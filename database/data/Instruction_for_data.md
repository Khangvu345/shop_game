## HOW TO USE DATA

## 1. Giới thiệu
- Các ảnh được lấy từ tập tin `pictures_for_product`.  
- `pk-ps5` là các phụ kiện PS5, tương tự cho PS4 và Switch.  
- `ps5` là máy PS5, tương tự cho PS4 và Switch.  

## 2. Nguồn dữ liệu
- Dữ liệu được crawl gốc từ website XGAME: [https://xgame.vn/](https://xgame.vn/)  
- Phần **product** và **category** được crawl từ web.

## 3. Hướng dẫn sử dụng
1. Chuẩn bị các file ảnh trong thư mục `pictures_for_product`.  
2. Map ảnh với sản phẩm theo tên/categoryID.
3. Chạy script seed hoặc upload dữ liệu vào database theo hướng dẫn trong `seed_dev.sql` / `data.sql`.  
4. Dữ liệu bị lỗi cần xoá hết copy/paste file xoa_all_bang.sql.

## 4. Lưu ý
- Để test nhanh quy trình làm với database như sau: 
1. Vào csdl tạo database `shop_game`.
2. Copy file schema.sql vào csdl để tạo các bảng
3. Chạy file seed_dev.sql để tạo dữ liệu master data
4. Chạy file data.sql để tạo dữ liệu sản phẩm
5. Vào test với dữ liệu thực tế