-- =====================================================
-- Migration: Update Product Schema
-- Description: Thêm stock_quantity và purchase_price vào bảng product
-- Date: 2025-11-27
-- =====================================================

USE shop_game;

-- Thêm stock_quantity (tồn kho hiện tại)
-- DEFAULT 0: Tất cả sản phẩm cũ sẽ có stock = 0
-- NOT NULL: Bắt buộc phải có giá trị
ALTER TABLE product
ADD COLUMN stock_quantity INT DEFAULT 0 NOT NULL
COMMENT 'Tồn kho hiện tại';

-- Thêm purchase_price (giá vốn bình quân gia quyền)
-- DEFAULT 0: Sản phẩm chưa nhập hàng sẽ có giá vốn = 0
-- Precision 10, scale 0: Mệnh giá VNĐ (không có phần thập phân)
ALTER TABLE product
ADD COLUMN purchase_price DECIMAL(10,0) DEFAULT 0
COMMENT 'Giá vốn bình quân gia quyền';

-- Khởi tạo stock_quantity cho các sản phẩm đã tồn tại
-- (Đảm bảo không có NULL values)
UPDATE product
SET stock_quantity = 0
WHERE stock_quantity IS NULL;

UPDATE product
SET purchase_price = 0
WHERE purchase_price IS NULL;

-- Verify changes
SELECT
    product_id,
    product_name,
    list_price,
    purchase_price,
    stock_quantity,
    status
FROM product
LIMIT 5;
