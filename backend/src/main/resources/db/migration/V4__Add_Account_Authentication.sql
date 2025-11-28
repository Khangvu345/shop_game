-- =====================================================
-- Migration V4: Add Account Authentication
-- Description: Sửa bảng account và liên kết với customer
-- WARNING: Password plain text - CHỈ ĐỂ TEST!
-- =====================================================

-- Bảng account đã tồn tại, chỉ cần thêm các trường cần thiết
-- Uncomment nếu bảng chưa có các trường này

/*
-- Thêm các trường nếu chưa có
ALTER TABLE account
ADD COLUMN IF NOT EXISTS role ENUM('ADMIN', 'CUSTOMER') NOT NULL DEFAULT 'CUSTOMER',
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- Thêm indexes
CREATE INDEX IF NOT EXISTS idx_username ON account(username);
CREATE INDEX IF NOT EXISTS idx_email ON account(email);
CREATE INDEX IF NOT EXISTS idx_role ON account(role);
*/

-- Add account_id to customer table (optional link)
ALTER TABLE customer
ADD COLUMN account_id BIGINT NULL AFTER customer_id,
ADD CONSTRAINT fk_customer_account
    FOREIGN KEY (account_id) REFERENCES account(account_id)
    ON DELETE SET NULL;

-- Insert default admin account
-- Username: admin, Password: admin123
INSERT INTO account (username, password, email, full_name, role, is_active) VALUES
('admin', 'admin123', 'admin@gameshop.com', 'Administrator', 'ADMIN', TRUE)
ON DUPLICATE KEY UPDATE username = username;

-- Insert test customer account
-- Username: customer1, Password: pass123
INSERT INTO account (username, password, email, full_name, role, is_active) VALUES
('customer1', 'pass123', 'customer1@test.com', 'Test Customer 1', 'CUSTOMER', TRUE)
ON DUPLICATE KEY UPDATE username = username;
