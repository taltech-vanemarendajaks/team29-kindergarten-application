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
import com.team29.kindergarten.modules.announcement.repository.AnnouncementWithRead;
import com.team29.kindergarten.modules.user.entity.User;
import java.time.LocalDate;


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
public Page<AnnouncementUserResponseDto> findAllUser(Pageable pageable) {

    Long tenantId = currentUser.getTenantId();
    Long userId = currentUser.getUserId();

    Page<AnnouncementWithRead> page = announcementRepository
        .findAllWithReadStatus(tenantId, userId, pageable);

    return page.map(p -> 
        announcementMapper.toUserResponseDto(
            p.getAnnouncement(),
            p.getIsRead()
        )
    );
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