ALTER TABLE "group"
    DROP CONSTRAINT IF EXISTS fk_group_teacher;

ALTER TABLE "group"
    DROP COLUMN IF EXISTS teacher_id;

ALTER TABLE "group"
    ADD COLUMN teacher_user_id BIGINT;

ALTER TABLE "group"
    ADD CONSTRAINT fk_group_teacher_user
        FOREIGN KEY (teacher_user_id) REFERENCES users(id);

CREATE INDEX IF NOT EXISTS idx_group_teacher_user ON "group"(teacher_user_id);
