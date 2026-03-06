package com.eventflow.ticketservice.service;

import com.eventflow.ticketservice.client.EventServiceClient;
import com.eventflow.ticketservice.client.NotificationServiceClient;
import com.eventflow.ticketservice.dto.TicketPurchaseRequest;
import com.eventflow.ticketservice.dto.TicketStatusUpdateRequest;
import com.eventflow.ticketservice.model.Ticket;
import com.eventflow.ticketservice.repository.TicketRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
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
    long existingTicketCount = ticketRepository.findByEventId(request.getEventId()).size();
    
    // Check if user already has 3 or more tickets for this event
    long userExistingTickets = ticketRepository.findByEventIdAndUserId(request.getEventId(), request.getUserId()).size();
    if (userExistingTickets >= 3) {
      throw new IllegalArgumentException("You have already purchased the maximum of 3 tickets for this event");
    }
    
    // Check if user's total tickets (existing + new) would exceed 3
    if (userExistingTickets + request.getQuantity() > 3) {
      throw new IllegalArgumentException("You can only purchase " + (3 - userExistingTickets) + " more ticket(s) for this event");
    }

    // Check if enough tickets are available
    long remainingTickets = maxTickets - existingTicketCount;
    if (remainingTickets < request.getQuantity()) {
      throw new IllegalArgumentException("Only " + remainingTickets + " ticket(s) remaining. Cannot purchase " + request.getQuantity() + " tickets.");
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

      