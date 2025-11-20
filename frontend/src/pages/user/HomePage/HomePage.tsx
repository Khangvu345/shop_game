import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchProducts } from '../../../store/slices/productSlice';
import { addItem } from '../../../store/slices/cartSlice';
import type { IProduct } from '../../../types';

import './HomePage.css'


export function HomePage () {

    return (
        <div className="homepage">
            {/* Hero Banner (Giống thiết kế) */}
            <section className="hero-banner" >
                <h1>TRẢI NGHIỆM TƯƠNG LAI CỦA TRÒ CHƠI</h1>
                <p>Khám phá thế giới game mới...</p>
            </section>

            {/* Sản phẩm nổi bật */}
            <section className="featured-products container">
                <h2 >SẢN PHẨM NỔI BẬT</h2>
            </section>

            {/* (Các section khác như "Khám Phá Danh Mục" sẽ thêm sau) */}
        </div>
    );
};