package com.eventflow.notificationservice.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public class NotificationResponse {
  private UUID id;
  private String channel;
  private String recipient;
  private String subject;
  private String message;
  private String status;
  private LocalDateTime createdAt;

  public NotificationResponse(UUID id, String channel, String recipient, String subject,
                              String message, String status, LocalDateTime createdAt) {
    this.id = id;
    this.channel = channel;
    this.recipient = recipient;
    this.subject = subject;
    this.message = message;
    this.status = status;
    this.createdAt = createdAt;
  }

  public UUID getId() {
    return id;
  }

  public String getChannel() {
    return channel;
  }

  public String getRecipient() {
    return recipient;
  }

  public String getSubject() {
    return subject;
  }

  public String getMessage() {
    return message;
  }

  public String getStatus() {
    return status;
  }

  public LocalDateTime getCreatedAt() {
    return createdAt;
  }
}

