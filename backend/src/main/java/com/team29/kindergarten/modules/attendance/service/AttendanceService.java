package com.team29.kindergarten.modules.attendance.service;

import com.team29.kindergarten.common.exception.ResourceNotFoundException;
import com.team29.kindergarten.modules.attendance.dto.AttendanceRequestDto;
import com.team29.kindergarten.modules.attendance.dto.AttendanceResponseDto;
import com.team29.kindergarten.modules.attendance.mapper.AttendanceMapper;
import com.team29.kindergarten.modules.attendance.model.Attendance;
import com.team29.kindergarten.modules.attendance.repository.AttendanceRepository;
import com.team29.kindergarten.modules.child.model.Child;
import com.team29.kindergarten.modules.child.service.ChildService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Transactional
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final AttendanceMapper attendanceMapper;
    private final ChildService childService;

    @Transactional(readOnly = true)
    public Page<AttendanceResponseDto> findAll(Long tenantId, Pageable pageable) {
        return attendanceRepository.findAllByTenantId(tenantId, pageable).map(attendanceMapper::toResponseDto);
    }

    @Transactional(readOnly = true)
    public AttendanceResponseDto findById(Long id, Long tenantId) {
        return attendanceMapper.toResponseDto(getAttendance(id, tenantId));
    }

    public AttendanceResponseDto create(AttendanceRequestDto request, Long tenantId) {
        Attendance attendance = attendanceMapper.toEntity(request);
        attendance.setTenantId(tenantId);
        attendance.setChild(resolveChild(request.getChildId(), tenantId));
        return attendanceMapper.toResponseDto(attendanceRepository.save(attendance));
    }

    public AttendanceResponseDto update(Long id, AttendanceRequestDto request, Long tenantId) {
        Attendance attendance = getAttendance(id, tenantId);
        attendanceMapper.updateEntityFromDto(request, attendance);
        attendance.setChild(resolveChild(request.getChildId(), tenantId));
        return attendanceMapper.toResponseDto(attendanceRepository.save(attendance));
    }

    public void delete(Long id, Long tenantId) {
        Attendance attendance = getAttendance(id, tenantId);
        attendance.setDeletedAt(LocalDateTime.now());
        attendanceRepository.save(attendance);
    }

    private Attendance getAttendance(Long id, Long tenantId) {
        return attendanceRepository.findByIdAndTenantId(id, tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Attendance not found: " + id));
    }

    private Child resolveChild(Long childId, Long tenantId) {
        return childService.getChild(childId, tenantId);
    }
}
