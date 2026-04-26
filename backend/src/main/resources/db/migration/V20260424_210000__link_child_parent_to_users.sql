ALTER TABLE child_parent
    DROP CONSTRAINT IF EXISTS fk_cp_parent;

ALTER TABLE child_parent
    RENAME COLUMN parent_id TO parent_user_id;

ALTER TABLE child_parent
    ADD CONSTRAINT fk_cp_parent_user
        FOREIGN KEY (parent_user_id) REFERENCES users(id);