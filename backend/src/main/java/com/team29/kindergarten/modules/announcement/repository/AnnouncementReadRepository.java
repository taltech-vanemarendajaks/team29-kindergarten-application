package com.team29.kindergarten.modules.announcement.repository;

import com.team29.kindergarten.modules.announcement.dto.AnnouncementResponseDto;
import com.team29.kindergarten.modules.announcement.model.AnnouncementRead;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AnnouncementReadRepository extends JpaRepository<AnnouncementRead, Long> {

    Optional<AnnouncementRead> findByIdUserIdAndIdAnnouncementIdAndIdTenantId(Long userId, Long announcementId, Long tenantId);
    List<AnnouncementRead> findByUserId(Long userId);

@Query("""
    SELECT new com.yourapp.dto.AnnouncementResponseDto(
        a.id,
        a.title,
        a.content,
        CASE WHEN ar.id IS NULL THEN false ELSE true END,
        a.createdAt
    )
    FROM Announcement a
    LEFT JOIN AnnouncementRead ar
        ON ar.announcement.id = a.id AND ar.user.id = :userId
    WHERE (a.expiresAt IS NULL OR a.expiresAt > CURRENT_TIMESTAMP)
""")
List<AnnouncementResponseDto> findAnnouncementsForUser(Long userId);  // Returning DTO without entity mapping

}
