package com.eventflow.notificationservice.controller;

import com.eventflow.notificationservice.dto.NotificationCreateRequest;
import com.eventflow.notificationservice.dto.NotificationResponse;
import com.eventflow.notificationservice.model.Notification;
import com.eventflow.notificationservice.service.NotificationService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {
  private final NotificationService notificationService;

  public NotificationController(NotificationService notificationService) {
    this.notificationService = notificationService;
  }

  @GetMapping
  public List<NotificationResponse> list() {
    return notificationService.list().stream().map(this::toResponse).toList();
  }

  @PostMapping
  public ResponseEntity<NotificationResponse> create(@Valid @RequestBody NotificationCreateRequest request) {
    return ResponseEntity.ok(toResponse(notificationService.create(request)));
  }

  @ExceptionHandler(IllegalArgumentException.class)
  public ResponseEntity<String> handleBadRequest(IllegalArgumentException ex) {
    return ResponseEntity.badRequest().body(ex.getMessage());
  }

  private NotificationResponse toResponse(Notification notification) {
    return new NotificationResponse(
      notification.getId(),
      notification.getChannel(),
      notification.getRecipient(),
      notification.getSubject(),
      notification.getMessage(),
      notification.getStatus(),
      notification.getCreatedAt()
    );
  }
}

