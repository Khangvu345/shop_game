# 🎯 Xây dựng Backend APIs cho Admin Dashboard

## 📋 Tổng quan

Xây dựng hệ thống backend hoàn chỉnh cho trang Admin Dashboard bao gồm:
- ✅ Quản lý tồn kho (Inventory Management)
- ✅ Quản lý nhập hàng (Goods Receipt)
- ✅ Thống kê & báo cáo (Dashboard & Reports)
- ✅ Tính toán doanh thu và lợi nhuận chính xác
- ✅ Authentication đơn giản (Username/Password + JWT)

---

## 🔧 Các vấn đề cần giải quyết

### 1. **Không thể tính doanh thu chính xác**
- Hiện tại Product chỉ có `list_price` (giá bán)
- Thiếu `purchase_price` (giá vốn) để tính lợi nhuận
- **Giải pháp:** Thêm `purchase_price` (weighted average) vào Product

### 2. **Hệ thống tồn kho không có tracking**
- `stock_quantity` trong Product là `@Transient` (không lưu DB)
- Không có lịch sử tracking thay đổi stock
- Nếu admin chỉnh sửa thủ công → conflict với logic tự động trừ stock
- **Giải pháp:**
  - Lưu `stock_quantity` trong Product
  - Dùng `stock_movement` để tracking mọi thay đổi
  - Mọi thao tác stock phải qua StockMovementService

### 3. **Database schema không đồng bộ với code**
- Order status enum không khớp
- Thiếu payment_method, payment_status
- Entity vs Schema có nhiều khác biệt
- **Giải pháp:** Chuẩn hóa database schema

---

## 📦 PHASE 1: Chuẩn hóa Database Schema

### 1.1 Cập nhật Product
```sql
ALTER TABLE product
ADD COLUMN stock_quantity INT DEFAULT 0 NOT NULL COMMENT 'Tồn kho hiện tại',
ADD COLUMN purchase_price DECIMAL(10,0) DEFAULT 0 COMMENT 'Giá vốn bình quân gia quyền';
```

### 1.2 Cập nhật Order
```sql
-- Sửa enum status
ALTER TABLE `order`
MODIFY COLUMN status ENUM(
  'PENDING', 'CONFIRMED', 'PREPARING', 'SHIPPED',
  'DELIVERED', 'COMPLETED', 'CANCELLED', 'RETURNED'
) NOT NULL DEFAULT 'PENDING';

-- Thêm payment fields
ALTER TABLE `order`
ADD COLUMN payment_method ENUM('COD', 'VNPAY') NOT NULL DEFAULT 'COD',
ADD COLUMN payment_status ENUM(
  'PENDING', 'PAID', 'COD_PENDING',
  'COD_COLLECTED', 'FAILED', 'REFUNDED'
) NOT NULL DEFAULT 'PENDING';
```

### 1.3 Cập nhật order_line
```sql
-- Bỏ line_discount (chỉ dùng discount toàn đơn hàng)
ALTER TABLE order_line
DROP COLUMN line_discount;
```

### 1.4 Tạo warehouse mặc định
```sql
INSERT INTO warehouse (warehouse_id, name, address_text)
VALUES (1, 'Kho Chính', 'Kho mặc định của hệ thống')
ON DUPLICATE KEY UPDATE name = name;
```

### 1.5 Khởi tạo stock_quantity cho sản phẩm cũ
```sql
-- Tất cả sản phẩm cũ sẽ có stock = 0
UPDATE product SET stock_quantity = 0 WHERE stock_quantity IS NULL;
```

---

## 📝 PHASE 2: Cập nhật Entities

### 2.1 Product.java
- [ ] Bỏ `@Transient` ở `stockQuantity`
- [ ] Thêm field `purchasePrice`
```java
@Column(name = "stock_quantity", nullable = false)
private Integer stockQuantity = 0;

@Column(name = "purchase_price", precision = 10, scale = 0)
private BigDecimal purchasePrice = BigDecimal.ZERO;
```

