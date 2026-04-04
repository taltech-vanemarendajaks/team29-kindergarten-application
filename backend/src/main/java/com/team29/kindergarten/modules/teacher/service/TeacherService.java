package com.team29.kindergarten.modules.teacher.service;

import com.team29.kindergarten.common.exception.ResourceNotFoundException;
import com.team29.kindergarten.modules.teacher.dto.TeacherRequestDto;
import com.team29.kindergarten.modules.teacher.dto.TeacherResponseDto;
import com.team29.kindergarten.modules.teacher.mapper.TeacherMapper;
import com.team29.kindergarten.modules.teacher.model.Teacher;
import com.team29.kindergarten.modules.teacher.repository.TeacherRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class TeacherService {

    private final TeacherRepository teacherRepository;
    private final TeacherMapper teacherMapper;

    @Transactional(readOnly = true)
    public List<TeacherResponseDto> findAll(Long tenantId) {
        return teacherRepository.findAllByTenantIdOrderByLastNameAscFirstNameAsc(tenantId)
                .stream()
                .map(teacherMapper::toResponseDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public TeacherResponseDto findById(Long id, Long tenantId) {
        return teacherMapper.toResponseDto(getTeacher(id, tenantId));
    }

    public TeacherResponseDto create(TeacherRequestDto request, Long tenantId) {
        Teacher teacher = teacherMapper.toEntity(request);
        teacher.setTenantId(tenantId);
        return teacherMapper.toResponseDto(teacherRepository.save(teacher));
    }

    public TeacherResponseDto update(Long id, TeacherRequestDto request, Long tenantId) {
        Teacher teacher = getTeacher(id, tenantId);
        teacherMapper.updateEntityFromDto(request, teacher);
        return teacherMapper.toResponseDto(teacherRepository.save(teacher));
    }

    public void delete(Long id, Long tenantId) {
        Teacher teacher = getTeacher(id, tenantId);
        teacher.setDeletedAt(LocalDateTime.now());
        teacherRepository.save(teacher);
    }

    public Teacher getTeacher(Long id, Long tenantId) {
        return teacherRepository.findByIdAndTenantId(id, tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found: " + id));
    }
}
