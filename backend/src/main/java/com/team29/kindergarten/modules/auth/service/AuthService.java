package com.team29.kindergarten.modules.auth.service;

import com.team29.kindergarten.modules.auth.dto.AuthResponse;
import com.team29.kindergarten.modules.auth.dto.LoginRequest;
import com.team29.kindergarten.modules.auth.dto.RegisterRequest;
import com.team29.kindergarten.modules.auth.entity.Role;
import com.team29.kindergarten.modules.user.dto.CreateUserRequestDto;
import com.team29.kindergarten.modules.user.entity.User;
import com.team29.kindergarten.modules.user.repository.UserRepository;
import com.team29.kindergarten.modules.user.service.UserService;
import com.team29.kindergarten.security.JwtService;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;

@Service
public class AuthService {
    private static final Long DEFAULT_TENANT_ID = 1L;

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final UserService userService;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService,
                       UserService userService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.userService = userService;
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.email())
                .orElse(null);

        if (user == null || !passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        String token = jwtService.generateToken(user);
        return new AuthResponse(
                token,
                user.getId(),
                user.getRoles().stream().map(Role::getName).collect(Collectors.toSet())
        );
    }

    public void register(RegisterRequest request) {
        // TODO: Replace the default tenant assignment once parent registration is moved
        // to a proper multi-tenant onboarding flow.
        userService.createParentUser(DEFAULT_TENANT_ID, CreateUserRequestDto.builder()
                .fullName(request.fullName())
                .email(request.email())
                .password(request.password())
                .build());
    }

    public AuthResponse me(User user) {
        return new AuthResponse(
                null,
                user.getId(),
                user.getRoles().stream().map(Role::getName).collect(Collectors.toSet())
        );
    }
}