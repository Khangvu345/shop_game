
USE shop_game;
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE category;
TRUNCATE TABLE product;
SET FOREIGN_KEY_CHECKS = 1;
INSERT INTO category (category_id, category_name, description, parent_id) VALUES

-- Cấp 1 - Danh mục gốc
(1,  'Máy Chơi Game',          'Tất cả các hệ máy chơi game console chính hãng và 2nd', NULL),
(2,  'Game Các Hệ Máy',        'Game bản đĩa và digital cho PS5, PS4, Nintendo Switch', NULL),
(3,  'Linh Phụ Kiện',          'Phụ kiện chính hãng & third-party: tay cầm, tai nghe, dock, vô lăng…', NULL),
(4,  'Thẻ Gift Card & Amiibo', 'Thẻ nạp tiền PSN, Nintendo eShop Card và figure Amiibo', NULL),

-- Cấp 2 - Máy chơi game
(101, 'PlayStation 5',         'Máy PS5 chính hãng Sony Việt Nam và hàng xách tay Nhật/Hàn/Mỹ', 1),
(102, 'PlayStation 4',         'PS4 Pro, PS4 Slim mới và đã qua sử dụng (có cả máy hack)', 1),
(103, 'Nintendo Switch',       'Switch V2, OLED, Lite và Nintendo Switch 2 (2025)', 1),

-- Cấp 2 - Game
(201, 'Game PS5',              'Đĩa game PS5 chính hãng Asia, US, Japan – bản mới nhất 2024-2025', 2),
(202, 'Game PS4',              'Đĩa game PS4 Asia, có tiếng Việt, hỗ trợ chơi trên PS5', 2),
(203, 'Game Switch',           'Game Nintendo Switch cartridge chính hãng, có hỗ trợ tiếng Việt', 2),

-- Cấp 2 - Phụ kiện
(301, 'Phụ kiện PS5',         'DualSense, Pulse 3D, Portal, SSD mở rộng, dock sạc… dành riêng cho PS5', 3),
(302, 'Phụ kiện PS4',          'DualShock 4, tai nghe, camera, vô lăng, bọc tay cầm cho PS4', 3),
(303, 'Phụ kiện Switch',       'Joy-Con, Pro Controller, dock 4K, grip, thẻ nhớ, bao đựng Switch', 3),

-- Cấp 2 - Thẻ nạp & Amiibo
(401, 'PSN Card',              'Thẻ PSN Plus, PSN Card nạp tiền (US, Asia, Japan)', 4),
(402, 'eShop Card',            'Thẻ Nintendo eShop Mỹ/Nhật/HongKong dùng nạp tiền mua game', 4),
(403, 'Amiibo',                'Figure Amiibo chính hãng Nintendo (Zelda, Mario, Pokémon…)', 4);

