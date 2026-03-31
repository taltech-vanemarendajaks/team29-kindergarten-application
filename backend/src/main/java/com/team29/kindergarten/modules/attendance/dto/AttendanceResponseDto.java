package com.team29.kindergarten.modules.attendance.dto;

import com.team29.kindergarten.common.enums.AttendanceStatus;
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
public class AttendanceResponseDto {
    private Long id;
    private Long tenantId;
    private Long childId;
    private LocalDate date;
    private AttendanceStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
