package com.team29.kindergarten.modules.auth.dto;

public record LoginRequest(
        String email,
        String password
)  {}