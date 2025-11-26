USE shop_game;

-- 1. Warehouse (chỉ 1 cái)
INSERT INTO warehouse (warehouse_id, name, address_text) VALUES
(1, 'Kho Chính Hà Nội', 'Số 123 Đường Láng Hạ, Đống Đa, Hà Nội');

-- 2. Role
INSERT INTO role (role_id, role_name) VALUES
(1, 'ADMIN'),
(2, 'MANAGER'),
(3, 'SALES_STAFF'),
(4, 'WAREHOUSE_STAFF'),
(5, 'CUSTOMER_SUPPORT');

-- 3. Party + Employee + Account + Employee_role (nhân viên mẫu)
INSERT INTO party (party_id, full_name, email, phone, birth_date) VALUES
(1, 'Nguyễn Văn Admin', 'admin@shopgame.vn', '0901234567', '1990-05-15'),
(2, 'Trần Thị Quản Lý', 'manager@shopgame.vn', '0902345678', '1992-08-20'),
(3, 'Lê Văn Nhân Viên', 'sales1@shopgame.vn', '0903456789', '1995-03-10'),
(4, 'Phạm Minh Kho', 'warehouse@shopgame.vn', '0904567890', '1994-11-25');

INSERT INTO employee (party_id, employee_code, hire_date, status) VALUES
(1, 'EMP001', '2023-01-01', 'Active'),
(2, 'EMP002', '2023-02-15', 'Active'),
(3, 'EMP003', '2024-01-10', 'Active'),
(4, 'EMP004', '2023-06-01', 'Active');

INSERT INTO account (party_id, provider, username, email_for_login, password_hash, account_status) VALUES
(1, 'LOCAL', 'admin', 'admin@shopgame.vn', '$2y$10$z1x2y3examplehashADMIN1234567890', 'Active'), -- mật khẩu mẫu: Admin123!
(2, 'LOCAL', 'manager', 'manager@shopgame.vn', '$2y$10$examplehashMANAGER1234567890', 'Active'),
(3, 'LOCAL', 'sales1', 'sales1@shopgame.vn', '$2y$10$examplehashSALES1234567890', 'Active'),
(4, 'LOCAL', 'warehouse', 'warehouse@shopgame.vn', '$2y$10$examplehashWAREHOUSE1234567890', 'Active');

INSERT INTO employee_role (party_id, role_id) VALUES
(1,1), (1,2), -- Admin có cả 2 quyền
(2,2), -- Manager
(3,3), (3,5), -- Nhân viên bán hàng + hỗ trợ khách
(4,4); -- Nhân viên kho

-- 4. Party + Customer + Account (khách hàng mẫu)
INSERT INTO party (party_id, full_name, email, phone, birth_date) VALUES
(101, 'Trần Văn A', 'khachhang1@gmail.com', '0912345678', '1998-07-12'),
(102, 'Nguyễn Thị B', 'khachhang2@gmail.com', '0923456789', '2000-12-25'),
(103, 'Lê Hoàng C', 'khachhang3@gmail.com', '0934567890', '1996-04-03');

INSERT INTO customer (party_id, tier, points) VALUES
(101, 'Silver', 1250),
(102, 'Gold', 3800),
(103, 'Bronze', 450);

INSERT INTO account (party_id, provider, username, email_for_login, password_hash, account_status) VALUES
(101, 'LOCAL', 'khach1', 'khachhang1@gmail.com', '$2y$10$exampleCustomer1234567890', 'Active'),
(102, 'LOCAL', 'khach2', 'khachhang2@gmail.com', '$2y$10$exampleCustomer2234567890', 'Active'),
(103, 'LOCAL', 'khach3', 'khachhang3@gmail.com', '$2y$10$exampleCustomer3234567890', 'Active');

-- 5. Address (địa chỉ khách hàng + nhân viên)
INSERT INTO address (party_id, line1, line2, ward, district, city, postal_code, is_default) VALUES
(101, '123 Đường Lê Lợi', 'Ngõ 45', 'Phường Bến Nghé', 'Quận 1', 'TP. Hồ Chí Minh', '700000', TRUE),
(102, '56 Nguyễn Trãi', NULL, 'Phường Thượng Đình', 'Quận Thanh Xuân', 'Hà Nội', '100000', TRUE),
(103, '789 Trần Hưng Đạo', 'Tầng 5', 'Phường 5', 'Quận 5', 'TP. Hồ Chí Minh', '700000', TRUE),
(1, 'Shop Game Hà Nội', 'Tầng 3 Tòa A', NULL, 'Đống Đa', 'Hà Nội', '100000', TRUE);

-- 6. Supplier (nhà cung cấp)
INSERT INTO supplier (supplier_id, name, contact_email, contact_phone) VALUES
(1, 'Sony Việt Nam', 'contact@sony.com.vn', '02873001188'),
(2, 'Nintendo Việt Nam', 'support@nintendo.vn', '02473003399'),
(3, 'Phụ kiện Game Trung Quốc', 'sales@gameacc.cn', '+8613812345678'),
(4, 'Đĩa game Asia', 'order@play-asia.com', '+85212345678');

