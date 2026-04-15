package com.team29.kindergarten.modules.teacher.controller;

import com.team29.kindergarten.modules.teacher.dto.DailyJournalEntryRequest;
import com.team29.kindergarten.modules.teacher.dto.DailyJournalEntryResponse;
import com.team29.kindergarten.modules.teacher.service.DailyJournalService;
import com.team29.kindergarten.modules.user.entity.User;
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
    public DailyJournalEntryResponse createEntry(
            @AuthenticationPrincipal User teacher,
            @RequestBody DailyJournalEntryRequest request
    ) {
        return journalService.createEntry(teacher, request);
    }

    @GetMapping
    public List<DailyJournalEntryResponse> getEntries(
            @AuthenticationPrincipal User teacher
    ) {
        return journalService.getEntriesForTeacher(teacher);
    }
}
