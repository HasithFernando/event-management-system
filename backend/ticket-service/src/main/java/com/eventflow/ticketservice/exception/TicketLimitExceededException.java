package com.eventflow.ticketservice.exception;

public class TicketLimitExceededException extends RuntimeException {
  public TicketLimitExceededException(String message) {
    super(message);
  }
}
