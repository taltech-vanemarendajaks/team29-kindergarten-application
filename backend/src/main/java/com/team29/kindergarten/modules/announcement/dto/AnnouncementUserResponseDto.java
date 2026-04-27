package com.team29.kindergarten.modules.announcement.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AnnouncementUserResponseDto {

    private Long id;
    private Long tenantId;
    private String title;
    private String content;
    private String createdByName;
    private LocalDate expiresAt;
    private boolean read;    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}    