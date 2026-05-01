package com.team29.kindergarten.security;

import java.security.Principal;

import org.springframework.security.core.Authentication;
// Utility class to extract tenantId from the authenticated user's principal
public class SecurityUtils {
    public static Long getTenantId(Principal principal) {
        if (principal instanceof Authentication auth &&
            auth.getPrincipal() instanceof UserPrincipal user) {
            return user.getTenantId();
        }
        throw new IllegalStateException("Invalid principal");
    }
}