### 2.2 Order.java
- [ ] Đổi `@Table(name = "orders")` → `@Table(name = "order")`
- [ ] Thêm `discountAmount`, `taxAmount`
```java
@Column(name = "discount_amount", precision = 12, scale = 2)
private BigDecimal discountAmount = BigDecimal.ZERO;

@Column(name = "tax_amount", precision = 12, scale = 2)
private BigDecimal taxAmount = BigDecimal.ZERO;
```

### 2.3 OrderLine.java
- [ ] **Đổi PK từ `@Id Long id` sang Composite Key**
- [ ] Tạo `OrderLinePK` class (embeddable)
- [ ] Bỏ `created_at`, `updated_at`

**Tạo OrderLinePK.java:**
```java
@Embeddable
public class OrderLinePK implements Serializable {
    @Column(name = "order_id")
    private Long orderId;

    @Column(name = "line_no")
    private Integer lineNo;

    // equals, hashCode, constructors
}
```

**Sửa OrderLine.java:**
```java
@EmbeddedId
private OrderLinePK id;

@ManyToOne
@MapsId("orderId")
@JoinColumn(name = "order_id")
private Order order;

// Bỏ created_at, updated_at
```

### 2.4 OrderAddress.java
- [ ] **Đổi PK từ `@Id Long id` sang `@Id Long orderId` (Shared PK với Order)**
- [ ] Sửa column names: `recipient_name` → `receiver_name`, etc.
```java
@Id
@Column(name = "order_id")
private Long orderId;

@OneToOne
@MapsId
@JoinColumn(name = "order_id")
private Order order;

@Column(name = "receiver_name")
private String receiverName;

@Column(name = "receiver_phone")
private String receiverPhone;

@Column(name = "line1")
private String line1;

@Column(name = "line2")
private String line2;

// Giữ: district, city
// Bỏ: ward (không có trong schema)
```

### 2.5 Tạo Entities mới
- [ ] `StockMovement.java`
- [ ] `Warehouse.java`
- [ ] `GoodsReceipt.java`
- [ ] `GoodsReceiptLine.java`
- [ ] `Supplier.java`

---

## 🔨 PHASE 3: Inventory Management System

### 3.1 StockMovementService
- [ ] `createMovement(productId, quantityDelta, reason, referenceNo, orderId)`
- [ ] `getStockHistory(productId)`
- [ ] `getCurrentStock(productId)`
- [ ] `adjustStockManually(productId, quantity, reason)` - Admin điều chỉnh thủ công

**Logic:**
```java
public void createMovement(Long productId, int quantityDelta,
                          StockMovementReason reason,
                          String referenceNo, Long orderId) {
    // 1. Lấy product
    Product product = productRepo.findById(productId)...;

    // 2. Cập nhật stock_quantity
    int newStock = product.getStockQuantity() + quantityDelta;
    if (newStock < 0) {
        throw new RuntimeException("Không đủ hàng trong kho!");
    }
    product.setStockQuantity(newStock);
    productRepo.save(product);

    // 3. Tạo stock_movement record (tracking history)
    StockMovement movement = new StockMovement();
    movement.setProduct(product);
    movement.setWarehouse(defaultWarehouse); // warehouse_id = 1
    movement.setQuantityDelta(quantityDelta);
    movement.setReason(reason);
    movement.setReferenceNo(referenceNo);
    movement.setOrderId(orderId);
    movement.setOccurredAt(LocalDateTime.now());
    stockMovementRepo.save(movement);
}
```

### 3.2 GoodsReceiptService
- [ ] `createGoodsReceipt(request)` - Nhập hàng
- [ ] `getGoodsReceiptById(id)`
- [ ] `getAllGoodsReceipts(filters)`
- [ ] `updateGoodsReceipt(id, request)`
- [ ] `deleteGoodsReceipt(id)`

