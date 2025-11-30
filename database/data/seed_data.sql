USE shop_game;

-- ===================================================================
-- 1. XÓA SẠCH DỮ LIỆU CŨ (TRUNCATE)
-- ===================================================================
SET FOREIGN_KEY_CHECKS = 0;

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
TRUNCATE TABLE product;
TRUNCATE TABLE category;
TRUNCATE TABLE supplier;
TRUNCATE TABLE warehouse;
TRUNCATE TABLE address;
TRUNCATE TABLE employee_role;
TRUNCATE TABLE employee;
TRUNCATE TABLE customer;
TRUNCATE TABLE account;
TRUNCATE TABLE party;
TRUNCATE TABLE role;

SET FOREIGN_KEY_CHECKS = 1;

-- ===================================================================
-- 2. ROLE (VAI TRÒ)
-- ===================================================================
INSERT INTO role (role_id, role_name) VALUES
(1, 'ADMIN'),
(2, 'CUSTOMER');

-- ===================================================================
-- 3. KHO HÀNG (WAREHOUSE)
-- ===================================================================
INSERT INTO warehouse (warehouse_id, name, address_text) VALUES
(1, 'Kho Chính Hà Nội', 'Số 123 Đường Láng Hạ, Đống Đa, Hà Nội');

-- ===================================================================
-- 4. PARTY - EMPLOYEE - CUSTOMER - ACCOUNT
-- ===================================================================
-- Tạo thông tin định danh (Party)
INSERT INTO party (party_id, full_name, email, phone, birth_date) VALUES
(1,   'Nguyễn Văn Admin',   'admin@shopgame.vn',      '0901234567', '1990-05-15'),
(101, 'Trần Văn A',         'khachhang1@gmail.com',   '0912345678', '1998-07-12'),
(102, 'Nguyễn Thị B',       'khachhang2@gmail.com',   '0923456789', '2000-12-25'),
(103, 'Lê Hoàng C',         'khachhang3@gmail.com',   '0934567890', '1996-04-03');

-- Tạo nhân viên
INSERT INTO employee (party_id, employee_code, hire_date, status) VALUES
(1, 'EMP001', '2023-01-01', 'Active');

INSERT INTO employee_role (party_id, role_id) VALUES (1, 1); -- Gán quyền ADMIN

-- Tạo khách hàng
INSERT INTO customer (party_id, tier, points) VALUES
(101, 'Silver', 1250),
(102, 'Gold',   3800),
(103, 'Bronze', 450);

-- Tạo tài khoản đăng nhập (Account)
INSERT INTO account (party_id, username, password, role, account_status) VALUES
(1,   'admin',  '12345', 'ADMIN',    'Active'),
(101, 'khach1', '12345', 'CUSTOMER', 'Active'),
(102, 'khach2', '12345', 'CUSTOMER', 'Active'),
(103, 'khach3', '12345', 'CUSTOMER', 'Active');

-- ===================================================================
-- 5. ĐỊA CHỈ NGƯỜI DÙNG (ADDRESS)
-- ===================================================================
INSERT INTO address (party_id, line1, line2, ward, district, city, postal_code, is_default) VALUES
(1,   'Shop Game Hà Nội',      'Tầng 3 Tòa A', NULL,              'Đống Đa',      'Hà Nội',          '100000', TRUE),
(101, '123 Đường Lê Lợi',      'Ngõ 45',       'Phường Bến Nghé', 'Quận 1',       'TP. Hồ Chí Minh', '700000', TRUE),
(102, '56 Nguyễn Trãi',        NULL,           'Phường Thượng Đình', 'Quận Thanh Xuân', 'Hà Nội',       '100000', TRUE),
(103, '789 Trần Hưng Đạo',     'Tầng 5',       'Phường 5',        'Quận 5',       'TP. Hồ Chí Minh', '700000', TRUE);

-- ===================================================================
-- 6. DANH MỤC & SẢN PHẨM (CATEGORY & PRODUCT)
-- ===================================================================
INSERT INTO category (category_id, category_name, description) VALUES
(1, 'Console', 'Máy chơi game'),
(2, 'Game Disc', 'Đĩa game vật lý'),
(3, 'Accessory', 'Phụ kiện tay cầm, tai nghe');

