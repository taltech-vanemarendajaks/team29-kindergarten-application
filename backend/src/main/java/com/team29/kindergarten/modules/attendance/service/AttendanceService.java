package com.team29.kindergarten.modules.attendance.service;

import com.team29.kindergarten.common.enums.AttendanceStatus;
import com.team29.kindergarten.common.exception.ForbiddenException;
import com.team29.kindergarten.common.exception.ResourceNotFoundException;
import com.team29.kindergarten.modules.attendance.dto.AttendanceRequestDto;
import com.team29.kindergarten.modules.attendance.dto.AttendanceResponseDto;
import com.team29.kindergarten.modules.attendance.mapper.AttendanceMapper;
import com.team29.kindergarten.modules.attendance.model.Attendance;
import com.team29.kindergarten.modules.attendance.repository.AttendanceRepository;
import com.team29.kindergarten.modules.auth.entity.enums.RoleName;
import com.team29.kindergarten.modules.child.model.Child;
import com.team29.kindergarten.modules.child.service.ChildService;
import com.team29.kindergarten.modules.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final AttendanceMapper attendanceMapper;
    private final ChildService childService;

    @Transactional(readOnly = true)
    public Page<AttendanceResponseDto> findAll(Long tenantId, Pageable pageable, User user) {
        if (!hasKindergartenAdminAccess(user)) {
            throw new ForbiddenException("Listing all attendance records is restricted to administrators.");
        }
        return attendanceRepository.findAllByTenantId(tenantId, pageable).map(attendanceMapper::toResponseDto);
    }

    @Transactional(readOnly = true)
    public AttendanceResponseDto findById(Long id, Long tenantId, User user) {
        Attendance attendance = getAttendance(id, tenantId);
        assertCanAccessChild(attendance.getChild().getId(), tenantId, user);
        return attendanceMapper.toResponseDto(attendance);
    }

    @Transactional(readOnly = true)
    public List<AttendanceResponseDto> findForChildInRange(Long childId, LocalDate from, LocalDate to, Long tenantId, User user) {
        childService.getChild(childId, tenantId, user);

        LocalDate resolvedFrom = from;
        LocalDate resolvedTo = to;
        if (resolvedFrom == null || resolvedTo == null) {
            YearMonth month = YearMonth.now();
            resolvedFrom = month.atDay(1);
            resolvedTo = month.atEndOfMonth();
        }

        if (resolvedFrom.isAfter(resolvedTo)) {
            throw new IllegalArgumentException("'from' date must be before or equal to 'to' date");
        }

        long daySpan = resolvedTo.toEpochDay() - resolvedFrom.toEpochDay();
        if (daySpan > 92) {
            throw new IllegalArgumentException("Date range is too large. Maximum allowed range is 92 days");
        }

        return attendanceRepository
                .findAllByTenantIdAndChildIdAndDateBetweenOrderByDateAsc(tenantId, childId, resolvedFrom, resolvedTo)
                .stream()
                .map(attendanceMapper::toResponseDto)
                .toList();
    }

    public AttendanceResponseDto create(AttendanceRequestDto request, Long tenantId, User user) {
        assertParentCannotSetPresent(user, request.getStatus());
        Child child = childService.getChild(request.getChildId(), tenantId, user);
        Optional<Attendance> existingAttendance = attendanceRepository.findAnyByTenantIdAndChildIdAndDate(
                tenantId,
                request.getChildId(),
                request.getDate()
        );

        Attendance attendance;
        if (existingAttendance.isPresent()) {
            attendance = existingAttendance.get();
            attendanceMapper.updateEntityFromDto(request, attendance);
            attendance.setDeletedAt(null);
        } else {
            attendance = attendanceMapper.toEntity(request);
            attendance.setTenantId(tenantId);
        }

        attendance.setChild(child);
        return attendanceMapper.toResponseDto(attendanceRepository.save(attendance));
    }

    public AttendanceResponseDto update(Long id, AttendanceRequestDto request, Long tenantId, User user) {
        assertParentCannotSetPresent(user, request.getStatus());
        Attendance attendance = getAttendance(id, tenantId);
        assertCanAccessChild(attendance.getChild().getId(), tenantId, user);
        assertCanAccessChild(request.getChildId(), tenantId, user);

        attendanceMapper.updateEntityFromDto(request, attendance);
        attendance.setChild(childService.getChild(request.getChildId(), tenantId, user));
        return attendanceMapper.toResponseDto(attendanceRepository.save(attendance));
    }

    public void delete(Long id, Long tenantId, User user) {
        Attendance attendance = getAttendance(id, tenantId);
        assertCanAccessChild(attendance.getChild().getId(), tenantId, user);
        attendance.setDeletedAt(LocalDateTime.now());
        attendanceRepository.save(attendance);
    }

    private void assertCanAccessChild(Long childId, Long tenantId, User user) {
        childService.getChild(childId, tenantId, user);
    }

    private void assertParentCannotSetPresent(User user, AttendanceStatus status) {
        if (status == AttendanceStatus.PRESENT && isParentOnly(user)) {
            throw new IllegalArgumentException("Parents cannot set attendance status to present.");
        }
    }

    /**
     * True when the user has the parent role and does not have admin or teacher role
     * (so parent-only accounts cannot set PRESENT).
     */
    private boolean isParentOnly(User user) {
        if (user == null || user.getRoles() == null) {
            return false;
        }
        boolean parent = user.getRoles().stream().anyMatch(r -> r.getName() == RoleName.PARENT);
        if (!parent) {
            return false;
        }
        boolean elevated = user.getRoles().stream()
                .anyMatch(r -> r.getName() == RoleName.KINDERGARTEN_ADMIN
                        || r.getName() == RoleName.SUPER_ADMIN
                        || r.getName() == RoleName.TEACHER);
        return !elevated;
    }

    private boolean hasKindergartenAdminAccess(User user) {
        if (user == null || user.getRoles() == null) {
            return false;
        }
        return user.getRoles().stream()
                .anyMatch(role -> role.getName() == RoleName.KINDERGARTEN_ADMIN
                        || role.getName() == RoleName.SUPER_ADMIN);
    }

    private Attendance getAttendance(Long id, Long tenantId) {
        return attendanceRepository.findByIdAndTenantId(id, tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Attendance not found: " + id));
    }
}
