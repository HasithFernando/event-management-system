package com.eventflow.authservice.dto;

import java.util.UUID;

public class AuthResponse {
  private UUID userId;
  private String name;
  private String role;
  private String token;

  public AuthResponse(UUID userId, String name, String role, String token) {
    this.userId = userId;
    this.name = name;
    this.role = role;
    this.token = token;
  }

  public UUID getUserId() {
    return userId;
  }

  public String getName() {
    return name;
  }

  public String getRole() {
    return role;
  }

  public String getToken() {
    return token;
  }
}