INSERT INTO product (product_id, sku, product_name, list_price, category_id) VALUES
(1,  'PS5-STD', 'PlayStation 5 Standard', 14500000, 1),
(2,  'PS5-PRO', 'PlayStation 5 Pro',      20499000, 1),
(4,  'PS4-SLIM','PlayStation 4 Slim',      6000000, 1),
(5,  'XBOX-X',  'Xbox Series X',          14000000, 1),
(14, 'SW2-OLED','Nintendo Switch 2',      12999000, 1),
(15, 'SW-LITE', 'Switch Lite',             4500000, 1),
(16, 'SW-OLED', 'Switch OLED Model',       8000000, 1),
(23, 'GAME-01', 'God of War Ragnarok',     1599000, 2),
(30, 'GAME-02', 'Zelda: Tears of Kingdom', 1200000, 2),
(45, 'ACC-01',  'Tay cầm PS5 DualSense',   1500000, 3),
(50, 'ACC-02',  'Tai nghe Pulse 3D',       2500000, 3);

-- ===================================================================
-- 7. NHÀ CUNG CẤP (SUPPLIER)
-- ===================================================================
INSERT INTO supplier (supplier_id, name, contact_email, contact_phone) VALUES
(1, 'Sony Việt Nam',           'contact@sony.com.vn',   '02873001188'),
(2, 'Nintendo Việt Nam',       'support@nintendo.vn',   '02473003399'),
(3, 'Phụ kiện Game Trung Quốc','sales@gameacc.cn',      '+8613812345678'),
(4, 'Đĩa game Asia',           'order@play-asia.com',   '+85212345678');

INSERT INTO product_supplier (product_id, supplier_id) VALUES
(1,1),(2,1),(4,1),(5,1),(14,2),(15,2),(16,2),(23,4),(30,4),(45,3),(50,3);

-- ===================================================================
-- 8. ĐƠN HÀNG (ORDER)
-- ===================================================================
INSERT INTO `order` 
(customer_id, created_at, status, payment_method, payment_status,
 subtotal, discount_amount, tax_amount, grand_total, notes,
 cancelled_at, cancel_reason, cancelled_by)
VALUES
-- Đơn 1: Thành công
(101, '2025-11-20 15:30:00', 'COMPLETED', 'VNPAY', 'PAID',
 21998000.00, 500000.00, 0.00, 21498000.00, 'Khách VIP Gold, giảm 500k',
 NULL, NULL, NULL),

-- Đơn 2: Đang giao
(102, '2025-11-21 10:15:00', 'SHIPPED', 'COD', 'COD_PENDING',
 12999000.00, 0.00, 0.00, 12999000.00, NULL,
 NULL, NULL, NULL),

-- Đơn 3: Đã hủy
(103, '2025-11-22 19:45:00', 'CANCELLED', 'COD', 'PENDING',
 1599000.00, 0.00, 0.00, 1599000.00, 'Khách hủy đơn',
 '2025-11-22 20:15:00', 'Khách không còn nhu cầu', '103');

-- Chi tiết đơn hàng
INSERT INTO order_line (order_id, line_no, product_id, quantity, unit_price_at_order, line_total) VALUES
(1,1,2,  1,20499000,20499000),
(1,2,45, 1,5499000,5499000),
(2,1,14, 1,12999000,12999000),
(3,1,23, 1,1599000,1599000);

-- Địa chỉ giao hàng (ĐÃ SỬA: Bỏ cột District để khớp schema)
INSERT INTO order_address (order_id, receiver_name, receiver_phone, line1, line2, ward, city, postal_code) VALUES
(1, 'Trần Văn A',   '0912345678', '123 Đường Lê Lợi',  'Ngõ 45',  'Phường Bến Nghé',    'TP. Hồ Chí Minh', '700000'),
(2, 'Nguyễn Thị B', '0923456789', '56 Nguyễn Trãi',    NULL,      'Phường Thượng Đình', 'Hà Nội',          '100000'),
(3, 'Lê Hoàng C',   '0934567890', '789 Trần Hưng Đạo','Tầng 5',  'Phường 5',           'TP. Hồ Chí Minh', '700000');

-- Thanh toán
INSERT INTO payment (order_id, method, amount, paid_at, status) VALUES
(1, 'BankTransfer', 21498000, '2025-11-20 15:45:00', 'Captured'),
(2, 'COD',          13029000, NULL,                 'Pending'),
(3, 'Momo',         1599000,  '2025-11-22 19:50:00', 'Captured');

