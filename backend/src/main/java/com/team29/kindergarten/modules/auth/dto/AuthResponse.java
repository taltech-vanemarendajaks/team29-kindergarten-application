package com.team29.kindergarten.modules.auth.dto;

import com.team29.kindergarten.modules.auth.entity.enums.RoleName;

import java.util.Set;

public record AuthResponse(
        String token,
        Long userId,
        Long tenantId,
        Set<RoleName> roles
) {}
