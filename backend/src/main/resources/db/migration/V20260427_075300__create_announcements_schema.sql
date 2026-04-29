CREATE TABLE announcement (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT,
    title VARCHAR(100) NOT NULL,
    content VARCHAR(100) NOT NULL,
    created_by BIGINT,
    expires_at DATE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE TABLE user_announcement (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT,
    announcement_id BIGINT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);