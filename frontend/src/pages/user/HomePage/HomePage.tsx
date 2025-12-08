import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchProducts } from '../../../store/slices/ProductBlock/productSlice.ts';
import { addItem } from '../../../store/slices/cartSlice';
import type { IProduct } from '../../../types';
import { useEffect, useRef } from 'react';
import { ProductCard } from '../../../components/features/product/ProductCard/ProductCard.tsx';
import { Link } from 'react-router-dom';
import { Button } from '../../../components/ui/button/Button.tsx';
import { Spinner } from '../../../components/ui/loading/Spinner';
import trailerVideo from '/assets/videos/playstation-5-pro-tralerr.io.mp4';
import './HomePage.css'
import PromotionSlider from '../../../components/ui/PromotionSlider/PromotionSlider.tsx';

// Mock Data cho Danh mục (Icon giả lập bằng text/emoji vì chưa có file svg cụ thể)
const categories = [
    {
        id: 1,
        name: 'Consoles',
        icon: 'https://res.cloudinary.com/ddehnsjtw/image/upload/v1765173573/console_mn3zyf.jpg',
        link: '/products?categoryId=1'
    },
    { id: 2, name: 'Thiết bị cầm tay', icon: 'https://res.cloudinary.com/ddehnsjtw/image/upload/v1764779382/Game_Control_Glyph_Icon_Vector_Game_Icons_Control_Icons_Controller_Clipart_PNG_and_Vector_with_Transparent_Background_for_Free_Download_jeu9yu.jpg', link: '/products?categoryId=3' },
    { id: 3, name: 'Phụ kiện', icon: 'https://res.cloudinary.com/ddehnsjtw/image/upload/v1765173709/s%C5%82uchawki_ikona_Stock_Vector_cgakmo.jpg', link: '/products?categoryId=3' },
    { id: 4, name: 'Trò chơi', icon: 'https://res.cloudinary.com/ddehnsjtw/image/upload/v1765173593/game_lhndz8.jpg', link: '/products?categoryId=2' },
];


// Mock Data cho Tin tức
const NEWS = [
    {
        id: 1,
        title: 'Các tựa game PlayStation Plus tháng 11 đã có mặt!',
        date: 'Ngày 1 tháng 11 năm 2025',
        image: 'https://res.cloudinary.com/ddehnsjtw/image/upload/v1764766151/Sony_PlayStation_Italia_on_Instagram__Il_nuovo_nbgk9s.jpg',
        desc: 'Đánh giá chi tiết...',
        link: 'https://blog.playstation.com/2024/11/13/playstation-plus-game-catalog-for-november-grand-theft-auto-v-dying-light-2-stay-human-like-a-dragon-ishin-and-more/'
    },
    {
        id: 2,
        title: 'Báo cáo tài chính Quý 3: Doanh số PlayStation kỷ lục',
        date: 'Ngày 10 tháng 11 năm 2025',
        image: 'https://res.cloudinary.com/ddehnsjtw/image/upload/v1764766289/t%E1%BA%A3i_xu%E1%BB%91ng_5_fln3fp.jpg',
        desc: 'Sony vừa công bố...',
        link: 'https://haloshop.vn/tin-tuc/sony-dat-doanh-thu-ky-luc-30-ty-usd-nho-ps5/?srsltid=AfmBOooGtaJONCgz6IMi8i3vm6a80ZCsygvXcrhbIxMepEAWHGBd5UY-'
    },
];

