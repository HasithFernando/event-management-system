package com.eventflow.reviewservice.dto;

import com.eventflow.reviewservice.model.ReviewStatus;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * DTO for review responses - Placeholder for future implementation
 */
public record ReviewResponse(
    UUID id,
    UUID eventId,
    UUID userId,
    Integer rating,
    String title,
    String comment,
    String pros,
    String cons,
    Boolean verified,
    Integer helpfulCount,
    ReviewStatus status,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {
}
