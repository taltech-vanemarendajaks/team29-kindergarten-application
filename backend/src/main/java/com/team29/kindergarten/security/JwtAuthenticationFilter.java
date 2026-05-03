package com.team29.kindergarten.security;

import com.team29.kindergarten.tenant.TenantContext;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;


@Component
@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {


    private final JwtAuthenticationFactory authFactory;

    public JwtAuthenticationFilter(JwtAuthenticationFactory authFactory) {

        this.authFactory = authFactory;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getServletPath();
        if (path.startsWith("/auth/")) {
            filterChain.doFilter(request, response);
            return;
        }

        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            filterChain.doFilter(request, response);
            return;
        }

        final String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7);

        UsernamePasswordAuthenticationToken authToken =
                authFactory.createAuthentication(token);

        if (authToken != null) {

            // TenantContext duplicates SecurityContextHolder TODO: use CurrentUserService instead
            UserPrincipal principal = (UserPrincipal) authToken.getPrincipal();

            if (principal.getTenantId() != null) {
                TenantContext.setTenantId(principal.getTenantId());
            }

            SecurityContextHolder.getContext().setAuthentication(authToken);
        } else {
            SecurityContextHolder.clearContext();
        }
        
        try {
            filterChain.doFilter(request, response);
        } finally {
            TenantContext.clear();
        }
    }
}
