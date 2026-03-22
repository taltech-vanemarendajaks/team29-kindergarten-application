INSERT INTO teacher (id, tenant_id, first_name, last_name, created_at, updated_at)
SELECT 
    (t * 10 + i),
    t,
    'TeacherFirst' || i,
    'TeacherLast' || i,
    NOW(),
    NOW()
FROM generate_series(1, 10) t,
     generate_series(1, 2) i;