import React, { useEffect } from 'react';
import {Spinner} from "../../../components/ui/loading/Spinner";
import { fetchProducts } from '../../../store/slices/productSlice';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import type {IProduct} from "../../../types";
import { addItem } from '../../../store/slices/cartSlice';
import {Button} from "../../../components/ui/button/Button";
import {ProductCard} from "../../../components/features/product/ProductCard/ProductCard";
import {ProductList} from "../../../components/features/product/ProductList/ProductList";

import './ProductListPage.css'




interface ProductListProps {
    products: IProduct[]; // Chỉ nhận mảng sản phẩm
}

export const ProductListPage: React.FC = () => {
    const dispatch = useAppDispatch();

    // 1. Lấy state từ Redux
    const {
        data: products, // products là mảng IProduct[]
        status,
        error
    } = useAppSelector((state) => state.products); // Lấy từ 'products' slice

    useEffect(() => {
        // Chỉ gọi khi state là 'idle' (tránh gọi lại nhiều lần)
        if (status === 'idle') {
            dispatch(fetchProducts());
        }
    }, [status, dispatch]);

    // 3. Hàm render nội dung chính (cột phải)
    const renderContent = () => {
        // Trường hợp 1: Đang tải
        if (status === 'loading') {
            return <Spinner type="spinner1" />; // Dùng Spinner UI Kit của bạn
        }

        // Trường hợp 2: Tải lỗi
        if (status === 'failed') {
            return <p style={{ color: 'red' }}>Lỗi khi tải sản phẩm: {error}</p>;
        }

        // Trường hợp 3: Tải thành công
        if (status === 'succeeded' && products) {
            // Truyền mảng products cho component "ngu"
            return <ProductList products={products} />;
        }

        return null; // Trả về null nếu đang 'idle'
    };

    return (
        // Dùng class 'container' để căn giữa và 'page-container' để chia 2 cột
        <div className="container page-container">



            {/* CỘT 2: SẢN PHẨM */}
            <main className="page-content">
                <h2>MÁY CHƠI GAME & THIẾT BỊ CẦM TAY</h2>
                <p>
                    Khám phá máy chơi game PlayStation 5 và Xbox mới nhất...
                </p>

                <hr style={{ margin: '1rem 0' }} />

                {/* 4. Render nội dung dựa trên trạng thái API */}
                {renderContent()}
            </main>

        </div>
    );
};