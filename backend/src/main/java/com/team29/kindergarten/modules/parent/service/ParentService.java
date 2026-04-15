package com.team29.kindergarten.modules.parent.service;

import com.team29.kindergarten.common.exception.ResourceNotFoundException;
import com.team29.kindergarten.modules.user.entity.User;
import com.team29.kindergarten.modules.parent.dto.ParentRequestDto;
import com.team29.kindergarten.modules.parent.dto.ParentResponseDto;
import com.team29.kindergarten.modules.parent.mapper.ParentMapper;
import com.team29.kindergarten.modules.parent.model.Parent;
import com.team29.kindergarten.modules.parent.repository.ParentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Transactional
public class ParentService {

    private final ParentRepository parentRepository;
    private final ParentMapper parentMapper;

    @Transactional(readOnly = true)
    public Page<ParentResponseDto> findAll(Long tenantId, Pageable pageable) {
        return parentRepository.findAllByTenantId(tenantId, pageable).map(parentMapper::toResponseDto);
    }

    @Transactional(readOnly = true)
    public ParentResponseDto findById(Long id, Long tenantId) {
        return parentMapper.toResponseDto(getParent(id, tenantId));
    }

    @Transactional(readOnly = true)
    public ParentResponseDto findMyProfile(User user, Long tenantId) {
        if (user == null || user.getEmail() == null || user.getEmail().isBlank()) {
            throw new ResourceNotFoundException("Authenticated user email is missing");
        }

        return ParentResponseDto.builder()
                .id(user.getId())
                .tenantId(tenantId)
                .email(user.getEmail())
                .phone(null)
                .createdAt(null)
                .updatedAt(null)
                .build();
    }

    public ParentResponseDto create(ParentRequestDto request, Long tenantId) {
        Parent parent = parentMapper.toEntity(request);
        parent.setTenantId(tenantId);
        return parentMapper.toResponseDto(parentRepository.save(parent));
    }

    public ParentResponseDto update(Long id, ParentRequestDto request, Long tenantId) {
        Parent parent = getParent(id, tenantId);
        parentMapper.updateEntityFromDto(request, parent);
        return parentMapper.toResponseDto(parentRepository.save(parent));
    }

    public void delete(Long id, Long tenantId) {
        Parent parent = getParent(id, tenantId);
        parent.setDeletedAt(LocalDateTime.now());
        parentRepository.save(parent);
    }

    public Parent getParent(Long id, Long tenantId) {
        return parentRepository.findByIdAndTenantId(id, tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Parent not found: " + id));
    }
}