-- 7. product_supplier (liên kết sản phẩm - nhà cung cấp, chọn 1 vài ví dụ)
INSERT INTO product_supplier (product_id, supplier_id) VALUES
(1,1), (2,1), (3,1), (4,1), (5,1), -- PS5 các loại → Sony
(14,2), (15,2), (16,2), -- Switch các loại → Nintendo
(45,3), (50,3), -- Phụ kiện → nhà cung cấp phụ kiện
(23,4), (30,4); -- Game đĩa → nhà cung cấp Asia

-- 8. Stock tồn kho ban đầu (chỉ kho 1) - chọn 20 sản phẩm phổ biến
INSERT INTO stock_movement 
(product_id, warehouse_id, quantity_delta, reason, occurred_at, reference_no) VALUES
(1, 1, 5,   'GoodsReceipt', '2025-11-01 10:00:00', 'GR-20251101-001'),
(2, 1, 15,  'GoodsReceipt', '2025-11-01 10:00:00', 'GR-20251101-001'),
(4, 1, 30,  'GoodsReceipt', '2025-11-05 14:30:00', 'GR-20251105-002'),
(5, 1, 25,  'GoodsReceipt', '2025-11-05 14:30:00', 'GR-20251105-002'),
(14,1, 20,  'GoodsReceipt', '2025-11-10 09:15:00', 'GR-20251110-003'),
(23,1, 50,  'GoodsReceipt', '2025-11-15 11:20:00', 'GR-20251115-004'),
(30,1, 80,  'GoodsReceipt', '2025-11-15 11:20:00', 'GR-20251115-004'),
(45,1, 100, 'GoodsReceipt', '2025-11-20 13:45:00', 'GR-20251120-005');

-- 9. Đơn hàng mẫu + chi tiết + payment + shipment
INSERT INTO `order` 
(customer_id, order_date, status, subtotal, discount_amount, shipping_fee, grand_total, notes) VALUES
(101, '2025-11-20 15:30:00', 'Completed', 21998000, 500000, 0, 21498000, 'Khách VIP Gold'),
(102, '2025-11-21 10:15:00', 'Shipped',   12999000, 0,      30000, 13029000, NULL),
(103, '2025-11-22 19:45:00', 'Paid',      1599000,  0,      0,     1599000,  'Thanh toán online');

INSERT INTO order_line (order_id, line_no, product_id, quantity, unit_price_at_order, line_total) VALUES
(1,1,2,1,20499000,20499000),   -- PS5 Pro Digital
(1,2,45,1,5499000,5499000),    -- Tai nghe Pulse Explore
(2,1,14,1,12999000,12999000),  -- Switch 2 STD
(3,1,23,1,1599000,1599000);    -- FC26 PS5

INSERT INTO order_address 
(order_id, receiver_name, receiver_phone, line1, line2, district, city, postal_code) VALUES
(1, 'Trần Văn A', '0912345678', '123 Đường Lê Lợi', 'Ngõ 45', 'Quận 1', 'TP. Hồ Chí Minh', '700000'),
(2, 'Nguyễn Thị B', '0923456789', '56 Nguyễn Trãi', NULL, 'Thanh Xuân', 'Hà Nội', '100000'),
(3, 'Lê Hoàng C', '0934567890', '789 Trần Hưng Đạo', 'Tầng 5', 'Quận 5', 'TP. Hồ Chí Minh', '700000');

INSERT INTO payment (order_id, method, amount, paid_at, status) VALUES
(1, 'BankTransfer', 21498000, '2025-11-20 15:45:00', 'Captured'),
(2, 'COD',         13029000, NULL,            'Pending'),
(3, 'Momo',        1599000,  '2025-11-22 19:50:00', 'Captured');

INSERT INTO shipment (order_id, carrier, tracking_no, estimated_delivery, shipped_at, delivered_at, status) VALUES
(1, 'Giao Hàng Nhanh', 'GHN123456789', '2025-11-23 00:00:00', '2025-11-21 10:00:00', '2025-11-22 14:30:00', 'Delivered'),
(2, 'Giao Hàng Tiết Kiệm', 'GHTK987654321', '2025-11-25 00:00:00', '2025-11-22 09:00:00', NULL, 'Shipped'),
(3, 'Ninja Van', 'NVN1122334455', '2025-11-24 00:00:00', NULL, NULL, 'Ready');

-- 10. Review mẫu
INSERT INTO product_review (product_id, party_id, rating, comment, created_at, visibility_status) VALUES
(2, 101, 5, 'Máy PS5 Pro chạy cực mượt, đồ họa đẹp long lanh, đáng tiền từng đồng!', '2025-11-23 10:15:00', 'Visible'),
(14,102, 4, 'Switch 2 rất đáng nâng cấp, màn hình lớn hơn, Joy-Con nam châm tiện lắm.', '2025-11-22 18:30:00', 'Visible');

