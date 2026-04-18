package com.team29.kindergarten.modules.parent.controller;

import com.team29.kindergarten.modules.parent.service.ParentJournalService;
import com.team29.kindergarten.modules.teacher.model.DailyJournalEntry;
import com.team29.kindergarten.modules.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/parent/journal")
@RequiredArgsConstructor
public class ParentJournalController {

    private final ParentJournalService parentJournalService;

    @GetMapping
    public List<DailyJournalEntry> getParentJournal(@AuthenticationPrincipal User parent) {
        return parentJournalService.getParentFeed(parent.getId());
    }
}
