package com.team29.kindergarten.modules.teacher.dto;

import java.util.List;

public record DailyJournalEntryRequest(
        String summary,
        String milestones,
        List<String> photoUrls
) {
}
