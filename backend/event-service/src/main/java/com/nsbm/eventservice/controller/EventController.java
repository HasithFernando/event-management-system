package com.nsbm.eventservice.controller;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/events")
public class EventController {

    // TODO: Implement REST endpoints
    // GET /events - List all events
    // GET /events/{id} - Get event by ID
    // POST /events - Create new event
    // PUT /events/{id} - Update event
    // DELETE /events/{id} - Delete event
    
    @GetMapping("/health")
    public String health() {
        return "Event Service is running";
    }
}