export function HomePage() {
    const dispatch = useAppDispatch();

    // Lấy state từ Redux
    const { data: productData, status } = useAppSelector((state) => state.products);

    useEffect(() => {
        // Gọi API lấy danh sách sản phẩm
        dispatch(fetchProducts({}));
    }, [dispatch]);

    const handleAddToCart = (product: any) => {
        dispatch(addItem(product));
        alert(`Đã thêm ${product.productName} vào giỏ!`);
    };
    // 2. Tạo một tham chiếu đến thẻ video
    const videoRef = useRef<HTMLVideoElement>(null);

    // 3. Dùng useEffect để ép video chạy khi component đã sẵn sàng
    useEffect(() => {
        if (videoRef.current) {
            // Thử chạy video
            const playPromise = videoRef.current.play();

            // Xử lý trường hợp trình duyệt chặn Autoplay (nếu có)
            if (playPromise !== undefined) {
                playPromise.catch((error) => {
                    console.log("Autoplay bị chặn hoặc lỗi:", error);
                    // Nếu lỗi, thử mute lại và chạy (đôi khi browser quên mất trạng thái muted)
                    if (videoRef.current) {
                        videoRef.current.muted = true;
                        videoRef.current.play();
                    }
                });
            }
        }
    }, []);
    // --- XỬ LÝ DỮ LIỆU TỪ API ---
    // 1. Lấy mảng sản phẩm: Kiểm tra xem data trả về là dạng Page (có .content) hay Mảng thường
    const rawList = (productData as any)?.content
        ? (productData as any).content
        : (Array.isArray(productData) ? productData : []);

    // 2. Lấy 4 sản phẩm & Map lại trường ảnh
    const featuredProducts = rawList.slice(0, 4).map((p: any) => ({
        ...p,
        // QUAN TRỌNG: Gán productImageUrl từ API vào thumbnailUrl để ProductCard hiển thị được
        thumbnailUrl: p.productImageUrl || p.thumbnailUrl
    }));
    return (
        <div className="homepage">
            <section className="hero-banner" >
                <h1>TRẢI NGHIỆM TƯƠNG LAI CỦA TRÒ CHƠI</h1>
                <p>Khám phá thế giới game nhập vai với PlayStation 5. Đồ họa siêu nét, tải siêu nhanh, phản hồi xúc giác tiên tiến.</p>
                <Link to="/products" className="shop-now-button" >Khám phá các Gói PS5</Link>
            </section>

            {/* 4. SẢN PHẨM NỔI BẬT */}
            <section className="featured-section container">
                <h2>SẢN PHẨM NỔI BẬT</h2>

                {status === 'loading' ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
                        <Spinner />
                    </div>
                ) : (
                    <div className="featured-grid">
                        {featuredProducts.length > 0 ? (
                            featuredProducts.map((product: IProduct) => (
                                <div key={product.productId} className="featured-item">
                                    <ProductCard product={product} onAddToCart={handleAddToCart} />
                                </div>
                            ))
                        ) : (
                            <div style={{ textAlign: 'center', width: '100%', color: '#888', fontStyle: 'italic', gridColumn: '1 / -1' }}>
                                Chưa có sản phẩm nào để hiển thị.
                            </div>
                        )}
                    </div>
                )}
            </section>
            
            {/* 5. VIDEO TRAILER SECTION (LOCAL FILE) */}
            <section className="video-trailer-section">
                {/* 1. Bỏ div 'container' để video tràn ra 2 bên lề */}
                {/* 2. Đã xóa thẻ <h2>TRAILER NỔI BẬT</h2> */}
                <div className="video-wrapper">
                    <video
                        ref={videoRef}
                        width="100%"
                        height="100%"
                        // 3. Đã xóa thuộc tính 'controls' để người dùng không chỉnh được
                        muted
                        loop
                        autoPlay
                        playsInline
                        className="promo-video"
                        preload="auto"
                    >
                        <source src={trailerVideo} type="video/mp4" />
                        Trình duyệt của bạn không hỗ trợ thẻ video.
                    </video>

                    {/* (Tùy chọn) Thêm một lớp phủ mờ để chặn hoàn toàn thao tác click chuột phải/trái vào video */}
                    <div className="video-overlay"></div>
                </div>
            </section>

            {/* 3. BANNER KHUYẾN MÃI (ƯU ĐÃI LỄ HỘI LỚN) */}
            <section
                className="slider-section container"
                style={{ marginTop: '3rem', marginBottom: '3rem' }}
            >
                <h2>CÁC SỰ KIỆN SẮP TỚI
                </h2>
                <PromotionSlider />
            </section>





            {/* 2. KHÁM PHÁ THEO DANH MỤC */}
            <section className="categories-section container">
                <h2>KHÁM PHÁ THEO DANH MỤC</h2>
                <div className="categories-grid">
                    {categories.map((cat) => (
                        <Link to={cat.link} key={cat.id} className="category-card">
                            <div className="category-icon">
                                {cat.icon.startsWith('http') ? (
                                    <img
                                        src={cat.icon}
                                        alt={cat.name}
                                        style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '8px' }}
                                    />
                                ) : (
                                    cat.icon
                                )}
                            </div>

                            <span className="category-name">{cat.name}</span>
                        </Link>
                    ))}
                </div>
            </section>
            
            {/* 6. TIN TỨC & CẬP NHẬT */}
            <section className="news-section container">
                <h2>TIN TỨC & CẬP NHẬT MỚI NHẤT</h2>
                <div className="news-grid">
                    {NEWS.map((item) => (
                        <Link
                            to={item.link}
                            key={item.id}
                            className="news-card"
                            rel="noopener noreferrer"
                        >
                            <img src={item.image} alt={item.title} className="news-img" />
                            <div className="news-info">
                                <h3>{item.title}</h3>
                                <span className="news-date">{item.date}</span>
                            </div>
                        </Link>
                    ))}
                    {/* Hardcode thêm 1 box bên phải cho giống ảnh (nếu cần grid 2 cột lệch) */}
                    <a
                        href="https://www.ign.com/articles/dualsense-edge-review"
                        className="news-card"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <img
                            src="https://res.cloudinary.com/ddehnsjtw/image/upload/v1764766232/Sony_tr%C3%ACnh_l%C3%A0ng_tay_c%E1%BA%A7m_DualSense_Edge_cho_gamer_hardcore_sqnktk.jpg"
                            alt="Review"
                            className="news-img"
                        />

                        <div className="news-info">
                            <h3>Đánh giá chi tiết tay cầm DualSense Edge</h3>
                            <span className="news-date">Ngày 28 tháng 10 năm 2025</span>
                        </div>
                    </a>
                </div>
            </section>
        </div>
    );
};