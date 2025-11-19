# Dự án GameStore (Backend)

Đây là Backend Server cho hệ thống bán hàng GameStore, cung cấp RESTful APIs cho Frontend. Dự án được xây dựng trên nền tảng Spring Boot và Java 21, tuân theo kiến trúc phân lớp (Layered Architecture) để đảm bảo tính mở rộng và bảo trì.

## Mục lục

1. [Công nghệ sử dụng](#-công-nghệ-sử-dụng)
2. [Yêu cầu hệ thống](#-yêu-cầu-hệ-thống)
3. [Cài đặt và Cấu hình](#-cài-đặt-và-cấu-hình)
   * [Bước 1: Clone và Chuẩn bị](#bước-1-clone-và-chuẩn-bị)
   * [Bước 2: Cài đặt Database](#bước-2-cài-đặt-database)
   * [Bước 3: Cấu hình Biến môi trường](#bước-3-cấu-hình-biến-môi-trường)
   * [Bước 4: Cài đặt thư viện](#bước-4-cài-đặt-thư-viện-dependencies)
   * [Bước 5: Chạy ứng dụng](#bước-5-chạy-ứng-dụng)
4. [Cấu trúc Thư mục](#-cấu-trúc-thư-mục)
5. [Tài liệu API (Swagger)](#-tài-liệu-api-swagger)
6. [Quy tắc Viết Code (Coding Convention)](#-quy-tắc-viết-code-coding-convention)
   * [Response Format](#1-response-format)
   * [Exception Handling](#2-exception-handling)
   * [Naming Convention](#3-naming-convention)
   * [DTO Usage](#4-dto-usage)
7. [Luồng làm việc với Git (Git Workflow)](#-luồng-làm-việc-với-git-git-workflow)
8. [Các Scripts có sẵn](#-các-scripts-có-sẵn)

---

## 🚀 Công nghệ sử dụng

* **Ngôn ngữ:** Java 21 (LTS)
* **Framework:** Spring Boot 3.3.0
* **Database:** MySQL 8.0+
* **ORM:** Spring Data JPA (Hibernate)
* **API Documentation:** OpenAPI (Swagger UI)
* **Build Tool:** Maven (Sử dụng Maven Wrapper `mvnw` có sẵn)

---

## 💻 Yêu cầu hệ thống

Trước khi bắt đầu, hãy đảm bảo máy bạn đã cài đặt:

* **JDK 21:** Tải tại [Oracle JDK](https://www.oracle.com/java/technologies/downloads/#java21) hoặc [OpenJDK](https://jdk.java.net/21/). Kiểm tra bằng lệnh:
  ```bash
  java -version
  ```
* **MySQL Server 8.0+:** Khuyên dùng [MySQL Workbench](https://www.mysql.com/products/workbench/) hoặc [Docker](https://www.docker.com/).
* **Git:** Để clone repository và quản lý version control.

---

## 🛠 Cài đặt và Cấu hình

Hướng dẫn cài đặt và chạy dự án ở môi trường local.

### Bước 1: Clone và Chuẩn bị

Clone repository về máy và di chuyển vào thư mục backend:

```bash
git clone https://github.com/Khangvu345/shop_game.git
cd shop_game/backend
```

### Bước 2: Cài đặt Database

⚠️ **Lưu ý quan trọng:** Dự án cấu hình `ddl-auto=none`, nghĩa là Hibernate sẽ **KHÔNG** tự tạo bảng. Bạn phải chạy script SQL thủ công.

1. Mở **MySQL Workbench** (hoặc công cụ quản lý DB bất kỳ).

2. Tạo một database trống tên là `shop_game`:
   ```sql
   CREATE DATABASE shop_game CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

3. Mở file `database/schema.sql` (nằm ở thư mục gốc của repo).

4. Chạy toàn bộ câu lệnh trong file đó để khởi tạo các bảng:
   * `party`, `customer`, `employee`, `account`
   * `product`, `category`, `supplier`
   * `order`, `order_line`, `order_address`
   * `warehouse`, `stock_movement`, `goods_receipt`
   * `product_review`, `review_reply`, `review_moderation`
   * Và các bảng liên quan khác...

### Bước 3: Cấu hình Biến môi trường

1. Vào thư mục `src/main/resources/`.

2. Copy file `application-local.properties.example` thành `application-local.properties`:
   ```bash
   cp application-local.properties.example application-local.properties
   ```
   *(File này đã được thêm vào `.gitignore` nên sẽ không bị lộ mật khẩu lên Git.)*

3. Mở file `application-local.properties` vừa tạo và chỉnh sửa thông tin DB của bạn:
   ```properties
   # Cấu hình kết nối MySQL của máy BẠN
   spring.datasource.url=jdbc:mysql://localhost:3306/shop_game?useSSL=false&serverTimezone=Asia/Ho_Chi_Minh&allowPublicKeyRetrieval=true
   spring.datasource.username=root
   spring.datasource.password=MAT_KHAU_MYSQL_CUA_BAN
   ```

### Bước 4: Cài đặt thư viện (Dependencies)

Lần đầu tiên chạy, bạn nên chạy lệnh này để Maven tải toàn bộ thư viện về và build thử dự án (giống như `npm install` bên Frontend).

**Trên Windows:**
```bash
mvnw.cmd clean install
```

**Trên Mac/Linux:**
```bash
./mvnw clean install
```

### Bước 5: Chạy ứng dụng

Sử dụng **Maven Wrapper** (được khuyến nghị để tránh lỗi version Maven):

**Trên Windows:**
```bash
mvnw.cmd spring-boot:run
```

**Trên Mac/Linux:**
```bash
./mvnw spring-boot:run
```

Sau khi ứng dụng khởi động thành công (bạn sẽ thấy dòng log `Started GameShopApplication in ...`), hãy truy cập vào các đường dẫn sau:

**Trang tài liệu API (Swagger UI) - QUAN TRỌNG NHẤT:**

👉 **http://localhost:8080/swagger-ui.html**

*(Đây là giao diện chính để bạn xem danh sách API và test thử chức năng)*

**Kiểm tra nhanh (Health Check):**

👉 **http://localhost:8080/api/v1/health**

⚠️ **Lưu ý:** Mặc định server chạy trên giao thức **HTTP**, không phải HTTPS.
* Nếu trình duyệt tự động chuyển sang HTTPS và báo lỗi "This site can't be reached", hãy sửa lại URL thành `http://...` thủ công.

---

## 📁 Cấu trúc Thư mục

Dự án tuân theo kiến trúc phân lớp (Layered Architecture):

```
src/main/java/com/gameshop/
├── config/                 # Cấu hình hệ thống
│   ├── CorsConfig.java     # Cấu hình CORS cho Frontend
│   ├── OpenApiConfig.java  # Cấu hình Swagger/OpenAPI
│   └── SecurityConfig.java # Cấu hình bảo mật (nếu có)
│
├── controller/             # Layer nhận request từ Frontend (REST API)
│   ├── ProductController.java
│   ├── OrderController.java
│   ├── HealthController.java
│   └── ...
│
├── model/
│   ├── entity/             # Các Class ánh xạ với bảng trong DB (JPA Entities)
│   │   ├── Product.java
│   │   ├── Order.java
│   │   └── ...
│   │
│   ├── dto/                # Data Transfer Objects (Request/Response Models)
│   │   └── common/
│   │       └── ApiResponse.java    # Response format chuẩn
│   │
│   └── enums/              # Các định nghĩa hằng số (Status, Role...)
│       ├── ProductStatus.java
│       └── ...
│
├── repository/             # Layer giao tiếp trực tiếp với Database (JPA Repository)
│   ├── ProductRepository.java
│   └── ...
│
├── service/                # Layer chứa logic nghiệp vụ chính (Business Logic)
│   ├── ProductService.java         # Interface
│   └── impl/                       # Triển khai code của Service
│       ├── ProductServiceImpl.java
│       └── ...
│
├── exception/              # Xử lý lỗi tập trung
│   ├── ResourceNotFoundException.java
│   ├── BadRequestException.java
│   └── GlobalExceptionHandler.java # Global Exception Handler
│
└── utils/                  # Các hàm tiện ích chung
```

Dự án được tổ chức theo "layer" (tầng) và "domain" (miền nghiệp vụ).

---

## 📖 Tài liệu API (Swagger)

Dự án tích hợp sẵn **Swagger UI**. Sau khi chạy server, truy cập đường dẫn sau để xem và test API:

👉 **http://localhost:8080/swagger-ui.html**

**Các tính năng:**
* **Schemas:** Xem cấu trúc dữ liệu request/response.
* **Try it out:** Gọi thử API trực tiếp trên trình duyệt.
* **Authorization:** Test các API yêu cầu authentication (nếu có).

---

## ✍️ Quy tắc Viết Code (Coding Convention)

Đây là các quy tắc bắt buộc khi tham gia dự án để đảm bảo code đồng nhất và dễ bảo trì.

### 1. Response Format

Tất cả API phải trả về theo format chuẩn `ApiResponse` đã định nghĩa:

```json
{
  "success": true,
  "message": "Thành công",
  "data": { ... }
}
```

### 2. Exception Handling

* **KHÔNG ĐƯỢC** `try-catch` và nuốt lỗi trong Service hoặc Controller.
* Hãy ném ra Exception cụ thể (ví dụ: `ResourceNotFoundException`, `BadRequestException`) để `GlobalExceptionHandler` xử lý tập trung.

### 3. Naming Convention

Tuân theo quy tắc đặt tên của Java và Spring Boot:

* **Class:** `PascalCase`
  * Ví dụ: `ProductController`, `OrderService`, `CustomerRepository`

* **Method/Variable:** `camelCase`
  * Ví dụ: `findProductById()`, `customerName`, `isActive`

* **Database Column:** `snake_case` (trong schema SQL)
  * Ví dụ: `product_name`, `order_date`, `created_at`

* **Constant:** `UPPER_SNAKE_CASE`
  * Ví dụ: `MAX_RETRY_ATTEMPTS`, `DEFAULT_PAGE_SIZE`

* **Package:** `lowercase` (không có dấu gạch dưới)
  * Ví dụ: `com.gameshop.controller`, `com.gameshop.service.impl`

### 4. DTO Usage

* **Luôn dùng DTO** để nhận dữ liệu (Request) và trả về (Response).
* **KHÔNG** trả về trực tiếp Entity ra ngoài Controller để tránh lộ thông tin nhạy cảm và lỗi vòng lặp JSON.

---

## 🌐 Luồng làm việc với Git (Git Workflow)

Tương tự như Frontend, chúng ta sử dụng **Feature Branch Workflow** kết hợp với **Issue Tracking**.

### Nhận Issue:
Vào tab "Issues" trên GitHub/GitLab để nhận nhiệm vụ (Ví dụ: **Issue #10** - Tạo API danh sách sản phẩm).

### Tạo Branch:
Từ branch `main` (luôn cập nhật mới nhất), tạo branch theo cú pháp: `[loại]/[backend]-[số-issue]-[tên-ngắn-gọn]`

```bash
git checkout main
git pull origin main

# Ví dụ cho Issue #10
git checkout -b feat/backend-10-get-product-list
```

### Làm việc:
* Code và commit thường xuyên. Message commit nên chứa số issue (để GitHub tự động link).
* Ví dụ: `feat: #10 Implement ProductService to fetch data`

### Tạo Pull Request (PR):
* Push branch lên remote:
  ```bash
  git push -u origin feat/backend-10-get-product-list
  ```
* Tạo PR vào branch `main`.
  * **Tiêu đề PR:** `feat: #10 Get product list API`
  * **Mô tả PR:** Ghi rõ "Closes #10" để khi merge, issue #10 sẽ tự động đóng lại.

### Review & Merge:
* Sau khi được Approve, tiến hành Merge và xóa branch phụ.

---

## 🚀 Các Scripts có sẵn

Dự án sử dụng **Maven Wrapper**, các lệnh thường dùng:

### Chạy ứng dụng (Development)

**Windows:**
```bash
mvnw.cmd spring-boot:run
```

**Mac/Linux:**
```bash
./mvnw spring-boot:run
```

### Build project (tạo file .jar)

**Windows:**
```bash
mvnw.cmd clean package
```

**Mac/Linux:**
```bash
./mvnw clean package
```

### Chạy tests

**Windows:**
```bash
mvnw.cmd test
```

**Mac/Linux:**
```bash
./mvnw test
```

### Clean project (xóa thư mục target/)

**Windows:**
```bash
mvnw.cmd clean
```

**Mac/Linux:**
```bash
./mvnw clean
```

---

## 📝 Lưu ý bảo mật

* **KHÔNG** commit file `application-local.properties` lên Git (đã có trong `.gitignore`).
* **KHÔNG** hardcode password, API key trong code.
* Sử dụng **environment variables** hoặc **Spring profiles** cho các thông tin nhạy cảm.