package com.team29.kindergarten.modules.attendance.repository;

import com.team29.kindergarten.common.enums.AttendanceStatus;
import com.team29.kindergarten.modules.attendance.model.Attendance;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {

    Page<Attendance> findAllByTenantId(Long tenantId, Pageable pageable);

    Optional<Attendance> findByIdAndTenantId(Long id, Long tenantId);

    long countByTenantIdAndStatus(Long tenantId, AttendanceStatus status);
    List<Attendance> findAllByTenantIdAndChildIdAndDateBetweenOrderByDateAsc(
            Long tenantId,
            Long childId,
            LocalDate from,
            LocalDate to
    );

    @Query(
            value = """
                    SELECT *
                    FROM attendance
                    WHERE tenant_id = :tenantId
                      AND child_id = :childId
                      AND date = :date
                    LIMIT 1
                    """,
            nativeQuery = true
    )
    Optional<Attendance> findAnyByTenantIdAndChildIdAndDate(
            @Param("tenantId") Long tenantId,
            @Param("childId") Long childId,
            @Param("date") LocalDate date
    );
}
