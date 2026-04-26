package com.team29.kindergarten.modules.teacher.dto;

import java.time.LocalDate;
import java.util.List;

public record DailyJournalEntryUpdateRequest(
        String summary,
        String milestones,
        List<String> photoUrls,
        LocalDate date
) {
}
