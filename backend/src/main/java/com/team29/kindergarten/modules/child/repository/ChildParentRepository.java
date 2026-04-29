package com.team29.kindergarten.modules.child.repository;

import com.team29.kindergarten.modules.child.model.ChildParent;
import com.team29.kindergarten.modules.child.model.ChildParentId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Repository
public interface ChildParentRepository extends JpaRepository<ChildParent, ChildParentId> {

    Optional<ChildParent> findByIdChildIdAndIdParentUserIdAndTenantId(Long childId, Long parentUserId, Long tenantId);

    List<ChildParent> findAllByIdChildIdInAndTenantId(Collection<Long> childIds, Long tenantId);

    @Query("select cp.id.childId from ChildParent cp where cp.id.parentUserId = :parentUserId and cp.tenantId = :tenantId")
    List<Long> findChildIdsByParentUserIdAndTenantId(Long parentUserId, Long tenantId);
}