-- Vận chuyển
INSERT INTO shipment (order_id, carrier, tracking_no, estimated_delivery, shipped_at, delivered_at, status) VALUES
(1, 'Giao Hàng Nhanh',     'GHN123456789',  '2025-11-23 00:00:00', '2025-11-21 10:00:00', '2025-11-22 14:30:00', 'Delivered'),
(2, 'Giao Hàng Tiết Kiệm', 'GHTK987654321', '2025-11-25 00:00:00', '2025-11-22 09:00:00', NULL,                  'Shipped'),
(3, 'Ninja Van',           'NVN1122334455', '2025-11-24 00:00:00', NULL,                  NULL,                  'Returned');

-- ===================================================================
-- 9. QUẢN LÝ KHO (STOCK MOVEMENT)
-- ===================================================================
INSERT INTO stock_movement
(product_id, warehouse_id, order_id, quantity_delta, reason, occurred_at, reference_no) VALUES
-- Nhập kho ban đầu
(1,  1, NULL,   5, 'GoodsReceipt', '2025-11-01 10:00:00', 'GR-20251101-001'),
(2,  1, NULL,  15, 'GoodsReceipt', '2025-11-01 10:00:00', 'GR-20251101-001'),
(4,  1, NULL,  30, 'GoodsReceipt', '2025-11-05 14:30:00', 'GR-20251105-002'),
(14, 1, NULL,  20, 'GoodsReceipt', '2025-11-10 09:15:00', 'GR-20251110-003'),
(23, 1, NULL,  50, 'GoodsReceipt', '2025-11-15 11:20:00', 'GR-20251115-004'),
(45, 1, NULL, 100, 'GoodsReceipt', '2025-11-20 13:45:00', 'GR-20251120-005'),
-- Xuất kho theo đơn hàng
(2,  1, 1, -1, 'Sale', '2025-11-21 11:00:00', 'SO-1'),
(45, 1, 1, -1, 'Sale', '2025-11-21 11:00:00', 'SO-1'),
(14, 1, 2, -1, 'Sale', '2025-11-22 10:00:00', 'SO-2');

-- ===================================================================
-- 10. ĐÁNH GIÁ SẢN PHẨM (REVIEW)
-- ===================================================================
INSERT INTO product_review (product_id, party_id, rating, comment, created_at, visibility_status) VALUES
(2, 101, 5, 'Máy PS5 Pro chạy cực mượt, đồ họa đẹp long lanh!', '2025-11-23 10:15:00', 'Visible'),
(14,102, 4, 'Switch 2 rất đáng nâng cấp.', '2025-11-22 18:30:00', 'Visible'),
(4, 103, 1, 'Máy giao thiếu hộp!!!', '2025-11-21 08:10:00', 'Hidden');

INSERT INTO review_reply (review_id, party_id, comment, created_at, is_from_staff) VALUES
(1, 1,   'Cảm ơn anh A đã tin tưởng Shop Game!',               '2025-11-23 11:20:00', TRUE),
(1, 101, 'Cảm ơn admin!',                                      '2025-11-23 12:05:00', FALSE),
(2, 1,   'Chào chị B! Joy-Con nam châm là điểm nâng cấp lớn',  '2025-11-22 19:10:00', TRUE),
(2, 103, 'Mình cũng đang cân nhắc lên Switch 2',               '2025-11-23 09:30:00', FALSE),
(2, 1,   'Dạ đúng 100% luôn anh ơi!',                          '2025-11-23 10:00:00', TRUE);

INSERT INTO review_moderation (review_id, moderator_party_id, status, reason_code, notes, created_at, decided_at) VALUES
(1, 1, 'Approved', NULL,      'Nội dung tích cực',                  '2025-11-23 10:30:00', '2025-11-23 10:35:00'),
(2, 1, 'Approved', NULL,      'Review hợp lệ',                      '2025-11-22 18:45:00', '2025-11-22 19:00:00'),
(3, 1, 'Rejected', 'FALSE_INFO','Khách nhầm hàng cũ, đã hoàn tiền',   '2025-11-21 09:00:00', '2025-11-21 09:30:00');

SELECT '=== SEED THÀNH CÔNG 100% ===' AS Status;