package com.team29.kindergarten.modules.teacher.model;


import com.team29.kindergarten.modules.group.model.Group;
import com.team29.kindergarten.modules.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "daily_journal_entry")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DailyJournalEntry {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate date;

    @Column(columnDefinition = "TEXT")
    private String summary;

    @Column(columnDefinition = "TEXT")
    private String milestones;

    @ElementCollection
    @CollectionTable(
            name = "daily_journal_photos",
            joinColumns = @JoinColumn(name = "entry_id")
    )
    @Column(name = "photo_url")
    private List<String> photoUrls = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "teacher_id")
    private User teacher;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "kindergarten_group_id")
    private Group kindergartenGroup;

    @Column(name = "kindergarten_id")
    private Long kindergartenId;
}
