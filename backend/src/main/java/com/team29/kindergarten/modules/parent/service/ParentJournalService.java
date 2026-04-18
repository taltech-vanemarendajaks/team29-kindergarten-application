package com.team29.kindergarten.modules.parent.service;

import com.team29.kindergarten.modules.teacher.dto.DailyJournalEntryResponse;
import com.team29.kindergarten.modules.teacher.model.DailyJournalEntry;
import com.team29.kindergarten.modules.teacher.repository.DailyJournalEntryRepository;
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
}
