package com.nsbm.bookingservice.client;

import com.nsbm.bookingservice.dto.EventDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@FeignClient(name = "event-service", fallback = EventServiceClientFallback.class)
public interface EventServiceClient {

    @GetMapping("/events/{id}")
    ResponseEntity<EventDTO> getEventById(@PathVariable("id") Long id);

    @GetMapping("/events/{id}/exists")
    ResponseEntity<Boolean> eventExists(@PathVariable("id") Long id);

    @GetMapping("/events/{id}/available-seats")
    ResponseEntity<Boolean> hasAvailableSeats(@PathVariable("id") Long id, @RequestParam("numberOfSeats") int numberOfSeats);

    @PostMapping("/events/{id}/reserve-seats")
    ResponseEntity<EventDTO> reserveSeats(@PathVariable("id") Long id, @RequestParam("numberOfSeats") int numberOfSeats);

    @PostMapping("/events/{id}/release-seats")
    ResponseEntity<EventDTO> releaseSeats(@PathVariable("id") Long id, @RequestParam("numberOfSeats") int numberOfSeats);
}
