package com.eventflow.reviewservice.client;

import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.Map;
import java.util.UUID;

@Component
public class TicketServiceClient {

  private final RestTemplate restTemplate;
  private static final String TICKET_SERVICE_URL = "http://ticket-service/api/tickets";

  public TicketServiceClient(RestTemplate restTemplate) {
    this.restTemplate = restTemplate;
  }

  public boolean hasTicket(UUID eventId, UUID userId) {
    try {
      Map<?, ?> response = restTemplate.getForObject(
          TICKET_SERVICE_URL + "/check?eventId=" + eventId + "&userId=" + userId,
          Map.class);
      return response != null && Boolean.TRUE.equals(response.get("hasTicket"));
    } catch (Exception e) {
      System.err.println("Failed to check ticket ownership: " + e.getMessage());
      return false;
    }
  }
}
