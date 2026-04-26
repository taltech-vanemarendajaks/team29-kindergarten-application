package com.team29.kindergarten.modules.attendance.repository;

import com.team29.kindergarten.common.enums.AttendanceStatus;
import com.team29.kindergarten.modules.attendance.model.Attendance;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {

    Page<Attendance> findAllByTenantId(Long tenantId, Pageable pageable);

    Optional<Attendance> findByIdAndTenantId(Long id, Long tenantId);

    long countByTenantIdAndStatus(Long tenantId, AttendanceStatus status);
}
