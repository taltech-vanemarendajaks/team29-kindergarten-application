package com.team29.kindergarten.modules.teacher.service;

import com.team29.kindergarten.modules.group.model.Group;
import com.team29.kindergarten.modules.group.repository.GroupRepository;
import com.team29.kindergarten.modules.teacher.dto.DailyJournalEntryRequest;
import com.team29.kindergarten.modules.teacher.dto.DailyJournalEntryResponse;
import com.team29.kindergarten.modules.teacher.model.DailyJournalEntry;
import com.team29.kindergarten.modules.teacher.repository.DailyJournalEntryRepository;
import com.team29.kindergarten.modules.user.entity.User;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class DailyJournalService {

    private final GroupRepository groupRepository;
    private final DailyJournalEntryRepository journalRepository;

    public DailyJournalService(
            GroupRepository groupRepository,
            DailyJournalEntryRepository journalRepository
    ) {
        this.groupRepository = groupRepository;
        this.journalRepository = journalRepository;
    }

    public DailyJournalEntryResponse createEntry(User teacherUser, DailyJournalEntryRequest request) {

        Group group = groupRepository.findByTeacherUserId(teacherUser.getId())
                .orElseThrow(() -> new RuntimeException("Group not found for teacher"));

        User teacher = group.getTeacherUser();
        if (teacher == null) {
            throw new RuntimeException("Group has no teacher assigned");
        }

        LocalDate date = request.date() != null ? request.date() : LocalDate.now();

        DailyJournalEntry entry = new DailyJournalEntry();
        entry.setDate(date);
        entry.setSummary(request.summary());
        entry.setMilestones(request.milestones());
        entry.setPhotoUrls(request.photoUrls());
        entry.setTeacher(teacher);
        entry.setKindergartenGroup(group);
        entry.setKindergartenId(teacherUser.getTenantId());

        journalRepository.save(entry);

        return DailyJournalEntryResponse.from(entry);
    }

    public List<DailyJournalEntryResponse> getEntriesForTeacher(User teacherUser) {
        Group group = groupRepository.findByTeacherUserId(teacherUser.getId())
                .orElseThrow(() -> new RuntimeException("Group not found for teacher"));

        return journalRepository.findByKindergartenGroupId(group.getId())
                .stream()
                .map(DailyJournalEntryResponse::from)
                .toList();
    }

    public DailyJournalEntryResponse getEntryById(User teacher, Long id) {
        DailyJournalEntry entry = journalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Entry not found"));

        if (!entry.getTeacher().getId().equals(teacher.getId())) {
            throw new RuntimeException("Access denied");
        }

        return DailyJournalEntryResponse.from(entry);
    }

}
