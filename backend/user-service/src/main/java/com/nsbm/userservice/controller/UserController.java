package com.nsbm.userservice.controller;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
public class UserController {

    // TODO: Implement REST endpoints
    // GET /users - List all users
    // GET /users/{id} - Get user by ID
    // POST /users - Create new user
    // PUT /users/{id} - Update user
    // DELETE /users/{id} - Delete user
    
    @GetMapping("/health")
    public String health() {
        return "User Service is running";
    }
}
