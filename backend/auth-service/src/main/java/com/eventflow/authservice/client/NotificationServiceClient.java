package com.eventflow.authservice.client;

import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

// Marks this class as a Spring component so it can be automatically detected and injected
@Component
public class NotificationServiceClient {

  // RestTemplate is used to send HTTP requests to other microservices
  private final RestTemplate restTemplate;

  // URL of the Notification Service API endpoint
  private static final String NOTIFICATION_SERVICE_URL = "http://notification-service/api/notifications/in-app";

  // Constructor injection to initialize RestTemplate
  public NotificationServiceClient(RestTemplate restTemplate) {
    this.restTemplate = restTemplate;
  }

  // Method to send an in-app notification to a user
  public void sendInAppNotification(UUID userId, String notificationType, String message, String actionUrl) {
    try {
      // Create a request body using a map to store notification details
      Map<String, Object> request = new HashMap<>();

      // Add user ID as a string
      request.put("userId", userId.toString());

      // Add the type of notification
      request.put("notificationType", notificationType);

      // Add the notification message
      request.put("message", message);

      // Add an optional action URL for the notification
      request.put("actionUrl", actionUrl);

      // Send POST request to the Notification Service
      restTemplate.postForEntity(NOTIFICATION_SERVICE_URL, request, Object.class);

    } catch (Exception e) {
      // If sending notification fails, print the error but do not stop the main process
      System.err.println("Failed to send notification: " + e.getMessage());
    }
  }
}