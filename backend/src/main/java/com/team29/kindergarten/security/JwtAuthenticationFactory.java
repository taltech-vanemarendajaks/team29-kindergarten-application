package com.team29.kindergarten.security;


import com.team29.kindergarten.modules.user.entity.User;
import com.team29.kindergarten.modules.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFactory {

    private final JwtService jwtService;
    private final UserRepository userRepository;

    public UsernamePasswordAuthenticationToken createAuthentication(String token) {
        String email = jwtService.extractEmail(token);

        if (email == null) return null;

        User user = userRepository.findByEmail(email).orElse(null);

        if (user == null || !jwtService.isTokenValid(token, user)) {
            return null;
        }

        List<SimpleGrantedAuthority> authorities = jwtService.extractRoles(token).stream()
                .map(role -> "ROLE_" + role)
                .map(SimpleGrantedAuthority::new)
                .toList();

        Long userId = jwtService.extractUserId(token);
        Long tenantId = jwtService.extractTenantId(token);

        System.out.println("Token valid: " + jwtService.isTokenValid(token, user));
        System.out.println("Token exp: " + jwtService.extractExpiration(token));


        UserPrincipal principal = new UserPrincipal(
                userId,
                tenantId,
                email,
                authorities
        );

        return new UsernamePasswordAuthenticationToken(
                principal,
                null,
                authorities
        );
    }
}