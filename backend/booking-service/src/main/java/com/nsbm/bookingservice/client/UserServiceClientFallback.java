package com.nsbm.bookingservice.client;

import com.nsbm.bookingservice.dto.UserDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

@Component
public class UserServiceClientFallback implements UserServiceClient {

    @Override
    public ResponseEntity<UserDTO> getUserById(Long id) {
        return ResponseEntity.notFound().build();
    }

    @Override
    public ResponseEntity<Boolean> userExists(Long id) {
        return ResponseEntity.ok(false);
    }
}
