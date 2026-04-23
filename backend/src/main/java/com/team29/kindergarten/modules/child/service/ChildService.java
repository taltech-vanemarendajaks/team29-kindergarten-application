package com.team29.kindergarten.modules.child.service;

import com.team29.kindergarten.common.exception.ResourceNotFoundException;
import com.team29.kindergarten.modules.child.dto.ChildRequestDto;
import com.team29.kindergarten.modules.child.dto.ChildResponseDto;
import com.team29.kindergarten.modules.child.mapper.ChildMapper;
import com.team29.kindergarten.modules.child.model.Child;
import com.team29.kindergarten.modules.child.repository.ChildRepository;
import com.team29.kindergarten.modules.group.model.Group;
import com.team29.kindergarten.modules.group.repository.GroupRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class ChildService {

    private final ChildRepository childRepository;
    private final ChildMapper childMapper;
    private final GroupRepository groupRepository;

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

    public ChildResponseDto create(ChildRequestDto request, Long tenantId) {
        log.info("Creating child for tenantId={}", tenantId);

        Child child = childMapper.toEntity(request);
        child.setTenantId(tenantId);
        resolveGroup(request.getGroupId(), tenantId, child);

        Child saved = childRepository.save(child);
        log.info("Created child id={} for tenantId={}", saved.getId(), tenantId);
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
}
