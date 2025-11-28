-- =====================================================
-- Migration V4: Add User Authentication
-- Description: Thêm bảng user và liên kết với customer
-- WARNING: Password plain text - CHỈ ĐỂ TEST!
-- =====================================================

-- Create user table
CREATE TABLE user (
    user_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL COMMENT 'Plain text - CHỈ TEST! Production cần BCrypt',
    email VARCHAR(100) UNIQUE NOT NULL,
    full_name VARCHAR(150),
    role ENUM('ADMIN', 'CUSTOMER') NOT NULL DEFAULT 'CUSTOMER',
    is_active BOOLEAN DEFAULT TRUE COMMENT 'Tài khoản có active không',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add user_id to customer table (optional link)
ALTER TABLE customer
ADD COLUMN user_id BIGINT NULL AFTER customer_id,
ADD CONSTRAINT fk_customer_user
    FOREIGN KEY (user_id) REFERENCES user(user_id)
    ON DELETE SET NULL;

-- Insert default admin user
-- Username: admin, Password: admin123
INSERT INTO user (username, password, email, full_name, role, is_active) VALUES
('admin', 'admin123', 'admin@gameshop.com', 'Administrator', 'ADMIN', TRUE);

-- Insert test customer user
-- Username: customer1, Password: pass123
INSERT INTO user (username, password, email, full_name, role, is_active) VALUES
('customer1', 'pass123', 'customer1@test.com', 'Test Customer 1', 'CUSTOMER', TRUE);
