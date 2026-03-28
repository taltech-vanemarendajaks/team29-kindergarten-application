package com.team29.kindergarten.modules.auth.controller;

import com.team29.kindergarten.modules.auth.dto.AuthResponse;
import com.team29.kindergarten.modules.auth.dto.LoginRequest;
import com.team29.kindergarten.modules.auth.dto.RegisterRequest;
import com.team29.kindergarten.modules.auth.entity.User;
import com.team29.kindergarten.modules.auth.service.AuthService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
@Tag(name = "Auth", description = "Authentication and authorization API")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @PostMapping("/register")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public void register(@RequestBody RegisterRequest request) {
        authService.register(request);
    }

    @GetMapping("/me")
    public AuthResponse me(@AuthenticationPrincipal User user) {
        return authService.me(user);
    }
}
