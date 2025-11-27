-- =====================================================
-- Migration: Update order_line Schema
-- Description: Bỏ line_discount (chỉ dùng discount toàn đơn hàng)
-- Date: 2025-11-27
-- =====================================================

USE shop_game;

-- Kiểm tra xem column line_discount có tồn tại không
SET @col_exists = (
    SELECT COUNT(*)
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = 'shop_game'
    AND TABLE_NAME = 'order_line'
    AND COLUMN_NAME = 'line_discount'
);

-- Chỉ drop nếu column tồn tại
SET @sql = IF(@col_exists > 0,
    'ALTER TABLE order_line DROP COLUMN line_discount',
    'SELECT "line_discount column does not exist" AS message'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Verify changes
SHOW COLUMNS FROM order_line;

-- Note: Hiện tại chỉ dùng discount_amount ở bảng order (discount toàn đơn)
-- Discount từng sản phẩm (line_discount) sẽ implement sau nếu cần
