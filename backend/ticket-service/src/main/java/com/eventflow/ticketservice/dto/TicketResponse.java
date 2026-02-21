package com.eventflow.ticketservice.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public class TicketResponse {
  private UUID id;
  private UUID eventId;
  private UUID attendeeId;
  private BigDecimal price;
  private String status;
  private LocalDateTime purchasedAt;

  public TicketResponse(UUID id, UUID eventId, UUID attendeeId, BigDecimal price, String status, LocalDateTime purchasedAt) {
    this.id = id;
    this.eventId = eventId;
    this.attendeeId = attendeeId;
    this.price = price;
    this.status = status;
    this.purchasedAt = purchasedAt;
  }

  public UUID getId() {
    return id;
  }

  public UUID getEventId() {
    return eventId;
  }

  public UUID getAttendeeId() {
    return attendeeId;
  }

  public BigDecimal getPrice() {
    return price;
  }

  public String getStatus() {
    return status;
  }

  public LocalDateTime getPurchasedAt() {
    return purchasedAt;
  }
}

