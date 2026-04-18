package com.team29.kindergarten.modules.teacher.repository;

import com.team29.kindergarten.modules.teacher.model.DailyJournalEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface DailyJournalEntryRepository extends JpaRepository<DailyJournalEntry, Long> {
    List<DailyJournalEntry> findByKindergartenGroup(Long groupId);

    @Query("""
    SELECT e
    FROM DailyJournalEntry e
    WHERE e.kindergartenGroup.id IN (
        SELECT c.group.id
        FROM Child c
        WHERE c.parent.id = :parentId
    )
    ORDER BY e.date DESC
    """)
    List<DailyJournalEntry> findEntriesForParent(Long parentId);
}
