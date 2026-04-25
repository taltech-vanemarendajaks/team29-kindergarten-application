package com.team29.kindergarten.security;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class CurrentUserService {

    public UserPrincipal getUser() {
        Object principal = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        if (!(principal instanceof UserPrincipal user)) {
            throw new IllegalStateException("No authenticated user");
        }

        return user;
    }

    public Long getUserId() {
        return getUser().getUserId();
    }

    public Long getTenantId() {
        return getUser().getTenantId();
    }
}