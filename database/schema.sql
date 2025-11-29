USE shop_game;

SET FOREIGN_KEY_CHECKS = 0;

-- PARTY & USER MANAGEMENT

CREATE TABLE party (
    party_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE,
    phone VARCHAR(30),
    birth_date DATE,
    note TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE customer (
    party_id BIGINT PRIMARY KEY,
    tier VARCHAR(30),
    points INT DEFAULT 0,
    FOREIGN KEY (party_id) REFERENCES party(party_id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE employee (
    party_id BIGINT PRIMARY KEY,
    employee_code VARCHAR(50) NOT NULL UNIQUE,
    hire_date DATE,
    status VARCHAR(30),
    FOREIGN KEY (party_id) REFERENCES party(party_id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE role (
    role_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    role_name VARCHAR(50) NOT NULL UNIQUE
) ENGINE=InnoDB;

CREATE TABLE employee_role (
    party_id BIGINT,
    role_id BIGINT,
    PRIMARY KEY (party_id, role_id),
    FOREIGN KEY (party_id) REFERENCES employee(party_id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES role(role_id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE address (
    address_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    party_id BIGINT NOT NULL,
    line1 VARCHAR(200) NOT NULL,
    line2 VARCHAR(200),
    ward VARCHAR(100),
    district VARCHAR(100),
    city VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20),
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (party_id) REFERENCES party(party_id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE account (
    account_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    party_id BIGINT NOT NULL,
    username VARCHAR(100) UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('ADMIN', 'CUSTOMER') NOT NULL,
    account_status ENUM('Active', 'Locked', 'Suspended') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP,
    FOREIGN KEY (party_id) REFERENCES party(party_id) ON DELETE CASCADE,
    INDEX idx_username (username)
    INDEX idx_role (role)
) ENGINE=InnoDB;

-- PRODUCT MANAGEMENT

CREATE TABLE category (
    category_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    category_name VARCHAR(120) NOT NULL,
    description TEXT,
    parent_id BIGINT,
    FOREIGN KEY (parent_id) REFERENCES category(category_id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE product (
    product_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    sku VARCHAR(100) UNIQUE,
    product_name VARCHAR(200) NOT NULL,
    description TEXT,
    list_price DECIMAL(10,0) NOT NULL, -- Mệnh giá VNĐ 
    stock_quantity INT DEFAULT 0 NOT NULL,-- Số lượng tồn kho
    purchase_price DECIMAL(10,0) DEFAULT 0, -- Giá mua vào VNĐ
    status ENUM('Active', 'Inactive') DEFAULT 'Active',
    category_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES category(category_id) ON DELETE RESTRICT,
    INDEX idx_product_name (product_name)
) ENGINE=InnoDB;

CREATE TABLE supplier (
    supplier_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(200) NOT NULL,
    contact_email VARCHAR(150),
    contact_phone VARCHAR(50)
) ENGINE=InnoDB;

CREATE TABLE product_supplier (
    product_id BIGINT,
    supplier_id BIGINT,
    PRIMARY KEY (product_id, supplier_id),
    FOREIGN KEY (product_id) REFERENCES product(product_id) ON DELETE CASCADE,
    FOREIGN KEY (supplier_id) REFERENCES supplier(supplier_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- PRODUCT REVIEW SYSTEM

CREATE TABLE product_review (
    review_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    product_id BIGINT NOT NULL,
    party_id BIGINT NOT NULL,
    rating TINYINT NOT NULL CHECK (rating BETWEEN 1 AND 5), 
    comment TEXT,
    created_at DATETIME NOT NULL,
    last_edited_at DATETIME,
    visibility_status ENUM('Visible', 'Hidden') DEFAULT 'Hidden',
    FOREIGN KEY (product_id) REFERENCES product(product_id) ON DELETE CASCADE,
    FOREIGN KEY (party_id) REFERENCES party(party_id) ON DELETE CASCADE,
    UNIQUE KEY uq_user_review (product_id, party_id)
) ENGINE=InnoDB;

CREATE TABLE review_reply (
    reply_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    review_id BIGINT NOT NULL,
    party_id BIGINT NOT NULL,
    comment TEXT NOT NULL,
    created_at DATETIME NOT NULL,
    is_from_staff BOOLEAN,
    FOREIGN KEY (review_id) REFERENCES product_review(review_id) ON DELETE CASCADE,
    FOREIGN KEY (party_id) REFERENCES party(party_id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE review_edit_history (
    edit_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    review_id BIGINT NOT NULL,
    edited_by_party_id BIGINT NOT NULL,
    old_rating TINYINT,
    old_comment TEXT,
    new_rating TINYINT,
    new_comment TEXT,
    edited_at DATETIME NOT NULL,
    change_note VARCHAR(200),
    FOREIGN KEY (review_id) REFERENCES product_review(review_id) ON DELETE CASCADE,
    FOREIGN KEY (edited_by_party_id) REFERENCES party(party_id) ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE review_moderation (
    moderation_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    review_id BIGINT NOT NULL,
    moderator_party_id BIGINT NOT NULL,
    status ENUM('Pending', 'Approved', 'Rejected', 'Hidden') NOT NULL,
    reason_code VARCHAR(50),
    notes TEXT,
    created_at DATETIME NOT NULL,
    decided_at DATETIME,
    FOREIGN KEY (review_id) REFERENCES product_review(review_id) ON DELETE CASCADE,
    FOREIGN KEY (moderator_party_id) REFERENCES party(party_id) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- ORDER MANAGEMENT

CREATE TABLE `order` (
    order_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    customer_id BIGINT NOT NULL,
    order_date DATETIME NOT NULL,
    status ENUM('PENDING','CONFIRMED','PREPARING','SHIPPED','DELIVERED','COMPLETED','CANCELLED','RETURNED') NOT NULL DEFAULT 'PENDING', -- Trạng thái đơn hàng mapping với backend
    payment_method ENUM ('COD', 'VNPAY') NOT NULL DEFAULT 'COD', -- Giữ lại 2 phương thức thanh toán hiện có
    payment_status ENUM('PENDING', 'PAID', 'COD_PENDING', 'COD_COLLECTED', 'FAILED', 'REFUNDED') NOT NULL DEFAULT 'PENDING', -- Trạng thái thanh toán
-- PENDING: Chờ thanh toán (VNPay)
-- PAID: Đã thanh toán (VNPay)
-- COD_PENDING: Chờ thu tiền (COD)
-- COD_COLLECTED: Đã thu tiền (COD)
-- FAILED: Thanh toán thất bại
-- REFUNDED: Đã hoàn tiền
    subtotal DECIMAL(12,2) NOT NULL,
    discount_amount DECIMAL(12,2) DEFAULT 0,
    tax_amount DECIMAL(12,2) DEFAULT 0,
    grand_total DECIMAL(12,2) NOT NULL,
    notes TEXT,
    -- Thêm mới các trường sau:
    cancelled_at DATETIME,
    cancel_reason VARCHAR(500),
    cancelled_by VARCHAR(50),
    -- HẾT thêm mới các trường
    FOREIGN KEY (customer_id) REFERENCES customer(party_id) ON DELETE RESTRICT,
    INDEX idx_order_date (order_date),
    INDEX idx_customer_date (customer_id, order_date),  
    INDEX idx_status_date (status, order_date)          
) ENGINE=InnoDB;

CREATE TABLE order_line (
    order_id BIGINT,
    line_no INT,
    product_id BIGINT NOT NULL,
    quantity INT NOT NULL, -- kết thúc sửa
    unit_price_at_order DECIMAL(12,2) NOT NULL,
    line_total DECIMAL(12,2) NOT NULL,
    PRIMARY KEY (order_id, line_no),
    FOREIGN KEY (order_id) REFERENCES `order`(order_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES product(product_id) ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE order_address (
    order_id BIGINT PRIMARY KEY,  
    receiver_name VARCHAR(150) NOT NULL,
    receiver_phone VARCHAR(30) NOT NULL,
    line1 VARCHAR(200) NOT NULL,
    line2 VARCHAR(200),
    district VARCHAR(100),
    city VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20),
    FOREIGN KEY (order_id) REFERENCES `order`(order_id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE payment (
    payment_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    order_id BIGINT NOT NULL,
    method VARCHAR(50) NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    paid_at DATETIME,
    status ENUM('Pending', 'Authorized', 'Captured', 'Failed', 'Refunded') NOT NULL,
    FOREIGN KEY (order_id) REFERENCES `order`(order_id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE shipment (
    shipment_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    order_id BIGINT NOT NULL,
    carrier VARCHAR(100),
    tracking_no VARCHAR(120),
    estimated_delivery DATETIME,
    shipped_at DATETIME,
    delivered_at DATETIME,
    status ENUM('Ready', 'Shipped', 'Delivered', 'Returned') NOT NULL,
    FOREIGN KEY (order_id) REFERENCES `order`(order_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- INVENTORY MANAGEMENT

CREATE TABLE warehouse (
    warehouse_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(120) NOT NULL,
    address_text VARCHAR(255)
) ENGINE=InnoDB;

CREATE TABLE stock_movement (
    movement_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    product_id BIGINT NOT NULL,
    warehouse_id BIGINT NOT NULL,
    quantity_delta INT NOT NULL,
    reason ENUM('GoodsReceipt', 'Sale', 'Return', 'DamagedAdjustment', 'StocktakeAdjustment', 'ManualAdjustment') NOT NULL,
    occurred_at DATETIME NOT NULL,
    reference_no VARCHAR(120),
    order_id BIGINT,
    FOREIGN KEY (product_id) REFERENCES product(product_id) ON DELETE CASCADE,
    FOREIGN KEY (warehouse_id) REFERENCES warehouse(warehouse_id) ON DELETE RESTRICT,
    FOREIGN KEY (order_id) REFERENCES `order`(order_id) ON DELETE SET NULL,
    INDEX idx_product_time (product_id, occurred_at)
) ENGINE=InnoDB;

CREATE TABLE goods_receipt (
    receipt_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    supplier_id BIGINT,
    receipt_date DATETIME NOT NULL,
    invoice_number VARCHAR(120),
    total_cost DECIMAL(12,2),
    notes TEXT,
    FOREIGN KEY (supplier_id) REFERENCES supplier(supplier_id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE goods_receipt_line (
    receipt_id BIGINT,
    line_no INT,
    product_id BIGINT NOT NULL,
    warehouse_id BIGINT NOT NULL,
    quantity_received INT NOT NULL,
    unit_cost DECIMAL(12,2),
    PRIMARY KEY (receipt_id, line_no),
    FOREIGN KEY (receipt_id) REFERENCES goods_receipt(receipt_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES product(product_id) ON DELETE RESTRICT,
    FOREIGN KEY (warehouse_id) REFERENCES warehouse(warehouse_id) ON DELETE RESTRICT
) ENGINE=InnoDB;

SET FOREIGN_KEY_CHECKS = 1;
