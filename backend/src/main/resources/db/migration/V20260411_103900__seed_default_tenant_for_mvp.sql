-- Seed a single default tenant for the current MVP setup.
-- TODO: Revisit this once tenant onboarding and multi-tenant registration are implemented.

INSERT INTO tenant (name, address, contact_info, subscription_plan)
SELECT
    'Default Kindergarten',
    'Placeholder address',
    'Placeholder contact info',
    'basic'
WHERE NOT EXISTS (
    SELECT 1
    FROM tenant
);
