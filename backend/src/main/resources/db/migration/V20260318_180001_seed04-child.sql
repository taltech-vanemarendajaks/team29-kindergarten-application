INSERT INTO child (id, tenant_id, first_name, last_name, birth_date, group_id, created_at, updated_at)
SELECT 
    (t * 1000 + c),
    t,
    'ChildFirst' || c,
    'ChildLast' || c,
    DATE '2018-01-01' + (c % 200),
    (t * 100 + ((c % 10) + 1)),
    NOW(),
    NOW()
FROM generate_series(1, 10) t,
     generate_series(1, 100) c;