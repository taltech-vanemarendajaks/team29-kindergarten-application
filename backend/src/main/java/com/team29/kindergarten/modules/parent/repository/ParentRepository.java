package com.team29.kindergarten.modules.parent.repository;

import com.team29.kindergarten.modules.parent.model.Parent;
import com.team29.kindergarten.modules.teacher.model.DailyJournalEntry;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ParentRepository extends JpaRepository<Parent, Long> {

    Page<Parent> findAllByTenantId(Long tenantId, Pageable pageable);

    Optional<Parent> findByIdAndTenantId(Long id, Long tenantId);
}
