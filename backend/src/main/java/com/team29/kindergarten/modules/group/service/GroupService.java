package com.team29.kindergarten.modules.group.service;

import com.team29.kindergarten.common.exception.ResourceNotFoundException;
import com.team29.kindergarten.modules.group.dto.GroupRequestDto;
import com.team29.kindergarten.modules.group.dto.GroupResponseDto;
import com.team29.kindergarten.modules.group.mapper.GroupMapper;
import com.team29.kindergarten.modules.group.model.Group;
import com.team29.kindergarten.modules.group.repository.GroupRepository;
import com.team29.kindergarten.modules.teacher.model.Teacher;
import com.team29.kindergarten.modules.teacher.service.TeacherService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class GroupService {

    private final GroupRepository groupRepository;
    private final GroupMapper groupMapper;
    private final TeacherService teacherService;

    @Transactional(readOnly = true)
    public List<GroupResponseDto> findAll(Long tenantId) {
        return groupRepository.findAllByTenantIdOrderByNameAsc(tenantId)
                .stream()
                .map(groupMapper::toResponseDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public GroupResponseDto findById(Long id, Long tenantId) {
        return groupMapper.toResponseDto(getGroup(id, tenantId));
    }

    public GroupResponseDto create(GroupRequestDto request, Long tenantId) {
        Group group = groupMapper.toEntity(request);
        group.setTenantId(tenantId);
        applyTeacher(group, request.getTeacherId(), tenantId);
        return groupMapper.toResponseDto(groupRepository.save(group));
    }

    public GroupResponseDto update(Long id, GroupRequestDto request, Long tenantId) {
        Group group = getGroup(id, tenantId);
        groupMapper.updateEntityFromDto(request, group);
        applyTeacher(group, request.getTeacherId(), tenantId);
        return groupMapper.toResponseDto(groupRepository.save(group));
    }

    public void delete(Long id, Long tenantId) {
        Group group = getGroup(id, tenantId);
        group.setDeletedAt(LocalDateTime.now());
        groupRepository.save(group);
    }

    public Group getGroup(Long id, Long tenantId) {
        return groupRepository.findByIdAndTenantId(id, tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Group not found: " + id));
    }

    private void applyTeacher(Group group, Long teacherId, Long tenantId) {
        if (teacherId == null) {
            group.setTeacher(null);
            return;
        }

        Teacher teacher = teacherService.getTeacher(teacherId, tenantId);
        group.setTeacher(teacher);
    }
}
