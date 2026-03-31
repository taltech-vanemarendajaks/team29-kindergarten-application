package com.team29.kindergarten.modules.group.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GroupResponseDto {
    private Long id;
    private Long tenantId;
    private String name;
    private String ageRange;
    private Long teacherId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
