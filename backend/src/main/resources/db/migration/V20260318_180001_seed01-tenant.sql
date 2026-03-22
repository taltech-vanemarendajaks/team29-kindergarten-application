INSERT INTO tenant (id, name, address, contact_info, subscription_plan, created_at, updated_at)
SELECT 
    t,
    'Tenant ' || t,
    'Address ' || t,
    'contact' || t || '@example.com',
    CASE WHEN t % 2 = 0 THEN 'PREMIUM' ELSE 'BASIC' END,
    NOW(),
    NOW()
FROM generate_series(1, 10) t;