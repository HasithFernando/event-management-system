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

  