# Dự án GameStore (Frontend)

Đây là project Frontend cho website bán hàng GameStore, được xây dựng bằng Vite, React và TypeScript.
Dự án được thiết kế để tách biệt rõ ràng logic (state) và giao diện (UI) nhằm mục đích dễ bảo trì và mở rộng.

## Mục lục

1.  [Công nghệ sử dụng](#-công-nghệ-sử-dụng)
2.  [Cài đặt và Chạy dự án](#-cài-đặt-và-chạy-dự-án)
3.  [Cấu trúc Thư mục](#-cấu-trúc-thư-mục)
4.  [Quy tắc Viết Code (Coding Convention)](#-quy-tắc-viết-code-coding-convention)
    * [Hướng dẫn viết Component](#1-hướng-dẫn-viết-component-ui-vs-features)
    * [Hướng dẫn Quản lý State (Redux)](#2-hướng-dẫn-quản-lý-state-redux)
    * [Hướng dẫn viết API](#3-hướng-dẫn-viết-api)
    * [Quy tắc Đặt tên (Types)](#4-quy-tắc-đặt-tên-types)
    * [Quy tắc CSS](#5-quy-tắc-css)
5.  [Luồng làm việc với Git (Git Workflow)](#-luồng-làm-việc-với-git-git-workflow)
6.  [Các Scripts có sẵn](#-các-scripts-có-sẵn)

---

## 🚀 Công nghệ sử dụng

* **Framework/Library:** Vite + React 18
* **Ngôn ngữ:** TypeScript
* **Quản lý State:** Redux Toolkit
* **Gọi API:** Axios
* **Điều hướng (Routing):** React Router v6
* **Styling:** CSS Tùy chỉnh (Custom CSS) (Không dùng thư viện UI có sẵn)

---

## 🏁 Cài đặt và Chạy dự án

Hướng dẫn cài đặt và chạy dự án ở môi trường local.

### Yêu cầu

* Node.js (v16+)
* npm (v8+)

### Cài đặt

1.  Clone repository về máy:
    ```bash
    git clone https://github.com/Khangvu345/shop_game.git
    cd shop_game/frontend
    ```

2.  Cài đặt các dependencies:
    ```bash
    npm install
    ```

### Chạy Dự án (Quan trọng)


**1. Khởi động React App (FE)**

* Tạo file `.env.local` ở thư mục gốc (nếu chưa có) và thêm biến môi trường dựa trên file `.env.example`:
* Mở một **terminal**.
* Khởi động app (lệnh `dev` của Vite):
    ```bash
    npm run dev
    ```
  *Ứng dụng sẽ tự động mở ở `http://localhost:5173` (hoặc một cổng khác do Vite chỉ định).*

---

## 📁 Cấu trúc Thư mục

├── public/
│   └── favicon.ico         # Icon của trang
│
├── src/
│   ├── api/                # Chứa logic gọi API (Axios)
│   │   ├── axiosClient.ts  # Cấu hình Axios, baseURL từ .env
│   │   ├── productApi.ts   # Lấy danh sách sản phẩm, chi tiết sản phẩm
│   │   └─── ......     #
│   │
│   ├── assets/             # Chứa file tĩnh
│   │   ├── images/         # Các ảnh cho dự án
│   │   └── styles/
│   │       └── global.css  # File CSS toàn cục, đinh nghĩa biến CSS, viết một số style chung nhất
│   │
│   ├── components/         # Component React
│   │   ├── ui/             # UI Kit "ngu" (Dumb Components)
│   │   │   ├── Button      # Chứa Button.tsx + Button.css
│   │   │   ├── Loading     # Fle .tsx để tạo thành phần tái sử dụng, css để dành cho riêng thành phần đó
│   │   │   └── ....        # Tương tự
│   │   │
│   │   ├── layout/         # Khung trang (Lắp ráp UI, làm khung chung và không có logic)
│   │   │   ├── MainLayout  # Cũng giống như ui, nhưng dành cho layout
│   │   │   └── ...
│   │   │
│   │   └── features/       # Component "thông minh" (Smart Components), có thể ghép bởi ui, có logic
│   │       └── ...         # Cấu trúc tương tự, cần một thư mục chứ .tsx và .css riêng

│   │
│   ├── hooks/              # Custom Hooks (ngoài Redux)
│   │
│   ├── pages/              # Các trang (tương ứng với route)
│   │   ├── user/           # Trang dành cho người dùng
│   │   │   
│   │   └── admin/          # Trang dành cho admin
│   │
│   ├── router/             # Logic React Router
│   │   ├── AppRoutes.tsx
│   │   └── ...
│   │
│   ├── store/              # Logic Redux
│   │   ├── slices/         # Các "kho con"
│   │   │   ├── authSlice.ts
│   │   │   ├── cartSlice.ts
│   │   │   └── productSlice.ts
│   │   ├── hooks.ts        # Định nghĩa useAppDispatch/useAppSelector
│   │   └── store.ts        # configureStore (Kho tổng)
│   │
│   ├── types/              # Định nghĩa TypeScript
│   │   ├── common.types.ts   # Chứa các ENUM (TOrderStatus...)
│   │   ├── fe.types.ts       # Chứa type của FE (ICartItem...)
│   │   ├── inventory.types.ts
│   │   ├── navigation.types.ts # Chứa INavLinkItem
│   │   ├── order.types.ts
│   │   ├── people.types.ts
│   │   ├── product.types.ts
│   │   └── index.ts          # File "barrel" export tất cả các type
│   │
│   ├── utils/              # Các hàm tiện ích
│   │   ├── localStorage    # Chứa logic lưu/xoá/lấy data từ localStorage
│   │   └── ...
│   │
│   ├── App.tsx             # Component gốc (chứa Router)
│   └── main.tsx           # Điểm vào ứng dụng (chứa Redux Provider)
│
├── .env.local              # File biến môi trường (Không đưa lên GitHub)
├── .env.example            # Mẫu viết file .env.local để chạy dự án
├── .eslintrc.cjs           # File cấu hình ESLint
├── .gitignore              # File .gitignore
├── index.html              # File HTML gốc (điểm vào của Vite)
├── package.json            #
├── tsconfig.json           # Cấu hình TypeScript
└── vite.config.ts          # File cấu hình Vite

Dự án được tổ chức theo "feature" (tính năng) và "domain" (khu vực).

---

## ✍️ Quy tắc Viết Code (Coding Convention)

Đây là các quy tắc bắt buộc khi tham gia dự án để đảm bảo code đồng nhất.

### 1. Hướng dẫn viết Component (`ui` vs `features`)

Đây là quy tắc quan trọng nhất của dự án này.

#### `components/ui` (UI Kit)
* **Mục đích:** Là các "viên gạch" cơ bản, tái sử dụng 100%.
* **Quy tắc:**
    * *PHẢI* nhận props (ví dụ:  `onClick`).
    * *KHÔNG ĐƯỢC* `import` `useAppDispatch` hay `useAppSelector`.
    * *KHÔNG ĐƯỢC* `import` từ `src/api/`.
    * *PHẢI* được style riêng.
* **Ví dụ:** `Button.tsx` được style bằng Button.css vớ, 

#### `components/features`
* **Mục đích:** Là các "cụm gạch" đã được lắp ráp, có logic cụ thể cho một tính năng.
* **Quy tắc:**
    * *ĐƯỢC PHÉP* `import` `useAppDispatch` / `useAppSelector` để lấy/thay đổi state.
    * *NÊN* sử dụng các component `ui` (ví dụ: `<Card>`, `<Button>`) để xây dựng giao diện.
* **Ví dụ:** `ProductCard.tsx` (dùng `Card` và `Button`, biết `dispatch(addItem)`).

### 2. Hướng dẫn Quản lý State (Redux)

* **State Phía Client:** (ví dụ: giỏ hàng, `isOpenMenu`): Dùng **`reducers`** đồng bộ trong slice (ví dụ: `cartSlice.ts`).
* **State Phía Server:** (ví dụ: danh sách sản phẩm, đơn hàng): Dùng **`createAsyncThunk`** để gọi API và quản lý state (`status: 'loading'`, `error`) trong **`extraReducers`** (ví dụ: `productSlice.ts`).
* **Hooks:** Luôn luôn dùng `useAppDispatch` và `useAppSelector` từ `src/store/hooks.ts`.
    * **KHÔNG** `import { useDispatch, useSelector } from 'react-redux'`.

### 3. Hướng dẫn viết API

* Tất cả các hàm gọi API phải nằm trong thư mục `src/api/`.
* Luôn sử dụng `axiosClient` đã được cấu hình (từ `api/axiosClient.ts`), không gọi `axios.get(...)` trực tiếp trong component.
* Các hàm API nên được gọi từ bên trong `createAsyncThunk` (trong các file slice).

### 4. Quy tắc Đặt tên (Types)

* Dùng tiền tố `I` cho `interface` (ví dụ: `IProduct`, `IOrder`).
* Dùng tiền tố `T` cho `type` (ví dụ: `TOrderStatus`, `TPaymentStatus`).
* **Rất quan trọng:** Tên thuộc tính trong `interface` phải là `snake_case` (ví dụ: `product_name`) để khớp 100% với JSON do BE trả về.
* Luôn dùng `string` cho các kiểu `BIGINT` (IDs) và `DATETIME`/`TIMESTAMP`.
* Sử dụng `import type { ... }` khi chỉ import `interface` hoặc `type` để giúp Vite biên dịch nhanh hơn.

### 5. Quy tắc CSS

* Tất cả CSS toàn cục được viết trong `src/assets/styles/global.css`.
* Sử dụng các biến CSS đã định nghĩa trong `:root` (ví dụ: `var(--primary-color)`).
* Ưu tiên dùng `className` thay vì `style={{ ... }}` (inline styles).
* Tên class nên đặt theo quy tắc BEM (Block-Element-Modifier) hoặc tương tự (ví dụ: `.product-card`, `.product-card__title`, `.product-card--featured`).
* Mỗi component nên có file CSS riêng (ví dụ: `Button.css` cho `Button.tsx`), có tác dụng css hình dạng, kích thước.
* Màu sắc liên quan đến theme (chủ đề) chung của ứng dụng nên đặt trong `global.css` để đồng nhất. Một vài màu đặc thù của component có thể đặt trong file CSS riêng của component đó.
---

## 🌐 Luồng làm việc với Git (Git Workflow)

Chúng ta sử dụng một luồng Git đơn giản dựa trên "feature branch".

1.  **Branch Chính:**
    * `main` (hoặc `master`): Đây là branch ổn định, code trên này luôn là code chạy được (production-ready).
    * **TUYỆT ĐỐI KHÔNG** commit trực tiếp lên `main`.

2.  **Làm tính năng mới (Ví dụ: làm trang Login):**
    * Đảm bảo bạn đang ở `main` và code đã mới nhất:
        ```bash
        git checkout main
        git pull origin main
        ```
    * Tạo một branch mới cho tính năng của bạn:
        ```bash
        # Cú pháp: [loại]/[tên-tính-năng]
        # (loại: feat, fix, chore, docs)
        git checkout -b feat/login-page
        ```

3.  **Làm việc:**
    * Code và `commit` thường xuyên trên branch của bạn.
    * Viết message commit rõ ràng (ví dụ: `feat: Add LoginForm component`, `fix: Fix password validation`).

4.  **Tạo Pull Request (PR):**
    * Khi tính năng hoàn thành, đẩy branch của bạn lên remote:
        ```bash
        git push -u origin feat/login-page
        ```
    * Lên GitHub (hoặc GitLab/Bitbucket), tạo một **Pull Request (PR)** từ `feat/login-page` vào `main`.
    * Thêm đồng đội (team members) vào làm "Reviewers" (người duyệt code).

5.  **Merge:**
    * Sau khi code được duyệt (approved) và vượt qua các kiểm tra (nếu có), người duyệt sẽ **Merge** PR đó vào `main`.
    * Xóa branch `feat/login-page` sau khi đã merge.

6.  **Cập nhật:**
    * Luôn kéo code mới nhất từ `main` về trước khi bắt đầu một tính năng mới (Quay lại Bước 2).

---