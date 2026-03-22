-- =========================
-- ENUMS
-- =========================

CREATE TYPE attendance_status AS ENUM (
    'PRESENT',
    'ABSENT',
    'SICK'
);

CREATE TYPE payment_status AS ENUM (
    'PAID',
    'PENDING',
    'FAILED'
);

CREATE TYPE meal_type AS ENUM (
    'BREAKFAST',
    'LUNCH',
    'SNACK',
    'DINNER'
);

-- =========================
-- TENANT
-- =========================

CREATE TABLE tenant (
    id BIGINT PRIMARY KEY,
    name VARCHAR,
    address VARCHAR,
    contact_info VARCHAR,
    subscription_plan VARCHAR,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP
);

-- =========================
-- PARENT
-- =========================

CREATE TABLE parent (
    id BIGINT PRIMARY KEY,
    tenant_id BIGINT,
    email VARCHAR,
    phone VARCHAR,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP,
    CONSTRAINT fk_parent_tenant FOREIGN KEY (tenant_id) REFERENCES tenant(id)
);

-- =========================
-- TEACHER
-- =========================

CREATE TABLE teacher (
    id BIGINT PRIMARY KEY,
    tenant_id BIGINT,
    first_name VARCHAR,
    last_name VARCHAR,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP,
    CONSTRAINT fk_teacher_tenant FOREIGN KEY (tenant_id) REFERENCES tenant(id)
);

-- =========================
-- GROUP
-- =========================

CREATE TABLE "group" (
    id BIGINT PRIMARY KEY,
    tenant_id BIGINT,
    name VARCHAR,
    age_range VARCHAR,
    teacher_id BIGINT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP,
    CONSTRAINT fk_group_tenant FOREIGN KEY (tenant_id) REFERENCES tenant(id),
    CONSTRAINT fk_group_teacher FOREIGN KEY (teacher_id) REFERENCES teacher(id)
);

-- =========================
-- CHILD
-- =========================

CREATE TABLE child (
    id BIGINT PRIMARY KEY,
    tenant_id BIGINT,
    first_name VARCHAR,
    last_name VARCHAR,
    birth_date DATE,
    group_id BIGINT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP,
    CONSTRAINT fk_child_tenant FOREIGN KEY (tenant_id) REFERENCES tenant(id),
    CONSTRAINT fk_child_group FOREIGN KEY (group_id) REFERENCES "group"(id)
);

-- =========================
-- CHILD_PARENT
-- =========================

CREATE TABLE child_parent (
    tenant_id BIGINT,
    child_id BIGINT,
    parent_id BIGINT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP,
    PRIMARY KEY (child_id, parent_id),
    CONSTRAINT fk_cp_tenant FOREIGN KEY (tenant_id) REFERENCES tenant(id),
    CONSTRAINT fk_cp_child FOREIGN KEY (child_id) REFERENCES child(id),
    CONSTRAINT fk_cp_parent FOREIGN KEY (parent_id) REFERENCES parent(id)
);

-- =========================
-- ATTENDANCE
-- =========================

CREATE TABLE attendance (
    id BIGINT PRIMARY KEY,
    tenant_id BIGINT,
    child_id BIGINT,
    date DATE,
    status attendance_status,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP,
    CONSTRAINT fk_attendance_tenant FOREIGN KEY (tenant_id) REFERENCES tenant(id),
    CONSTRAINT fk_attendance_child FOREIGN KEY (child_id) REFERENCES child(id),
    CONSTRAINT uq_attendance_child_date UNIQUE (child_id, date)
);

-- =========================
-- PAYMENT
-- =========================

CREATE TABLE payment (
    id BIGINT PRIMARY KEY,
    tenant_id BIGINT,
    parent_id BIGINT,
    amount DECIMAL,
    month DATE,
    status payment_status,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP,
    CONSTRAINT fk_payment_tenant FOREIGN KEY (tenant_id) REFERENCES tenant(id),
    CONSTRAINT fk_payment_parent FOREIGN KEY (parent_id) REFERENCES parent(id)
);

-- =========================
-- MENU
-- =========================

CREATE TABLE menu (
    id BIGINT PRIMARY KEY,
    tenant_id BIGINT,
    date DATE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP,
    CONSTRAINT fk_menu_tenant FOREIGN KEY (tenant_id) REFERENCES tenant(id)
);

-- =========================
-- MEAL
-- =========================

CREATE TABLE meal (
    id BIGINT PRIMARY KEY,
    tenant_id BIGINT,
    menu_id BIGINT,
    meal_type meal_type,
    description VARCHAR,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP,
    CONSTRAINT fk_meal_tenant FOREIGN KEY (tenant_id) REFERENCES tenant(id),
    CONSTRAINT fk_meal_menu FOREIGN KEY (menu_id) REFERENCES menu(id)
);

-- =========================
-- INDEXES
-- =========================

CREATE INDEX idx_child_tenant ON child(tenant_id);
CREATE INDEX idx_parent_tenant ON parent(tenant_id);
CREATE INDEX idx_attendance_tenant ON attendance(tenant_id);
CREATE INDEX idx_payment_tenant ON payment(tenant_id);