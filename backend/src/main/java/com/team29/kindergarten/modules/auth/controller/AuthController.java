package com.team29.kindergarten.modules.auth.controller;

import com.team29.kindergarten.modules.auth.dto.AuthResponse;
import com.team29.kindergarten.modules.auth.dto.LoginRequest;
import com.team29.kindergarten.modules.auth.dto.RegisterRequest;
import com.team29.kindergarten.modules.auth.entity.User;
import com.team29.kindergarten.modules.auth.service.AuthService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Tag(name = "Auth", description = "Authentication and authorization API")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(Map.of("token", response.token()));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        authService.register(request);
        return ResponseEntity.ok(Map.of("status", "success"));
    }

    @GetMapping("/me")
    public AuthResponse me(@AuthenticationPrincipal User user) {
        return authService.me(user);
    }
}
