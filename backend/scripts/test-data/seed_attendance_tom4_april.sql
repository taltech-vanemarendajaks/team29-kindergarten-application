-- =========================================================================
-- Test data: attendance records for child "tom4" for April 2026.
--
-- Purpose: populate the `attendance` table so the Attendance tab on
--          /parent/children shows realistic data (PRESENT / ABSENT / SICK)
--          when tom4 is the selected child.
--
-- How to run (psql):
--   psql -h localhost -U <user> -d <db> -f seed_attendance_tom4_april.sql
--
-- Notes:
--   * The script resolves tom4's child_id and tenant_id automatically by
--     first_name (case-insensitive). Make sure such a child exists first.
--   * Weekends (Sat/Sun) are skipped - kindergarten is closed.
--   * Script is idempotent: re-running it updates status via ON CONFLICT.
--   * Respects the (child_id, date) unique constraint from migration
--     V20260329_180410__recreating_tables_with_auto_incremented_primary_keys.
-- =========================================================================

WITH target_child AS (
    SELECT id, tenant_id
    FROM child
    WHERE LOWER(first_name) = 'tom4'
      AND deleted_at IS NULL
    ORDER BY id
    LIMIT 1
)
INSERT INTO attendance (tenant_id, child_id, date, status)
SELECT
    tc.tenant_id,
    tc.id,
    v.date::date,
    v.status::attendance_status
FROM target_child tc
CROSS JOIN (VALUES
    -- Week 1
    ('2026-04-01', 'PRESENT'),
    ('2026-04-02', 'PRESENT'),
    ('2026-04-03', 'PRESENT'),
    -- Week 2
    ('2026-04-06', 'PRESENT'),
    ('2026-04-07', 'PRESENT'),
    ('2026-04-08', 'ABSENT'),
    ('2026-04-09', 'PRESENT'),
    ('2026-04-10', 'SICK'),
    -- Week 3 (sick streak)
    ('2026-04-13', 'SICK'),
    ('2026-04-14', 'SICK'),
    ('2026-04-15', 'PRESENT'),
    ('2026-04-16', 'PRESENT'),
    ('2026-04-17', 'ABSENT'),
    -- Week 4
    ('2026-04-20', 'PRESENT'),
    ('2026-04-21', 'PRESENT'),
    ('2026-04-22', 'PRESENT'),
    ('2026-04-23', 'ABSENT'),
    ('2026-04-24', 'SICK'),
    -- Week 5
    ('2026-04-27', 'PRESENT'),
    ('2026-04-28', 'PRESENT'),
    ('2026-04-29', 'ABSENT'),
    ('2026-04-30', 'PRESENT')
) AS v(date, status)
ON CONFLICT (child_id, date) DO UPDATE
    SET status     = EXCLUDED.status,
        deleted_at = NULL,
        updated_at = NOW();

-- =========================================================================
-- Verification: inspect the seeded rows.
-- =========================================================================
SELECT a.date, a.status
FROM attendance a
         JOIN child c ON c.id = a.child_id
WHERE LOWER(c.first_name) = 'tom4'
  AND a.deleted_at IS NULL
  AND a.date BETWEEN DATE '2026-04-01' AND DATE '2026-04-30'
ORDER BY a.date;
