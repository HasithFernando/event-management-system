package com.nsbm.eventservice.dto;

import com.nsbm.eventservice.model.EventCategory;
import com.nsbm.eventservice.model.EventStatus;
import jakarta.validation.constraints.*;
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
public class UpdateEventRequest {

    @Size(min = 3, max = 200, message = "Title must be between 3 and 200 characters")
    private String title;

    @Size(min = 10, max = 5000, message = "Description must be between 10 and 5000 characters")
    private String description;

    @FutureOrPresent(message = "Event date must be in the future or present")
    private LocalDate eventDate;

    private LocalTime startTime;

    private LocalTime endTime;

    @Size(max = 500, message = "Location must be at most 500 characters")
    private String location;

    @Size(max = 500, message = "Address must be at most 500 characters")
    private String address;

    @Min(value = 1, message = "Capacity must be at least 1")
    private Integer capacity;

    @DecimalMin(value = "0.0", message = "Price cannot be negative")
    private BigDecimal price;

    private EventCategory category;

    private EventStatus status;

    private List<String> imageUrls;

    private String thumbnailUrl;

    private Boolean featured;
}
