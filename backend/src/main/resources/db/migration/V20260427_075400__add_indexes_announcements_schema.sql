-- NOT NULL constraints (recommended)
ALTER TABLE user_announcement
ALTER COLUMN user_id SET NOT NULL;

ALTER TABLE user_announcement
ALTER COLUMN announcement_id SET NOT NULL;

-- Foreign key
ALTER TABLE user_announcement
ADD CONSTRAINT fk_user_announcement_announcement
FOREIGN KEY (announcement_id)
REFERENCES announcement(id)
ON DELETE CASCADE;

-- Prevent duplicate reads
ALTER TABLE user_announcement
ADD CONSTRAINT uq_user_announcement
UNIQUE (user_id, announcement_id);

-- Indexes

-- For tenant filtering
CREATE INDEX idx_announcement_tenant
ON announcement(tenant_id);

-- For expiration queries
CREATE INDEX idx_announcement_expires
ON announcement(expires_at);

-- For user lookup
CREATE INDEX idx_user_announcement_user
ON user_announcement(user_id);

-- For joins
CREATE INDEX idx_user_announcement_announcement
ON user_announcement(announcement_id);

--  composite index (for JOIN query)
CREATE INDEX idx_user_announcement_user_announcement
ON user_announcement(user_id, announcement_id);

ALTER TABLE announcement
ALTER COLUMN tenant_id SET NOT NULL;