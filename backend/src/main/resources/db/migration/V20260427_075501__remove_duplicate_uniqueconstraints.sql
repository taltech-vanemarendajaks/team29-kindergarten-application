DO $$
DECLARE
    r RECORD;
    kept_constraint TEXT := NULL;
BEGIN
    -- Loop through all UNIQUE constraints on the table
    FOR r IN
        SELECT conname, pg_get_constraintdef(c.oid) AS def
        FROM pg_constraint c
        JOIN pg_class t ON c.conrelid = t.oid
        WHERE t.relname = 'user_announcement'
          AND contype = 'u'
    LOOP
        -- Check if it's the target unique constraint
        IF r.def = 'UNIQUE (user_id, announcement_id)' THEN

            -- Keep the first one, drop the rest
            IF kept_constraint IS NULL THEN
                kept_constraint := r.conname;
            ELSE
                EXECUTE format(
                    'ALTER TABLE user_announcement DROP CONSTRAINT %I',
                    r.conname
                );
            END IF;

        END IF;
    END LOOP;

    -- If none found, create it
    IF kept_constraint IS NULL THEN
        EXECUTE '
            ALTER TABLE user_announcement
            ADD CONSTRAINT uk_user_announcement
            UNIQUE (user_id, announcement_id)
        ';
    END IF;
END
$$;