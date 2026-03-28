package com.team29.kindergarten.modules.auth.repository;

import com.team29.kindergarten.modules.auth.entity.Role;
import com.team29.kindergarten.modules.auth.entity.enums.RoleName;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByName(RoleName name);
}
