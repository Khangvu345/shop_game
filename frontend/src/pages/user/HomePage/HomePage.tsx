import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchProducts } from '../../../store/slices/ProductBlock/productSlice.ts';
import { addItem } from '../../../store/slices/cartSlice';
import type { IProduct } from '../../../types';
import { useEffect } from 'react';
import { ProductCard } from '../../../components/features/product/ProductCard/ProductCard.tsx';
import { Link } from 'react-router-dom';
import { Button } from '../../../components/ui/button/Button.tsx';
import { Spinner } from '../../../components/ui/loading/Spinner';
import './HomePage.css'

// Mock Data cho Danh mục (Icon giả lập bằng text/emoji vì chưa có file svg cụ thể)
const categories = [
    { 
        id: 1, 
        name: 'Consoles', 
        icon: 'https://res.cloudinary.com/ddehnsjtw/image/upload/v1764779169/Sony_Unveils_PlayStation_5_Game_Console___WERD_zgljzx.jpg', 
        link: '/products?category=console' 
    },
    { id: 2, name: 'Thiết bị cầm tay', icon: 'https://res.cloudinary.com/ddehnsjtw/image/upload/v1764779382/Game_Control_Glyph_Icon_Vector_Game_Icons_Control_Icons_Controller_Clipart_PNG_and_Vector_with_Transparent_Background_for_Free_Download_jeu9yu.jpg', link: '/products?category=handheld' },
    { id: 3, name: 'Phụ kiện', icon: '🎧', link: '/products?category=accessory' },
    { id: 4, name: 'Trò chơi', icon: '💿', link: '/products?category=game' },
];


// Mock Data cho Tin tức
const NEWS = [
    {
        id: 1,
        title: 'Các tựa game PlayStation Plus tháng 11 đã có mặt!',
        date: 'Ngày 1 tháng 11 năm 2025',
        image: 'https://res.cloudinary.com/ddehnsjtw/image/upload/v1764766151/Sony_PlayStation_Italia_on_Instagram__Il_nuovo_nbgk9s.jpg',
        desc: 'Đánh giá chi tiết...'
    },
    {
        id: 2,
        title: 'Báo cáo tài chính Quý 3: Doanh số PlayStation kỷ lục',
        date: 'Ngày 10 tháng 11 năm 2025',
        image: 'https://res.cloudinary.com/ddehnsjtw/image/upload/v1764766289/t%E1%BA%A3i_xu%E1%BB%91ng_5_fln3fp.jpg',
        desc: 'Sony vừa công bố...'
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
                <button className="shop-now-button">Khám phá các Gói PS5</button>
            </section>

            {/* 2. SẢN PHẨM NỔI BẬT */}
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

            {/* 3. KHÁM PHÁ THEO DANH MỤC */}
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


            {/* 4. BANNER KHUYẾN MÃI (ƯU ĐÃI LỄ HỘI LỚN) */}
            <section 
                className="promo-banner-section"
            >

                {/* Lớp overlay chứa nội dung (sử dụng CSS bạn cung cấp) */}
                <div className="promo-overlay">
                    <div className="promo-content-inner">
                        <h2>ƯU ĐÃI LỄ HỘI LỚN!</h2>
                        <p>Giảm giá lên tới 50% cho các trò chơi và phụ kiện chọn lọc. Đừng bỏ lỡ!</p>
                        <Link to="/products">
                            <Button className="promo-button">Xem ưu đãi</Button>
                        </Link>
                    </div>
                </div>
            </section>
            {/* 5. TIN TỨC & CẬP NHẬT */}
            <section className="news-section container">
                <h2>TIN TỨC & CẬP NHẬT MỚI NHẤT</h2>
                <div className="news-grid">
                    {NEWS.map((item) => (
                        <div key={item.id} className="news-card">
                            <img src={item.image} alt={item.title} className="news-img" />
                            <div className="news-info">
                                <h3>{item.title}</h3>
                                <span className="news-date">{item.date}</span>
                            </div>
                        </div>
                    ))}
                    {/* Hardcode thêm 1 box bên phải cho giống ảnh (nếu cần grid 2 cột lệch) */}
                     <div className="news-card">
                        <img src="https://res.cloudinary.com/ddehnsjtw/image/upload/v1764766232/Sony_tr%C3%ACnh_l%C3%A0ng_tay_c%E1%BA%A7m_DualSense_Edge_cho_gamer_hardcore_sqnktk.jpg" alt="Review" className="news-img" />
                        <div className="news-info">
                            <h3>Đánh giá chi tiết tay cầm DualSense Edge</h3>
                            <span className="news-date">Ngày 28 tháng 10 năm 2025</span>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};