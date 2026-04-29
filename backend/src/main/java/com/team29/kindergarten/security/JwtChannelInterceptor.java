package com.team29.kindergarten.security;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Component;
import com.team29.kindergarten.modules.user.entity.User;
import com.team29.kindergarten.modules.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;

import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtChannelInterceptor implements ChannelInterceptor {

    private final JwtService jwtService;
    private final UserRepository userRepository;

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {

        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(message);

       if (accessor.getCommand() == StompCommand.CONNECT) {

            System.out.println("CONNECT received");
            System.out.println("Command: " + accessor.getCommand());

            String authHeader = accessor.getFirstNativeHeader("Authorization");

            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);

                String email = jwtService.extractEmail(token);

                if (email != null) {
                    User user = userRepository.findByEmail(email).orElse(null);

                    if (user != null && jwtService.isTokenValid(token, user)) {

                        List<String> roles = jwtService.extractRoles(token);

                        var authorities = roles.stream()
                                .map(role -> "ROLE_" + role)
                                .map(org.springframework.security.core.authority.SimpleGrantedAuthority::new)
                                .toList();

                        var auth = new UsernamePasswordAuthenticationToken(
                                user,
                                null,
                                authorities
                        );

                        // ✅ THIS replaces SecurityContextHolder
                        accessor.setUser(auth);

                    }
                }
            }
        }

        return message;
    }
}