INSERT INTO product (
    sku,
    product_name,
    description,
    list_price,
    stock_quantity,
    purchase_price,
    status,
    category_id,
    created_at,
    updated_at
) VALUES
('PS5PRO-30TH', 'Máy PS5 Pro 30th Anniversary Limited Edition', 
'1. Thông tin cơ bản
- Tên sản phẩm: PS5 Pro 30th Anniversary Limited Edition
- Hãng sản xuất: Sony
- Loại máy: Digital Edition (không ổ đĩa)
- Ngày ra mắt: 07/11/2024
- SKU / Số lượng giới hạn: Chỉ 12.300 chiếc toàn cầu, có khắc số series riêng
- Tình trạng: Hàng Order (giá có thể thay đổi)

2. Bộ sản phẩm đi kèm (full set)
- Limited edition PS5 Pro Digital Edition console
- Limited edition DualSense wireless controller
- Limited Edition DualSense Edge controller
- Limited edition console cover cho disc drive (gắn thêm được)
- Limited Edition DualSense Charging Station
- Limited edition vertical stand
- Original PlayStation controller-style cable connector housing
- 4 PlayStation shapes cable ties
- PlayStation sticker
- Limited edition Play poster (1 trong 30 thiết kế ngẫu nhiên)
- PlayStation paperclip

3. Thông số kỹ thuật nổi bật
- GPU nâng cấp +67% computing units so với PS5 thường
- Bộ nhớ nhanh hơn +28%
- Ray Tracing cải tiến (gấp 2-3 lần tốc độ)
- PlayStation Spectral Super Resolution (AI upscaling)
- PS5 Pro Game Boost (hỗ trợ >8.500 game PS4)
- Wi-Fi 7, VRR, hỗ trợ 8K
- SSD 2TB
- Trò chơi cài sẵn: Astro’s Playroom',
74999000, 3, 68500000, 'Active', 101, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('PS5PRO-DIGI', 'Máy PS5 Pro Digital Edition', 
'1. Thông tin cơ bản
- Tên sản phẩm: PS5 Pro Digital Edition
- Hãng sản xuất: Sony
- Loại máy: Digital Edition (không ổ đĩa, có thể gắn thêm disc drive riêng)
- Ngày ra mắt: 07/11/2024
- Tình trạng: Có sẵn

2. Bộ sản phẩm đi kèm
- Máy PS5 Pro Digital Edition
- Tay cầm DualSense
- Cáp HDMI, cáp nguồn, dây USB
- Trò chơi cài sẵn: Astro’s Playroom

3. Thông số kỹ thuật nổi bật
- GPU nâng cấp +67% computing units
- Bộ nhớ nhanh hơn +28%
- Ray Tracing cải tiến (gấp 2-3 lần)
- PlayStation Spectral Super Resolution (AI upscaling)
- PS5 Pro Game Boost (>8.500 game PS4)
- Wi-Fi 7, VRR, hỗ trợ 8K
- SSD 2TB',
20499000, 18, 17800000, 'Active', 101, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('PS5SLIM-30TH', 'Máy PS5 Slim Digital 30th Anniversary Limited Edition', 
'1. Thông tin cơ bản
- Tên sản phẩm: PS5 Slim Digital 30th Anniversary Limited Edition
- Hãng sản xuất: Sony
- Loại máy: Digital Edition (không ổ đĩa)
- Ngày ra mắt: 2024 (phiên bản kỷ niệm 30 năm PlayStation)
- Tình trạng: Hàng Order (2-5 ngày có máy)

2. Bộ sản phẩm đi kèm (full set)
- Limited edition PS5 Slim Digital Edition console
- Limited edition DualSense wireless controller
- Limited edition console cover cho disc drive
- Limited edition vertical stand
- Original PlayStation controller-style cable connector housing
- 4 PlayStation shapes cable ties
- PlayStation sticker
- Limited edition PlayStation poster (1 trong 30 thiết kế)
- PlayStation paperclip

3. Thông số kỹ thuật nổi bật
- Thiết kế Slim nhỏ hơn 30% so với PS5 gốc
- SSD 1TB
- Hỗ trợ 4K 120Hz, 8K, VRR
- Trò chơi cài sẵn: Astro’s Playroom
- Tương thích ngược PS4',
15999000, 6, 13800000, 'Active', 101, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('PS5SLIM-DIGI', 'Máy PS5 Slim Digital Edition', 
'1. Thông tin cơ bản
- Tên sản phẩm: PS5 Slim Digital Edition
- Hãng sản xuất: Sony
- Loại máy: Digital Edition (không ổ đĩa, có thể gắn thêm disc drive)
- Model: CFI-2000 (Japan/Korea)
- Tình trạng: Có sẵn

2. Bộ sản phẩm đi kèm
- Máy PS5 Slim Digital Edition
- Tay cầm DualSense
- 2 chân đế ngang
- Cáp HDMI, cáp nguồn, dây USB
- Trò chơi cài sẵn: Astro’s Playroom
(Đế đứng dọc bán riêng)

3. Thông số kỹ thuật nổi bật
- Thiết kế nhỏ hơn 30%, nhẹ chỉ 2.6kg
- SSD 1TB
- CPU AMD Zen 2 8 nhân, GPU 10.3 TFLOPS
- Hỗ trợ 4K 120Hz, 8K, VRR (HDMI 2.1)
- Tương thích ngược PS4',
10999000, 35, 9200000, 'Active', 101, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('PS5SLIM-DISC-VN', 'Máy PS5 Slim Standard Ổ Đĩa Sony VN chính hãng', 
'1. Thông tin cơ bản
- Tên sản phẩm: PS5 Slim Standard Edition (có ổ đĩa)
- Hãng sản xuất: Sony
- Phân phối: Sony Việt Nam chính hãng
- Model: CFI-2018A
- Bảo hành: 12 tháng chính hãng
- Tình trạng: Có sẵn

2. Bộ sản phẩm đi kèm
- Máy PS5 Slim Standard (có ổ đĩa Blu-ray)
- Tay cầm DualSense
- 2 chân đế ngang
- Cáp HDMI, cáp nguồn, dây USB
- Trò chơi cài sẵn: Astro’s Playroom
(Đế đứng dọc bán riêng)

3. Thông số kỹ thuật nổi bật
- Thiết kế nhỏ hơn 30%, nặng 3.2kg
- SSD 1TB
- CPU AMD Zen 2 8 nhân, GPU 10.3 TFLOPS
- Hỗ trợ 4K 120Hz, 8K, VRR (HDMI 2.1)
- Ổ đĩa Ultra HD Blu-ray
- Tương thích ngược PS4',
11999000, 42, 9980000, 'Active', 101, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO product (
    sku,
    product_name,
    description,
    list_price,
    stock_quantity,
    purchase_price,
    status,
    category_id,
    created_at,
    updated_at
) VALUES
('PS4PRO-7117B-HACK', 'Máy PS4 Pro 1TB CUH-7117B 2ND Hacked FullBOX', 
'1. Thông tin cơ bản
- Model: CUH-7117B (PS4 Pro)
- Dung lượng: 1TB
- Tình trạng: Máy cũ fullBOX, còn rất đẹp
- Firmware: Đã hacked + đĩa kích hack
- Game cài sẵn: 21 game (PES 21 update, FC 26, God of War…)
- Bảo hành: 03 tháng

2. Bộ sản phẩm đi kèm
- Máy PS4 Pro 1TB
- Tay cầm DualShock 4 đen
- Cáp HDMI, cáp nguồn, cáp sạc USB

3. Thông số kỹ thuật nổi bật
- GPU 4.20 TFLOPS → hỗ trợ 4K checkerboard
- CPU x86-64 AMD Jaguar 8 nhân
- HDD 1TB, dễ thay SSD
- Chơi game hack trọn đời',
6799000, 7, 5200000, 'Active', 102, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('PS4SLIM-1TB-2ND', 'Máy PS4 Slim 1TB CUH-2218B 2ND', 
'1. Thông tin cơ bản
- Model: CUH-2218B
- Dung lượng: 1TB
- Tình trạng: Máy cũ noBOX, FW 12.52
- Game digital sẵn có: It Takes Two, Mortal Kombat 11 Ultimate, Injustice 2, Spider-Man Miles Morales
- Bảo hành: 03 tháng

2. Bộ sản phẩm đi kèm
- Máy PS4 Slim 1TB
- Tay cầm DualShock 4 đen
- Cáp HDMI, cáp nguồn, cáp sạc USB

3. Thông số kỹ thuật nổi bật
- Thiết kế mỏng nhẹ, nhám chống bám vân
- GPU 1.84 TFLOPS, hỗ trợ HDR
- Dễ thay ổ cứng',
3799000, 14, 2950000, 'Active', 102, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('PS4SLIM-500GB-HACK', 'Máy PS4 Slim 500GB 2ND FullBOX Hacked', 
'1. Thông tin cơ bản
- Model: CUH-2117A
- Dung lượng: 500GB
- Tình trạng: Máy cũ fullBOX đẹp
- Firmware: 9.0 đã hack
- Game cài sẵn: 12 game đỉnh cao
- Bảo hành: 03 tháng

2. Bộ sản phẩm đi kèm
- Máy PS4 Slim 500GB
- Tay cầm DualShock 4 đen
- Cáp HDMI, cáp nguồn, cáp sạc USB

3. Thông số kỹ thuật nổi bật
- Thiết kế Slim siêu mỏng
- GPU 1.84 TFLOPS, HDR
- Chơi game miễn phí trọn đời',
5799000, 5, 4450000, 'Active', 102, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('PS4PRO-7218B-FULLGAME', 'Máy PS4 Pro 1TB CUH-7218B Hacked Full 22 Game', 
'1. Thông tin cơ bản
- Model: CUH-7218B
- Tình trạng: Máy cũ fullBOX đẹp
- Firmware: 11.0 đã hacked + cục kích hack
- Game cài sẵn: 22 game (PES 21 update, FC 25, God of War…)
- Bảo hành: 03 tháng

2. Bộ sản phẩm đi kèm
- Máy PS4 Pro 1TB
- Tay cầm DualShock 4 đen
- Cáp HDMI, cáp nguồn, cáp sạc USB

3. Thông số kỹ thuật nổi bật
- Hỗ trợ 4K checkerboard
- GPU 4.20 TFLOPS
- HDD 1TB',
7499000, 4, 5850000, 'Active', 102, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('PS4PRO-PARTY', 'Máy PS4 Pro Party Bundle BH 24 tháng', 
'1. Thông tin cơ bản
- Model: CUH-7218B mới 100%
- Bảo hành chính hãng Sony VN: 24 tháng
- Khuyến mãi đặc biệt: 2 đĩa game + 2 tay cầm

2. Bộ sản phẩm đi kèm
- Máy PS4 Pro 1TB mới
- 2 tay cầm DualShock 4
- Đĩa FIFA 20 + Crash Team Racing
- Full phụ kiện + hộp

3. Thông số kỹ thuật nổi bật
- GPU 4.20 TFLOPS, hỗ trợ 4K
- Bảo hành dài nhất thị trường',
9999000, 9, 8200000, 'Active', 102, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('PS4SLIM-MEGA', 'Máy PS4 Slim 1TB Mega Pack 3 Game', 
'1. Thông tin cơ bản
- Model: CUH-2218
- Dung lượng: 1TB
- Bundle chính hãng 3 game AAA

2. Bộ sản phẩm đi kèm
- Máy PS4 Slim 1TB
- Tay cầm DualShock 4
- 3 đĩa game: God of War, Horizon Zero Dawn Complete, GTA V Premium
- Full phụ kiện

3. Thông số kỹ thuật nổi bật
- HDD 1TB siêu rộng
- Thiết kế Slim gọn nhẹ',
7499000, 11, 6100000, 'Active', 102, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('PS4PRO-500MILLION', 'Máy PS4 Pro 2TB 500 Million Limited Edition', 
'1. Thông tin cơ bản
- Phiên bản kỷ niệm 500 triệu máy PS
- Số lượng giới hạn toàn cầu 50.000 chiếc
- Màu xanh trong suốt + logo đồng
- Dung lượng gốc: 2TB

2. Bộ sản phẩm đi kèm
- Máy PS4 Pro 2TB Limited
- Tay cầm + camera + đế đứng trong suốt
- Full hộp gốc + số serial riêng

3. Thông số kỹ thuật nổi bật
- Ổ cứng 2TB nguyên bản
- Giá trị sưu tầm cực cao',
0, 1, 0, 'Active', 102, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),  -- trưng bày hoặc hết hàng

('PS4SLIM-FFXV-LE', 'Máy PS4 Slim 1TB Final Fantasy XV Luna Edition Hacked', 
'1. Thông tin cơ bản
- Phiên bản Limited Final Fantasy XV Luna Edition
- Model: PCAS-02028HA
- Tình trạng: Like New 99%, fullBOX
- Đã hacked FW 11.0 + 25 game

2. Bộ sản phẩm đi kèm
- Máy + tay cầm Luna Edition
- Cáp đầy đủ

3. Thông số kỹ thuật nổi bật
- Thiết kế Luna cực đẹp & hiếm
- Chơi game hack trọn đời',
6499000, 3, 5100000, 'Active', 102, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO product (
    sku,
    product_name,
    description,
    list_price,
    stock_quantity,
    purchase_price,
    status,
    category_id,
    created_at,
    updated_at
) VALUES
('NSW2-STD', 'Máy Nintendo Switch 2 New FullBOX', 
'1. Thông tin cơ bản
- Model: Nintendo Switch 2 (thế hệ mới 2025)
- Tình trạng: New 100% nguyên seal
- Bộ nhớ trong: 256GB UFS 3.1
- RAM: 12GB LPDDR5X
- Phát hành chính thức: 05/06/2025
- Tương thích ngược hoàn toàn game Switch 1

2. Bộ sản phẩm đi kèm
- Máy Nintendo Switch 2
- Joy-Con 2 (trái + phải) gắn nam châm
- Tay cầm Joy-Con Grip
- Dây đeo Joy-Con
- Dock xuất TV (thiết kế mới bo tròn)
- Cáp HDMI tốc độ cao + sạc USB-C
- Tặng: Bao đựng Dobe hoặc ốp silicon + dán cường lực (400k)

3. Thông số kỹ thuật nổi bật
- Màn hình 8 inch 1080p (dự kiến)
- 2 quạt tản nhiệt chủ động
- Joy-Con gắn nam châm + dùng như chuột
- Hỗ trợ HDMI 2.1, cổng USB-C trên nóc máy
- Chân đế chữ U siêu rộng',
12999000, 22, 10850000, 'Active', 103, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('NSW2-POKEMON', 'Máy Nintendo Switch 2 Pokemon Legends Z-A Bundle', 
'1. Thông tin cơ bản
- Model: Nintendo Switch 2 kèm code Pokemon Legends Z-A
- Tình trạng: New nguyên seal
- Phát hành: 16/10/2025
- Bộ nhớ 256GB + 12GB RAM

2. Bộ sản phẩm đi kèm
- Full phụ kiện giống bản thường
- Code tải game Pokemon Legends Z-A chính hãng
- Tặng bao đựng + dán cường lực trị giá 500k

3. Thông số kỹ thuật nổi bật
- Joy-Con gắn nam châm thế hệ mới
- Tương thích ngược 100% game Switch cũ
- Hỗ trợ 4K khi dock (dự kiến)',
14199000, 15, 11880000, 'Active', 103, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('NSW2-MARIOKART', 'Máy Nintendo Switch 2 Mario Kart World Bundle', 
'1. Thông tin cơ bản
- Model: Nintendo Switch 2 kèm code Mario Kart World
- Tình trạng: New nguyên seal
- Phát hành: 05/06/2025

2. Bộ sản phẩm đi kèm
- Fullbox giống bản tiêu chuẩn
- Code tải game Mario Kart World
- Tặng bao + dán cường lực trị giá 500k

3. Thông số kỹ thuật nổi bật
- Thiết kế Joy-Con 2 mới + nút chuột
- HDMI 2.1, bộ nhớ trong 256GB',
13999000, 18, 11650000, 'Active', 103, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('NSW-OLED-ZELDA', 'Máy Nintendo Switch OLED The Legend of Zelda: Tears of the Kingdom Edition', 
'1. Thông tin cơ bản
- Phiên bản Limited Zelda TOTK
- Màn hình OLED 7 inch
- Hoa văn Zonai vàng cực đẹp
- Dock và Joy-Con theme đặc biệt

2. Bộ sản phẩm đi kèm
- Máy + dock + Joy-Con Zelda Edition
- Full phụ kiện chính hãng
- Tặng bao đựng + dán cường lực (400k)

3. Thông số kỹ thuật nổi bật
- Bộ nhớ 64GB + LAN có dây trên dock
- Chân đế rộng, loa cải tiến
- Màu sắc sưu tầm cực hiếm',
7999000, 8, 6500000, 'Active', 103, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('NSW-OLED-MARIO', 'Máy Nintendo Switch OLED Mario Red Edition', 
'1. Thông tin cơ bản
- Phiên bản đặc biệt Mario Red
- Toàn bộ máy + dock + Joy-Con màu đỏ Mario
- Mặt sau dock có hình Mario ẩn

2. Bộ sản phẩm đi kèm
- Fullbox Mario Red Edition
- Tặng bao + dán cường lực (400k)

3. Thông số kỹ thuật nổi bật
- Màn hình OLED 7 inch rực rỡ
- Dock có cổng LAN tích hợp',
7799000, 12, 6350000, 'Active', 103, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('NSW-OLED-SPLATOON3', 'Máy Nintendo Switch OLED Splatoon 3 Edition', 
'1. Thông tin cơ bản
- Phiên bản Limited Splatoon 3
- Joy-Con gradient tím - xanh lá cực chất
- Dock và máy phủ họa tiết mực Splatoon

2. Bộ sản phẩm đi kèm
- Fullbox Splatoon 3 Edition
- Tặng bao + dán cường lực (400k)

3. Thông số kỹ thuật nổi bật
- OLED 7 inch + loa cải tiến
- Bộ nhớ 64GB + LAN dock',
7999000, 10, 6500000, 'Active', 103, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('NSW-OLED-WHITE-HACK', 'Máy Nintendo Switch OLED White Hacked Full Game', 
'1. Thông tin cơ bản
- Model OLED White đã hacked
- Kèm thẻ nhớ 128GB hoặc 256GB full game
- Lưu ý: Không online, không update

2. Bộ sản phẩm đi kèm
- Máy OLED White + dock thường
- Full phụ kiện + thẻ nhớ full game
- Tặng bao + dán cường lực

3. Thông số kỹ thuật nổi bật
- Màn hình OLED 7 inch đẹp nhất dòng Switch
- Chơi thoải mái mọi game offline',
8799000, 6, 7100000, 'Active', 103, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('NSW-OLED-POKEMON', 'Máy Nintendo Switch OLED Pokémon Scarlet & Violet Edition', 
'1. Thông tin cơ bản
- Phiên bản Limited Pokémon Scarlet & Violet
- Joy-Con tím - cam + dock họa tiết Pokémon

2. Bộ sản phẩm đi kèm
- Fullbox Pokémon Edition
- Tặng bao + dán cường lực (400k)

3. Thông số kỹ thuật nổi bật
- OLED 7 inch + dock có LAN
- Thiết kế sưu tầm đẹp nhất 2022',
7799000, 9, 6350000, 'Active', 103, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('NSW-OLED-WHITE', 'Máy Nintendo Switch OLED White New', 
'1. Thông tin cơ bản
- Model OLED White chính hãng
- Joy-Con trắng tinh khôi

2. Bộ sản phẩm đi kèm
- Fullbox mới 100%
- Tặng bao + dán cường lực (400k)

3. Thông số kỹ thuật nổi bật
- Màn hình OLED 7 inch
- Dock có cổng mạng LAN',
7299000, 25, 5950000, 'Active', 103, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
-- ==================== GAME PS5 (category_id = 201) ====================
INSERT INTO product (
    sku, product_name, description, list_price, stock_quantity, purchase_price, status, category_id, created_at, updated_at
) VALUES
('NINJAGAIDEN4-PS5', 'Ninja Gaiden 4 (PS5)', 
'1. Thông tin\n- Phát hành: 21/10/2025\n- Thể loại: Hack & Slash\n- Team Ninja x PlatinumGames\n\n2. Nội dung hot\n- Nhân vật chính: Thần đồng ninja Yakumo + Ryu Hayabusa\n- Bối cảnh Tokyo tương lai bị miasma bao phủ\n- Bloodbind Ninjutsu biến đổi vũ khí\n- Hero Mode cho người mới\n\n3. Tình trạng\n- Đĩa PS5 Asia\n- Fullbox seal zin',
1749000, 38, 1180000, 'Active', 201, NOW(), NOW()),

('BATTLEFIELD6-PS5', 'Battlefield 6 (PS5)', 
'1. Thông tin\n- Phát hành: 10/10/2025\n- Thể loại: FPS All-Out Warfare\n- Campaign + Portal trở lại\n\n2. Điểm nhấn\n- Gunplay + movement cải tiến hoàn toàn\n- Chiến dịch 2027: NATO vs Pax Armata\n- Tactical destruction đỉnh cao\n- Cross-play full\n\n3. Tình trạng\n- Đĩa PS5 Asia\n- Box zin nguyên seal',
1749000, 45, 1190000, 'Active', 201, NOW(), NOW()),

('BORDERLANDS4-PS5', 'Borderlands 4 (PS5)', 
'1. Thông tin\n- Phát hành: 15/09/2025\n- Thể loại: Looter Shooter\n- Gearbox trở lại\n\n2. Nội dung\n- Hành tinh mới + phản diện Timekeeper\n- Vũ khí tỷ tỷ + build cực sâu\n- Co-op 4 người mượt mà\n\n3. Tình trạng\n- Đĩa PS5 Asia\n- Fullbox đẹp lung linh',
1599000, 52, 1080000, 'Active', 201, NOW(), NOW()),

('SILENTHILLF-PS5', 'Silent Hill f (PS5)', 
'1. Thông tin\n- Phát hành: 25/09/2025\n- Thể loại: Survival Horror\n- Bối cảnh Nhật Bản 1960s\n\n2. Đặc sắc\n- Không súng, cận chiến siêu căng\n- Thanh tâm trí + Dark Shrine\n- Nhiều ending, replay value cao\n\n3. Tình trạng\n- Đĩa PS5 Asia\n- Box zin seal',
1649000, 41, 1120000, 'Active', 201, NOW(), NOW()),

('GHOSTYOTEI-PS5', 'Ghost of Yōtei (PS5)', 
'1. Thông tin\n- Phát hành: 02/10/2025\n- Thể loại: Open-world Action\n- Sucker Punch\n\n2. Nội dung\n- Năm 1603, nữ samurai Atsu báo thù\n- Núi Yōtei + thời tiết thay đổi\n- Gameplay kế thừa + cải tiến từ Tsushima\n\n3. Tình trạng\n- Đĩa PS5 Asia\n- Fullbox nguyên seal',
1799000, 36, 1220000, 'Active', 201, NOW(), NOW()),

('FC26-PS5', 'EA SPORTS FC 26 (PS5)', 
'1. Thông tin\n- Phát hành: 26/09/2025\n- Thể loại: Bóng đá\n- Cross-play full\n\n2. Tính năng mới\n- Authentic vs Competitive mode\n- Archetypes + PlayStyles mới\n- Be-a-Keeper + Tournament mode\n- Career cải tiến sâu\n\n3. Tình trạng\n- Đĩa Asia có tiếng Việt\n- Box zin đẹp',
1599000, 68, 1050000, 'Active', 201, NOW(), NOW()),

('LOSTSOUL-PS5', 'Lost Soul Aside (PS5)', 
'1. Thông tin\n- Phát hành: 29/08/2025\n- Thể loại: Action RPG\n- China Hero Project\n\n2. Điểm nhấn\n- Hack & Slash siêu nhanh kiểu DMC + FFXV\n- Nhân vật Kazer + rồng biến kiếm\n- Đồ họa UE5 cực nét\n\n3. Tình trạng\n- Đĩa PS5 Asia\n- Fullbox seal zin',
1499000, 59, 1000000, 'Active', 201, NOW(), NOW()),

('NBA2K26-PS5', 'NBA 2K26 (PS5 - Asia)', 
'1. Thông tin\n- Phát hành: 05/09/2025\n- Công nghệ ProPLAY™ mới nhất\n\n2. Chế độ hot\n- MyCAREER City tinh gọn\n- Build-By-Badges tùy chỉnh sâu\n- MyTEAM + MyNBA cải tiến\n\n3. Tình trạng\n- Đĩa Asia có tiếng Việt\n- Box zin nguyên seal',
1499000, 72, 980000, 'Active', 201, NOW(), NOW()),

('MGSDELTA-PS5', 'Metal Gear Solid Δ: Snake Eater (PS5)', 
'1. Thông tin\n- Phát hành: 28/08/2025\n- Thể loại: Stealth Action\n- Remake MGS3 bằng UE5\n\n2. Đặc điểm\n- Đồ họa + hiệu ứng hoàn toàn mới\n- Giữ nguyên cốt truyện gốc\n- Gameplay hiện đại hóa\n\n3. Tình trạng\n- Đĩa PS5 Asia\n- Fullbox đẹp',
1649000, 48, 1100000, 'Active', 201, NOW(), NOW()),

('DOOMDARK-PS5', 'DOOM: The Dark Ages (PS5)', 
'1. Thông tin\n- Phát hành: 15/05/2025\n- Thể loại: FPS\n- Tiền truyện của DOOM 2016\n\n2. Nổi bật\n- Shield Saw chặn đạn + cưa đôi quái\n- Cưỡi rồng + lái Mecha khổng lồ\n- Gameplay "xe tăng" cực gắt\n\n3. Tình trạng\n- Đĩa PS5 Asia\n- Box zin seal nguyên',
1599000, 55, 1080000, 'Active', 201, NOW(), NOW());

-- ==================== GAME PS4 (category_id = 202) ====================
INSERT INTO product (
    sku, product_name, description, list_price, stock_quantity, purchase_price, status, category_id, created_at, updated_at
) VALUES
('NBA2K26-PS4', 'NBA 2K26 (PS4 - Asia)', 
'1. Thông tin\n- Phát hành: 05/09/2025\n- Thể loại: Sports Simulation\n- Công nghệ ProPLAY™ siêu thực\n\n2. Tính năng hot\n- MyCAREER City mới + Build-By-Badges\n- MyTEAM sưu tầm huyền thoại\n- MyNBA làm GM\n- Đồ họa 4K/120FPS\n\n3. Tình trạng\n- Đĩa PS4 Asia chính hãng\n- Có tiếng Việt (dự kiến)\n- Fullbox seal zin',
1599000, 88, 998000, 'Active', 202, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('FC26-PS4', 'EA SPORTS FC 26 (PS4)', 
'1. Thông tin\n- Phát hành: 26/09/2025\n- Thể loại: Bóng đá\n- Cross-play full thế hệ\n\n2. Tính năng mới\n- Authentic vs Competitive mode\n- FC IQ chiến thuật đời thực\n- Ultimate Team + Career cải tiến\n- Archetypes & PlayStyles mới\n\n3. Tình trạng\n- Đĩa Asia có tiếng Việt\n- Box zin nguyên seal',
1599000, 95, 965000, 'Active', 202, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('BLEACH-REBIRTH-PS4', 'Bleach Rebirth of Souls (PS4)', 
'1. Thông tin\n- Phát hành: 21/03/2025\n- Thể loại: Fighting 3D\n- Bandai Namco\n\n2. Nội dung\n- Từ đầu đến Arrancar Arc\n- Đồ họa cel-shaded cực đẹp\n- Nhiều nhân vật + chiêu thức iconic\n\n3. Tình trạng\n- Đĩa PS4 Asia\n- Fullbox đẹp lung linh',
1199000, 72, 785000, 'Active', 202, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('ATOMFALL-PS4', 'Atomfall (PS4)', 
'1. Thông tin\n- Phát hành: 27/03/2025\n- Thể loại: Survival Action\n- Rebellion (tác giả Sniper Elite)\n\n2. Đặc điểm\n- Bối cảnh Anh hậu tận thế hạt nhân\n- Sinh tồn + bắn súng + crafting\n- Khám phá tự do, nhiều ending\n\n3. Tình trạng\n- Đĩa PS4 gốc\n- Box zin seal nguyên',
1199000, 59, 765000, 'Active', 202, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('PIRATE-YAKUZA-PS4', 'Like a Dragon: Pirate Yakuza in Hawaii (PS4)', 
'1. Thông tin\n- Phát hành: 21/02/2025\n- Thể loại: Action Adventure\n- Goro Majima làm thuyền trưởng!\n\n2. Nổi bật\n- Chiêu mộ băng hải tặc\n- Chiến đấu trên biển + nhảy combo\n- Chuyển style Mad Dog ↔ Sea Dog\n\n3. Tình trạng\n- Đĩa PS4 Asia\n- Fullbox đẹp',
1199000, 78, 775000, 'Active', 202, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('WWE2K25-PS4', 'WWE 2K25 (PS4)', 
'1. Thông tin\n- Phát hành: 14/03/2025\n- Thể loại: Đấu vật\n- Intergender wrestling lần đầu xuất hiện\n\n2. Chế độ mới\n- The Island open-world\n- MyGM online multiplayer\n- Showcase Bloodline Dynasty\n\n3. Tình trạng\n- Đĩa PS4 Asia có tiếng Việt\n- Box zin seal',
1299000, 66, 858000, 'Active', 202, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('SNIPER-RESISTANCE-PS4', 'Sniper Elite: Resistance (PS4)', 
'1. Thông tin\n- Phát hành: 30/01/2025\n- Thể loại: Stealth Shooter\n- Rebellion phát triển\n\n2. Đặc điểm\n- Bắn tỉa X-ray kill cam đỉnh cao\n- Chiến dịch độc lập + co-op\n- Nhiệm vụ phụ Propaganda mới\n\n3. Tình trạng\n- Đĩa PS4 Asia\n- Fullbox nguyên seal',
1099000, 64, 698000, 'Active', 202, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('BO6-ASIA-PS4', 'Call of Duty: Black Ops 6 (PS4 - Asia)', 
'1. Thông tin\n- Phát hành: 25/10/2024\n- Bối cảnh Chiến tranh Lạnh\n- Omnimovement mới siêu mượt\n\n2. Nội dung\n- Campaign + Multiplayer 16 map\n- Zombies round-based trở lại\n\n3. Tình trạng\n- Đĩa Asia có tiếng Việt\n- Box zin đẹp',
1599000, 48, 1058000, 'Active', 202, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('NBA2K25-PS4', 'NBA 2K25 (PS4 - Asia)', 
'1. Thông tin\n- Phát hành: 06/09/2024\n- Công nghệ ProPLAY™\n- The City cực lớn\n\n2. Chế độ\n- MyCAREER + MyTEAM + MyNBA\n- The W (WNBA) siêu chi tiết\n\n3. Tình trạng\n- Đĩa Asia có tiếng Việt\n- Box zin seal',
999000, 82, 628000, 'Active', 202, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('FC25-PS4', 'EA SPORTS FC 25 (PS4)', 
'1. Thông tin\n- Phát hành: 27/09/2024\n- FC IQ + 5v5 Rush mode mới\n- Career + Ultimate Team cải tiến\n\n2. Đặc điểm\n- Đồ họa + animation siêu mượt\n- Cross-play full\n\n3. Tình trạng\n- Đĩa Asia có tiếng Việt\n- Box zin nguyên seal',
899000, 93, 558000, 'Active', 202, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- ==================== GAME SWITCH (category_id = 203) ====================
INSERT INTO product (
    sku, product_name, description, list_price, stock_quantity, purchase_price, status, category_id, created_at, updated_at
) VALUES
('NSW-POKLEGZA', 'Pokemon Legends Z-A',
'1. Thông tin\n- Phát hành: Nintendo, The Pokémon Company\n- Thể loại: Role-Playing\n- Ngày phát hành: 16/10/2025\n- Số người chơi: 1\n- Hệ máy: Nintendo Switch\n\n2. Giới thiệu\n- Pokemon Legends Z-A – game Pokemon mới sẽ xuất hiện trên Nintendo Switch vào năm 2025, đánh dấu sự trở lại vùng đất Kalos. Thành phố Lumiose, Mega Evolutions trở lại!',
1299000, 76, 880000, 'Active', 203, NOW(), NOW()),

('NSW-SMGALAXY12', 'Super Mario Galaxy + Super Mario Galaxy 2',
'1. Thông tin\n- Phát hành: Nintendo\n- Thể loại: Phiêu lưu hành động\n- Ngày phát hành: 02/10/2025\n- Số người chơi: 1-2\n- Hệ máy: Nintendo Switch\n\n2. Giới thiệu\n- Bộ đôi game 3D Mario kinh điển nay trở lại trên Switch với đồ họa nâng cấp, chơi được cả 2 phần liên tiếp!',
1499000, 62, 1020000, 'Active', 203, NOW(), NOW()),

('NSW-EAFC26', 'EA SPORTS FC 26',
'1. Thông tin\n- Phát hành: Electronic Arts\n- Thể loại: Bóng đá\n- Ngày phát hành: 26/09/2025\n- Hỗ trợ: 1-4 người local, online 2-22 người\n- Hệ máy: Nintendo Switch\n\n2. Giới thiệu\n- Phiên bản bóng đá mới nhất của EA với gameplay Authentic/Competitive, AI nâng cấp, Ultimate Team, Career Mode, Clubs cực mạnh!',
1499000, 84, 980000, 'Active', 203, NOW(), NOW()),

('NSW-NBA2K26', 'NBA 2K26',
'1. Thông tin\n- Phát hành: 2K\n- Thể loại: Thể thao bóng rổ\n- Ngày phát hành: 05/09/2025\n- Hỗ trợ: 1-10 người\n- Hệ máy: Nintendo Switch\n\n2. Giới thiệu\n- Công nghệ ProPLAY mới nhất, MyCAREER City cải tiến, MyTEAM, MyNBA – trải nghiệm bóng rổ chân thực nhất!',
1499000, 71, 950000, 'Active', 203, NOW(), NOW()),

('NSW-FANTASYLIFEI', 'Fantasy Life i The Girl Who Steals Time',
'1. Thông tin\n- Phát hành: LEVEL-5\n- Thể loại: Nhập vai mô phỏng cuộc sống\n- Ngày phát hành: 06/2025\n- Hệ máy: Nintendo Switch\n\n2. Giới thiệu\n- Phần mới của series Fantasy Life huyền thoại trên 3DS, du hành thời gian quá khứ - hiện tại, 14 nghề nghiệp, xây thành phố!',
1499000, 58, 990000, 'Active', 203, NOW(), NOW()),

('NSW-ATELIER-YUMIA', 'Atelier Yumia The Alchemist Of Memories The Envisioned Land',
'1. Thông tin\n- Phát hành: Koei Tecmo / Gust\n- Thể loại: JRPG giả kim thuật\n- Ngày phát hành: 20/03/2025\n- Hệ máy: Nintendo Switch\n\n2. Giới thiệu\n- Phần thứ 26 series Atelier – khám phá ký ức, xây căn cứ, Simple Synthesis, thế giới mở rộng lớn!',
1399000, 65, 920000, 'Active', 203, NOW(), NOW()),

('NSW-XENOBCXDE', 'Xenoblade Chronicles X Definitive Edition',
'1. Thông tin\n- Phát hành: Nintendo / Monolith Soft\n- Thể loại: RPG thế giới mở\n- Ngày phát hành: 20/03/2025\n- Hỗ trợ online: 1-32 người\n- Hệ máy: Nintendo Switch\n\n2. Giới thiệu\n- Bản hoàn chỉnh của siêu phẩm Wii U nay trở lại với đồ họa 4K, nội dung mới, Skell, hành tinh Mira rộng lớn!',
1199000, 73, 780000, 'Active', 203, NOW(), NOW()),

('NSW-CIV7', 'Sid Meier''s Civilization VII',
'1. Thông tin\n- Phát hành: 2K / Firaxis Games\n- Thể loại: Chiến thuật 4X\n- Ngày phát hành: 11/02/2025\n- Hệ máy: Nintendo Switch\n\n2. Giới thiệu\n- Phần mới nhất của series Civ huyền thoại – thay đổi nền văn minh qua các Age, lãnh đạo vĩ đại, multiplayer cross-play!',
1499000, 69, 1000000, 'Active', 203, NOW(), NOW()),

('NSW-TR456RM', 'Tomb Raider IV-VI Remastered',
'1. Thông tin\n- Phát hành: Aspyr\n- Thể loại: Hành động phiêu lưu\n- Ngày phát hành: 14/02/2025\n- Hệ máy: Nintendo Switch\n\n2. Giới thiệu\n- Gồm 3 game kinh điển: The Last Revelation, Chronicles, The Angel of Darkness – đồ họa remastered + điều khiển hiện đại!',
1199000, 81, 760000, 'Active', 203, NOW(), NOW()),

('NSW-NINJAGRAGE', 'Ninja Gaiden Ragebound',
'1. Thông tin\n- Phát hành: DotEmu\n- Thể loại: Hành động chặt chém 2D\n- Ngày phát hành: 25/07/2025\n- Hệ máy: Nintendo Switch\n\n2. Giới thiệu\n- Chương mới của series Ninja Gaiden – pixel art đẹp mê hồn, độ khó cao, theo chân ninja trẻ Kenji Mozu!',
1199000, 74, 770000, 'Active', 203, NOW(), NOW());
-- ==================== PHỤ KIỆN CHUNG / VR / TAI NGHE (category_id = 301) ====================
INSERT INTO product (
    sku, product_name, description, list_price, stock_quantity, purchase_price, status, category_id, created_at, updated_at
) VALUES
('META-QUEST3-512', 'Kính thực tế ảo VR Meta Quest 3 512GB', 
'Meta Quest 3 512GB – Kính VR độc lập cao cấp. Chip Snapdragon XR2 Gen 2, RAM 8GB, màn hình 4K+ (2064×2208 mỗi mắt), thấu kính Pancake, passthrough màu đầy đủ, FOV 110° ngang/96° dọc, tần số quét 90-120Hz, điều chỉnh IPD 58-71mm, trọng lượng 515g, pin ~3 giờ. Tay cầm Touch Plus với TruTouch haptics, hỗ trợ hand-tracking Direct Touch. Tương thích toàn bộ kho game Quest 2. Hộp gồm: kính, 2 tay cầm, sạc 18W, 2 pin AA.',
14499000, 18, 11850000, 'Active', 301, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('META-QUESTPRO-256', 'Kính thực tế ảo Meta Oculus Quest Pro 256GB', 
'Meta Quest Pro 256GB – Kính VR/MR cao cấp. Chip Snapdragon XR2+, RAM 12GB, màn hình LCD 1800×1920 mỗi mắt, thấu kính Pancake, eye-tracking + face-tracking, passthrough màu, FOV 106° ngang, tần số 90Hz, Wi-Fi 6E. Tay cầm Touch Pro tự tracking, pin phía sau đầu cho cân bằng trọng lượng. Hộp gồm: kính, 2 tay cầm Touch Pro, dock sạc, sạc 45W, miếng chặn sáng, phụ kiện.',
17999000, 7, 14800000, 'Active', 301, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('PS-PULSE-EXP-WH', 'Tai nghe Pulse Explore Wireless Earbuds màu Trắng', 
'Tai nghe không dây Sony Pulse Explore (Trắng) cho PS5/PC/Mac/Portal. Driver Planar Magnetic, công nghệ PlayStation Link độ trễ cực thấp & lossless, AI khử tiếng ồn microphone, kết nối đồng thời Bluetooth + PS Link, pin 5 giờ + hộp sạc thêm 10 giờ. Hộp gồm: tai nghe, adapter PS Link USB, hộp sạc, 6 tip tai, cáp USB.',
5499000, 42, 4150000, 'Active', 301, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('PS-PULSE-EXP-BK', 'Tai nghe Pulse Explore Wireless Earbuds Midnight Black', 
'Tai nghe không dây Sony Pulse Explore (Midnight Black) cho PS5/PC/Mac/Portal. Driver Planar Magnetic, công nghệ PlayStation Link độ trễ cực thấp & lossless, AI khử tiếng ồn microphone, kết nối đồng thời Bluetooth + PS Link, pin 5 giờ + hộp sạc thêm 10 giờ. Hộp gồm: tai nghe, adapter PS Link USB, hộp sạc, 6 tip tai, cáp USB.',
5699000, 38, 4280000, 'Active', 301, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('PS-INZONE-H9', 'Tai nghe Game không dây chống ồn INZONE H9', 
'Tai nghe không dây Sony INZONE H9 (Trắng) cho PS5 & PC. 360 Spatial Sound, chống ồn chủ động, Ambient Sound mode, kết nối 2.4GHz độ trễ thấp + Bluetooth đồng thời, pin tới 32 giờ, micro boom gập tắt tiếng. Tương thích Tempest 3D AudioTech của PS5.',
5999000, 25, 4450000, 'Active', 301, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('PS-PORTAL', 'PlayStation Portal Remote Player for PS5', 
'PlayStation Portal – Thiết bị Remote Play chính hãng Sony. Màn hình 8 inch Full HD 60Hz, tích hợp tay cầm DualSense (haptic feedback + adaptive triggers), kết nối Wi-Fi (tối thiểu 5Mbps, khuyến nghị 15Mbps+), chơi game đã cài trên PS5 từ xa. Có loa, jack 3.5mm, USB-C.',
5999000, 31, 4680000, 'Active', 301, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('PS5-DS-30TH', 'Tay PS5 DualSense Wireless 30th Anniversary Limited Edition', 
'Tay cầm DualSense phiên bản giới hạn kỷ niệm 30 năm PlayStation. Thiết kế màu xám cổ điển PS1 + logo màu, đầy đủ tính năng haptic feedback, adaptive triggers L2/R2, micro tích hợp, nút Create. Phát hành ngày 2/11/2024.',
3199000, 15, 2480000, 'Active', 301, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('PS-PORTAL-30TH', 'PlayStation Portal Remote Player 30th Anniversary Limited Edition', 
'PlayStation Portal phiên bản giới hạn kỷ niệm 30 năm PlayStation. Thiết kế màu xám cổ điển PS1 + logo màu, giữ nguyên toàn bộ tính năng Remote Play, màn hình 8 inch 1080p 60fps, haptic feedback, adaptive triggers, Wi-Fi streaming game từ PS5.',
10999000, 9, 8900000, 'Active', 301, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);


-- ==================== PHỤ KIỆN PS5 / PS4 (category_id = 302) ====================
INSERT INTO product (
    sku, product_name, description, list_price, stock_quantity, purchase_price, status, category_id, created_at, updated_at
) VALUES
('LOGI-G29', 'Vô lăng Logitech G29 Driving Force', 
'Logitech G29 Driving Force dành cho PS5, PS4, PS3, PC. Phản hồi lực mô tơ kép, vô lăng bọc da khâu tay, vòng xoay 900 độ, cảm biến Hall, lẫy chuyển số thép không gỉ, bàn đạp thép có thể điều chỉnh. Kích thước vô lăng: 270 x 260 x 278 mm (2.25 kg). Kích thước bàn đạp: 167 x 428.5 x 311 mm (3.1 kg). Tương thích Windows 11/10/8.1/8/7. Bao gồm vô lăng, bàn đạp, bộ nguồn và tài liệu.',
5599000, 12, 4250000, 'Active', 302, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('PS4-DS4-GC', 'Tay PS4 - Dualshock 4 Green Camouflage Sony VN', 
'Tay cầm DualShock 4 chính hãng Sony Việt Nam (CUH-ZCT2). Màu Green Camouflage. Thiết kế ergonomics, touch-pad cảm ứng, loa tích hợp, rung feedback, light bar, kết nối Bluetooth + USB. Bảo hành chính hãng 12 tháng.',
1399000, 48, 890000, 'Active', 302, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('ANALOG-CAP', 'Chụp bọc cần analog tay PS5, PS4, Xbox Cao cấp', 
'Bọc silicon cao cấp bảo vệ và tăng độ bám, chống trượt cho cần analog tay cầm PS3/PS4/PS5/Xbox 360/Xbox One/Xbox Series. Giúp tăng chiều cao, ma sát và thẩm mỹ cho cần analog.',
49000, 285, 18000, 'Active', 302, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('BT53-LLANO', 'Thiết bị Bluetooth 5.3 Audio PS5-PS4-Switch-PC Llano', 
'USB Bluetooth 5.3 Adapter (Llano) hỗ trợ kết nối đồng thời 2 tai nghe Bluetooth. Độ trễ cực thấp, truyền xa 10m, chip giảm nhiễu. Tương thích PS5, PS4, Nintendo Switch, PC, Mac. Cắm là chạy, không cần driver.',
499000, 156, 268000, 'Active', 302, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('PS4-DS4-BK', 'Tay PS4 - Dualshock 4 Black Sony VN', 
'Tay cầm DualShock 4 chính hãng Sony Việt Nam (CUH-ZCT2). Màu Đen. Thiết kế ergonomics, touch-pad cảm ứng, loa tích hợp, rung feedback, light bar, kết nối Bluetooth + USB. Bảo hành chính hãng 12 tháng.',
1349000, 62, 850000, 'Active', 302, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('BT50-AOLION', 'Thiết bị Bluetooth 5.0 Dongle Audio PS5-PS4-Switch-PC AOLION', 
'USB Bluetooth 5.0 Adapter (AOLION) hỗ trợ kết nối 2 tai nghe cùng lúc, độ trễ thấp, truyền xa 10m. Tương thích PS5/PS4/Switch/PC/Mac. Đi kèm cáp Type-C to Micro USB.',
299000, 189, 158000, 'Active', 302, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('BAG-PS5-01', 'Balo Đựng Máy Game PS5-PS4', 
'Balo chuyên dụng đựng máy PS5/PS4/PS5 Slim/Pro + 2 tay cầm + phụ kiện + 2 đĩa game. Chất liệu chống sốc, đệm êm, dây đeo thoải mái.',
499000, 78, 295000, 'Active', 302, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('BAG-PS5-02', 'Balo Đựng Máy Game PS5 Pro-PS4', 
'Balo chuyên dụng cao cấp đựng máy PS5/PS5 Pro/PS4 + 2 tay cầm + dock sạc + 5 đĩa game. Chất liệu chống sốc, nhiều ngăn, đệm bảo vệ tốt.',
549000, 65, 328000, 'Active', 302, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);


-- ==================== PHỤ KIỆN NINTENDO SWITCH (category_id = 303) ====================
INSERT INTO product (
    sku, product_name, description, list_price, stock_quantity, purchase_price, status, category_id, created_at, updated_at
) VALUES
('SW-DOCK-4K144', 'Dock xuất hình kèm 2 quạt tản nhiệt 4K 144Hz', 
'Dock đa năng cho Nintendo Switch (v1/v2/OLED/Switch 2), Steam Deck, ROG Ally. Cổng HDMI 2.1 hỗ trợ 8K@30Hz / 4K@144Hz HDR 10bit, 3×USB 3.2 5Gbps, LAN Gigabit 1000Mbps, USB-C PD 100W, tích hợp 2 quạt tản nhiệt. New fullbox, bảo hành 1 tháng.',
1199000, 44, 785000, 'Active', 303, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('HORI-ZELDA-SPLIT', 'HORI Split Pad Pro The Legend of Zelda Tears of the Kingdom', 
'Tay cầm HORI Split Pad Pro chính hãng Nintendo – phiên bản Zelda Tears of the Kingdom. Thiết kế ergonomic grip lớn, D-Pad thay thế, turbo, nút Assign, programmable rear buttons. Dành cho chế độ handheld Switch/Switch OLED.',
1399000, 28, 980000, 'Active', 303, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('8BITDO-PRO2-PURPLE', 'Tay cầm 8Bitdo PRO 2 Clear Purple Edition', 
'8Bitdo Pro 2 Clear Purple – Bluetooth, 2 nút back paddle, rumble, motion control 6 trục, pin 1000mAh ~20 giờ, USB-C, Ultimate Software tùy chỉnh profile. Tương thích Switch, PC, Android, macOS, Steam, Raspberry Pi. Đi kèm 2 rocker cap.',
1249000, 56, 820000, 'Active', 303, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('GULIKIT-KK3-MAX', 'Tay GuliKit KK3 Max', 
'GuliKit KK3 Max – Hall Effect analog chống drift, 4 metal back buttons remappable, Maglev + HD rumble, Hyperlink adapter 1000Hz, layout Switch/Xbox, Amiibo, turbo, 6-axis gyro, RGB. Tương thích Switch, PC, Steam Deck, ROG Ally, Android, iOS.',
1849000, 19, 1380000, 'Active', 303, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('8BITDO-PRO2-GRAY', 'Tay cầm 8Bitdo PRO 2 G Classic Edition', 
'8Bitdo Pro 2 G Classic Gray – Bluetooth, 2 nút back paddle, rumble, motion control 6 trục, pin 1000mAh ~20 giờ, USB-C, Ultimate Software. Tương thích Switch, PC, Android, macOS, Steam, Raspberry Pi.',
1199000, 71, 785000, 'Active', 303, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('8BITDO-SN30PRO-GB', 'Tay cầm Super Nintendo SN30 Pro G 8bitdo GameBoy Version', 
'8Bitdo SN30 Pro G GameBoy – Bluetooth 4.0, motion control, HD rumble, screenshot, USB-C, D-Input/X-Input. Tương thích Windows 7+, Android 4.0+, macOS 10.7+, Steam, Switch, Raspberry Pi.',
999000, 83, 620000, 'Active', 303, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('DOBE-24IN1-SW2', 'Bộ phụ kiện 24 in 1 cho Nintendo Switch 2 DOBE', 
'DOBE TNS-5113 24-in-1 Motion Gaming Kit cho Switch 2 / OLED / V2. Gồm: 2 vợt tennis, 2 gậy golf, 2 kiếm, 2 súng, 2 vô lăng, 2 baseball bat, 2 sand hammer, 2 controller grip, 4 dây đeo, 1 cần câu cá, 1 túi đựng. Chất liệu ABS cao cấp.',
899000, 92, 545000, 'Active', 303, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('GULIKIT-KK3-PRO', 'Tay GuliKit KK3 Pro', 
'GuliKit KK3 Pro – Hall Effect analog, 2 metal back buttons, Hyperlink adapter 1000Hz, layout Switch/Xbox, Amiibo, turbo, 6-axis gyro. Tương thích Switch, PC, Steam Deck, ROG Ally, Android, iOS. Bảo hành 3 tháng.',
1399000, 47, 980000, 'Active', 303, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('8BITDO-ULTIMATE-BT', 'Tay cầm 8Bitdo Ultimate Bluetooth Controller', 
'8Bitdo Ultimate Bluetooth – Dock sạc kiêm adapter 2.4G, 2 back paddle, Ultimate Software, X-input/D-input, rumble, motion. Tương thích Switch, PC, Android, iOS, macOS, Apple TV, Steam Deck. Pin ~15 giờ.',
1199000, 68, 785000, 'Active', 303, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('JOYCON-PASTEL-PY', 'Bộ Joy-Con Controllers Pastel Pink / Pastel Yellow', 
'Joy-Con chính hãng Nintendo (New Model 2023) màu Pastel Pink / Pastel Yellow. Hỗ trợ motion control, HD rumble, NFC Amiibo. Dùng riêng lẻ 2 người hoặc gắn grip. Tương thích Switch / Switch OLED / Switch 2.',
1599000, 22, 1180000, 'Active', 303, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('JOYCON-NEON-BY', 'Bộ Joy-Con Controllers Neon Blue / Neon Yellow', 
'Joy-Con chính hãng Nintendo (New Model 2019) màu Neon Blue / Neon Yellow. Hỗ trợ motion control, HD rumble, NFC Amiibo. Dùng riêng lẻ 2 người hoặc gắn grip. Tương thích Switch / Switch OLED / Switch 2.',
1599000, 35, 1150000, 'Active', 303, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

UPDATE product 
SET stock_quantity = 0
WHERE product_id > 0;   -- chắc chắn đúng với mọi dòng