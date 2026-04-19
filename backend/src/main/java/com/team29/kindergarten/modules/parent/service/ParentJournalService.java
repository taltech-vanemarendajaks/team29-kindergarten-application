package com.team29.kindergarten.modules.parent.service;

import com.team29.kindergarten.modules.teacher.dto.DailyJournalEntryResponse;
import com.team29.kindergarten.modules.teacher.model.DailyJournalEntry;
import com.team29.kindergarten.modules.teacher.repository.DailyJournalEntryRepository;
import com.team29.kindergarten.modules.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ParentJournalService {
    private final DailyJournalEntryRepository entryRepository;

    public List<DailyJournalEntryResponse> getParentFeed(Long parentId) {
        return entryRepository.findEntriesForParent(parentId)
                .stream()
                .map(DailyJournalEntryResponse::from)
                .toList();
    }

    public DailyJournalEntryResponse getEntryForParent(User parent, Long entryId) {
        DailyJournalEntry entry = entryRepository.findEntryForParent(parent.getId(), entryId)
                .orElseThrow(() -> new RuntimeException("Entry not found or access denied"));

        return DailyJournalEntryResponse.from(entry);
    }

}
