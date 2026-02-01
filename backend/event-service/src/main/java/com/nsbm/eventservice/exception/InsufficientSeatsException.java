package com.nsbm.eventservice.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class InsufficientSeatsException extends RuntimeException {

    public InsufficientSeatsException(String message) {
        super(message);
    }

    public InsufficientSeatsException(Long eventId, int requested, int available) {
        super(String.format("Event %d has only %d seats available, but %d were requested", eventId, available, requested));
    }
}
