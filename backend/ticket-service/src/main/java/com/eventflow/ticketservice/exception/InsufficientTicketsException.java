package com.eventflow.ticketservice.exception;

public class InsufficientTicketsException extends RuntimeException {
  public InsufficientTicketsException(String message) {
    super(message);
  }
}
