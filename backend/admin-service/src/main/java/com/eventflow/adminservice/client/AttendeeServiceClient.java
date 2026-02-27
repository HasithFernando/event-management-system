package com.eventflow.adminservice.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;

@FeignClient(name = "ticket-service", contextId = "attendeeServiceClient")
public interface AttendeeServiceClient {

  @GetMapping("/api/tickets/count")
  long getAttendeeCount();
}
