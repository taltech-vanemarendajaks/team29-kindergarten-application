package com.team29.kindergarten.modules.announcement.service;
import com.team29.kindergarten.common.exception.ResourceNotFoundException;
import com.team29.kindergarten.modules.announcement.dto.AnnouncementRequestDto;
import com.team29.kindergarten.modules.announcement.dto.AnnouncementResponseDto;
import com.team29.kindergarten.modules.announcement.mapper.AnnouncementMapper;
import com.team29.kindergarten.modules.announcement.model.Announcement;
import com.team29.kindergarten.modules.announcement.repository.AnnouncementReadRepository;
import com.team29.kindergarten.modules.announcement.repository.AnnouncementRepository;
import com.team29.kindergarten.modules.user.entity.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;


@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class AnnouncementService {

    private final AnnouncementRepository announcementRepository;
    private final AnnouncementMapper announcementMapper;
    private final AnnouncementReadRepository announcementReadRepository;


    @Transactional(readOnly = true)
    public Page<AnnouncementResponseDto> findAll(Long tenantId, Pageable pageable) {
        log.info("Fetching all children for tenantId={}, page={}", tenantId, pageable.getPageNumber());
        return announcementRepository
                .findAllByTenantId(tenantId, pageable)
                .map(announcementMapper::toResponseDto);
    }

    @Transactional(readOnly = true)
    public AnnouncementResponseDto findById(Long id, Long tenantId) {
        log.info("Fetching announcement id={} for tenantId={}", id, tenantId);
        return announcementRepository
                .findByIdAndTenantId(id, tenantId)
                .map(announcementMapper::toResponseDto)
                .orElseThrow(() -> new ResourceNotFoundException("Announcement not found: " + id));
    }

public List<AnnouncementResponseDto> getAnnouncementsForUser(User user) {
    return announcementReadRepository.findAnnouncementsForUser(user.getId());
}



    public AnnouncementResponseDto create(AnnouncementRequestDto request, Long tenantId, Long userId) {


        Announcement announcement = announcementMapper.toEntity(request);
        announcement.setTenantId(tenantId);
        announcement.setCreatedBy(userId);
        Announcement saved = announcementRepository.save(announcement);

        return announcementMapper.toResponseDto(saved);
    }

    public AnnouncementResponseDto update(Long id, AnnouncementRequestDto request, Long tenantId) {
        log.info("Updating child id={} for tenantId={}", id, tenantId);

        Announcement announcement = announcementRepository
                .findByIdAndTenantId(id, tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Child not found: " + id));

        announcementMapper.updateEntityFromDto(request, announcement);

        announcementRepository.save(announcement);
        log.info("Updated child id={} for tenantId={}", id, tenantId);
        return announcementMapper.toResponseDto(announcement);
    }

    public void delete(Long id, Long tenantId) {
        Announcement announcement = getAnnouncement(id, tenantId);

        announcement.setDeletedAt(LocalDateTime.now());
        announcementRepository.save(announcement);
    }

    public Announcement getAnnouncement(Long id, Long tenantId) {
        return announcementRepository.findByIdAndTenantId(id, tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Announcement not found: " + id));
    }



}
