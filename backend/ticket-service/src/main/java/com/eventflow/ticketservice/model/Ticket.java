package com.eventflow.ticketservice.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import org.hibernate.annotations.UuidGenerator;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "tickets")
public class Ticket {
  @Id
  @GeneratedValue
  @UuidGenerator
  private UUID id;

  @Column(nullable = false)
  private UUID eventId;

  @Column(nullable = false)
  private UUID attendeeId;

  @Column(nullable = false)
  private BigDecimal price;

  @Column(nullable = false)
  private String status;

  @Column(nullable = false)
  private LocalDateTime purchasedAt;

  public UUID getId() {
    return id;
  }

  public void setId(UUID id) {
    this.id = id;
  }

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

  public String getStatus() {
    return status;
  }

  public void setStatus(String status) {
    this.status = status;
  }

  public LocalDateTime getPurchasedAt() {
    return purchasedAt;
  }

  public void setPurchasedAt(LocalDateTime purchasedAt) {
    this.purchasedAt = purchasedAt;
  }
}

