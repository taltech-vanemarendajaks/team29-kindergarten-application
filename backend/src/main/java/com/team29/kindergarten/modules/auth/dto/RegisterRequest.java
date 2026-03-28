package com.team29.kindergarten.modules.auth.dto;

import com.team29.kindergarten.modules.auth.entity.enums.RoleName;

public record RegisterRequest(
        String email,
        String password,
        Long tenantId,
        RoleName role
) {}
