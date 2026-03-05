package com.eventflow.feedbackservice.dto;

import com.eventflow.feedbackservice.model.FeedbackCategory;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;

import java.util.UUID;

@Schema(description = "Request payload for submitting feedback")
public record FeedbackCreateRequest(

    @Schema(description = "UUID of the user submitting feedback", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotNull(message = "User ID is required")
    UUID userId,

    @Schema(description = "Display name of the submitter", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotBlank(message = "User name is required")
    @Size(max = 200, message = "User name must be at most 200 characters")
    String userName,

    @Schema(description = "Email address of the submitter", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotBlank(message = "User email is required")
    @Email(message = "Must be a valid email address")
    @Size(max = 320, message = "Email must be at most 320 characters")
    String userEmail,

    @Schema(description = "Category of the feedback", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotNull(message = "Category is required")
    FeedbackCategory category,

    @Schema(description = "Short subject line", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotBlank(message = "Subject is required")
    @Size(max = 200, message = "Subject must be at most 200 characters")
    String subject,

    @Schema(description = "Detailed feedback message", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotBlank(message = "Message is required")
    @Size(max = 2000, message = "Message must be at most 2000 characters")
    String message,

    @Schema(description = "Overall satisfaction score from 1 (very dissatisfied) to 5 (very satisfied)", minimum = "1", maximum = "5")
    @Min(value = 1, message = "Satisfaction score must be at least 1")
    @Max(value = 5, message = "Satisfaction score must be at most 5")
    Integer satisfactionScore
) {}
