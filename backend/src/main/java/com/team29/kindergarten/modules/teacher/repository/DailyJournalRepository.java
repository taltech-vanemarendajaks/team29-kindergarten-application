package com.team29.kindergarten.modules.teacher.repository;

import com.team29.kindergarten.modules.teacher.model.DailyJournalEntry;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DailyJournalRepository extends JpaRepository<DailyJournalEntry, Long> {
    List<DailyJournalEntry> findByKindergartenGroup(Long groupId);
}
