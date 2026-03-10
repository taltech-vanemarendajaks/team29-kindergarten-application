-- ENUM TYPES

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


-- TENANT

CREATE TABLE tenant (
    id BIGINT PRIMARY KEY,
    name VARCHAR(255),
    address VARCHAR(255),
    contact_info VARCHAR(255),
    subscription_plan VARCHAR(255),
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP
);


-- PARENT

CREATE TABLE parent (
    id BIGINT PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP,

    CONSTRAINT fk_parent_tenant
        FOREIGN KEY (tenant_id)
        REFERENCES tenant(id)
);


-- TEACHER

CREATE TABLE teacher (
    id BIGINT PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP,

    CONSTRAINT fk_teacher_tenant
        FOREIGN KEY (tenant_id)
        REFERENCES tenant(id)
);


-- GROUP

CREATE TABLE "group" (
    id BIGINT PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    name VARCHAR(255),
    age_range VARCHAR(100),
    teacher_id BIGINT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP,

    CONSTRAINT fk_group_tenant
        FOREIGN KEY (tenant_id)
        REFERENCES tenant(id),

    CONSTRAINT fk_group_teacher
        FOREIGN KEY (teacher_id)
        REFERENCES teacher(id)
);


-- CHILD

CREATE TABLE child (
    id BIGINT PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    birth_date DATE,
    group_id BIGINT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP,

    CONSTRAINT fk_child_tenant
        FOREIGN KEY (tenant_id)
        REFERENCES tenant(id),

    CONSTRAINT fk_child_group
        FOREIGN KEY (group_id)
        REFERENCES "group"(id)
);


-- CHILD_PARENT

CREATE TABLE child_parent (
    tenant_id BIGINT NOT NULL,
    child_id BIGINT NOT NULL,
    parent_id BIGINT NOT NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP,

    PRIMARY KEY (child_id, parent_id),

    CONSTRAINT fk_cp_tenant
        FOREIGN KEY (tenant_id)
        REFERENCES tenant(id),

    CONSTRAINT fk_cp_child
        FOREIGN KEY (child_id)
        REFERENCES child(id),

    CONSTRAINT fk_cp_parent
        FOREIGN KEY (parent_id)
        REFERENCES parent(id)
);


-- ATTENDANCE

CREATE TABLE attendance (
    id BIGINT PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    child_id BIGINT NOT NULL,
    date DATE NOT NULL,
    status attendance_status,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP,

    CONSTRAINT fk_attendance_tenant
        FOREIGN KEY (tenant_id)
        REFERENCES tenant(id),

    CONSTRAINT fk_attendance_child
        FOREIGN KEY (child_id)
        REFERENCES child(id),

    CONSTRAINT uq_attendance_child_date
        UNIQUE (child_id, date)
);


-- PAYMENT

CREATE TABLE payment (
    id BIGINT PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    parent_id BIGINT NOT NULL,
    amount DECIMAL(10,2),
    month DATE,
    status payment_status,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP,

    CONSTRAINT fk_payment_tenant
        FOREIGN KEY (tenant_id)
        REFERENCES tenant(id),

    CONSTRAINT fk_payment_parent
        FOREIGN KEY (parent_id)
        REFERENCES parent(id)
);


-- MENU

CREATE TABLE menu (
    id BIGINT PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    date DATE,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP,

    CONSTRAINT fk_menu_tenant
        FOREIGN KEY (tenant_id)
        REFERENCES tenant(id)
);


-- MEAL

CREATE TABLE meal (
    id BIGINT PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    menu_id BIGINT NOT NULL,
    meal_type meal_type,
    description VARCHAR(255),
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP,

    CONSTRAINT fk_meal_tenant
        FOREIGN KEY (tenant_id)
        REFERENCES tenant(id),

    CONSTRAINT fk_meal_menu
        FOREIGN KEY (menu_id)
        REFERENCES menu(id)
);


-- INDEXES FOR MULTI-TENANT PERFORMANCE

CREATE INDEX idx_child_tenant ON child(tenant_id);
CREATE INDEX idx_parent_tenant ON parent(tenant_id);
CREATE INDEX idx_attendance_tenant ON attendance(tenant_id);
CREATE INDEX idx_payment_tenant ON payment(tenant_id);