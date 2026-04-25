package com.team29.kindergarten.modules.child.repository;

import com.team29.kindergarten.modules.child.model.Child;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface ChildRepository extends JpaRepository<Child, Long> {

    Page<Child> findAllByTenantId(Long tenantId, Pageable pageable);

    List<Child> findAllByTenantIdAndGroupIsNullOrderByCreatedAtAsc(Long tenantId);

    Optional<Child> findByIdAndTenantId(Long id, Long tenantId);

    List<Child> findAllByGroupIdAndTenantId(Long groupId, Long tenantId);
}
