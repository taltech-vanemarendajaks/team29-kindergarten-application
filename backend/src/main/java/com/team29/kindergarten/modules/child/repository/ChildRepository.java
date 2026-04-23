package com.team29.kindergarten.modules.child.repository;

import com.team29.kindergarten.modules.child.model.Child;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.Optional;

@Repository
public interface ChildRepository extends JpaRepository<Child, Long> {

    Page<Child> findAllByTenantId(Long tenantId, Pageable pageable);

    Page<Child> findAllByTenantIdAndIdIn(Long tenantId, Collection<Long> ids, Pageable pageable);

    Optional<Child> findByIdAndTenantId(Long id, Long tenantId);

    Optional<Child> findByIdAndTenantIdAndIdIn(Long id, Long tenantId, Collection<Long> ids);
}
