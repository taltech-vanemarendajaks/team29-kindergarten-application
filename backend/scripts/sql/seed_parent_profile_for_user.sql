-- Quick test seed for parent profile resolution (/api/v1/parents/me)
-- Usage:
-- 1) Set target_email below
-- 2) Run this script in PostgreSQL connected to your app database
-- 3) Re-login in frontend to refresh JWT with current tenant_id

DO $$
DECLARE
    target_email TEXT := 'a@gmail.com'; -- change to your login email
    v_user_id BIGINT;
    v_tenant_id BIGINT;
BEGIN
    -- Find auth user by email
    SELECT id, tenant_id
    INTO v_user_id, v_tenant_id
    FROM users
    WHERE email = target_email;

    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'User not found for email: %', target_email;
    END IF;

    -- If user has no tenant, create a test tenant and attach the user
    IF v_tenant_id IS NULL THEN
        INSERT INTO tenant (name, address, contact_info, subscription_plan)
        VALUES ('Test Tenant for ' || target_email, 'N/A', 'N/A', 'BASIC')
        RETURNING id INTO v_tenant_id;

        UPDATE users
        SET tenant_id = v_tenant_id
        WHERE id = v_user_id;
    END IF;

    -- If parent exists but was soft-deleted, restore it
    UPDATE parent
    SET deleted_at = NULL,
        updated_at = NOW(),
        tenant_id = v_tenant_id
    WHERE email = target_email
      AND tenant_id = v_tenant_id
      AND deleted_at IS NOT NULL;

    -- Ensure active parent profile exists for this email + tenant
    INSERT INTO parent (tenant_id, email, phone)
    SELECT v_tenant_id, target_email, NULL
    WHERE NOT EXISTS (
        SELECT 1
        FROM parent p
        WHERE p.email = target_email
          AND p.tenant_id = v_tenant_id
          AND p.deleted_at IS NULL
    );

    RAISE NOTICE 'Ready: user_id=%, tenant_id=%, email=%', v_user_id, v_tenant_id, target_email;
END $$;
