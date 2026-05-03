package com.team29.kindergarten.modules.announcement.service;

import com.team29.kindergarten.modules.announcement.dto.AnnouncementResponseDto;


public record AnnouncementCreatedEvent(
    Long tenantId,
    AnnouncementResponseDto dto
) {}