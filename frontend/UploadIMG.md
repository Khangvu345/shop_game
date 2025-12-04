### Hướng dẫn Upload file (Multipart)
Khi gọi API upload ảnh (ví dụ: Tạo sản phẩm), Backend yêu cầu gửi dữ liệu dạng `multipart/form-data`.
**Lưu ý quan trọng:** Phần JSON data phải được bọc trong `Blob` với type `application/json` thì Spring Boot mới đọc được.

**Ví dụ code:**
```typescript
const createProductWithImage = async (productData: any, file: File) => {
    const formData = new FormData();

    // 1. Phần JSON: Phải convert sang Blob và set type application/json
    formData.append("data", new Blob([JSON.stringify(productData)], { type: "application/json" }));

    // 2. Phần File: Gửi trực tiếp file object
    if (file) {
        formData.append("image", file);
    }

    // 3. Gọi API
    return axiosClient.post('/products', formData, {
        headers: { "Content-Type": "multipart/form-data" }
    });
};

### Tại sao cần thêm vào đây?
1.  **Tránh lỗi "415 Unsupported Media Type":** Đây là lỗi phổ biến nhất khi FE gửi JSON string thẳng vào FormData mà không bọc Blob + type json.
2.  **Chuẩn hóa:** Giúp mọi người trong team biết cách xử lý file upload giống nhau.
3.  **Dễ nhớ:** Vì logic `new Blob(...)` hơi dài dòng và khó nhớ, nên document lại để copy-paste cho nhanh.

### Cách xem và quản lý ảnh trên Cloudinary
Sau khi upload thành công qua API, ảnh sẽ được lưu trên Cloud này. Để kiểm tra hoặc xóa ảnh:

1.  Truy cập [Cloudinary Console](https://console.cloudinary.com/).
2.  Đăng nhập bằng tài khoản chung của dự án (liên hệ Leader để lấy thông tin).
3.  Ở menu bên trái, chọn **Media Library**.
4.  Vào thư mục **`gameshop_products`**.
    * Tại đây bạn sẽ thấy tất cả ảnh sản phẩm đã upload.
    * Bạn có thể xem URL, xóa hoặc tải ảnh về nếu cần.