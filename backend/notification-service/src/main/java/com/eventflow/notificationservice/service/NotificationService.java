package com.eventflow.notificationservice.service;

import com.eventflow.notificationservice.dto.NotificationCreateRequest;
import com.eventflow.notificationservice.model.Notification;
import com.eventflow.notificationservice.repository.NotificationRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificationService {
  private final NotificationRepository notificationRepository;

  public NotificationService(NotificationRepository notificationRepository) {
    this.notificationRepository = notificationRepository;
  }

  public List<Notification> list() {
    return notificationRepository.findAll();
  }

  public Notification create(NotificationCreateRequest request) {
    Notification notification = new Notification();
    notification.setChannel(request.getChannel());
    notification.setRecipient(request.getRecipient());
    notification.setSubject(request.getSubject());
    notification.setMessage(request.getMessage());
    notification.setStatus("Queued");
    notification.setCreatedAt(LocalDateTime.now());
    return notificationRepository.save(notification);
  }
}

