INSERT INTO payment (id, tenant_id, parent_id, amount, month, status, created_at, updated_at)
SELECT 
    row_number() OVER (),
    p.tenant_id,
    p.id,
    250 + (random() * 100)::numeric(10,2),
    DATE '2026-03-01',
    (ARRAY['PAID','PENDING','FAILED'])[1 + (random() * 2)::int]::payment_status,
    NOW(),
    NOW()
FROM parent p;