INSERT INTO menu (id, tenant_id, date, created_at, updated_at)
SELECT 
    row_number() OVER (),
    t,
    DATE '2026-03-01' + d,
    NOW(),
    NOW()
FROM generate_series(1, 10) t,
     generate_series(0, 4) d;