package com.team29.kindergarten.modules.teacher.repository;

import com.team29.kindergarten.modules.teacher.model.DailyJournalEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface DailyJournalEntryRepository extends JpaRepository<DailyJournalEntry, Long> {

    List<DailyJournalEntry> findByKindergartenGroupId(Long groupId);

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

    @Query("""
    SELECT e
    FROM DailyJournalEntry e
    WHERE e.id = :entryId
      AND e.kindergartenGroup.id IN (
          SELECT c.group.id
          FROM Child c
          WHERE c.parent.id = :parentId
      )
    """)
    Optional<DailyJournalEntry> findEntryForParent(Long parentId, Long entryId);

}
