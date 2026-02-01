package com.nsbm.bookingservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EventDTO {
    private Long id;
    private String title;
    private String description;
    private LocalDate eventDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private String location;
    private String address;
    private Integer capacity;
    private Integer availableSeats;
    private BigDecimal price;
    private String category;
    private Long organizerId;
    private String organizerName;
    private String status;
    private List<String> imageUrls;
    private String thumbnailUrl;
    private Boolean featured;
}
