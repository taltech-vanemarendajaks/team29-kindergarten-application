package com.team29.kindergarten.modules.auth.service;

import com.team29.kindergarten.modules.auth.dto.AuthResponse;
import com.team29.kindergarten.modules.auth.dto.LoginRequest;
import com.team29.kindergarten.modules.auth.dto.RegisterRequest;
import com.team29.kindergarten.modules.auth.entity.Role;
import com.team29.kindergarten.modules.auth.entity.User;
import com.team29.kindergarten.modules.auth.entity.enums.RoleName;
import com.team29.kindergarten.modules.auth.repository.RoleRepository;
import com.team29.kindergarten.modules.auth.repository.UserRepository;
import com.team29.kindergarten.security.JwtService;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.stream.Collectors;

import com.team29.kindergarten.modules.parent.model.Parent;
import com.team29.kindergarten.modules.parent.repository.ParentRepository;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final RoleRepository roleRepository;
    private final ParentRepository parentRepository;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService,
                       RoleRepository roleRepository,
                       ParentRepository parentRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.roleRepository = roleRepository;
        this.parentRepository = parentRepository;
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
    if (userRepository.existsByEmail(request.email())) {
        throw new IllegalArgumentException("Email already exists");
    }

    User user = new User();
    user.setFullName(request.fullName());
    user.setEmail(request.email());
    user.setPassword(passwordEncoder.encode(request.password()));

    // Role role = roleRepository.findByName(request.role())
    Role role = roleRepository.findByName(RoleName.PARENT)
            .orElseThrow(() -> new RuntimeException("Role not found"));
    user.setRoles(Set.of(role));

    userRepository.save(user);

    // if (request.role() == RoleName.PARENT) {
    if (true) {
        Parent parent = Parent.builder()
                .userId(user.getId())
                .tenantId(user.getTenantId())
                .email(user.getEmail())
                .build();
        parentRepository.save(parent);
    }
}
public AuthResponse me(User user) {
    return new AuthResponse(
            null,
            user.getId(),
            user.getRoles().stream().map(Role::getName).collect(Collectors.toSet())
    );
}

}