-- 11. Goods Receipt mẫu (phiếu nhập kho)
INSERT INTO goods_receipt (supplier_id, receipt_date, invoice_number, total_cost, notes) VALUES
(1, '2025-11-01 10:00:00', 'INV-SONY-20251101', 1500000000, 'Nhập PS5 Pro + Slim');

INSERT INTO goods_receipt_line (receipt_id, line_no, product_id, warehouse_id, quantity_received, unit_cost) VALUES
(1,1,1,1,5,140000000),
(1,2,2,1,15,38000000);

-- Dữ liệu mẫu đã có từ trước:
-- product_review có 2 dòng:
-- review_id = 1 → PS5 Pro Digital (product_id=2) – khách Trần Văn A (party_id=101)
-- review_id = 2 → Switch 2 STD (product_id=14) – khách Nguyễn Thị B (party_id=102)

-- 1. review_reply (phản hồi cho review)
INSERT INTO review_reply (review_id, party_id, comment, created_at, is_from_staff) VALUES
-- Nhân viên hỗ trợ trả lời review PS5 Pro
(1, 3, 'Cảm ơn anh A đã tin tưởng Shop Game! Chúc anh trải nghiệm game 4K/120fps thật đã với PS5 Pro nhé ', '2025-11-23 11:20:00', TRUE),

-- Khách trả lời lại nhân viên
(1, 101, 'Cảm ơn em tư vấn nhiệt tình, máy chạy mát và êm ru luôn!', '2025-11-23 12:05:00', FALSE),

-- Nhân viên kho trả lời review Switch 2
(2, 4, 'Chào chị B! Joy-Con nam châm là điểm nâng cấp lớn nhất của Switch 2, chị dùng lâu sẽ thấy rất tiện ạ. Có gì cần hỗ trợ cứ nhắn shop nhé!', '2025-11-22 19:10:00', TRUE),

-- Một khách khác (không phải chủ review) bình luận thêm vào review Switch 2
(2, 103, 'Mình cũng đang cân nhắc lên Switch 2, nghe bảo chơi được cả game cũ luôn hả shop?', '2025-11-23 09:30:00', FALSE),

-- Nhân viên trả lời tiếp câu hỏi của khách 103
(2, 3, 'Dạ đúng ạ anh! Switch 2 tương thích ngược 100% toàn bộ game cartridge + digital của Switch 1 luôn ạ', '2025-11-23 10:00:00', TRUE);


-- 2. review_edit_history (lịch sử chỉnh sửa review)
-- Giả sử khách Trần Văn A sửa lại review PS5 Pro 1 lần
INSERT INTO review_edit_history 
(review_id, edited_by_party_id, old_rating, old_comment, new_rating, new_comment, edited_at, change_note) 
VALUES
(1, 101, 5, 
 'Máy PS5 Pro chạy cực mượt, đồ họa đẹp long lanh, đáng tiền từng đồng!', 
 5, 
 'Máy PS5 Pro chạy cực mượt, đồ họa đẹp long lanh, đáng tiền từng đồng! Đặc biệt Ray Tracing + 120fps quá đỉnh!',
 '2025-11-23 14:45:00', 'Thêm cảm nhận về Ray Tracing và 120fps'
);


-- 3. review_moderation (duyệt review)
INSERT INTO review_moderation 
(review_id, moderator_party_id, status, reason_code, notes, created_at, decided_at) 
VALUES
-- Review PS5 Pro được duyệt ngay
(1, 1, 'Approved', NULL, 'Nội dung tích cực, không vi phạm', '2025-11-23 10:30:00', '2025-11-23 10:35:00'),

-- Review Switch 2 ban đầu bị Pending vì nhân viên kho muốn kiểm tra lại
(2, 2, 'Approved', NULL, 'Review hợp lệ, đã trả lời khách đầy đủ', '2025-11-22 18:45:00', '2025-11-22 19:00:00');

-- Thêm 1 review bị từ chối để test (giả lập)
-- Tạo review bị từ chối trước
INSERT INTO product_review (product_id, party_id, rating, comment, created_at, visibility_status) 
VALUES (4, 103, 1, 'Máy giao thiếu hộp, không có bảo hành chính hãng!!!', '2025-11-21 08:10:00', 'Hidden');

-- Lấy review_id mới nhất (giả sử là 3)
INSERT INTO review_moderation 
(review_id, moderator_party_id, status, reason_code, notes, created_at, decided_at) 
VALUES
(3, 1, 'Rejected', 'FALSE_INFO', 'Khách nhầm lẫn, đơn hàng này là hàng cũ đã ghi rõ trên web. Đã liên hệ giải thích và hoàn tiền thiện chí.', '2025-11-21 09:00:00', '2025-11-21 09:30:00');