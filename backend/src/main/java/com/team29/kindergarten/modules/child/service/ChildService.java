package com.team29.kindergarten.modules.child.service;

import com.team29.kindergarten.common.exception.ResourceNotFoundException;
import com.team29.kindergarten.modules.child.dto.ChildRequestDto;
import com.team29.kindergarten.modules.child.dto.ChildResponseDto;
import com.team29.kindergarten.modules.child.mapper.ChildMapper;
import com.team29.kindergarten.modules.child.model.Child;
import com.team29.kindergarten.modules.child.model.ChildParent;
import com.team29.kindergarten.modules.child.model.ChildParentId;
import com.team29.kindergarten.modules.child.repository.ChildParentRepository;
import com.team29.kindergarten.modules.child.repository.ChildRepository;
import com.team29.kindergarten.modules.group.model.Group;
import com.team29.kindergarten.modules.group.repository.GroupRepository;
import com.team29.kindergarten.modules.parent.service.ParentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class ChildService {

    private final ChildRepository childRepository;
    private final ChildMapper childMapper;
    private final GroupRepository groupRepository;
    private final ParentService parentService;
    private final ChildParentRepository childParentRepository;

    @Transactional(readOnly = true)
    public Page<ChildResponseDto> findAll(Long tenantId, Pageable pageable) {
        log.info("Fetching all children for tenantId={}, page={}", tenantId, pageable.getPageNumber());
        return childRepository
                .findAllByTenantId(tenantId, pageable)
                .map(childMapper::toResponseDto);
    }

    @Transactional(readOnly = true)
    public ChildResponseDto findById(Long id, Long tenantId) {
        log.info("Fetching child id={} for tenantId={}", id, tenantId);
        return childRepository
                .findByIdAndTenantId(id, tenantId)
                .map(childMapper::toResponseDto)
                .orElseThrow(() -> new ResourceNotFoundException("Child not found: " + id));
    }

    @Transactional(readOnly = true)
    public List<ChildResponseDto> findAllByTeacher(Long teacherUserId, Long tenantId) {
    log.info("Fetching class records for teacherUserId={}, tenantId={}", teacherUserId, tenantId);

    Group group = groupRepository.findByTeacherUserIdAndTenantId(teacherUserId, tenantId)
            .orElseThrow(() -> new ResourceNotFoundException(
                    "No group found for teacher userId=" + teacherUserId));

    return childRepository.findAllByGroupIdAndTenantId(group.getId(), tenantId)
            .stream()
            .map(childMapper::toResponseDto)
            .toList();
}

    public ChildResponseDto create(ChildRequestDto request, Long tenantId, Long parentId) {
        log.info("Creating child for tenantId={} and linking parentId={}", tenantId, parentId);

        Child child = childMapper.toEntity(request);
        child.setTenantId(tenantId);
        resolveGroup(request.getGroupId(), tenantId, child);

        Child saved = childRepository.save(child);
        linkParent(saved.getId(), parentId, tenantId);
        log.info("Created child id={} for tenantId={} and linked parentId={}", saved.getId(), tenantId, parentId);
        return childMapper.toResponseDto(saved);
    }

    public ChildResponseDto update(Long id, ChildRequestDto request, Long tenantId) {
        log.info("Updating child id={} for tenantId={}", id, tenantId);

        Child child = childRepository
                .findByIdAndTenantId(id, tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Child not found: " + id));

        childMapper.updateEntityFromDto(request, child);
        resolveGroup(request.getGroupId(), tenantId, child);

        childRepository.save(child);
        log.info("Updated child id={} for tenantId={}", id, tenantId);
        return childMapper.toResponseDto(child);
    }

    public void delete(Long id, Long tenantId) {
        Child child = getChild(id, tenantId);

        child.setDeletedAt(LocalDateTime.now());
        childRepository.save(child);
    }

    public Child getChild(Long id, Long tenantId) {
        return childRepository.findByIdAndTenantId(id, tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Child not found: " + id));
    }

    public void addParentLink(Long childId, Long parentId, Long tenantId) {
        log.info("Linking parentId={} to childId={} for tenantId={}", parentId, childId, tenantId);
        // TODO: Decide whether this operation should stay admin/staff-controlled
        // or move behind a parent invitation / consent workflow.
        getChild(childId, tenantId);
        linkParent(childId, parentId, tenantId);
        log.info("Linked parentId={} to childId={} for tenantId={}", parentId, childId, tenantId);
    }

    private void resolveGroup(Long groupId, Long tenantId, Child child) {
        if (groupId == null) {
            child.setGroup(null);
            return;
        }

        Group group = groupRepository
                .findByIdAndTenantId(groupId, tenantId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Group not found or does not belong to tenant: " + groupId));

        child.setGroup(group);
    }

    private void linkParent(Long childId, Long parentId, Long tenantId) {
        // TODO: For the parent self-service flow, parentId should be resolved
        // from authentication instead of being passed in by the client.
        parentService.getParent(parentId, tenantId);

        childParentRepository
                .findByIdChildIdAndIdParentIdAndTenantId(childId, parentId, tenantId)
                .ifPresent(existingLink -> {
                    throw new IllegalArgumentException("Parent is already linked to child");
                });

        ChildParent childParent = ChildParent.builder()
                .id(ChildParentId.builder()
                        .childId(childId)
                        .parentId(parentId)
                        .build())
                .tenantId(tenantId)
                .build();

        childParentRepository.save(childParent);
    }
}
