import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchProducts } from '../../../store/slices/productSlice';
import { addItem } from '../../../store/slices/cartSlice';
import type { IProduct } from '../../../types';

import './HomePage.css'

export const HomePage: React.FC = () => {

    return (
        <div className="homepage">
            {/* Hero Banner (Giống thiết kế) */}
            <section className="hero-banner" style={{ textAlign: 'center', padding: '4rem 1rem', backgroundColor: '#e9ecef' }}>
                <h1>TRẢI NGHIỆM TƯƠNG LAI CỦA TRÒ CHƠI</h1>
                <p>Khám phá thế giới game mới...</p>
            </section>

            {/* Sản phẩm nổi bật */}
            <section className="featured-products container" style={{ padding: '3rem 15px' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>SẢN PHẨM NỔI BẬT</h2>
            </section>

            {/* (Các section khác như "Khám Phá Danh Mục" sẽ thêm sau) */}
        </div>
    );
};