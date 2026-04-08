package com.team29.kindergarten.modules.parent.repository;

import com.team29.kindergarten.modules.parent.model.Parent;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ParentRepository extends JpaRepository<Parent, Long> {

    Page<Parent> findAllByTenantId(Long tenantId, Pageable pageable);

    Optional<Parent> findByIdAndTenantId(Long id, Long tenantId);

    Optional<Parent> findByEmailAndTenantId(String email, Long tenantId);
}
