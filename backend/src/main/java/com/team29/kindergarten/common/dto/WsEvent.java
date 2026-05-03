package com.team29.kindergarten.common.dto;

public record WsEvent(
    String type,
    Object payload
) {}