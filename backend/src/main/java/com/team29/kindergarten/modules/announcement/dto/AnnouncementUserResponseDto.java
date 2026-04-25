package com.team29.kindergarten.modules.announcement.dto;

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
    private String title;
    private String content;
    private boolean isRead;
    private String createdByName;
    private LocalDateTime createdAt;
}