package com.eventflow.analyticsservice.dto;

import java.math.BigDecimal;

public class TicketDTO {

  private String id;
  private String eventId;
  private String userId;
  private BigDecimal price;
  private String status;
  private String purchasedAt;

  public TicketDTO() {
  }

  public String getId() {
    return id;
  }

  public void setId(String id) {
    this.id = id;
  }

  public String getEventId() {
    return eventId;
  }

  public void setEventId(String eventId) {
    this.eventId = eventId;
  }

  public String getUserId() {
    return userId;
  }

  public void setUserId(String userId) {
    this.userId = userId;
  }

  public BigDecimal getPrice() {
    return price;
  }

  public void setPrice(BigDecimal price) {
    this.price = price;
  }

  public String getStatus() {
    return status;
  }

  public void setStatus(String status) {
    this.status = status;
  }

  public String getPurchasedAt() {
    return purchasedAt;
  }

  public void setPurchasedAt(String purchasedAt) {
    this.purchasedAt = purchasedAt;
  }
}
