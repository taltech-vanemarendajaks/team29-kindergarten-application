package com.team29.kindergarten.modules.announcement.repository;

import com.team29.kindergarten.modules.announcement.model.Announcement;
import com.team29.kindergarten.modules.announcement.model.AnnouncementRead;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.Optional;


@Repository
public interface AnnouncementRepository extends JpaRepository<Announcement, Long> {

@EntityGraph(attributePaths = "creator")
@Query("""
    SELECT a FROM Announcement a
    WHERE a.tenantId = :tenantId
    AND (a.expiresAt IS NULL OR a.expiresAt > :now)
""")
Page<Announcement> findActiveByTenantId(
    Long tenantId,
    LocalDate now,
    Pageable pageable
);

Optional<Announcement> findByIdAndTenantId(Long announcementId, Long tenantId);


@Query(
    value = """
        SELECT 
            a as announcement,
            CASE WHEN ar.id IS NOT NULL THEN true ELSE false END as isRead
        FROM Announcement a
        LEFT JOIN AnnouncementRead ar
            ON ar.announcement = a
            AND ar.userId = :userId
            AND ar.deletedAt IS NULL
        WHERE a.tenantId = :tenantId
          AND (a.expiresAt IS NULL OR a.expiresAt > CURRENT_DATE)
    """,
    countQuery = """
        SELECT COUNT(a)
        FROM Announcement a
        WHERE a.tenantId = :tenantId
          AND (a.expiresAt IS NULL OR a.expiresAt > CURRENT_DATE)
    """
)
Page<AnnouncementWithRead> findAllWithReadStatus(
    Long tenantId,
    Long userId,
    Pageable pageable
);


}