**Logic nhập hàng:**
```java
public GoodsReceiptResponse createGoodsReceipt(CreateGoodsReceiptRequest request) {
    // 1. Tạo goods_receipt
    GoodsReceipt receipt = new GoodsReceipt();
    receipt.setSupplier(...);
    receipt.setReceiptDate(...);
    receipt.setInvoiceNumber(...);

    // 2. Tạo goods_receipt_line cho từng sản phẩm
    for (ItemDto item : request.items()) {
        Product product = productRepo.findById(item.productId())...;

        // 3. Cập nhật purchase_price (weighted average)
        int oldQty = product.getStockQuantity();
        BigDecimal oldCost = product.getPurchasePrice();
        int newQty = item.quantity();
        BigDecimal newCost = item.unitCost();

        BigDecimal totalValue = oldCost.multiply(valueOf(oldQty))
                              .add(newCost.multiply(valueOf(newQty)));
        int totalQty = oldQty + newQty;
        BigDecimal avgCost = totalValue.divide(valueOf(totalQty), 0, HALF_UP);

        product.setPurchasePrice(avgCost);
        productRepo.save(product);

        // 4. Tạo stock_movement
        stockMovementService.createMovement(
            product.getId(),
            item.quantity(),
            StockMovementReason.GoodsReceipt,
            request.invoiceNumber(),
            null
        );

        // 5. Thêm vào goods_receipt_line
        GoodsReceiptLine line = new GoodsReceiptLine();
        line.setProduct(product);
        line.setQuantityReceived(item.quantity());
        line.setUnitCost(item.unitCost());
        receipt.getLines().add(line);
    }

    return goodsReceiptRepo.save(receipt);
}
```

### 3.3 Sửa OrderService
- [ ] Sửa `createOrder()` - Dùng StockMovementService thay vì trực tiếp
- [ ] Sửa `cancelOrder()` - Dùng StockMovementService

**Thay đổi:**
```java
// Trong createOrder() - Thay vì:
product.setStockQuantity(product.getStockQuantity() - quantity);
productRepo.save(product);

// Dùng:
stockMovementService.createMovement(
    product.getId(),
    -quantity,  // Số âm = trừ
    StockMovementReason.Sale,
    "ORDER-" + orderId,
    orderId
);

// Trong cancelOrder() - Thay vì:
product.setStockQuantity(product.getStockQuantity() + quantity);
productRepo.save(product);

// Dùng:
stockMovementService.createMovement(
    product.getId(),
    +quantity,  // Số dương = cộng lại
    StockMovementReason.Return,
    "CANCEL-ORDER-" + orderId,
    orderId
);
```

### 3.4 Controllers mới
- [ ] `StockMovementController` - APIs xem lịch sử stock
  - `GET /api/v1/admin/stock-movements?productId=...`
  - `POST /api/v1/admin/stock-movements/adjust` - Điều chỉnh thủ công

---

## 📊 PHASE 4: Goods Receipt Management

### 4.1 SupplierService
- [ ] CRUD suppliers

### 4.2 GoodsReceiptController
- [ ] `POST /api/v1/admin/goods-receipts` - Tạo phiếu nhập
- [ ] `GET /api/v1/admin/goods-receipts` - Danh sách phiếu nhập
- [ ] `GET /api/v1/admin/goods-receipts/{id}` - Chi tiết
- [ ] `PUT /api/v1/admin/goods-receipts/{id}` - Sửa
- [ ] `DELETE /api/v1/admin/goods-receipts/{id}` - Xóa

### 4.3 SupplierController
- [ ] CRUD suppliers APIs

---

## 📈 PHASE 5: Dashboard & Statistics

### 5.1 DashboardService
- [ ] `getOverview()` - Thống kê tổng quan
- [ ] `getRevenueChart(period)` - Biểu đồ doanh thu
- [ ] `getTopProducts(limit)` - Top sản phẩm bán chạy
- [ ] `getLowStockProducts()` - Sản phẩm sắp hết hàng
- [ ] `calculateProfit(fromDate, toDate)` - Tính lợi nhuận

