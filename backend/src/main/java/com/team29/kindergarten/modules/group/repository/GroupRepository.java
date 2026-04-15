package com.team29.kindergarten.modules.group.repository;

import com.team29.kindergarten.modules.group.model.Group;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GroupRepository extends JpaRepository<Group, Long> {

    Page<Group> findAllByTenantId(Long tenantId, Pageable pageable);

    List<Group> findAllByTenantIdOrderByNameAsc(Long tenantId);

    Optional<Group> findByIdAndTenantId(Long id, Long tenantId);
    Optional<Group> findByTeacherUserId(Long teacherUserId);
}
