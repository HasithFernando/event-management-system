package com.eventflow.ticketservice.service;

import com.eventflow.ticketservice.client.EventServiceClient;
import com.eventflow.ticketservice.client.NotificationServiceClient;
import com.eventflow.ticketservice.dto.TicketPurchaseRequest;
import com.eventflow.ticketservice.dto.TicketStatusUpdateRequest;
import com.eventflow.ticketservice.exception.InsufficientTicketsException;
import com.eventflow.ticketservice.exception.TicketLimitExceededException;
import com.eventflow.ticketservice.exception.TicketNotFoundException;
import com.eventflow.ticketservice.model.Ticket;
import com.eventflow.ticketservice.repository.TicketRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@Transactional(readOnly = true)
public class TicketService {
  private final TicketRepository ticketRepository;
  private final NotificationServiceClient notificationClient;
  private final EventServiceClient eventServiceClient;

  public TicketService(TicketRepository ticketRepository,
                      NotificationServiceClient notificationClient,
                      EventServiceClient eventServiceClient) {
    this.ticketRepository = ticketRepository;
    this.notificationClient = notificationClient;
    this.eventServiceClient = eventServiceClient;
  }

  @Transactional
  public List<Ticket> purchase(TicketPurchaseRequest request) {
    // Get event details to check capacity
    Map<String, Object> event = eventServiceClient.getEvent(request.getEventId());
    if (event == null) {
      throw new IllegalArgumentException("Event not found");
    }

    Integer maxTickets = event.get("maxTickets") != null ? 
        Integer.valueOf(event.get("maxTickets").toString()) : null;
    
    if (maxTickets == null) {
      throw new IllegalArgumentException("Event does not have ticket capacity configured");
    }

    // Count existing tickets for this event
    long existingTicketCount = ticketRepository.countByEventId(request.getEventId());
    
    // Check if user already has 3 or more tickets for this event
    long userExistingTickets = ticketRepository.findByEventIdAndUserId(request.getEventId(), request.getUserId()).size();
    if (userExistingTickets >= 3) {
      throw new TicketLimitExceededException("You have already purchased the maximum of 3 tickets for this event");
    }
    
    // Check if user's total tickets (existing + new) would exceed 3
    if (userExistingTickets + request.getQuantity() > 3) {
      throw new TicketLimitExceededException("You can only purchase " + (3 - userExistingTickets) + " more ticket(s) for this event");
    }

    // Check if enough tickets are available
    long remainingTickets = maxTickets - existingTicketCount;
    if (remainingTickets < request.getQuantity()) {
      throw new InsufficientTicketsException("Only " + remainingTickets + " ticket(s) remaining. Cannot purchase " + request.getQuantity() + " tickets.");
    }

    // Create multiple tickets based on quantity
    List<Ticket> createdTickets = new java.util.ArrayList<>();
    for (int i = 0; i < request.getQuantity(); i++) {
      Ticket ticket = new Ticket();
      ticket.setEventId(request.getEventId());
      ticket.setUserId(request.getUserId());
      ticket.setPrice(request.getPrice());
      ticket.setStatus("Confirmed");
      ticket.setPurchasedAt(LocalDateTime.now());
      createdTickets.add(ticketRepository.save(ticket));
    }

    // Send notifications
    try {
      String eventTitle = (String) event.get("title");
      
      // Notify attendee (buyer)
      String ticketText = request.getQuantity() == 1 ? "ticket" : "tickets";
      notificationClient.sendInAppNotification(
        request.getUserId(),
        "TICKET_CONFIRMATION",
        "Your " + request.getQuantity() + " " + ticketText + " for " + eventTitle + " has been confirmed",
        "/attendee/tickets"
      );

      // Notify organizer
      Object organizerIdObj = event.get("organizerId");
      if (organizerIdObj != null) {
        UUID organizerId = UUID.fromString(organizerIdObj.toString());
        notificationClient.sendInAppNotification(
          organizerId,
          "TICKET_SOLD",
          request.getQuantity() + " " + ticketText + " purchased for " + eventTitle,
          "/dashboard/events/" + request.getEventId()
        );
      }
    } catch (Exception e) {
      System.err.println("Failed to send ticket purchase notifications: " + e.getMessage());
    }

    return createdTickets;
  }

  public Ticket get(UUID id) {
    return ticketRepository.findById(id)
      .orElseThrow(() -> new TicketNotFoundException("Ticket not found with id: " + id));
  }

  public List<Ticket> list(UUID eventId, UUID userId) {
    if (eventId != null) {
      return ticketRepository.findByEventId(eventId);
    }
    if (userId != null) {
      return ticketRepository.findByUserId(userId);
    }
    return ticketRepository.findAll();
  }

  public List<Ticket> getByEvent(UUID eventId) {
    return ticketRepository.findByEventId(eventId);
  }

  public List<Ticket> getByUser(UUID userId) {
    return ticketRepository.findByUserId(userId);
  }

  @Transactional
  public Ticket updateStatus(UUID id, TicketStatusUpdateRequest request) {
    Ticket ticket = get(id);
    ticket.setStatus(request.getStatus());
    return ticketRepository.save(ticket);
  }

  @Transactional
  public Ticket cancel(UUID id, UUID userId) {
    Ticket ticket = get(id);

    if (!ticket.getUserId().equals(userId)) {
      throw new IllegalArgumentException("You can only cancel your own tickets");
    }

    if ("Cancelled".equalsIgnoreCase(ticket.getStatus())) {
      throw new IllegalArgumentException("Ticket is already cancelled");
    }

    ticket.setStatus("Cancelled");
    Ticket cancelledTicket = ticketRepository.save(ticket);

    // Send cancellation notifications
    try {
      Map<String, Object> event = eventServiceClient.getEvent(ticket.getEventId());
      String eventTitle = event != null ? (String) event.get("title") : "an event";

      // Notify attendee
      notificationClient.sendInAppNotification(
        userId,
        "TICKET_CANCELLED",
        "Your ticket for " + eventTitle + " has been cancelled",
        "/attendee/tickets"
      );

      // Notify organizer
      if (event != null) {
        Object organizerIdObj = event.get("organizerId");
        if (organizerIdObj != null) {
          UUID organizerId = UUID.fromString(organizerIdObj.toString());
          notificationClient.sendInAppNotification(
            organizerId,
            "TICKET_CANCELLED",
            "A ticket for " + eventTitle + " has been cancelled",
            "/dashboard/events/" + ticket.getEventId()
          );
        }
      }
    } catch (Exception e) {
      System.err.println("Failed to send ticket cancellation notifications: " + e.getMessage());
    }

    return cancelledTicket;
  }

  @Transactional
  public void delete(UUID id) {
    Ticket ticket = get(id);
    ticketRepository.delete(ticket);
  }

  public long count() {
    return ticketRepository.count();
  }

  public long countByEvent(UUID eventId) {
    return ticketRepository.countByEventId(eventId);
  }
}
