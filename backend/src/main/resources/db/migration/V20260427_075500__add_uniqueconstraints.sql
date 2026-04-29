ALTER TABLE user_announcement
ADD CONSTRAINT uk_user_announcement_unique
UNIQUE (user_id, announcement_id);