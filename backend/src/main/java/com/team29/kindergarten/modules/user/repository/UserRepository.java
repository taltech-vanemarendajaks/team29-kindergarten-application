package com.team29.kindergarten.modules.user.repository;

import com.team29.kindergarten.modules.auth.entity.enums.RoleName;
import com.team29.kindergarten.modules.user.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    boolean existsByEmailAndIdNot(String email, Long id);

    Page<User> findDistinctByTenantIdAndRoles_Name(Long tenantId, RoleName roleName, Pageable pageable);

    Page<User> findDistinctByTenantIdAndRoles_NameAndFullNameContainingIgnoreCase(
    Long tenantId, RoleName roleName, String fullName, Pageable pageable);

    List<User> findDistinctByTenantIdAndRoles_NameOrderByFullNameAsc(Long tenantId, RoleName roleName);

    List<User> findAllByIdInAndTenantIdAndRoles_Name(Set<Long> ids, Long tenantId, RoleName roleName);

    @Query("""
            SELECT DISTINCT u
            FROM User u
            JOIN u.roles r
            WHERE u.tenantId = :tenantId
              AND r.name = :roleName
              AND NOT EXISTS (
                  SELECT 1
                  FROM Group g
                  WHERE g.teacherUser.id = u.id
                    AND g.tenantId = :tenantId
                    AND (:groupId IS NULL OR g.id <> :groupId)
              )
            ORDER BY u.fullName ASC
            """)
    List<User> findAvailableByTenantIdAndRoleNameForGroup(
            @Param("tenantId") Long tenantId,
            @Param("roleName") RoleName roleName,
            @Param("groupId") Long groupId
    );

    Optional<User> findByIdAndTenantIdAndRoles_Name(Long id, Long tenantId, RoleName roleName);
}
