package com.team29.kindergarten.modules.child.repository;

import com.team29.kindergarten.modules.child.model.ChildParent;
import com.team29.kindergarten.modules.child.model.ChildParentId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChildParentRepository extends JpaRepository<ChildParent, ChildParentId> {

    Optional<ChildParent> findByIdChildIdAndIdParentIdAndTenantId(Long childId, Long parentId, Long tenantId);

    @Query("select cp.id.childId from ChildParent cp where cp.id.parentId = :parentId and cp.tenantId = :tenantId")
    List<Long> findChildIdsByParentIdAndTenantId(Long parentId, Long tenantId);
}
