INSERT INTO "group" (id, tenant_id, name, age_range, teacher_id, created_at, updated_at)
SELECT 
    (t * 100 + g),
    t,
    'Group ' || g,
    (3 + (g % 4)) || '-' || (4 + (g % 4)),
    (t * 10 + ((g % 2) + 1)),
    NOW(),
    NOW()
FROM generate_series(1, 10) t,
     generate_series(1, 10) g;