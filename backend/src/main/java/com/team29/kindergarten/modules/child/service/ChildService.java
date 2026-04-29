package com.team29.kindergarten.modules.child.service;

import com.team29.kindergarten.common.exception.ResourceNotFoundException;
import com.team29.kindergarten.modules.auth.entity.enums.RoleName;
import com.team29.kindergarten.modules.child.dto.ChildRequestDto;
import com.team29.kindergarten.modules.child.dto.ChildResponseDto;
import com.team29.kindergarten.modules.child.dto.ParentSummaryDto;
import com.team29.kindergarten.modules.child.dto.UpdateChildGroupRequestDto;
import com.team29.kindergarten.modules.child.mapper.ChildMapper;
import com.team29.kindergarten.modules.child.model.Child;
import com.team29.kindergarten.modules.child.model.ChildParent;
import com.team29.kindergarten.modules.child.model.ChildParentId;
import com.team29.kindergarten.modules.child.repository.ChildParentRepository;
import com.team29.kindergarten.modules.child.repository.ChildRepository;
import com.team29.kindergarten.modules.group.model.Group;
import com.team29.kindergarten.modules.group.repository.GroupRepository;
import com.team29.kindergarten.modules.user.entity.User;
import com.team29.kindergarten.modules.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class ChildService {

    private final ChildRepository childRepository;
    private final ChildParentRepository childParentRepository;
    private final ChildMapper childMapper;
    private final GroupRepository groupRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public Page<ChildResponseDto> findAll(Long tenantId, Pageable pageable, User user) {
        log.info("Fetching all children for tenantId={}, page={}", tenantId, pageable.getPageNumber());
        if (user != null && isParent(user)) {
            List<Long> childIds = childParentRepository.findChildIdsByParentUserIdAndTenantId(user.getId(), tenantId);
            if (childIds.isEmpty()) {
                return new PageImpl<>(List.of(), pageable, 0);
            }
            Page<Child> page = childRepository.findAllByTenantIdAndIdIn(tenantId, childIds, pageable);
            return mapChildrenWithParents(page, tenantId);
        }
        Page<Child> page = childRepository.findAllByTenantId(tenantId, pageable);
        return mapChildrenWithParents(page, tenantId);
    }

    @Transactional(readOnly = true)
    public List<ChildResponseDto> findUnassigned(Long tenantId) {
        log.info("Fetching all unassigned children for tenantId={}", tenantId);
        return mapChildrenWithParents(
                childRepository.findAllByTenantIdAndGroupIsNullOrderByCreatedAtAsc(tenantId),
                tenantId
        );
    }

    @Transactional(readOnly = true)
    public ChildResponseDto findById(Long id, Long tenantId, User user) {
        log.info("Fetching child id={} for tenantId={}", id, tenantId);
        Child child = getChild(id, tenantId, user);
        ChildResponseDto response = childMapper.toResponseDto(child);
        attachParents(List.of(response), tenantId);
        return response;
    }

    @Transactional(readOnly = true)
    public List<ChildResponseDto> findAllByTeacher(Long teacherUserId, Long tenantId) {
        log.info("Fetching class records for teacherUserId={}, tenantId={}", teacherUserId, tenantId);

        Group group = groupRepository.findByTeacherUserIdAndTenantId(teacherUserId, tenantId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "No group found for teacher userId=" + teacherUserId));

        List<ChildResponseDto> responses = childRepository.findAllByGroupIdAndTenantId(group.getId(), tenantId)
                .stream()
                .map(childMapper::toResponseDto)
                .toList();
        attachParents(responses, tenantId);
        return responses;
    }

    public ChildResponseDto create(ChildRequestDto request, Long tenantId, User user) {
        log.info("Creating child for tenantId={}", tenantId);

        Child child = childMapper.toEntity(request);
        child.setTenantId(tenantId);
        resolveGroup(request.getGroupId(), tenantId, child);

        Child saved = childRepository.save(child);
        linkChildToParentUserIfNeeded(saved.getId(), tenantId, user);
        log.info("Created child id={} for tenantId={}", saved.getId(), tenantId);
        ChildResponseDto response = childMapper.toResponseDto(saved);
        attachParents(List.of(response), tenantId);
        return response;
    }

    public ChildResponseDto update(Long id, ChildRequestDto request, Long tenantId, User user) {
        log.info("Updating child id={} for tenantId={}", id, tenantId);

        Child child = getChild(id, tenantId, user);

        childMapper.updateEntityFromDto(request, child);
        resolveGroup(request.getGroupId(), tenantId, child);

        childRepository.save(child);
        log.info("Updated child id={} for tenantId={}", id, tenantId);
        ChildResponseDto response = childMapper.toResponseDto(child);
        attachParents(List.of(response), tenantId);
        return response;
    }

    public ChildResponseDto updateGroup(Long id, UpdateChildGroupRequestDto request, Long tenantId) {
        log.info("Updating child group for childId={} tenantId={}", id, tenantId);

        Child child = childRepository
                .findByIdAndTenantId(id, tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Child not found: " + id));

        resolveGroup(request.getGroupId(), tenantId, child);

        childRepository.save(child);
        ChildResponseDto response = childMapper.toResponseDto(child);
        attachParents(List.of(response), tenantId);
        return response;
    }

    public void delete(Long id, Long tenantId, User user) {
        Child child = getChild(id, tenantId, user);

        child.setDeletedAt(LocalDateTime.now());
        childRepository.save(child);
    }

    public Child getChild(Long id, Long tenantId, User user) {
        if (user == null) {
            return childRepository.findByIdAndTenantId(id, tenantId)
                    .orElseThrow(() -> new ResourceNotFoundException("Child not found: " + id));
        }
        if (hasKindergartenAdminAccess(user)) {
            return childRepository.findByIdAndTenantId(id, tenantId)
                    .orElseThrow(() -> new ResourceNotFoundException("Child not found: " + id));
        }
        if (isParent(user)) {
            List<Long> childIds = childParentRepository.findChildIdsByParentUserIdAndTenantId(user.getId(), tenantId);
            if (childIds.isEmpty()) {
                throw new ResourceNotFoundException("Child not found: " + id);
            }
            return childRepository.findByIdAndTenantIdAndIdIn(id, tenantId, childIds)
                    .orElseThrow(() -> new ResourceNotFoundException("Child not found: " + id));
        }
        if (isTeacher(user)) {
            Group teacherGroup = groupRepository.findByTeacherUserIdAndTenantId(user.getId(), tenantId)
                    .orElseThrow(() -> new ResourceNotFoundException("Child not found: " + id));
            Child child = childRepository.findByIdAndTenantId(id, tenantId)
                    .orElseThrow(() -> new ResourceNotFoundException("Child not found: " + id));
            if (child.getGroup() == null || !child.getGroup().getId().equals(teacherGroup.getId())) {
                throw new ResourceNotFoundException("Child not found: " + id);
            }
            return child;
        }
        return childRepository.findByIdAndTenantId(id, tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Child not found: " + id));
    }

    /**
     * Resolve child for admin/staff flows without applying parent visibility scope.
     */
    public Child getChild(Long id, Long tenantId) {
        return getChild(id, tenantId, null);
    }

    public void addParentLink(Long childId, Long parentUserId, Long tenantId) {
        log.info("Linking parentUserId={} to childId={} for tenantId={}", parentUserId, childId, tenantId);
        // TODO: Decide whether this operation should stay admin/staff-controlled
        // or move behind a parent invitation / consent workflow.
        getChild(childId, tenantId);
        linkParent(childId, parentUserId, tenantId);
        log.info("Linked parentUserId={} to childId={} for tenantId={}", parentUserId, childId, tenantId);
    }

    private void linkChildToParentUserIfNeeded(Long childId, Long tenantId, User user) {
        if (!isParent(user)) {
            return;
        }
        Long parentUserId = user.getId();
        childParentRepository
                .findByIdChildIdAndIdParentUserIdAndTenantId(childId, parentUserId, tenantId)
                .orElseGet(() -> childParentRepository.save(ChildParent.builder()
                        .id(ChildParentId.builder()
                                .childId(childId)
                                .parentUserId(parentUserId)
                                .build())
                        .tenantId(tenantId)
                        .build()));
    }

    private boolean isParent(User user) {
        return user != null
                && user.getRoles() != null
                && user.getRoles().stream().anyMatch(role -> role.getName() == RoleName.PARENT);
    }

    private boolean isTeacher(User user) {
        return user != null
                && user.getRoles() != null
                && user.getRoles().stream().anyMatch(role -> role.getName() == RoleName.TEACHER);
    }

    private boolean hasKindergartenAdminAccess(User user) {
        if (user == null || user.getRoles() == null) {
            return false;
        }
        return user.getRoles().stream()
                .anyMatch(role -> role.getName() == RoleName.KINDERGARTEN_ADMIN
                        || role.getName() == RoleName.SUPER_ADMIN);
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

    private void linkParent(Long childId, Long parentUserId, Long tenantId) {
        // TODO: For the parent self-service flow, parentUserId should be resolved
        // from authentication instead of being passed in by the client.
        userRepository.findByIdAndTenantIdAndRoles_Name(parentUserId, tenantId, RoleName.PARENT)
                .orElseThrow(() -> new ResourceNotFoundException("Parent user not found: " + parentUserId));

        childParentRepository
                .findByIdChildIdAndIdParentUserIdAndTenantId(childId, parentUserId, tenantId)
                .ifPresent(existingLink -> {
                    throw new IllegalArgumentException("Parent is already linked to child");
                });

        ChildParent childParent = ChildParent.builder()
                .id(ChildParentId.builder()
                        .childId(childId)
                        .parentUserId(parentUserId)
                        .build())
                .tenantId(tenantId)
                .build();

        childParentRepository.save(childParent);
    }

    private Page<ChildResponseDto> mapChildrenWithParents(Page<Child> childPage, Long tenantId) {
        Page<ChildResponseDto> responsePage = childPage.map(childMapper::toResponseDto);
        attachParents(responsePage.getContent(), tenantId);
        return responsePage;
    }

    private List<ChildResponseDto> mapChildrenWithParents(List<Child> children, Long tenantId) {
        List<ChildResponseDto> response = children.stream()
                .map(childMapper::toResponseDto)
                .toList();
        attachParents(response, tenantId);
        return response;
    }

    private void attachParents(List<ChildResponseDto> children, Long tenantId) {
        if (children.isEmpty()) {
            return;
        }

        List<Long> childIds = children.stream()
                .map(ChildResponseDto::getId)
                .toList();

        List<ChildParent> childParents = childParentRepository.findAllByIdChildIdInAndTenantId(childIds, tenantId);
        if (childParents.isEmpty()) {
            children.forEach(child -> child.setParents(Collections.emptyList()));
            return;
        }

        Set<Long> parentUserIds = childParents.stream()
                .map(link -> link.getId().getParentUserId())
                .collect(Collectors.toSet());

        Map<Long, User> parentsById = userRepository.findAllByIdInAndTenantIdAndRoles_Name(parentUserIds, tenantId, RoleName.PARENT).stream()
                .collect(Collectors.toMap(User::getId, Function.identity()));

        Map<Long, List<ParentSummaryDto>> parentsByChildId = childParents.stream()
                .collect(Collectors.groupingBy(
                        link -> link.getId().getChildId(),
                        Collectors.mapping(
                                link -> toParentSummary(parentsById.get(link.getId().getParentUserId())),
                                Collectors.filtering(parent -> parent != null, Collectors.toList())
                        )
                ));

        children.forEach(child -> child.setParents(parentsByChildId.getOrDefault(child.getId(), Collections.emptyList())));
    }

    private ParentSummaryDto toParentSummary(User parentUser) {
        if (parentUser == null) {
            return null;
        }

        return ParentSummaryDto.builder()
                .id(parentUser.getId())
                .fullName(parentUser.getFullName())
                .email(parentUser.getEmail())
                .build();
    }
}
