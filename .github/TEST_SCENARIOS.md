# 🧪 KỊCH BẢN KIỂM TRA HỆ THỐNG ADMIN DASHBOARD

Document này mô tả các kịch bản sử dụng thực tế để test hệ thống shop game.

---

## 📋 MỤC LỤC

1. [Setup Ban Đầu](#setup-ban-đầu)
2. [Kịch Bản 1: Nhập Hàng Từ Nhà Cung Cấp](#kịch-bản-1-nhập-hàng-từ-nhà-cung-cấp)
3. [Kịch Bản 2: Khách Hàng Đặt Hàng (COD)](#kịch-bản-2-khách-hàng-đặt-hàng-cod)
4. [Kịch Bản 3: Khách Hàng Hủy Đơn](#kịch-bản-3-khách-hàng-hủy-đơn)
5. [Kịch Bản 4: Admin Điều Chỉnh Tồn Kho Thủ Công](#kịch-bản-4-admin-điều-chỉnh-tồn-kho-thủ-công)
6. [Kịch Bản 5: Tính Doanh Thu & Lợi Nhuận](#kịch-bản-5-tính-doanh-thu--lợi-nhuận)
7. [Kịch Bản 6: Xử Lý Đơn Hàng VNPay](#kịch-bản-6-xử-lý-đơn-hàng-vnpay)
8. [Edge Cases Cần Test](#edge-cases-cần-test)

---

## 🔧 SETUP BAN ĐẦU

### 1. Chạy Database Migrations

```bash
mysql -u root -p shop_game < database/migrations/001_update_product_schema.sql
mysql -u root -p shop_game < database/migrations/002_update_order_schema.sql
mysql -u root -p shop_game < database/migrations/003_update_order_line_schema.sql
mysql -u root -p shop_game < database/migrations/004_seed_warehouse_and_admin.sql
```

### 2. Kiểm Tra Data Mặc Định

```sql
-- Kiểm tra warehouse
SELECT * FROM warehouse WHERE warehouse_id = 1;
-- Expected: ID=1, Name='Kho Chính'

-- Kiểm tra admin account
SELECT username, email_for_login FROM account WHERE username = 'admin';
-- Expected: admin / admin@shopgame.com

-- Kiểm tra products có stock_quantity và purchase_price
DESCRIBE product;
-- Expected: Có columns stock_quantity và purchase_price
```

### 3. Khởi Động Backend

```bash
cd backend
mvn spring-boot:run
```

### 4. Login Admin

```http
POST http://localhost:8080/api/v1/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}

# Response:
{
  "success": true,
  "data": {
    "token": "eyJhbGc...",
    "employee": {
      "id": 1,
      "fullName": "Administrator"
    }
  }
}
```

---

## 📦 KỊCH BẢN 1: NHẬP HÀNG TỪ NHÀ CUNG CẤP

### **Mô tả:**
Admin nhập 100 bản game "The Legend of Zelda" từ nhà cung cấp Nintendo với giá 150,000 VNĐ/bản.

### **Bước thực hiện:**

#### **1.1. Tạo Supplier (Nhà Cung Cấp)**

```http
POST http://localhost:8080/api/v1/admin/suppliers
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Nintendo Vietnam",
  "contactEmail": "contact@nintendo.vn",
  "contactPhone": "0912345678"
}

# Response Expected:
{
  "success": true,
  "data": {
    "supplierId": 1,
    "name": "Nintendo Vietnam",
    "contactEmail": "contact@nintendo.vn",
    "contactPhone": "0912345678"
  }
}
```

#### **1.2. Tạo Product (Sản Phẩm)**

```http
POST http://localhost:8080/api/v1/products
Authorization: Bearer {token}
Content-Type: application/json

{
  "sku": "ZELDA-001",
  "productName": "The Legend of Zelda: Breath of the Wild",
  "description": "Game phiêu lưu thế giới mở trên Nintendo Switch",
  "listPrice": 250000,
  "categoryId": 1,
  "status": "Active"
}

# Response Expected:
{
  "success": true,
  "data": {
    "productId": 1,
    "sku": "ZELDA-001",
    "productName": "The Legend of Zelda: Breath of the Wild",
    "listPrice": 250000,
    "purchasePrice": 0,        // Chưa nhập hàng
    "stockQuantity": 0,         // Chưa có hàng
    "status": "Active"
  }
}
```

#### **1.3. Tạo Phiếu Nhập Hàng (Goods Receipt)**

```http
POST http://localhost:8080/api/v1/admin/goods-receipts
Authorization: Bearer {token}
Content-Type: application/json

{
  "supplierId": 1,
  "receiptDate": "2025-11-27T10:00:00",
  "invoiceNumber": "INV-NIN-2025-001",
  "notes": "Đợt nhập hàng tháng 11",
  "items": [
    {
      "productId": 1,
      "warehouseId": 1,
      "quantityReceived": 100,
      "unitCost": 150000
    }
  ]
}

# Response Expected:
{
  "success": true,
  "data": {
    "receiptId": 1,
    "supplierId": 1,
    "supplierName": "Nintendo Vietnam",
    "receiptDate": "2025-11-27T10:00:00",
    "invoiceNumber": "INV-NIN-2025-001",
    "totalCost": 15000000,
    "items": [
      {
        "productId": 1,
        "productName": "The Legend of Zelda: Breath of the Wild",
        "quantityReceived": 100,
        "unitCost": 150000
      }
    ]
  }
}
```

#### **1.4. Kiểm Tra Kết Quả**

```sql
-- Kiểm tra Product đã cập nhật stock và purchase_price
SELECT product_id, product_name, stock_quantity, purchase_price, list_price
FROM product
WHERE product_id = 1;
-- Expected:
-- stock_quantity = 100
-- purchase_price = 150000 (weighted average)
-- list_price = 250000

-- Kiểm tra Stock Movement đã được tạo
SELECT * FROM stock_movement
WHERE product_id = 1 AND reason = 'GoodsReceipt';
-- Expected: 1 record với quantity_delta = +100

-- Kiểm tra GoodsReceiptLine
SELECT * FROM goods_receipt_line
WHERE receipt_id = 1;
-- Expected: 1 record với quantity_received = 100, unit_cost = 150000
```

### **❓ Điểm Cần Kiểm Tra:**

- ✅ Product.stockQuantity tăng từ 0 → 100
- ✅ Product.purchasePrice = 150,000 (weighted average)
- ✅ StockMovement record được tạo với reason='GoodsReceipt', quantity_delta=+100
- ✅ GoodsReceipt và GoodsReceiptLine được lưu đúng
- ✅ Warehouse ID = 1 được sử dụng

---

## 🛒 KỊCH BẢN 2: KHÁCH HÀNG ĐẶT HÀNG (COD)

### **Mô tả:**
Khách hàng Nguyễn Văn A đặt mua 3 bản game Zelda với phương thức COD.

### **Bước thực hiện:**

#### **2.1. Tạo Customer**

```http
POST http://localhost:8080/api/v1/admin/customers
Authorization: Bearer {token}
Content-Type: application/json

{
  "fullName": "Nguyễn Văn A",
  "email": "nguyenvana@gmail.com",
  "phone": "0987654321",
  "tier": "Bronze",
  "points": 0
}

# Response Expected:
{
  "success": true,
  "data": {
    "customerId": 1,
    "fullName": "Nguyễn Văn A",
    "email": "nguyenvana@gmail.com",
    "tier": "Bronze",
    "points": 0
  }
}
```

#### **2.2. Tạo Order**

```http
POST http://localhost:8080/api/v1/orders
Content-Type: application/json

{
  "customerId": 1,
  "paymentMethod": "COD",
  "address": {
    "recipientName": "Nguyễn Văn A",
    "phone": "0987654321",
    "street": "123 Đường Lê Lợi",
    "ward": "Phường Bến Nghé",
    "district": "Quận 1",
    "city": "Hồ Chí Minh"
  },
  "items": [
    {
      "productId": 1,
      "quantity": 3
    }
  ]
}

# Response Expected:
{
  "success": true,
  "data": {
    "orderId": 1,
    "message": "Đặt hàng thành công!"
  }
}
```

#### **2.3. Kiểm Tra Order Detail**

```http
GET http://localhost:8080/api/v1/orders/1

# Response Expected:
{
  "success": true,
  "data": {
    "orderId": 1,
    "customerId": 1,
    "customerName": "Nguyễn Văn A",
    "status": "PENDING",
    "paymentStatus": "COD_PENDING",
    "paymentMethod": "COD",
    "subTotal": 750000,
    "grandTotal": 750000,
    "discountAmount": 0,
    "taxAmount": 0,
    "items": [
      {
        "productId": 1,
        "productName": "The Legend of Zelda: Breath of the Wild",
        "quantity": 3,
        "price": 250000,
        "lineTotal": 750000
      }
    ],
    "shippingAddress": {
      "recipientName": "Nguyễn Văn A",
      "phone": "0987654321",
      "street": "123 Đường Lê Lợi",
      "city": "Hồ Chí Minh"
    }
  }
}
```

#### **2.4. Kiểm Tra Kết Quả**

```sql
-- Kiểm tra Product stock đã giảm
SELECT product_id, product_name, stock_quantity
FROM product
WHERE product_id = 1;
-- Expected: stock_quantity = 97 (100 - 3)

-- Kiểm tra Stock Movement
SELECT * FROM stock_movement
WHERE product_id = 1 AND reason = 'Sale';
-- Expected: 1 record với quantity_delta = -3, order_id = 1

-- Kiểm tra Order
SELECT * FROM `order` WHERE order_id = 1;
-- Expected:
-- status = 'PENDING'
-- payment_method = 'COD'
-- payment_status = 'COD_PENDING'
-- grand_total = 750000

-- Kiểm tra OrderLine
SELECT * FROM order_line WHERE order_id = 1;
-- Expected: 1 record với:
-- Composite PK (order_id=1, line_no=1)
-- quantity = 3
-- unit_price_at_order = 250000
-- line_total = 750000

-- Kiểm tra OrderAddress
SELECT * FROM order_address WHERE order_id = 1;
-- Expected: 1 record với:
-- PK = order_id = 1 (Shared PK)
-- receiver_name = 'Nguyễn Văn A'
```

### **❓ Điểm Cần Kiểm Tra:**

- ✅ Product.stockQuantity giảm từ 100 → 97
- ✅ StockMovement record với reason='Sale', quantity_delta=-3
- ✅ Order được tạo với status='PENDING', payment_status='COD_PENDING'
- ✅ OrderLine có composite PK (order_id, line_no) đúng
- ✅ OrderAddress có shared PK với Order
- ✅ Price được snapshot tại thời điểm đặt hàng (250,000)

---

## ❌ KỊCH BẢN 3: KHÁCH HÀNG HỦY ĐƠN

### **Mô tả:**
Khách hàng Nguyễn Văn A hủy đơn hàng vì lý do "Đổi ý".

### **Bước thực hiện:**

#### **3.1. Hủy Order**

```http
POST http://localhost:8080/api/v1/orders/1/cancel
Authorization: Bearer {token}
Content-Type: application/json

{
  "reason": "Khách hàng đổi ý",
  "cancelledBy": "Customer"
}

# Response Expected:
{
  "success": true,
  "data": {
    "orderId": 1,
    "status": "CANCELLED",
    "cancelledAt": "2025-11-27T14:30:00",
    "cancelReason": "Khách hàng đổi ý",
    "cancelledBy": "Customer"
  }
}
```

#### **3.2. Kiểm Tra Kết Quả**

```sql
-- Kiểm tra Product stock đã hoàn lại
SELECT product_id, product_name, stock_quantity
FROM product
WHERE product_id = 1;
-- Expected: stock_quantity = 100 (97 + 3)

-- Kiểm tra Stock Movement hoàn hàng
SELECT * FROM stock_movement
WHERE product_id = 1 AND reason = 'Return';
-- Expected: 1 record với quantity_delta = +3, order_id = 1

-- Kiểm tra Order đã cancelled
SELECT status, cancelled_at, cancel_reason, cancelled_by
FROM `order`
WHERE order_id = 1;
-- Expected:
-- status = 'CANCELLED'
-- cancelled_at = NOT NULL
-- cancel_reason = 'Khách hàng đổi ý'
-- cancelled_by = 'Customer'
```

### **❓ Điểm Cần Kiểm Tra:**

- ✅ Product.stockQuantity tăng lại từ 97 → 100 (hoàn hàng)
- ✅ StockMovement record mới với reason='Return', quantity_delta=+3
- ✅ Order.status = 'CANCELLED'
- ✅ Order.cancelledAt, cancelReason, cancelledBy được lưu đúng

---

## 🔧 KỊCH BẢN 4: ADMIN ĐIỀU CHỈNH TỒN KHO THỦ CÔNG

### **Mô tả:**
Admin phát hiện 5 bản game Zelda bị hỏng, cần trừ bớt stock.

### **Bước thực hiện:**

#### **4.1. Điều Chỉnh Stock**

```http
POST http://localhost:8080/api/v1/admin/stock-movements/adjust
Authorization: Bearer {token}
Content-Type: application/json

{
  "productId": 1,
  "warehouseId": 1,
  "quantityDelta": -5,
  "reason": "DamagedAdjustment",
  "referenceNo": "DAMAGE-001",
  "notes": "5 bản bị hỏng do bao bì ẩm"
}

# Response Expected:
{
  "success": true,
  "data": {
    "movementId": 3,
    "productId": 1,
    "quantityDelta": -5,
    "reason": "DamagedAdjustment",
    "currentStock": 95,
    "occurredAt": "2025-11-27T15:00:00"
  }
}
```

#### **4.2. Kiểm Tra Kết Quả**

```sql
-- Kiểm tra Product stock
SELECT product_id, product_name, stock_quantity
FROM product
WHERE product_id = 1;
-- Expected: stock_quantity = 95

-- Kiểm tra Stock Movement
SELECT * FROM stock_movement
WHERE product_id = 1 AND reason = 'DamagedAdjustment';
-- Expected: 1 record với quantity_delta = -5
```

### **❓ Điểm Cần Kiểm Tra:**

- ✅ Admin có thể điều chỉnh stock thủ công
- ✅ StockMovement được tạo với reason='DamagedAdjustment'
- ✅ Product.stockQuantity cập nhật đúng
- ✅ Có tracking đầy đủ (ai, khi nào, lý do gì)

---

## 💰 KỊCH BẢN 5: TÍNH DOANH THU & LỢI NHUẬN

### **Mô tả:**
Admin xem báo cáo doanh thu và lợi nhuận.

### **Bước thực hiện:**

#### **5.1. Tạo Thêm Đơn Hàng Hoàn Thành**

```http
# Tạo đơn 2: Khách B mua 10 bản
POST http://localhost:8080/api/v1/orders
{
  "customerId": 2,
  "paymentMethod": "COD",
  "items": [{"productId": 1, "quantity": 10}]
}

# Cập nhật trạng thái đơn 2
PUT http://localhost:8080/api/v1/orders/2/status
{
  "status": "COMPLETED"
}

PUT http://localhost:8080/api/v1/orders/2/payment-status
{
  "paymentStatus": "COD_COLLECTED"
}
```

#### **5.2. Xem Dashboard Overview**

```http
GET http://localhost:8080/api/v1/admin/dashboard/overview
Authorization: Bearer {token}

# Response Expected:
{
  "success": true,
  "data": {
    "totalRevenue": 2500000,      // 10 * 250,000
    "totalProfit": 1000000,       // (250,000 - 150,000) * 10
    "totalOrders": 2,
    "completedOrders": 1,
    "pendingOrders": 0,
    "cancelledOrders": 1,
    "totalCustomers": 2,
    "lowStockProducts": 0
  }
}
```

#### **5.3. Công Thức Tính:**

```
Doanh Thu (Revenue) = Tổng giá bán
= 10 * 250,000 = 2,500,000 VNĐ

Giá Vốn (Cost) = Tổng giá nhập
= 10 * 150,000 = 1,500,000 VNĐ

Lợi Nhuận (Profit) = Revenue - Cost
= 2,500,000 - 1,500,000 = 1,000,000 VNĐ

Tỷ Suất Lợi Nhuận (Margin) = Profit / Revenue
= 1,000,000 / 2,500,000 = 40%
```

### **❓ Điểm Cần Kiểm Tra:**

- ✅ Tính revenue đúng từ completed orders
- ✅ Tính profit = (listPrice - purchasePrice) * quantity
- ✅ Không tính đơn hàng CANCELLED vào doanh thu
- ✅ Chỉ tính đơn COMPLETED hoặc DELIVERED

---

## 💳 KỊCH BẢN 6: XỬ LÝ ĐƠN HÀNG VNPAY

### **Mô tả:**
Khách hàng C đặt hàng và thanh toán qua VNPay.

### **Bước thực hiện:**

#### **6.1. Tạo Order VNPay**

```http
POST http://localhost:8080/api/v1/orders
{
  "customerId": 3,
  "paymentMethod": "VNPAY",
  "items": [{"productId": 1, "quantity": 2}]
}

# Response:
{
  "orderId": 3,
  "status": "PENDING",
  "paymentStatus": "PENDING",
  "paymentMethod": "VNPAY"
}
```

#### **6.2. Cập Nhật Payment Status (sau khi thanh toán)**

```http
PUT http://localhost:8080/api/v1/orders/3/payment-status
{
  "paymentStatus": "PAID"
}
```

#### **6.3. Admin Xác Nhận Đơn**

```http
PUT http://localhost:8080/api/v1/orders/3/status
{
  "status": "CONFIRMED"
}

# ✅ Success vì đã PAID trước

# ❌ Nếu chưa PAID:
# Error: "Đơn hàng VNPay phải thanh toán trước khi xử lý!"
```

### **❓ Điểm Cần Kiểm Tra:**

- ✅ VNPay orders phải PAID trước khi chuyển sang CONFIRMED/PREPARING/SHIPPED
- ✅ COD orders không có ràng buộc này
- ✅ Payment workflow đúng

---

## ⚠️ EDGE CASES CẦN TEST

### **1. Không Đủ Hàng Trong Kho**

```http
POST http://localhost:8080/api/v1/orders
{
  "customerId": 1,
  "items": [{"productId": 1, "quantity": 200}]
}

# Expected Error:
{
  "success": false,
  "error": "Sản phẩm The Legend of Zelda không đủ hàng! (Tồn kho: 95, Yêu cầu: 200)"
}
```

### **2. Hủy Đơn Đã SHIPPED**

```http
POST http://localhost:8080/api/v1/orders/3/cancel

# Expected Error:
{
  "success": false,
  "error": "Không thể hủy đơn hàng đã giao hoặc đang giao!"
}
```

### **3. Nhập Hàng Lần 2 - Weighted Average Cost**

```http
# Nhập thêm 50 bản với giá 180,000
POST http://localhost:8080/api/v1/admin/goods-receipts
{
  "supplierId": 1,
  "items": [{
    "productId": 1,
    "quantity": 50,
    "unitCost": 180000
  }]
}

# Kiểm tra purchase_price mới:
# Old: 95 * 150,000 = 14,250,000
# New: 50 * 180,000 = 9,000,000
# Total: 145 units, 23,250,000 VNĐ
# Weighted Avg = 23,250,000 / 145 = 160,345 VNĐ
```

### **4. Order Status Transition Không Hợp Lệ**

```http
# Từ PENDING → SHIPPED (skip CONFIRMED)
PUT http://localhost:8080/api/v1/orders/1/status
{"status": "SHIPPED"}

# Expected Error:
{
  "success": false,
  "error": "Không thể chuyển trạng thái từ PENDING sang SHIPPED"
}

# Valid transitions:
# PENDING → CONFIRMED → PREPARING → SHIPPED → DELIVERED → COMPLETED
```

### **5. Discount & Tax Calculation**

```http
# Tạo đơn với discount 10% và thuế VAT 8%
POST http://localhost:8080/api/v1/orders
{
  "customerId": 1,
  "items": [{"productId": 1, "quantity": 4}],
  "discountAmount": 100000,
  "taxAmount": 80000
}

# Expected Calculation:
# subTotal = 4 * 250,000 = 1,000,000
# - discount = -100,000
# + tax = +80,000
# grandTotal = 980,000
```

---

## 📊 CHECKLIST TỔNG QUAN

### **Database Schema:**
- [ ] Tất cả migrations chạy thành công
- [ ] Product có stock_quantity và purchase_price
- [ ] Order có discount_amount và tax_amount
- [ ] OrderLine dùng composite PK (order_id, line_no)
- [ ] OrderAddress dùng shared PK với Order
- [ ] Warehouse mặc định (ID=1) tồn tại
- [ ] Admin account tồn tại

### **Inventory Management:**
- [ ] Nhập hàng tạo StockMovement với reason='GoodsReceipt'
- [ ] Bán hàng tạo StockMovement với reason='Sale'
- [ ] Hủy đơn tạo StockMovement với reason='Return'
- [ ] Điều chỉnh thủ công tạo StockMovement với reason phù hợp
- [ ] Product.stockQuantity luôn đồng bộ với thực tế

### **Order Management:**
- [ ] Tạo order trừ stock tự động
- [ ] Hủy order hoàn stock tự động
- [ ] Order status workflow đúng
- [ ] VNPay orders phải PAID trước khi xử lý
- [ ] COD orders có payment_status riêng

### **Business Logic:**
- [ ] Tính doanh thu chỉ từ completed orders
- [ ] Tính lợi nhuận = (listPrice - purchasePrice) * quantity
- [ ] Weighted average cost tính đúng
- [ ] Không bán khi stock không đủ

---

## 🐛 GHI CHÚ KHI TEST

Ghi lại các lỗi phát hiện:

```
[ ] Lỗi 1: _____________________
    - Kịch bản: _________________
    - Expected: _________________
    - Actual: ___________________
    - Root cause: _______________

[ ] Lỗi 2: _____________________
    ...
```

---

**Tạo bởi:** Claude Code
**Ngày:** 2025-11-27
**Version:** 1.0
