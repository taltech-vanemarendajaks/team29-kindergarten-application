package com.team29.kindergarten.modules.attendance.controller;

import com.team29.kindergarten.common.enums.AttendanceStatus;
import com.team29.kindergarten.modules.attendance.dto.AttendanceResponseDto;
import com.team29.kindergarten.modules.attendance.service.AttendanceService;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;

import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertInstanceOf;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import com.team29.kindergarten.tenant.TenantContext;

@ExtendWith(MockitoExtension.class)
class AttendanceControllerTest {

    @Mock
    private AttendanceService attendanceService;

    @InjectMocks
    private AttendanceController attendanceController;

    @AfterEach
    void tearDown() {
        TenantContext.clear();
    }

    @Test
    void findAllReturnsChildRangeWhenChildIdProvided() {
        TenantContext.setTenantId(2L);
        LocalDate from = LocalDate.of(2026, 4, 1);
        LocalDate to = LocalDate.of(2026, 4, 30);
        AttendanceResponseDto dto = AttendanceResponseDto.builder()
                .id(1L)
                .tenantId(2L)
                .childId(5L)
                .date(LocalDate.of(2026, 4, 1))
                .status(AttendanceStatus.PRESENT)
                .build();
        when(attendanceService.findForChildInRange(5L, from, to, 2L)).thenReturn(List.of(dto));

        ResponseEntity<?> response = attendanceController.findAll(5L, from, to, PageRequest.of(0, 20));

        assertEquals(200, response.getStatusCode().value());
        assertInstanceOf(List.class, response.getBody());
        verify(attendanceService).findForChildInRange(5L, from, to, 2L);
    }

    @Test
    void findAllReturnsPageWhenChildIdMissing() {
        TenantContext.setTenantId(3L);
        Page<AttendanceResponseDto> page = new PageImpl<>(List.of(), PageRequest.of(0, 20), 0);
        when(attendanceService.findAll(3L, PageRequest.of(0, 20))).thenReturn(page);

        ResponseEntity<?> response = attendanceController.findAll(null, null, null, PageRequest.of(0, 20));

        assertEquals(200, response.getStatusCode().value());
        assertInstanceOf(Page.class, response.getBody());
        verify(attendanceService).findAll(3L, PageRequest.of(0, 20));
    }
}
