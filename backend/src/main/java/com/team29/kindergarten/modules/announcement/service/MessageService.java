package com.team29.kindergarten.modules.announcement.service;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;

import com.team29.kindergarten.modules.announcement.dto.AnnouncementResponseDto;

@Service
public class MessageService {

    private final ApplicationEventPublisher eventPublisher;

    public MessageService(ApplicationEventPublisher eventPublisher) {
        this.eventPublisher = eventPublisher;
    }

    public void createMessage(AnnouncementResponseDto dto, Long tenantId) {

        eventPublisher.publishEvent(
            new AnnouncementCreatedEvent(tenantId, dto)
        );
    }
}