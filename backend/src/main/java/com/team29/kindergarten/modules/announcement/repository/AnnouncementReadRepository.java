package com.team29.kindergarten.modules.announcement.repository;

import com.team29.kindergarten.modules.announcement.model.AnnouncementRead;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AnnouncementReadRepository extends JpaRepository<AnnouncementRead, Long> {

    Optional<AnnouncementRead> findByUserIdAndAnnouncementId(Long userId, Long announcementId);

    List<AnnouncementRead> findByUserId(Long userId);

    List<AnnouncementRead> findByUserIdAndAnnouncementIdIn(Long userId, List<Long> announcementIds);

    boolean existsByUserIdAndAnnouncement_Id(Long userId, Long announcementId);





}
