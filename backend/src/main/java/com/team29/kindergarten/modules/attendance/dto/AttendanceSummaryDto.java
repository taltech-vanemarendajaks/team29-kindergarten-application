package com.team29.kindergarten.modules.attendance.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AttendanceSummaryDto {
    private long present;
    private long absent;
    private long sick;
}