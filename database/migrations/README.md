# Database Migrations

Thư mục này chứa các migration scripts để cập nhật database schema cho Admin Dashboard APIs.

## 📋 Danh sách Migrations

### 001_update_product_schema.sql
**Mục đích:** Thêm stock_quantity và purchase_price vào bảng product

**Thay đổi:**
- ✅ Thêm `stock_quantity INT DEFAULT 0` - Tồn kho hiện tại
- ✅ Thêm `purchase_price DECIMAL(10,0) DEFAULT 0` - Giá vốn bình quân gia quyền
- ✅ Khởi tạo giá trị mặc định cho sản phẩm cũ

**Lý do:**
- Hiện tại `stock_quantity` là `@Transient` trong entity → không lưu DB
- Cần lưu để tăng performance (không phải tính từ stock_movement mỗi lần query)
- Cần `purchase_price` để tính lợi nhuận: `profit = (list_price - purchase_price) * quantity`

---

### 002_update_order_schema.sql
**Mục đích:** Cập nhật enum status và thêm payment fields

**Thay đổi:**
- ✅ Sửa `status` enum: `'Draft', 'Confirmed'...` → `'PENDING', 'CONFIRMED', 'PREPARING'...`
- ✅ Thêm `payment_method ENUM('COD', 'VNPAY')`
- ✅ Thêm `payment_status ENUM('PENDING', 'PAID', 'COD_PENDING'...)`
- ✅ Đảm bảo `discount_amount`, `tax_amount` tồn tại
- ✅ Khởi tạo giá trị mặc định cho đơn hàng cũ

**Lý do:**
- Database schema không khớp với code OrderStatus.java
- Code đã implement payment_method và payment_status nhưng DB chưa có
- Cần discount_amount và tax_amount để tính tổng tiền chính xác

---

### 003_update_order_line_schema.sql
**Mục đích:** Bỏ line_discount (chỉ dùng discount toàn đơn hàng)

**Thay đổi:**
- ✅ Xóa column `line_discount` nếu tồn tại

**Lý do:**
- Hiện tại chỉ implement discount toàn đơn hàng (`discount_amount` trong order)
- Discount từng sản phẩm (`line_discount`) sẽ mở rộng sau nếu cần
- Đơn giản hóa logic tính toán

---

### 004_seed_warehouse_and_admin.sql
**Mục đích:** Tạo warehouse mặc định và admin account

**Thay đổi:**
- ✅ Tạo warehouse (ID=1, Name='Kho Chính')
- ✅ Tạo admin party, employee, role, account
- ✅ Admin login: `username=admin, password=admin123`

**Lý do:**
- Hệ thống chỉ có 1 kho → tạo sẵn warehouse_id=1
- Cần admin account để test APIs có authentication
- Tất cả stock_movement và goods_receipt_line sẽ dùng warehouse_id=1

---

## 🚀 Cách chạy Migrations

### Option 1: Chạy từng file tuần tự (Khuyến nghị)

```bash
# Kết nối MySQL
mysql -u root -p

# Chạy từng migration
source database/migrations/001_update_product_schema.sql
source database/migrations/002_update_order_schema.sql
source database/migrations/003_update_order_line_schema.sql
source database/migrations/004_seed_warehouse_and_admin.sql
```

### Option 2: Chạy tất cả cùng lúc

```bash
mysql -u root -p shop_game < database/migrations/001_update_product_schema.sql
mysql -u root -p shop_game < database/migrations/002_update_order_schema.sql
mysql -u root -p shop_game < database/migrations/003_update_order_line_schema.sql
mysql -u root -p shop_game < database/migrations/004_seed_warehouse_and_admin.sql
```

### Option 3: Sử dụng script (sẽ tạo sau)

```bash
./database/run_migrations.sh
```

---

## ✅ Kiểm tra sau khi chạy

### 1. Kiểm tra Product
```sql
DESCRIBE product;
-- Phải có: stock_quantity, purchase_price

SELECT product_id, product_name, list_price, purchase_price, stock_quantity
FROM product
LIMIT 5;
```

### 2. Kiểm tra Order
```sql
DESCRIBE `order`;
-- Phải có: payment_method, payment_status, discount_amount, tax_amount

SELECT order_id, status, payment_method, payment_status, grand_total
FROM `order`
LIMIT 5;
```

### 3. Kiểm tra Warehouse
```sql
SELECT * FROM warehouse WHERE warehouse_id = 1;
-- Phải có: ID=1, Name='Kho Chính'
```

### 4. Kiểm tra Admin Account
```sql
SELECT
    a.username,
    a.email_for_login,
    a.account_status,
    p.full_name,
    e.employee_code,
    r.role_name
FROM account a
INNER JOIN party p ON a.party_id = p.party_id
INNER JOIN employee e ON p.party_id = e.party_id
INNER JOIN employee_role er ON e.party_id = er.party_id
INNER JOIN role r ON er.role_id = r.role_id
WHERE a.username = 'admin';
```

**Expected result:**
- Username: `admin`
- Password: `admin123` (BCrypt hash in DB)
- Email: `admin@shopgame.com`
- Role: `ADMIN`

---

## ⚠️ Lưu ý quan trọng

1. **Backup database trước khi chạy migrations:**
   ```bash
   mysqldump -u root -p shop_game > backup_before_migration_$(date +%Y%m%d).sql
   ```

2. **Migrations có thể chạy nhiều lần (idempotent):**
   - Sử dụng `ON DUPLICATE KEY UPDATE`
   - Kiểm tra column tồn tại trước khi thêm
   - An toàn để re-run nếu có lỗi

3. **Thứ tự chạy migrations rất quan trọng:**
   - Phải chạy theo số thứ tự: 001 → 002 → 003 → 004
   - Không được skip migrations

4. **Development vs Production:**
   - Development: Có thể xóa và tạo lại database
   - Production: **BẮT BUỘC** backup trước, test trên staging trước

---

## 📝 Changelog

### 2025-11-27 - Phase 1: Database Schema
- ✅ Tạo migration 001: Update product schema
- ✅ Tạo migration 002: Update order schema
- ✅ Tạo migration 003: Update order_line schema
- ✅ Tạo migration 004: Seed warehouse and admin

---

## 🔗 Related Documents

- [Issue Template](../../.github/ISSUE_ADMIN_DASHBOARD.md) - Kế hoạch chi tiết cho Admin Dashboard
- [Database Schema](../schema.sql) - Schema ban đầu
- [Entity Documentation](../../backend/src/main/java/com/gameshop/model/entity/) - Java entities

---

## ❓ FAQs

**Q: Tại sao cần thêm stock_quantity vào product khi có thể query từ stock_movement?**
A: Performance! Query `SUM(quantity_delta)` từ stock_movement rất chậm khi có nhiều records. Lưu trực tiếp trong product giúp truy vấn tức thì.

**Q: Giá vốn (purchase_price) tính như thế nào?**
A: Dùng weighted average cost method: `new_avg = (old_qty * old_cost + new_qty * new_cost) / (old_qty + new_qty)`

**Q: Tại sao bỏ line_discount?**
A: Hiện tại chỉ implement discount toàn đơn. Discount từng sản phẩm phức tạp hơn, sẽ làm sau.

**Q: Password admin123 có an toàn không?**
A: Đây chỉ là account mặc định cho development. Production phải đổi password ngay!
