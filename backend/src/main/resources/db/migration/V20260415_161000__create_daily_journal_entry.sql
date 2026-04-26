ALTER TABLE "group" RENAME TO kindergarten_group;

CREATE TABLE daily_journal_entry (
    id BIGSERIAL PRIMARY KEY,
    date DATE NOT NULL,
    summary TEXT,
    milestones TEXT,
    teacher_id BIGINT NOT NULL,
    kindergarten_group_id BIGINT NOT NULL,
    kindergarten_id BIGINT NOT NULL,

    CONSTRAINT fk_journal_teacher FOREIGN KEY (teacher_id) REFERENCES users(id),
    CONSTRAINT fk_journal_group FOREIGN KEY (kindergarten_group_id) REFERENCES kindergarten_group(id)
);

CREATE TABLE daily_journal_photos (
    entry_id BIGINT NOT NULL,
    photo_url TEXT NOT NULL,

    CONSTRAINT fk_journal_photos_entry FOREIGN KEY (entry_id) REFERENCES daily_journal_entry(id)
);
