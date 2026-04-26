package com.team29.kindergarten.modules.announcement.service;


import com.team29.kindergarten.common.exception.ResourceNotFoundException;
import com.team29.kindergarten.modules.announcement.dto.AnnouncementRequestDto;
import com.team29.kindergarten.modules.announcement.dto.AnnouncementResponseDto;
import com.team29.kindergarten.modules.announcement.dto.AnnouncementUserResponseDto;
import com.team29.kindergarten.modules.announcement.mapper.AnnouncementMapper;
import com.team29.kindergarten.modules.announcement.model.Announcement;
import com.team29.kindergarten.modules.announcement.model.AnnouncementRead;
import com.team29.kindergarten.modules.announcement.repository.AnnouncementReadRepository;
import com.team29.kindergarten.modules.announcement.repository.AnnouncementRepository;
import com.team29.kindergarten.modules.user.entity.User;

import java.time.LocalDate;
import java.util.Map;
import java.util.Set;
import java.util.HashSet;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import com.team29.kindergarten.modules.user.repository.UserRepository;
import com.team29.kindergarten.security.CurrentUserService;

import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class AnnouncementService {

    private final AnnouncementRepository announcementRepository;
    private final AnnouncementReadRepository announcementReadRepository;  
    private final UserRepository userRepository;
    private final AnnouncementMapper announcementMapper;
    private final CurrentUserService currentUser;   


    @Transactional(readOnly = true)
    public Page<AnnouncementResponseDto> findAll(Pageable pageable) {
        Long tenantId = currentUser.getTenantId();
        log.info("Fetching all announcements for tenantId={}, page={}", tenantId, pageable.getPageNumber());
        return announcementRepository
                .findActiveByTenantId(tenantId, LocalDate.now(),pageable)
                .map(announcementMapper::toResponseDto);
    }    

    @Transactional(readOnly = true)
    public AnnouncementResponseDto findById(Long id) {
        Long tenantId = currentUser.getTenantId();
        log.info("Fetching announcement id={} tenantId={}", id, tenantId);

        return announcementRepository
                .findByIdAndTenantId(id, tenantId) 
                .map(announcementMapper::toResponseDto)
                .orElseThrow(() ->
                    new ResourceNotFoundException("Announcement not found: " + id)
                );
} 

    public Page<AnnouncementUserResponseDto> getAnnouncementsForUser(User user, Pageable pageable) {
        Long tenantId = currentUser.getTenantId();
        Long userId = currentUser.getUserId();        
        Page<Announcement> page =
            announcementRepository.findActiveByTenantId(
                tenantId,
                LocalDate.now(),
                pageable
            );

        List<Long> announcementIds = page.getContent().stream()
            .map(Announcement::getId)
            .toList();

        Set<Long> readSet = new HashSet<>(
            announcementReadRepository.findByUserIdAndAnnouncementIdIn(userId, announcementIds)
                .stream()
                .map(r -> r.getAnnouncement().getId())
                .toList()
        );

        Map<Long, String> creatorNames = userRepository.findByIdIn(
            page.getContent().stream()
                .map(a -> a.getCreator().getId())
                .toList()
        ).stream().collect(Collectors.toMap(User::getId, User::getFullName));

        return page.map(a -> new AnnouncementUserResponseDto(
            a.getId(),
            a.getTitle(),
            a.getContent(),
            readSet.contains(a.getId()),
            creatorNames.get(a.getCreator().getId()),
            a.getCreatedAt()
        ));
}

    @PreAuthorize("hasAnyRole('ADMIN','KINDERGARTEN_ADMIN' )")
   public AnnouncementResponseDto create(AnnouncementRequestDto requestDto) {
        Long tenantId = currentUser.getTenantId();
        Long userId = currentUser.getUserId();
        log.info("Posting announcement from tenantId={}, userId={}", tenantId, userId);

        User creator = userRepository.getReferenceById(userId);

        Announcement announcement = Announcement.builder()
            .title(requestDto.getTitle())
            .content(requestDto.getContent())
            .expiresAt(requestDto.getExpires_At())
            .creator(creator)
            .tenantId(tenantId)
            .build();

        return announcementMapper.toPostResponseDto(announcementRepository.save(announcement), creator.getFullName());

    }


    @Transactional
    public void markAsRead(Long announcementId) {
    Long userId = currentUser.getUserId();

        if (announcementReadRepository
                .existsByUserIdAndAnnouncement_Id(userId, announcementId)) {
            return;
        }
        Announcement announcement = announcementRepository
                .getReferenceById(announcementId);

        AnnouncementRead read = AnnouncementRead.builder()
                .userId(userId)
                .announcement(announcement)
                .build();

        announcementReadRepository.save(read);
    }

}