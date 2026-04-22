package com.team29.kindergarten.modules.announcement.repository;

import com.team29.kindergarten.modules.announcement.model.Announcement;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AnnouncementRepository extends JpaRepository<Announcement, Long> {

    Page<Announcement> findAllByTenantId(Long tenantId, Pageable pageable);

    Optional<Announcement> findByIdAndTenantId(Long id, Long tenantId);

    @Query("""
        SELECT a FROM Announcement a
        WHERE a.expiresAt IS NULL OR a.expiresAt > CURRENT_TIMESTAMP
    """)
    List<Announcement> findActiveAnnouncements();

}
