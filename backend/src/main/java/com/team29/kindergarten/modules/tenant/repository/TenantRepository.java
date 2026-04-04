package com.team29.kindergarten.modules.tenant.repository;

import com.team29.kindergarten.modules.tenant.model.Tenant;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TenantRepository extends JpaRepository<Tenant, Long> {

    List<Tenant> findAllByDeletedAtIsNull(Sort sort);
}
