package com.team29.kindergarten.modules.parent.service;

import com.team29.kindergarten.modules.teacher.dto.DailyJournalEntryResponse;
import com.team29.kindergarten.modules.teacher.model.DailyJournalEntry;
import com.team29.kindergarten.modules.teacher.repository.DailyJournalEntryRepository;
import com.team29.kindergarten.security.CurrentUserService;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ParentJournalService {
    private final DailyJournalEntryRepository entryRepository;
    private final CurrentUserService currentUserService;



    public List<DailyJournalEntryResponse> getParentFeed() {
        Long userId = currentUserService.getUserId();
        return entryRepository.findEntriesForParent(userId)
                .stream()
                .map(DailyJournalEntryResponse::from)
                .toList();
    }

    public DailyJournalEntryResponse getEntryForParent( Long entryId) {
        Long userId = currentUserService.getUserId();
        DailyJournalEntry entry = entryRepository.findEntryForParent(userId, entryId)
                .orElseThrow(() -> new RuntimeException("Entry not found or access denied"));

        return DailyJournalEntryResponse.from(entry);
    }

}
