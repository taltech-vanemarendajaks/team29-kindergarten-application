ALTER TABLE child
    ADD COLUMN parent_id BIGINT,
ADD CONSTRAINT fk_child_parent FOREIGN KEY (parent_id) REFERENCES "users"(id);
