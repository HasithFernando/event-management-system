package com.nsbm.bookingservice.client;

import com.nsbm.bookingservice.dto.UserDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "user-service", fallback = UserServiceClientFallback.class)
public interface UserServiceClient {

    @GetMapping("/users/{id}")
    ResponseEntity<UserDTO> getUserById(@PathVariable("id") Long id);

    @GetMapping("/users/{id}/exists")
    ResponseEntity<Boolean> userExists(@PathVariable("id") Long id);
}
