-- =====================================================================
-- SEED_DATA.SQL - DỮ LIỆU CỐ ĐỊNH HỆ THỐNG (MASTER DATA)
-- =====================================================================
-- MỤC ĐÍCH:
--   File này chứa dữ liệu CỐ ĐỊNH, KHÔNG THAY ĐỔI của hệ thống:
--   - Roles (vai trò hệ thống)
--   - Warehouse (kho hàng)
--   - Admin account (tài khoản quản trị)
--   - Suppliers (nhà cung cấp)
--
-- LƯU Ý:r
--   - File này KHÔNG chứa dữ liệu mẫu/test
--   - File này KHÔNG chứa categories và products (xem data.sql)
--   - Import file này SAU khi chạy schema.sql
--   - Import file này TRƯỚC khi chạy data.sql
-- =====================================================================

SET FOREIGN_KEY_CHECKS = 0;

-- Chỉ TRUNCATE các bảng liên quan đến transactional data
TRUNCATE TABLE review_moderation;
TRUNCATE TABLE review_edit_history;
TRUNCATE TABLE review_reply;
TRUNCATE TABLE product_review;
TRUNCATE TABLE goods_receipt_line;
TRUNCATE TABLE goods_receipt;
TRUNCATE TABLE stock_movement;
TRUNCATE TABLE shipment;
TRUNCATE TABLE payment;
TRUNCATE TABLE order_address;
TRUNCATE TABLE order_line;
TRUNCATE TABLE `order`;
TRUNCATE TABLE product_supplier;

SET FOREIGN_KEY_CHECKS = 1;

-- =====================================================================
-- 1. ROLE (VAI TRÒ HỆ THỐNG) - MASTER DATA
-- =====================================================================
INSERT INTO role (role_id, role_name) VALUES
(1, 'ADMIN'),
(2, 'CUSTOMER');

-- =====================================================================
-- 2. WAREHOUSE (KHO HÀNG) - MASTER DATA
-- =====================================================================
INSERT INTO warehouse (warehouse_id, name, address_text) VALUES
(1, 'Kho Chính Hà Nội', 'Số 123 Đường Láng Hạ, Đống Đa, Hà Nội');

-- =====================================================================
-- 3. ADMIN ACCOUNT - MASTER DATA
-- =====================================================================
-- Tạo thông tin định danh Admin
INSERT INTO party (party_id, full_name, email, phone, birth_date) VALUES
(1, 'Nguyễn Văn Admin', 'admin@shopgame.vn', '0901234567', '1990-05-15');

-- Tạo nhân viên Admin
INSERT INTO employee (party_id, employee_code, hire_date, status) VALUES
(1, 'EMP001', '2023-01-01', 'Active');

-- Gán quyền ADMIN
INSERT INTO employee_role (party_id, role_id) VALUES (1, 1);

-- Tạo tài khoản đăng nhập Admin
INSERT INTO account (party_id, username, password, role, account_status) VALUES
(1, 'admin', '12345', 'ADMIN', 'Active');

-- Địa chỉ Admin
INSERT INTO address (party_id, line1, line2, ward, district, city, postal_code, is_default) VALUES
(1, 'Shop Game Hà Nội', 'Tầng 3 Tòa A', NULL, 'Đống Đa', 'Hà Nội', '100000', TRUE);

-- =====================================================================
-- 4. SUPPLIERS (NHÀ CUNG CẤP) - MASTER DATA
-- =====================================================================
INSERT INTO supplier (supplier_id, name, contact_email, contact_phone) VALUES
(1, 'Sony Việt Nam',           'contact@sony.com.vn',   '02873001188'),
(2, 'Nintendo Việt Nam',       'support@nintendo.vn',   '02473003399'),
(3, 'Phụ kiện Game Trung Quốc','sales@gameacc.cn',      '+8613812345678'),
(4, 'Đĩa game Asia',           'order@play-asia.com',   '+85212345678');

SELECT '=== SEED MASTER DATA THÀNH CÔNG ===' AS Status;