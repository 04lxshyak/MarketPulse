package com.lakshya.auth.controller;

import com.lakshya.auth.dto.AuthResponse;
import com.lakshya.auth.dto.LoginRequest;
import com.lakshya.auth.dto.RegisterRequest;
import com.lakshya.auth.entity.User;
import com.lakshya.auth.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public String register(@RequestBody RegisterRequest request) {

        authService.register(request);
        return "User registered successfully";
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }
}