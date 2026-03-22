WITH base AS (
    SELECT 
        c.*,
        ((c.id / 2) % 100) + 1 AS family_parent1,
        ((c.id / 2 + 17) % 100) + 1 AS family_parent2
    FROM child c
)
INSERT INTO child_parent (tenant_id, child_id, parent_id, created_at, updated_at)
SELECT tenant_id, id, tenant_id * 1000 + family_parent1, NOW(), NOW()
FROM base

UNION ALL

SELECT tenant_id, id, tenant_id * 1000 + family_parent2, NOW(), NOW()
FROM base
WHERE random() > 0.3

ON CONFLICT DO NOTHING;