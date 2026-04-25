CREATE UNIQUE INDEX IF NOT EXISTS uq_group_active_teacher_user
    ON "group"(teacher_user_id)
    WHERE teacher_user_id IS NOT NULL
      AND deleted_at IS NULL;
