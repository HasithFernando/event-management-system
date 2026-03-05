package com.eventflow.feedbackservice.dto;

import com.eventflow.feedbackservice.model.FeedbackStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;

@Schema(description = "Request payload for updating feedback status (admin only)")
public record FeedbackStatusUpdateRequest(

    @Schema(description = "New status to assign", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotNull(message = "Status is required")
    FeedbackStatus status,

    @Schema(description = "Optional internal notes from the admin")
    String adminNotes
) {}
