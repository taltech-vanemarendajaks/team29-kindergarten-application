package com.team29.kindergarten.modules.announcement.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AnnouncementResponseDto {
    private Long id;
    private String title;
    private String content;
    private LocalDate created_by;
    private LocalDate expires_at;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

