package com.nsbm.bookingservice.client;

import com.nsbm.bookingservice.dto.EventDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

@Component
public class EventServiceClientFallback implements EventServiceClient {

    @Override
    public ResponseEntity<EventDTO> getEventById(Long id) {
        return ResponseEntity.notFound().build();
    }

    @Override
    public ResponseEntity<Boolean> eventExists(Long id) {
        return ResponseEntity.ok(false);
    }

    @Override
    public ResponseEntity<Boolean> hasAvailableSeats(Long id, int numberOfSeats) {
        return ResponseEntity.ok(false);
    }

    @Override
    public ResponseEntity<EventDTO> reserveSeats(Long id, int numberOfSeats) {
        return ResponseEntity.notFound().build();
    }

    @Override
    public ResponseEntity<EventDTO> releaseSeats(Long id, int numberOfSeats) {
        return ResponseEntity.notFound().build();
    }
}
