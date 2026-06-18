-- =============================================================================
-- Tiffin Management System — MySQL Schema
-- Engine: InnoDB | Charset: utf8mb4
-- =============================================================================

CREATE DATABASE IF NOT EXISTS tiffin_management_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE tiffin_management_db;

-- -----------------------------------------------------------------------------
-- users
-- -----------------------------------------------------------------------------
CREATE TABLE users (
    id              BIGINT          NOT NULL AUTO_INCREMENT,
    email           VARCHAR(150)    NOT NULL,
    password_hash   VARCHAR(255)    NOT NULL,
    role            ENUM('ADMIN', 'STUDENT') NOT NULL,
    first_name      VARCHAR(80)     NOT NULL,
    last_name       VARCHAR(80)     NOT NULL,
    phone           VARCHAR(20)     NULL,
    is_active       TINYINT(1)      NOT NULL DEFAULT 1,
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    CONSTRAINT uk_users_email UNIQUE (email),
    CONSTRAINT chk_users_phone CHECK (phone IS NULL OR phone REGEXP '^[0-9+\\- ]{7,20}$')
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_users_role ON users (role);
CREATE INDEX idx_users_is_active ON users (is_active);

-- -----------------------------------------------------------------------------
-- student_profiles
-- -----------------------------------------------------------------------------
CREATE TABLE student_profiles (
    id                      BIGINT          NOT NULL AUTO_INCREMENT,
    user_id                 BIGINT          NOT NULL,
    enrollment_number       VARCHAR(50)     NOT NULL,
    hostel_block            VARCHAR(50)     NULL,
    room_number             VARCHAR(20)     NULL,
    aadhaar_number          VARCHAR(12)     NULL,
    aadhaar_document_path   VARCHAR(500)    NULL,
    diet_preference         ENUM('VEG', 'NON_VEG', 'VEGAN') NOT NULL DEFAULT 'VEG',
    created_at              TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at              TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    CONSTRAINT uk_student_profiles_user_id UNIQUE (user_id),
    CONSTRAINT uk_student_profiles_enrollment UNIQUE (enrollment_number),
    CONSTRAINT fk_student_profiles_user
        FOREIGN KEY (user_id) REFERENCES users (id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT chk_student_profiles_aadhaar
        CHECK (aadhaar_number IS NULL OR aadhaar_number REGEXP '^[0-9]{12}$')
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_student_profiles_hostel ON student_profiles (hostel_block, room_number);

-- -----------------------------------------------------------------------------
-- menus
-- -----------------------------------------------------------------------------
CREATE TABLE menus (
    id              BIGINT          NOT NULL AUTO_INCREMENT,
    menu_date       DATE            NOT NULL,
    meal_type       ENUM('BREAKFAST', 'LUNCH', 'DINNER') NOT NULL,
    title           VARCHAR(150)    NOT NULL,
    description     TEXT            NULL,
    items           JSON            NULL,
    is_published    TINYINT(1)      NOT NULL DEFAULT 0,
    created_by      BIGINT          NOT NULL,
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    CONSTRAINT uk_menus_date_meal UNIQUE (menu_date, meal_type),
    CONSTRAINT fk_menus_created_by
        FOREIGN KEY (created_by) REFERENCES users (id)
        ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_menus_date ON menus (menu_date);
CREATE INDEX idx_menus_published ON menus (is_published);

-- -----------------------------------------------------------------------------
-- tiffin_orders
-- -----------------------------------------------------------------------------
CREATE TABLE tiffin_orders (
    id                  BIGINT          NOT NULL AUTO_INCREMENT,
    student_profile_id  BIGINT          NOT NULL,
    menu_id             BIGINT          NOT NULL,
    order_date          DATE            NOT NULL,
    quantity            TINYINT         NOT NULL DEFAULT 1,
    status              ENUM('PENDING', 'CONFIRMED', 'CANCELLED', 'DELIVERED') NOT NULL DEFAULT 'PENDING',
    special_instructions VARCHAR(500)   NULL,
    created_at          TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    CONSTRAINT fk_tiffin_orders_student
        FOREIGN KEY (student_profile_id) REFERENCES student_profiles (id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_tiffin_orders_menu
        FOREIGN KEY (menu_id) REFERENCES menus (id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT uk_tiffin_orders_student_menu_date
        UNIQUE (student_profile_id, menu_id, order_date),
    CONSTRAINT chk_tiffin_orders_quantity CHECK (quantity BETWEEN 1 AND 5)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_tiffin_orders_status ON tiffin_orders (status);
CREATE INDEX idx_tiffin_orders_order_date ON tiffin_orders (order_date);
CREATE INDEX idx_tiffin_orders_student_date ON tiffin_orders (student_profile_id, order_date);

-- -----------------------------------------------------------------------------
-- attendance
-- -----------------------------------------------------------------------------
CREATE TABLE attendance (
    id                  BIGINT          NOT NULL AUTO_INCREMENT,
    student_profile_id  BIGINT          NOT NULL,
    menu_id             BIGINT          NOT NULL,
    attendance_date     DATE            NOT NULL,
    status              ENUM('PRESENT', 'ABSENT') NOT NULL,
    marked_by           BIGINT          NOT NULL,
    remarks             VARCHAR(255)    NULL,
    created_at          TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    CONSTRAINT fk_attendance_student
        FOREIGN KEY (student_profile_id) REFERENCES student_profiles (id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_attendance_menu
        FOREIGN KEY (menu_id) REFERENCES menus (id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_attendance_marked_by
        FOREIGN KEY (marked_by) REFERENCES users (id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT uk_attendance_student_menu_date
        UNIQUE (student_profile_id, menu_id, attendance_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_attendance_date ON attendance (attendance_date);
CREATE INDEX idx_attendance_status ON attendance (status);
CREATE INDEX idx_attendance_student_date ON attendance (student_profile_id, attendance_date);
