package com.eventflow.notificationservice.dto;

import jakarta.validation.constraints.NotBlank;

public class NotificationCreateRequest {
  @NotBlank
  private String channel;

  @NotBlank
  private String recipient;

  @NotBlank
  private String subject;

  @NotBlank
  private String message;

  public String getChannel() {
    return channel;
  }

  public void setChannel(String channel) {
    this.channel = channel;
  }

  public String getRecipient() {
    return recipient;
  }

  public void setRecipient(String recipient) {
    this.recipient = recipient;
  }

  public String getSubject() {
    return subject;
  }

  public void setSubject(String subject) {
    this.subject = subject;
  }

  public String getMessage() {
    return message;
  }

  public void setMessage(String message) {
    this.message = message;
  }
}

