package com.team29.kindergarten.modules.group.service;

import com.team29.kindergarten.common.exception.ResourceNotFoundException;
import com.team29.kindergarten.modules.child.model.Child;
import com.team29.kindergarten.modules.child.repository.ChildRepository;
import com.team29.kindergarten.modules.group.dto.GroupRequestDto;
import com.team29.kindergarten.modules.group.dto.GroupResponseDto;
import com.team29.kindergarten.modules.group.mapper.GroupMapper;
import com.team29.kindergarten.modules.group.model.Group;
import com.team29.kindergarten.modules.group.repository.GroupRepository;
import com.team29.kindergarten.modules.auth.entity.enums.RoleName;
import com.team29.kindergarten.modules.user.entity.User;
import com.team29.kindergarten.modules.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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
    private final UserRepository userRepository;
    private final ChildRepository childRepository;

    @Transactional(readOnly = true)
    public Page<GroupResponseDto> findAll(Long tenantId, Pageable pageable) {
        return groupRepository.findAllByTenantId(tenantId, pageable)
                .map(groupMapper::toResponseDto);
    }

    @Transactional(readOnly = true)
    public GroupResponseDto findById(Long id, Long tenantId) {
        return groupMapper.toResponseDto(getGroup(id, tenantId));
    }

    public GroupResponseDto create(GroupRequestDto request, Long tenantId) {
        normalizeRequest(request);
        Group group = groupMapper.toEntity(request);
        group.setTenantId(tenantId);
        applyTeacher(group, request.getTeacherId(), tenantId);
        return groupMapper.toResponseDto(groupRepository.save(group));
    }

    public GroupResponseDto update(Long id, GroupRequestDto request, Long tenantId) {
        normalizeRequest(request);
        Group group = getGroup(id, tenantId);
        groupMapper.updateEntityFromDto(request, group);
        applyTeacher(group, request.getTeacherId(), tenantId);
        return groupMapper.toResponseDto(groupRepository.save(group));
    }

    public void delete(Long id, Long tenantId) {
        Group group = getGroup(id, tenantId);

        List<Child> childrenInGroup = childRepository.findAllByGroupIdAndTenantId(group.getId(), tenantId);
        childrenInGroup.forEach(child -> child.setGroup(null));
        childRepository.saveAll(childrenInGroup);

        group.setTeacherUser(null);
        group.setDeletedAt(LocalDateTime.now());
        groupRepository.save(group);
    }

    public Group getGroup(Long id, Long tenantId) {
        return groupRepository.findByIdAndTenantId(id, tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Group not found: " + id));
    }

    private void applyTeacher(Group group, Long teacherId, Long tenantId) {
        if (teacherId == null) {
            group.setTeacherUser(null);
            return;
        }

        User teacherUser = userRepository.findByIdAndTenantIdAndRoles_Name(teacherId, tenantId, RoleName.TEACHER)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher user not found: " + teacherId));
        group.setTeacherUser(teacherUser);
    }

    private void normalizeRequest(GroupRequestDto request) {
        request.setName(normalizeWhitespace(request.getName()));
        request.setAgeRange(normalizeWhitespace(request.getAgeRange()));
    }

    private String normalizeWhitespace(String value) {
        if (value == null) {
            return null;
        }

        return value.trim().replaceAll("\\s+", " ");
    }
}
