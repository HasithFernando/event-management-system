package com.eventflow.authservice.controller;

import com.eventflow.authservice.dto.AuthResponse;
import com.eventflow.authservice.dto.LoginRequest;
import com.eventflow.authservice.dto.RegisterRequest;
import com.eventflow.authservice.model.User;
import com.eventflow.authservice.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

// Marks this class as a REST controller that handles HTTP requests
@RestController

// Base URL for all authentication-related endpoints
@RequestMapping("/api/auth")
public class AuthController {

  // Service layer used to handle authentication logic
  private final AuthService authService;

  // Constructor injection to initialize AuthService
  public AuthController(AuthService authService) {
    this.authService = authService;
  }

  // Health check endpoint to verify the auth service is running
  @GetMapping("/health")
  public ResponseEntity<Map<String, String>> health() {
    // Returns a simple JSON response showing service status
    return ResponseEntity.ok(Map.of("status", "UP", "service", "auth-service"));
  }

  // Endpoint to register a new user
  @PostMapping("/register")
  public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
    // Calls the service layer to create a new user account
    return ResponseEntity.ok(authService.register(request));
  }

  // Endpoint for user login
  @PostMapping("/login")
  public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
    // Calls the service layer to authenticate the user and return a response
    return ResponseEntity.ok(authService.login(request));
  }

  // Endpoint to get users filtered by role
  @GetMapping("/users")
  public ResponseEntity<List<User>> getUsersByRole(@RequestParam(required = false) String role) {
    // Calls service method to return users based on role (or all users if role is null)
    return ResponseEntity.ok(authService.getUsersByRole(role));
  }

  // Handles IllegalArgumentException and returns a 400 Bad Request response
  @ExceptionHandler(IllegalArgumentException.class)
  public ResponseEntity<String> handleBadRequest(IllegalArgumentException ex) {
    // Returns the error message as the response body
    return ResponseEntity.badRequest().body(ex.getMessage());
  }
}