-- =====================================================
-- Migration: Seed Warehouse and Admin Account
-- Description: Tạo warehouse mặc định và admin account
-- Date: 2025-11-27
-- =====================================================

USE shop_game;

-- ===================================================
-- 1. TẠO WAREHOUSE MẶC ĐỊNH
-- ===================================================

-- Kiểm tra xem warehouse_id = 1 đã tồn tại chưa
INSERT INTO warehouse (warehouse_id, name, address_text)
VALUES (1, 'Kho Chính', 'Kho mặc định của hệ thống')
ON DUPLICATE KEY UPDATE
    name = 'Kho Chính',
    address_text = 'Kho mặc định của hệ thống';

-- ===================================================
-- 2. TẠO ADMIN ACCOUNT
-- ===================================================

-- 2.1. Tạo Party cho Admin
INSERT INTO party (party_id, full_name, email, phone, created_at, updated_at)
VALUES (1, 'Administrator', 'admin@shopgame.com', '0123456789', NOW(), NOW())
ON DUPLICATE KEY UPDATE
    full_name = 'Administrator',
    email = 'admin@shopgame.com',
    updated_at = NOW();

-- 2.2. Tạo Employee
INSERT INTO employee (party_id, employee_code, hire_date, status)
VALUES (1, 'ADMIN001', CURDATE(), 'Active')
ON DUPLICATE KEY UPDATE
    employee_code = 'ADMIN001',
    status = 'Active';

-- 2.3. Tạo Role Admin (nếu chưa có)
INSERT INTO role (role_id, role_name)
VALUES (1, 'ADMIN')
ON DUPLICATE KEY UPDATE
    role_name = 'ADMIN';

-- 2.4. Gán role cho employee
INSERT INTO employee_role (party_id, role_id)
VALUES (1, 1)
ON DUPLICATE KEY UPDATE
    party_id = 1,
    role_id = 1;

-- 2.5. Tạo Account (username: admin, password: admin123)
-- Password hash sử dụng BCrypt với cost=10
-- Plain password: "admin123"
-- BCrypt hash: $2a$10$ZLhnHxdpHETcxmtEStgpI.Jy1Z5nFq7YgPBqwqLK.LnfJKZYZY6/e
INSERT INTO account (
    account_id,
    party_id,
    provider,
    provider_user_id,
    username,
    email_for_login,
    password_hash,
    account_status,
    created_at
)
VALUES (
    1,
    1,
    'LOCAL',
    NULL,
    'admin',
    'admin@shopgame.com',
    '$2a$10$ZLhnHxdpHETcxmtEStgpI.Jy1Z5nFq7YgPBqwqLK.LnfJKZYZY6/e',
    'Active',
    NOW()
)
ON DUPLICATE KEY UPDATE
    username = 'admin',
    email_for_login = 'admin@shopgame.com',
    password_hash = '$2a$10$ZLhnHxdpHETcxmtEStgpI.Jy1Z5nFq7YgPBqwqLK.LnfJKZYZY6/e',
    account_status = 'Active';

-- ===================================================
-- VERIFY
-- ===================================================

-- Kiểm tra warehouse
SELECT * FROM warehouse WHERE warehouse_id = 1;

-- Kiểm tra admin account
SELECT
    p.party_id,
    p.full_name,
    p.email,
    e.employee_code,
    e.status AS employee_status,
    a.username,
    a.account_status,
    r.role_name
FROM party p
INNER JOIN employee e ON p.party_id = e.party_id
INNER JOIN account a ON p.party_id = a.party_id
LEFT JOIN employee_role er ON e.party_id = er.party_id
LEFT JOIN role r ON er.role_id = r.role_id
WHERE p.party_id = 1;

-- ===================================================
-- NOTES
-- ===================================================

-- Admin Login Credentials:
-- Username: admin
-- Password: admin123
-- Email: admin@shopgame.com

-- Warehouse:
-- ID: 1
-- Name: Kho Chính
-- Dùng cho tất cả stock_movement và goods_receipt_line
