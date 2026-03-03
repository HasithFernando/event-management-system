package com.eventflow.reviewservice.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.UUID;

/**
 * DTO for creating a review - Placeholder for future implementation
 */
public record ReviewCreateRequest(
    @NotNull(message = "Event ID is required")
    UUID eventId,

    @NotNull(message = "User ID is required")
    UUID userId,

    @NotNull(message = "Rating is required")
    @Min(value = 1, message = "Rating must be at least 1")
    @Max(value = 5, message = "Rating must be at most 5")
    Integer rating,

    @Size(max = 200, message = "Title must be less than 200 characters")
    String title,

    @Size(max = 2000, message = "Comment must be less than 2000 characters")
    String comment,

    String pros,

    String cons
) {
}