**Tính lợi nhuận:**
```java
// Lợi nhuận = (Giá bán - Giá vốn) * Số lượng bán
BigDecimal profit = BigDecimal.ZERO;
for (OrderLine line : completedOrders) {
    BigDecimal revenue = line.getPrice().multiply(valueOf(line.getQuantity()));
    BigDecimal cost = line.getProduct().getPurchasePrice()
                         .multiply(valueOf(line.getQuantity()));
    profit = profit.add(revenue.subtract(cost));
}
```

### 5.2 DashboardController
- [ ] `GET /api/v1/admin/dashboard/overview`
  ```json
  {
    "totalRevenue": 50000000,
    "totalProfit": 15000000,
    "totalOrders": 150,
    "totalCustomers": 80,
    "pendingOrders": 5,
    "lowStockProducts": 12
  }
  ```
- [ ] `GET /api/v1/admin/dashboard/revenue-chart?period=30days`
- [ ] `GET /api/v1/admin/dashboard/top-products?limit=10`

### 5.3 ReportController
- [ ] `GET /api/v1/admin/reports/sales?from=...&to=...`
- [ ] `GET /api/v1/admin/reports/inventory`
- [ ] `GET /api/v1/admin/reports/profit-loss`

---

## 👥 PHASE 6: Customer Management

### 6.1 AdminCustomerController
- [ ] `GET /api/v1/admin/customers` - Danh sách khách hàng
- [ ] `GET /api/v1/admin/customers/{id}` - Chi tiết
- [ ] `POST /api/v1/admin/customers` - Tạo khách hàng
- [ ] `PUT /api/v1/admin/customers/{id}` - Sửa
- [ ] `DELETE /api/v1/admin/customers/{id}` - Xóa
- [ ] `GET /api/v1/admin/customers/{id}/orders` - Lịch sử đơn hàng

---

## 🔐 PHASE 7: Authentication (Simple)

### 7.1 AuthService
- [ ] `login(username, password)` - Đăng nhập
- [ ] `generateJwtToken(employee)` - Tạo JWT
- [ ] `validateToken(token)` - Validate JWT
- [ ] `refreshToken(refreshToken)` - Refresh JWT

### 7.2 AuthController
- [ ] `POST /api/v1/auth/login`
  ```json
  {
    "username": "admin",
    "password": "admin123"
  }
  // Response:
  {
    "token": "eyJhbGc...",
    "refreshToken": "...",
    "employee": {
      "id": 1,
      "fullName": "Admin",
      "email": "admin@shop.com"
    }
  }
  ```
- [ ] `POST /api/v1/auth/refresh`

### 7.3 Security Config
- [ ] Tạo `JwtUtil` - Generate/validate JWT
- [ ] Tạo `JwtAuthenticationFilter` - Filter kiểm tra token
- [ ] Tạo `SecurityConfig` - Spring Security configuration
- [ ] Public endpoints: `/api/v1/auth/**`, `/api/v1/products/**`
- [ ] Protected endpoints: `/api/v1/admin/**` (require authentication)

### 7.4 Seed admin account
```sql
-- Tạo admin account mặc định
INSERT INTO party (party_id, full_name, email, phone)
VALUES (1, 'Admin', 'admin@shop.com', '0123456789');

INSERT INTO employee (party_id, employee_code, hire_date, status)
VALUES (1, 'ADMIN001', CURDATE(), 'Active');

INSERT INTO account (party_id, provider, username, email_for_login, password_hash, account_status)
VALUES (1, 'LOCAL', 'admin', 'admin@shop.com',
        '$2a$10$...', -- BCrypt hash của "admin123"
        'Active');
```

---

## 📂 Danh sách Files cần tạo/sửa

