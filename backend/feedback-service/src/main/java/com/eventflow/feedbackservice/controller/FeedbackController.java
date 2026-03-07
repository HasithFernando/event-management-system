package com.eventflow.feedbackservice.controller;

import com.eventflow.feedbackservice.dto.FeedbackCreateRequest;
import com.eventflow.feedbackservice.dto.FeedbackResponse;
import com.eventflow.feedbackservice.dto.FeedbackStatusUpdateRequest;
import com.eventflow.feedbackservice.model.FeedbackCategory;
import com.eventflow.feedbackservice.model.FeedbackStatus;
import com.eventflow.feedbackservice.service.FeedbackService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/feedback")
@Tag(name = "Feedback", description = "API for submitting and managing user feedback")
public class FeedbackController {

    private final FeedbackService feedbackService;

    public FeedbackController(FeedbackService feedbackService) {
        this.feedbackService = feedbackService;
    }

    @Operation(summary = "Health check")
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of(
                "status", "UP",
                "service", "feedback-service",
                "port", "8090"
        ));
    }

    @Operation(summary = "Submit feedback", description = "Any authenticated user can submit feedback")
    @PostMapping
    public ResponseEntity<FeedbackResponse> createFeedback(@Valid @RequestBody FeedbackCreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(feedbackService.createFeedback(request));
    }

    @Operation(summary = "Get all feedback (admin)", description = "Retrieve all feedback, optionally filtered by status and/or category")
    @GetMapping
    public ResponseEntity<List<FeedbackResponse>> getAllFeedback(
            @Parameter(description = "Filter by status") @RequestParam(required = false) FeedbackStatus status,
            @Parameter(description = "Filter by category") @RequestParam(required = false) FeedbackCategory category) {
        return ResponseEntity.ok(feedbackService.getAllFeedback(status, category));
    }

    @Operation(summary = "Get feedback by ID")
    @GetMapping("/{id}")
    public ResponseEntity<FeedbackResponse> getFeedback(
            @Parameter(description = "UUID of the feedback") @PathVariable UUID id) {
        return ResponseEntity.ok(feedbackService.getFeedback(id));
    }

    @Operation(summary = "Get feedback submitted by a user")
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<FeedbackResponse>> getFeedbackByUser(
            @Parameter(description = "UUID of the user") @PathVariable UUID userId) {
        return ResponseEntity.ok(feedbackService.getFeedbackByUser(userId));
    }

    @Operation(summary = "Update feedback status (admin)", description = "Update the status and optionally add admin notes")
    @PutMapping("/{id}/status")
    public ResponseEntity<FeedbackResponse> updateStatus(
            @Parameter(description = "UUID of the feedback") @PathVariable UUID id,
            @Valid @RequestBody FeedbackStatusUpdateRequest request) {
        return ResponseEntity.ok(feedbackService.updateStatus(id, request));
    }

    @Operation(summary = "Delete feedback (admin)")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFeedback(
            @Parameter(description = "UUID of the feedback") @PathVariable UUID id) {
        feedbackService.deleteFeedback(id);
        return ResponseEntity.noContent().build();
    }
}
