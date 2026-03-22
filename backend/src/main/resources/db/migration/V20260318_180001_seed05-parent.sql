INSERT INTO parent (id, tenant_id, email, phone, created_at, updated_at)
SELECT 
    (t * 1000 + p),
    t,
    'parent' || p || '_t' || t || '@mail.com',
    '+372123' || LPAD(p::text, 6, '0'),
    NOW(),
    NOW()
FROM generate_series(1, 10) t,
     generate_series(1, 100) p;