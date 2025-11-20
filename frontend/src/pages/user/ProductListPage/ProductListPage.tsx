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
import {ProductSidebar} from "../../../components/features/product/ProductSidebar/ProductSidebar.tsx";




interface ProductListProps {
    products: IProduct[];
}

export function ProductListPage() {
    const dispatch = useAppDispatch();

    const {
        data: products,
        status,
        error
    } = useAppSelector((state) => state.products); // Lấy từ 'products' slice

    useEffect(() => {
        // Chỉ gọi khi state là 'idle' (tránh gọi lại nhiều lần)
        if (status === 'idle') {
            dispatch(fetchProducts());
        }
    }, [status, dispatch]);



    function renderContent (){
        switch (status) {
            case 'loading': return <Spinner type="spinner1" />;
            case 'failed': return <p style={{ color: 'red' }}>Lỗi khi tải sản phẩm: {error}</p>;
            case 'succeeded': return products? <ProductList products={products} /> : <p>Không có sản phẩm nào.</p>;
        }

        return null;
    }

    return (

        <div className="product-page-container">
            <div className="product-page-header">
                <h1>Danh sách sản phẩm</h1>
            </div>
            <div className={'product-page-body'}>
                <ProductSidebar></ProductSidebar>
                <main className="product-page-content">
                    {renderContent()}
                </main>
            </div>

        </div>


    );
};