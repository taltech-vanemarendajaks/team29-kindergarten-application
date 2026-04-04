package com.team29.kindergarten.modules.tenant.service;

import com.team29.kindergarten.common.exception.ResourceNotFoundException;
import com.team29.kindergarten.modules.tenant.dto.TenantRequestDto;
import com.team29.kindergarten.modules.tenant.dto.TenantResponseDto;
import com.team29.kindergarten.modules.tenant.mapper.TenantMapper;
import com.team29.kindergarten.modules.tenant.model.Tenant;
import com.team29.kindergarten.modules.tenant.repository.TenantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class TenantService {

    private final TenantRepository tenantRepository;
    private final TenantMapper tenantMapper;

    @Transactional(readOnly = true)
    public List<TenantResponseDto> findAll() {
        return tenantRepository.findAllByDeletedAtIsNull(Sort.by(Sort.Direction.ASC, "id"))
                .stream()
                .map(tenantMapper::toResponseDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public TenantResponseDto findById(Long id) {
        return tenantMapper.toResponseDto(getTenant(id));
    }

    public TenantResponseDto create(TenantRequestDto request) {
        return tenantMapper.toResponseDto(tenantRepository.save(tenantMapper.toEntity(request)));
    }

    public TenantResponseDto update(Long id, TenantRequestDto request) {
        Tenant tenant = getTenant(id);
        tenantMapper.updateEntityFromDto(request, tenant);
        return tenantMapper.toResponseDto(tenantRepository.save(tenant));
    }

    public void delete(Long id) {
        Tenant tenant = getTenant(id);
        tenant.setDeletedAt(LocalDateTime.now());
        tenantRepository.save(tenant);
    }

    private Tenant getTenant(Long id) {
        return tenantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tenant not found: " + id));
    }
}
