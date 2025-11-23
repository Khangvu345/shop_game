import React, { useEffect } from 'react';
import {Spinner} from "../../../components/ui/loading/Spinner";
import { fetchProducts } from '../../../store/slices/productSlice';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import type {IProduct} from "../../../types";
import {ProductList} from "../../../components/features/product/ProductList/ProductList";
import {ProductSidebar} from "../../../components/features/product/ProductSidebar/ProductSidebar.tsx";
import { selectFilteredProducts } from "../../../store/slices/productSlice";

import './ProductListPage.css'




interface ProductListProps {
    products: IProduct[];
}

export function ProductListPage() {
    const dispatch = useAppDispatch();


    const filteredProducts = useAppSelector(selectFilteredProducts);

    const {
        data: products,
        status,
        error
    } = useAppSelector((state) => state.products); // Lấy từ 'products' slice

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchProducts());
        }
    }, [status, dispatch]);



    function renderContent (){
        switch (status) {
            case 'loading': return (
                <div className="product-list-loading"> 
                    <Spinner type="spinner1" />
                </div>
            );
            case 'failed': return <p style={{ color: 'red' }}>Lỗi khi tải sản phẩm: {error}</p>;
            case 'succeeded': return filteredProducts? <ProductList products={filteredProducts} /> : <p>Không có sản phẩm nào.</p>;
        }

        return null;
    }

    return (

        <div className="product-page-container">
            <div className="product-page-header">
                <h1>Danh sách sản phẩm</h1>
                <p>Khám phá bộ sưu tập máy chơi game PlayStation và thiết bị cầm tay mới nhất. Tìm kiếm trải nghiệm giải trí hoàn hảo của bạn.</p>
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