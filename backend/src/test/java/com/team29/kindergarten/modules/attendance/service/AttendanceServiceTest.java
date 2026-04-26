package com.team29.kindergarten.modules.attendance.service;

import com.team29.kindergarten.common.exception.ResourceNotFoundException;
import com.team29.kindergarten.common.enums.AttendanceStatus;
import com.team29.kindergarten.modules.attendance.dto.AttendanceResponseDto;
import com.team29.kindergarten.modules.attendance.mapper.AttendanceMapper;
import com.team29.kindergarten.modules.attendance.model.Attendance;
import com.team29.kindergarten.modules.attendance.repository.AttendanceRepository;
import com.team29.kindergarten.modules.child.service.ChildService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AttendanceServiceTest {

    @Mock
    private AttendanceRepository attendanceRepository;

    @Mock
    private AttendanceMapper attendanceMapper;

    @Mock
    private ChildService childService;

    @InjectMocks
    private AttendanceService attendanceService;

    @Test
    void findForChildInRangeReturnsMappedList() {
        Long tenantId = 1L;
        Long childId = 5L;
        LocalDate from = LocalDate.of(2026, 4, 1);
        LocalDate to = LocalDate.of(2026, 4, 30);
        Attendance attendance = Attendance.builder()
                .id(10L)
                .date(LocalDate.of(2026, 4, 3))
                .status(AttendanceStatus.PRESENT)
                .tenantId(tenantId)
                .build();
        AttendanceResponseDto dto = AttendanceResponseDto.builder()
                .id(10L)
                .childId(childId)
                .date(LocalDate.of(2026, 4, 3))
                .status(AttendanceStatus.PRESENT)
                .tenantId(tenantId)
                .build();

        when(attendanceRepository.findAllByTenantIdAndChildIdAndDateBetweenOrderByDateAsc(tenantId, childId, from, to))
                .thenReturn(List.of(attendance));
        when(attendanceMapper.toResponseDto(attendance)).thenReturn(dto);

        List<AttendanceResponseDto> result = attendanceService.findForChildInRange(childId, from, to, tenantId);

        assertEquals(1, result.size());
        assertEquals(dto.getId(), result.getFirst().getId());
        verify(childService).getChild(childId, tenantId);
        verify(attendanceRepository).findAllByTenantIdAndChildIdAndDateBetweenOrderByDateAsc(tenantId, childId, from, to);
    }

    @Test
    void findForChildInRangeThrowsWhenRangeIsInvalid() {
        LocalDate from = LocalDate.of(2026, 4, 11);
        LocalDate to = LocalDate.of(2026, 4, 1);

        assertThrows(
                IllegalArgumentException.class,
                () -> attendanceService.findForChildInRange(1L, from, to, 1L)
        );
    }

    @Test
    void findForChildInRangeThrowsWhenChildIsNotAccessible() {
        when(childService.getChild(eq(99L), eq(1L))).thenThrow(new ResourceNotFoundException("Child not found: 99"));

        assertThrows(
                ResourceNotFoundException.class,
                () -> attendanceService.findForChildInRange(99L, LocalDate.of(2026, 4, 1), LocalDate.of(2026, 4, 30), 1L)
        );

        verify(attendanceRepository, org.mockito.Mockito.never())
                .findAllByTenantIdAndChildIdAndDateBetweenOrderByDateAsc(any(), any(), any(), any());
    }
}
