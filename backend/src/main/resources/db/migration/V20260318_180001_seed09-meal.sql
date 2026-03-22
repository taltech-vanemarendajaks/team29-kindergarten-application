INSERT INTO meal (id, tenant_id, menu_id, meal_type, description, created_at, updated_at)
SELECT 
    row_number() OVER (),
    m.tenant_id,
    m.id,
    mt.meal_type::meal_type,
    mt.meal_type || ' meal',
    NOW(),
    NOW()
FROM menu m
CROSS JOIN (
    VALUES 
        ('BREAKFAST'::meal_type),
        ('LUNCH'::meal_type),
        ('SNACK'::meal_type)
) AS mt(meal_type)