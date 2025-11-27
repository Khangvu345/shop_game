-- =====================================================
-- Migration: Update Order Schema
-- Description: Cập nhật enum status và thêm payment fields
-- Date: 2025-11-27
-- =====================================================

USE shop_game;

-- 1. Sửa enum status (đồng bộ với code OrderStatus.java)
-- Thay đổi từ: 'Draft', 'Confirmed', 'Paid', 'Shipped', 'Completed', 'Cancelled'
-- Sang: 'PENDING', 'CONFIRMED', 'PREPARING', 'SHIPPED', 'DELIVERED', 'COMPLETED', 'CANCELLED', 'RETURNED'
ALTER TABLE `order`
MODIFY COLUMN status ENUM(
    'PENDING',
    'CONFIRMED',
    'PREPARING',
    'SHIPPED',
    'DELIVERED',
    'COMPLETED',
    'CANCELLED',
    'RETURNED'
) NOT NULL DEFAULT 'PENDING';

-- 2. Thêm payment_method
-- COD: Cash on Delivery
-- VNPAY: Cổng thanh toán VNPay
ALTER TABLE `order`
ADD COLUMN payment_method ENUM('COD', 'VNPAY') NOT NULL DEFAULT 'COD'
COMMENT 'Phương thức thanh toán';

-- 3. Thêm payment_status
-- PENDING: Chờ thanh toán (VNPay)
-- PAID: Đã thanh toán (VNPay)
-- COD_PENDING: Chờ thu tiền (COD)
-- COD_COLLECTED: Đã thu tiền (COD)
-- FAILED: Thanh toán thất bại
-- REFUNDED: Đã hoàn tiền
ALTER TABLE `order`
ADD COLUMN payment_status ENUM(
    'PENDING',
    'PAID',
    'COD_PENDING',
    'COD_COLLECTED',
    'FAILED',
    'REFUNDED'
) NOT NULL DEFAULT 'PENDING'
COMMENT 'Trạng thái thanh toán';

-- 4. Đảm bảo các columns khác tồn tại
-- discount_amount: Giảm giá toàn đơn hàng
-- tax_amount: Thuế (nếu có)
-- Nếu chưa có thì thêm, nếu có rồi thì giữ nguyên

-- Kiểm tra và thêm discount_amount nếu chưa có
SET @col_exists = (
    SELECT COUNT(*)
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = 'shop_game'
    AND TABLE_NAME = 'order'
    AND COLUMN_NAME = 'discount_amount'
);

SET @sql = IF(@col_exists = 0,
    'ALTER TABLE `order` ADD COLUMN discount_amount DECIMAL(12,2) DEFAULT 0 COMMENT "Giảm giá toàn đơn hàng"',
    'SELECT "discount_amount already exists" AS message'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Kiểm tra và thêm tax_amount nếu chưa có
SET @col_exists = (
    SELECT COUNT(*)
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = 'shop_game'
    AND TABLE_NAME = 'order'
    AND COLUMN_NAME = 'tax_amount'
);

SET @sql = IF(@col_exists = 0,
    'ALTER TABLE `order` ADD COLUMN tax_amount DECIMAL(12,2) DEFAULT 0 COMMENT "Thuế (VAT, nếu có)"',
    'SELECT "tax_amount already exists" AS message'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 5. Khởi tạo giá trị mặc định cho các đơn hàng cũ
UPDATE `order`
SET payment_method = 'COD'
WHERE payment_method IS NULL;

UPDATE `order`
SET payment_status = 'COD_PENDING'
WHERE payment_status IS NULL AND payment_method = 'COD';

UPDATE `order`
SET discount_amount = 0
WHERE discount_amount IS NULL;

UPDATE `order`
SET tax_amount = 0
WHERE tax_amount IS NULL;

-- Verify changes
SELECT
    order_id,
    customer_id,
    status,
    payment_method,
    payment_status,
    grand_total,
    discount_amount,
    tax_amount
FROM `order`
LIMIT 5;
