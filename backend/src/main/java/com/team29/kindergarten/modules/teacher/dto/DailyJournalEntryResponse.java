package com.team29.kindergarten.modules.teacher.dto;

import com.team29.kindergarten.modules.teacher.model.DailyJournalEntry;

import java.time.LocalDate;
import java.util.List;

public record DailyJournalEntryResponse(
        Long id,
        LocalDate date,
        String summary,
        String milestones,
        List<String> photoUrls,
        Long teacherId,
        Long groupId
) {
    public static DailyJournalEntryResponse from(DailyJournalEntry entry) {
        return new DailyJournalEntryResponse(
                entry.getId(),
                entry.getDate(),
                entry.getSummary(),
                entry.getMilestones(),
                entry.getPhotoUrls(),
                entry.getTeacher().getId(),
                entry.getKindergartenGroup().getId()
        );
    }
}
