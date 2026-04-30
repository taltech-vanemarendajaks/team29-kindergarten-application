package com.team29.kindergarten.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.http.HttpMethod;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Value("${cors.allowed-origins}")
    private String allowedOrigins;

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth

                        // Public endpoints
                        .requestMatchers(
                                "/auth/login",
                                "/auth/register",
                                "/v3/api-docs/**",
                                "/swagger-ui/**",
                                "/swagger-ui.html",
                                "/uploads/**"
                        ).permitAll()

                        // Authenticated user info
                        .requestMatchers("/auth/me").authenticated()

                        // KINDERGARTEN_ADMIN endpoints
                        .requestMatchers("/api/v1/tenants/**").hasRole("KINDERGARTEN_ADMIN")
                        .requestMatchers("/api/v1/users/**").hasRole("KINDERGARTEN_ADMIN")
                        .requestMatchers("/api/v1/groups/**").hasRole("KINDERGARTEN_ADMIN")

                        // TEACHER-only child endpoint
                        .requestMatchers(HttpMethod.GET, "/api/v1/children/class-records").hasRole("TEACHER")

                        // Children endpoints — KINDERGARTEN_ADMIN and PARENT
                        .requestMatchers("/api/v1/children/**").hasAnyRole("KINDERGARTEN_ADMIN", "PARENT")

                        // Attendance endpoints — all authenticated roles
                        .requestMatchers("/api/v1/attendances/**").hasAnyRole("KINDERGARTEN_ADMIN", "TEACHER", "PARENT")

                        // TEACHER endpoints
                        .requestMatchers("/api/teacher/**").hasRole("TEACHER")
                        .requestMatchers("/api/upload/**").hasRole("TEACHER")

                        // PARENT endpoints
                        .requestMatchers("/api/parent/**").hasRole("PARENT")

                        // Everything else requires authentication
                        .anyRequest().authenticated()
                )
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of(allowedOrigins.split(",")));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}