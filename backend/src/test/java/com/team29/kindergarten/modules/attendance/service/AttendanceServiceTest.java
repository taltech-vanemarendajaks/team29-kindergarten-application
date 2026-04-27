package com.team29.kindergarten.modules.attendance.service;

import com.team29.kindergarten.common.enums.AttendanceStatus;
import com.team29.kindergarten.common.exception.ForbiddenException;
import com.team29.kindergarten.common.exception.ResourceNotFoundException;
import com.team29.kindergarten.modules.attendance.dto.AttendanceRequestDto;
import com.team29.kindergarten.modules.attendance.dto.AttendanceResponseDto;
import com.team29.kindergarten.modules.attendance.mapper.AttendanceMapper;
import com.team29.kindergarten.modules.attendance.model.Attendance;
import com.team29.kindergarten.modules.attendance.repository.AttendanceRepository;
import com.team29.kindergarten.modules.auth.entity.Role;
import com.team29.kindergarten.modules.auth.entity.enums.RoleName;
import com.team29.kindergarten.modules.child.model.Child;
import com.team29.kindergarten.modules.child.service.ChildService;
import com.team29.kindergarten.modules.user.entity.User;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageRequest;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
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
        User user = teacherUser(10L);
        LocalDate from = LocalDate.of(2026, 4, 1);
        LocalDate to = LocalDate.of(2026, 4, 30);
        Child child = Child.builder().id(childId).tenantId(tenantId).build();
        Attendance attendance = Attendance.builder()
                .id(10L)
                .date(LocalDate.of(2026, 4, 3))
                .status(AttendanceStatus.PRESENT)
                .tenantId(tenantId)
                .child(child)
                .build();
        AttendanceResponseDto dto = AttendanceResponseDto.builder()
                .id(10L)
                .childId(childId)
                .date(LocalDate.of(2026, 4, 3))
                .status(AttendanceStatus.PRESENT)
                .tenantId(tenantId)
                .build();

        when(childService.getChild(childId, tenantId, user)).thenReturn(child);
        when(attendanceRepository.findAllByTenantIdAndChildIdAndDateBetweenOrderByDateAsc(tenantId, childId, from, to))
                .thenReturn(List.of(attendance));
        when(attendanceMapper.toResponseDto(attendance)).thenReturn(dto);

        List<AttendanceResponseDto> result = attendanceService.findForChildInRange(childId, from, to, tenantId, user);

        assertEquals(1, result.size());
        assertEquals(dto.getId(), result.getFirst().getId());
        verify(childService).getChild(childId, tenantId, user);
        verify(attendanceRepository).findAllByTenantIdAndChildIdAndDateBetweenOrderByDateAsc(tenantId, childId, from, to);
    }

    @Test
    void findForChildInRangeThrowsWhenRangeIsInvalid() {
        LocalDate from = LocalDate.of(2026, 4, 11);
        LocalDate to = LocalDate.of(2026, 4, 1);

        assertThrows(
                IllegalArgumentException.class,
                () -> attendanceService.findForChildInRange(1L, from, to, 1L, teacherUser(1L))
        );
    }

    @Test
    void findForChildInRangeThrowsWhenChildIsNotAccessible() {
        User user = parentUser(2L);
        when(childService.getChild(eq(99L), eq(1L), eq(user)))
                .thenThrow(new ResourceNotFoundException("Child not found: 99"));

        assertThrows(
                ResourceNotFoundException.class,
                () -> attendanceService.findForChildInRange(99L, LocalDate.of(2026, 4, 1), LocalDate.of(2026, 4, 30), 1L, user)
        );

        verify(attendanceRepository, never())
                .findAllByTenantIdAndChildIdAndDateBetweenOrderByDateAsc(any(), any(), any(), any());
    }

    @Test
    void findAllThrowsForNonAdmin() {
        assertThrows(
                ForbiddenException.class,
                () -> attendanceService.findAll(1L, PageRequest.of(0, 20), teacherUser(1L))
        );
    }

    @Test
    void findAllAllowedForKindergartenAdmin() {
        User admin = kindergartenAdminUser(3L);
        when(attendanceRepository.findAllByTenantId(eq(1L), eq(PageRequest.of(0, 20))))
                .thenReturn(org.springframework.data.domain.Page.empty(PageRequest.of(0, 20)));

        attendanceService.findAll(1L, PageRequest.of(0, 20), admin);

        verify(attendanceRepository).findAllByTenantId(1L, PageRequest.of(0, 20));
    }

    @Test
    void parentCannotCreatePresent() {
        User parent = parentUser(5L);
        Child child = Child.builder().id(7L).tenantId(1L).build();
        when(childService.getChild(7L, 1L, parent)).thenReturn(child);

        AttendanceRequestDto request = AttendanceRequestDto.builder()
                .childId(7L)
                .date(LocalDate.of(2026, 4, 10))
                .status(AttendanceStatus.PRESENT)
                .build();

        assertThrows(IllegalArgumentException.class, () -> attendanceService.create(request, 1L, parent));
        verify(attendanceRepository, never()).save(any());
    }

    @Test
    void parentCannotUpdateToPresent() {
        User parent = parentUser(5L);
        Child child = Child.builder().id(7L).tenantId(1L).build();
        Attendance existing = Attendance.builder()
                .id(30L)
                .tenantId(1L)
                .child(child)
                .date(LocalDate.of(2026, 4, 2))
                .status(AttendanceStatus.SICK)
                .build();

        when(attendanceRepository.findByIdAndTenantId(30L, 1L)).thenReturn(Optional.of(existing));
        when(childService.getChild(7L, 1L, parent)).thenReturn(child);

        AttendanceRequestDto request = AttendanceRequestDto.builder()
                .childId(7L)
                .date(LocalDate.of(2026, 4, 2))
                .status(AttendanceStatus.PRESENT)
                .build();

        assertThrows(IllegalArgumentException.class, () -> attendanceService.update(30L, request, 1L, parent));
        verify(attendanceRepository, never()).save(any());
    }

    @Test
    void parentCannotEditExistingPresentViaCreateUpsert() {
        User parent = parentUser(11L);
        Child child = Child.builder().id(7L).tenantId(1L).build();
        Attendance existingPresent = Attendance.builder()
                .id(31L)
                .tenantId(1L)
                .child(child)
                .date(LocalDate.of(2026, 4, 11))
                .status(AttendanceStatus.PRESENT)
                .build();

        when(childService.getChild(7L, 1L, parent)).thenReturn(child);
        when(attendanceRepository.findAnyByTenantIdAndChildIdAndDate(1L, 7L, LocalDate.of(2026, 4, 11)))
                .thenReturn(Optional.of(existingPresent));

        AttendanceRequestDto request = AttendanceRequestDto.builder()
                .childId(7L)
                .date(LocalDate.of(2026, 4, 11))
                .status(AttendanceStatus.ABSENT)
                .build();

        assertThrows(ForbiddenException.class, () -> attendanceService.create(request, 1L, parent));
        verify(attendanceRepository, never()).save(any());
    }

    @Test
    void parentCannotUpdateExistingPresentRecord() {
        User parent = parentUser(12L);
        Child child = Child.builder().id(8L).tenantId(1L).build();
        Attendance existingPresent = Attendance.builder()
                .id(32L)
                .tenantId(1L)
                .child(child)
                .date(LocalDate.of(2026, 4, 12))
                .status(AttendanceStatus.PRESENT)
                .build();

        when(attendanceRepository.findByIdAndTenantId(32L, 1L)).thenReturn(Optional.of(existingPresent));

        AttendanceRequestDto request = AttendanceRequestDto.builder()
                .childId(8L)
                .date(LocalDate.of(2026, 4, 12))
                .status(AttendanceStatus.SICK)
                .build();

        assertThrows(ForbiddenException.class, () -> attendanceService.update(32L, request, 1L, parent));
        verify(attendanceRepository, never()).save(any());
    }

    @Test
    void parentCannotDeleteExistingPresentRecord() {
        User parent = parentUser(13L);
        Child child = Child.builder().id(9L).tenantId(1L).build();
        Attendance existingPresent = Attendance.builder()
                .id(33L)
                .tenantId(1L)
                .child(child)
                .date(LocalDate.of(2026, 4, 13))
                .status(AttendanceStatus.PRESENT)
                .build();

        when(attendanceRepository.findByIdAndTenantId(33L, 1L)).thenReturn(Optional.of(existingPresent));

        assertThrows(ForbiddenException.class, () -> attendanceService.delete(33L, 1L, parent));
        verify(attendanceRepository, never()).save(any());
    }

    @Test
    void teacherCanCreatePresent() {
        User teacher = teacherUser(8L);
        Child child = Child.builder().id(7L).tenantId(1L).build();
        when(childService.getChild(7L, 1L, teacher)).thenReturn(child);
        when(attendanceRepository.findAnyByTenantIdAndChildIdAndDate(1L, 7L, LocalDate.of(2026, 4, 10)))
                .thenReturn(Optional.empty());

        Attendance mapped = Attendance.builder().id(1L).child(child).build();
        when(attendanceMapper.toEntity(any(AttendanceRequestDto.class))).thenReturn(mapped);
        when(attendanceRepository.save(any(Attendance.class))).thenAnswer(inv -> inv.getArgument(0));
        when(attendanceMapper.toResponseDto(any(Attendance.class)))
                .thenReturn(AttendanceResponseDto.builder().id(1L).childId(7L).status(AttendanceStatus.PRESENT).build());

        AttendanceRequestDto request = AttendanceRequestDto.builder()
                .childId(7L)
                .date(LocalDate.of(2026, 4, 10))
                .status(AttendanceStatus.PRESENT)
                .build();

        AttendanceResponseDto result = attendanceService.create(request, 1L, teacher);
        assertEquals(AttendanceStatus.PRESENT, result.getStatus());
        verify(attendanceRepository).save(any(Attendance.class));
    }

    @Test
    void updateValidatesExistingRecordChildAccess() {
        User teacher = teacherUser(2L);
        Child child = Child.builder().id(4L).tenantId(1L).build();
        Attendance existing = Attendance.builder()
                .id(20L)
                .tenantId(1L)
                .child(child)
                .date(LocalDate.of(2026, 4, 5))
                .status(AttendanceStatus.ABSENT)
                .build();

        when(attendanceRepository.findByIdAndTenantId(20L, 1L)).thenReturn(Optional.of(existing));
        when(childService.getChild(4L, 1L, teacher)).thenReturn(child);

        AttendanceRequestDto request = AttendanceRequestDto.builder()
                .childId(4L)
                .date(LocalDate.of(2026, 4, 5))
                .status(AttendanceStatus.PRESENT)
                .build();

        when(attendanceRepository.save(any(Attendance.class))).thenAnswer(inv -> inv.getArgument(0));
        when(attendanceMapper.toResponseDto(any(Attendance.class)))
                .thenReturn(AttendanceResponseDto.builder().id(20L).status(AttendanceStatus.PRESENT).build());

        attendanceService.update(20L, request, 1L, teacher);

        verify(childService).getChild(4L, 1L, teacher);
        verify(attendanceRepository).save(existing);
    }

    private static User parentUser(long id) {
        return User.builder()
                .id(id)
                .roles(Set.of(role(RoleName.PARENT)))
                .build();
    }

    private static User teacherUser(long id) {
        return User.builder()
                .id(id)
                .roles(Set.of(role(RoleName.TEACHER)))
                .build();
    }

    private static User kindergartenAdminUser(long id) {
        return User.builder()
                .id(id)
                .roles(Set.of(role(RoleName.KINDERGARTEN_ADMIN)))
                .build();
    }

    private static Role role(RoleName name) {
        Role r = new Role();
        r.setName(name);
        return r;
    }
}
