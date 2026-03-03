package com.eventflow.ticketservice.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Max;

import java.math.BigDecimal;
import java.util.UUID;

public class TicketPurchaseRequest {
  @NotNull
  private UUID eventId;

  @NotNull
  private UUID userId;

  @NotNull
  private BigDecimal price;

  @NotNull
  @Min(value = 1, message = "Quantity must be at least 1")
  @Max(value = 3, message = "Maximum 3 tickets can be purchased at once")
  private Integer quantity;

  public UUID getEventId() {
    return eventId;
  }

  public void setEventId(UUID eventId) {
    this.eventId = eventId;
  }

  public UUID getUserId() {
    return userId;
  }

  public void setUserId(UUID userId) {
    this.userId = userId;
  }

  public BigDecimal getPrice() {
    return price;
  }

  public void setPrice(BigDecimal price) {
    this.price = price;
  }

  public Integer getQuantity() {
    return quantity;
  }

  public void setQuantity(Integer quantity) {
    this.quantity = quantity;
  }
}

