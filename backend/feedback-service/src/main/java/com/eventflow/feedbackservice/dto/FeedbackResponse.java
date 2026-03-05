package com.eventflow.feedbackservice.dto;

import com.eventflow.feedbackservice.model.FeedbackCategory;
import com.eventflow.feedbackservice.model.FeedbackStatus;

import java.time.LocalDateTime;
import java.util.UUID;

public record FeedbackResponse(
    UUID id,
    UUID userId,
    String userName,
    String userEmail,
    FeedbackCategory category,
    String subject,
    String message,
    Integer satisfactionScore,
    FeedbackStatus status,
    String adminNotes,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {}
