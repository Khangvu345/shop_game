import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
// Import các actions và selector từ productSlice
import {
    fetchProducts,
    selectDisplayProducts,
    setPage
} from '../../../store/slices/productSlice';

import { Spinner } from '../../../components/ui/loading/Spinner';
import { ProductSidebar } from '../../../components/features/product/ProductSidebar/ProductSidebar';
import { ProductList } from '../../../components/features/product/ProductList/ProductList';
import { Pagination } from '../../../components/ui/pagination/Pagination';

import './ProductListPage.css'

export function ProductListPage(){
    const dispatch = useAppDispatch();


    const { paginatedData, totalRows } = useAppSelector(selectDisplayProducts);

    // 2. Lấy trạng thái API và cấu hình hiện tại
    const {
        status,
        error,
        serverFilters, // Bộ lọc gửi lên server
        clientFilters
   // Cấu hình trang hiện tại (page, limit)
    } = useAppSelector((state) => state.products);

    // 3. Gọi API mỗi khi bộ lọc Server thay đổi (Category, Price)
    useEffect(() => {
        // Luôn gọi lại API khi filters thay đổi để lấy dữ liệu mới nhất
        dispatch(fetchProducts(serverFilters));
    }, [dispatch, serverFilters]);

    // 4. Xử lý khi người dùng chuyển trang
    const handlePageChange = (newPage: number) => {
        dispatch(setPage(newPage));
        // Cuộn lên đầu trang cho mượt
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Hàm render nội dung chính
    const renderContent = () => {
        // Trường hợp đang tải
        if (status === 'loading') {
            return (
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '3rem' }}>
                    <Spinner/>
                </div>
            );
        }

        // Trường hợp lỗi
        if (status === 'failed') {
            return (
                <div style={{ color: 'red', padding: '1rem', border: '1px solid red', borderRadius: '8px' }}>
                    Lỗi tải dữ liệu: {error}
                </div>
            );
        }

        // Trường hợp thành công
        if (status === 'succeeded') {
            if (paginatedData.length === 0) {
                return (
                    <div style={{ textAlign: 'center', marginTop: '2rem', color: '#666' }}>
                        <p>Không tìm thấy sản phẩm nào phù hợp với tiêu chí lọc.</p>
                    </div>
                );
            }

            return (
                <div>
                    {/* Hiển thị danh sách sản phẩm (đã cắt trang) */}
                    <ProductList products={paginatedData} />

                    {/* Hiển thị thanh phân trang */}
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem', maxWidth: '100%' }}>
                        <Pagination
                            totalRows={totalRows}
                            limit={clientFilters.limit}
                            currentPage={clientFilters.page}
                            onPageChange={handlePageChange}
                        />
                    </div>

                </div>
            );
        }

        return null;
    };

    return (
        <div className="products-list-page-container">
            {/* CỘT 1: SIDEBAR (Bộ lọc) */}
            <ProductSidebar />

            {/* CỘT 2: NỘI DUNG CHÍNH */}
            <main className="product-page-content">
                <h2>Danh sách sản phẩm</h2>
                <br/>
                <br/>
                <br/>
                <br/>
                {/* Nội dung thay đổi (Loading / Error / List) */}
                {renderContent()}
            </main>
        </div>
    );
}