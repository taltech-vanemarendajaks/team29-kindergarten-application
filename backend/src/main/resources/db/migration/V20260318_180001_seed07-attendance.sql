INSERT INTO attendance (id, tenant_id, child_id, date, status, created_at, updated_at)
SELECT 
    row_number() OVER (),
    c.tenant_id,
    c.id,
    DATE '2026-03-01' + (gs % 15),
    (ARRAY['PRESENT','ABSENT','SICK'])[1 + (random() * 2)::int]::attendance_status,
    NOW(),
    NOW()
FROM child c
JOIN generate_series(1, 1) gs ON TRUE
LIMIT 1000;