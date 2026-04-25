package com.team29.kindergarten.modules.user.repository;

import com.team29.kindergarten.modules.auth.entity.enums.RoleName;
import com.team29.kindergarten.modules.user.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    boolean existsByEmailAndIdNot(String email, Long id);

    Page<User> findDistinctByTenantIdAndRoles_NameOrderByFullNameAsc(Long tenantId, RoleName roleName, Pageable pageable);

    List<User> findDistinctByTenantIdAndRoles_NameOrderByFullNameAsc(Long tenantId, RoleName roleName);

    Optional<User> findByIdAndTenantIdAndRoles_Name(Long id, Long tenantId, RoleName roleName);

    List<User> findByIdIn(List<Long> ids);
}
