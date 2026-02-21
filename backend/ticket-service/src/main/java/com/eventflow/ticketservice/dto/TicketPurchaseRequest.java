package com.eventflow.ticketservice.dto;

import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.util.UUID;

public class TicketPurchaseRequest {
  @NotNull
  private UUID eventId;

  @NotNull
  private UUID attendeeId;

  @NotNull
  private BigDecimal price;

  public UUID getEventId() {
    return eventId;
  }

  public void setEventId(UUID eventId) {
    this.eventId = eventId;
  }

  public UUID getAttendeeId() {
    return attendeeId;
  }

  public void setAttendeeId(UUID attendeeId) {
    this.attendeeId = attendeeId;
  }

  public BigDecimal getPrice() {
    return price;
  }

  public void setPrice(BigDecimal price) {
    this.price = price;
  }
}

