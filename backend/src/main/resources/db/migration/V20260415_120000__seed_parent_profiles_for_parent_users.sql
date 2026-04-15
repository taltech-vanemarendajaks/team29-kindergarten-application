-- Ensure each active PARENT user has an active parent profile.
-- This replaces the old manual helper script and keeps environments consistent
-- through Flyway migrations.

-- Restore previously soft-deleted profiles for parent users.
UPDATE parent p
SET
    deleted_at = NULL,
    updated_at = NOW()
FROM users u
         JOIN user_roles ur ON ur.user_id = u.id
         JOIN roles r ON r.id = ur.role_id
WHERE r.name = 'PARENT'
  AND u.tenant_id IS NOT NULL
  AND p.email = u.email
  AND p.tenant_id = u.tenant_id
  AND p.deleted_at IS NOT NULL;

-- Create missing active profiles for parent users.
INSERT INTO parent (tenant_id, email, phone)
SELECT DISTINCT
    u.tenant_id,
    u.email,
    NULL
FROM users u
         JOIN user_roles ur ON ur.user_id = u.id
         JOIN roles r ON r.id = ur.role_id
WHERE r.name = 'PARENT'
  AND u.tenant_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1
    FROM parent p
    WHERE p.email = u.email
      AND p.tenant_id = u.tenant_id
      AND p.deleted_at IS NULL
);
