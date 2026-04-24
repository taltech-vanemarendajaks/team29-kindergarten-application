package com.team29.kindergarten.modules.teacher.controller;

import com.team29.kindergarten.modules.teacher.dto.DailyJournalEntryRequest;
import com.team29.kindergarten.modules.teacher.dto.DailyJournalEntryResponse;
import com.team29.kindergarten.modules.teacher.dto.DailyJournalEntryUpdateRequest;
import com.team29.kindergarten.modules.teacher.model.DailyJournalEntry;
import com.team29.kindergarten.modules.teacher.service.DailyJournalService;
import com.team29.kindergarten.modules.user.entity.User;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/teacher/journal")
public class TeacherJournalController {

    private final DailyJournalService journalService;

    public TeacherJournalController(DailyJournalService journalService) {
        this.journalService = journalService;
    }

    @PostMapping
    public DailyJournalEntryResponse createEntry(@AuthenticationPrincipal User teacher, @RequestBody DailyJournalEntryRequest request) {
        return journalService.createEntry(teacher, request);
    }

    @PreAuthorize("hasRole('TEACHER')")
    @GetMapping
    public List<DailyJournalEntryResponse> getEntries(@AuthenticationPrincipal User teacher) {
        return journalService.getEntriesForTeacher(teacher);
    }

    @GetMapping("/{id}")
    public DailyJournalEntryResponse getEntry(@AuthenticationPrincipal User teacher, @PathVariable Long id) {
        return journalService.getEntryById(teacher, id);
    }

    @PutMapping("/{id}")
    public DailyJournalEntryResponse updateEntry(@PathVariable Long id, @AuthenticationPrincipal User teacher,
                                         @RequestBody DailyJournalEntryUpdateRequest request) {
        DailyJournalEntry entry = journalService.updateEntry(id, teacher, request);
        return DailyJournalEntryResponse.from(entry);
    }

}
