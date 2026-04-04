package com.team29.kindergarten.modules.teacher.repository;

import com.team29.kindergarten.modules.teacher.model.Teacher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TeacherRepository extends JpaRepository<Teacher, Long> {

    Page<Teacher> findAllByTenantId(Long tenantId, Pageable pageable);

    List<Teacher> findAllByTenantIdOrderByLastNameAscFirstNameAsc(Long tenantId);

    Optional<Teacher> findByIdAndTenantId(Long id, Long tenantId);
}
