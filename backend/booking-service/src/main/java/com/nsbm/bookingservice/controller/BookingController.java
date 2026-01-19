package com.nsbm.bookingservice.controller;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/bookings")
public class BookingController {

    // TODO: Implement REST endpoints
    // GET /bookings - List all bookings
    // GET /bookings/{id} - Get booking by ID
    // POST /bookings - Create new booking
    // PUT /bookings/{id} - Update booking
    // DELETE /bookings/{id} - Delete booking
    
    @GetMapping("/health")
    public String health() {
        return "Booking Service is running";
    }
}
