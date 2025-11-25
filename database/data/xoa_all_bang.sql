USE shop_game;

SET FOREIGN_KEY_CHECKS = 0;  -- Tạm tắt kiểm tra ràng buộc để xóa thoải mái

TRUNCATE TABLE review_reply;
TRUNCATE TABLE review_edit_history;
TRUNCATE TABLE review_moderation;
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
TRUNCATE TABLE supplier;
TRUNCATE TABLE employee_role;
TRUNCATE TABLE role;
TRUNCATE TABLE account;
TRUNCATE TABLE address;
TRUNCATE TABLE employee;
TRUNCATE TABLE customer;
TRUNCATE TABLE party;
TRUNCATE TABLE warehouse;
TRUNCATE TABLE product;
TRUNCATE TABLE category;

SET FOREIGN_KEY_CHECKS = 1;  -- Bật lại kiểm tra ràng buộc

-- Thông báo hoàn tất (tùy chọn)
SELECT 'Đã xóa sạch dữ liệu của 24 bảng thành công! AUTO_INCREMENT cũng đã được reset về 1.' AS Ket_qua;