### Database
- [ ] `database/migrations/001_update_product_schema.sql`
- [ ] `database/migrations/002_update_order_schema.sql`
- [ ] `database/migrations/003_seed_warehouse.sql`
- [ ] `database/migrations/004_seed_admin_account.sql`

### Entities
- [x] ~~`Product.java`~~ - Sửa
- [x] ~~`Order.java`~~ - Sửa
- [x] ~~`OrderLine.java`~~ - Sửa (composite PK)
- [x] ~~`OrderAddress.java`~~ - Sửa (shared PK)
- [ ] `OrderLinePK.java` - Tạo mới
- [ ] `StockMovement.java` - Tạo mới
- [ ] `Warehouse.java` - Tạo mới
- [ ] `GoodsReceipt.java` - Tạo mới
- [ ] `GoodsReceiptLine.java` - Tạo mới
- [ ] `Supplier.java` - Tạo mới

### Enums
- [ ] `StockMovementReason.java` - GoodsReceipt, Sale, Return, ManualAdjustment, etc.

### DTOs
- [ ] `CreateGoodsReceiptRequest.java`
- [ ] `GoodsReceiptResponse.java`
- [ ] `DashboardOverviewResponse.java`
- [ ] `RevenueChartResponse.java`
- [ ] `StockMovementResponse.java`
- [ ] `LoginRequest.java`, `LoginResponse.java`

### Services
- [x] ~~`OrderService.java`~~ - Sửa
- [ ] `StockMovementService.java` - Tạo mới
- [ ] `GoodsReceiptService.java` - Tạo mới
- [ ] `SupplierService.java` - Tạo mới
- [ ] `DashboardService.java` - Tạo mới
- [ ] `ReportService.java` - Tạo mới
- [ ] `AuthService.java` - Tạo mới

### Controllers
- [ ] `DashboardController.java` - Tạo mới
- [ ] `GoodsReceiptController.java` - Tạo mới
- [ ] `SupplierController.java` - Tạo mới
- [ ] `StockMovementController.java` - Tạo mới
- [ ] `AdminCustomerController.java` - Tạo mới
- [ ] `ReportController.java` - Tạo mới
- [ ] `AuthController.java` - Tạo mới

### Security
- [ ] `JwtUtil.java` - JWT helper
- [ ] `JwtAuthenticationFilter.java` - Filter
- [ ] `SecurityConfig.java` - Spring Security config

---

## ✅ Acceptance Criteria

- [ ] Tất cả entities đồng bộ với database schema
- [ ] Có thể tính toán doanh thu và lợi nhuận chính xác
- [ ] Có tracking đầy đủ lịch sử thay đổi stock
- [ ] Admin có thể nhập hàng và tự động cập nhật stock + giá vốn
- [ ] Admin có thể điều chỉnh stock thủ công (có tracking)
- [ ] Dashboard hiển thị thống kê tổng quan
- [ ] Có authentication đơn giản cho admin
- [ ] Tất cả APIs có Swagger documentation
- [ ] Code có unit tests cho các service chính

---

## 📝 Notes

- **Về discount:** Hiện tại chỉ implement discount toàn đơn hàng (`discount_amount`), discount từng sản phẩm (`line_discount`) sẽ mở rộng sau
- **Về warehouse:** Hiện tại chỉ 1 kho mặc định (warehouse_id = 1), không có kế hoạch mở rộng multi-warehouse
- **Về giá vốn:** Dùng weighted average cost method
- **Về authentication:** Implement đơn giản với username/password + JWT, OAuth2/SSO sẽ nâng cấp sau

---

## 🎯 Priority

1. **HIGH:** Phase 1, 2, 3 (Database + Entities + Inventory)
2. **MEDIUM:** Phase 4, 5 (Goods Receipt + Dashboard)
3. **LOW:** Phase 6, 7 (Customer Management + Auth)

---

**Estimated Time:** 3-5 working days

**Assignee:** @claude

**Labels:** `enhancement`, `backend`, `admin-dashboard`, `database`
