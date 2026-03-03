package com.eventflow.ticketservice.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public class TicketResponse {
  private UUID id;
  private UUID eventId;
  private UUID userId;
  private BigDecimal price;
  private String status;
  private LocalDateTime purchasedAt;

  public TicketResponse(UUID id, UUID eventId, UUID userId, BigDecimal price, String status, LocalDateTime purchasedAt) {
    this.id = id;
    this.eventId = eventId;
    this.userId = userId;
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

  public UUID getUserId() {
    return userId;
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

