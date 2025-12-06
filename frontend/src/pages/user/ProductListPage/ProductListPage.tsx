import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom'; // Import useSearchParams
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchProducts } from '../../../store/slices/ProductBlock/productSlice.ts';
import { Spinner } from '../../../components/ui/loading/Spinner';
import { ProductSidebar } from '../../../components/features/product/ProductSidebar/ProductSidebar';
import { ProductList } from '../../../components/features/product/ProductList/ProductList';
import { Pagination } from '../../../components/ui/pagination/Pagination';
import type { IServerProductFilters } from '../../../types';
import './ProductListPage.css';

export function ProductListPage() {
    const dispatch = useAppDispatch();
    const [searchParams] = useSearchParams();   // Hook lấy query string

    // 1. Lấy data và pagination từ GenericSlice
    // (Lưu ý: state.products giờ có cấu trúc của GenericState)
    const { data: products, status, error, pagination } = useAppSelector((state: any) => state.products);

    // 2. Quản lý bộ lọc tại Component (Local State)
    const [filters, setFilters] = useState<IServerProductFilters>(() => {
        const f: IServerProductFilters = {};
        const k = searchParams.get('keyword');
        const c = searchParams.get('categoryId');
        if (k) f.keyword = k;
        if (c) f.categoryId = Number(c);
        return f;
    });
    const [currentPage, setCurrentPage] = useState(1);
    const limit = 9; // Số sản phẩm mỗi trang

    // --- EFFECT MỚI: Sync URL keyword & categoryId vào filters ---
    useEffect(() => {
        const keywordFromUrl = searchParams.get('keyword');
        const categoryIdFromUrl = searchParams.get('categoryId');

        setFilters(prev => {
            const newFilters = { ...prev };

            // Handle Keyword
            if (keywordFromUrl) {
                newFilters.keyword = keywordFromUrl;
            } else {
                delete newFilters.keyword;
            }

            // Handle CategoryId
            if (categoryIdFromUrl) {
                newFilters.categoryId = Number(categoryIdFromUrl);
            } else {
                delete newFilters.categoryId;
            }

            return newFilters;
        });

        // Reset về trang 1 khi URL params thay đổi
        if (keywordFromUrl || categoryIdFromUrl) {
            setCurrentPage(1);
        }
    }, [searchParams]);

    // 3. Gọi API mỗi khi filters hoặc page thay đổi
    useEffect(() => {
        const params = {
            ...filters,
            page: currentPage - 1, // Backend bắt đầu từ 0
            size: limit
        };

        // fetchProducts giờ là thunk của GenericSlice, nhận params
        const promise = dispatch(fetchProducts(params));

        // Scroll lên đầu
        window.scrollTo({ top: 0, behavior: 'smooth' });

        return () => {
            promise.abort();
        };
    }, [dispatch, filters, currentPage]);

    // Hàm xử lý thay đổi bộ lọc (truyền xuống Sidebar)
    const handleFilterChange = (newFilters: IServerProductFilters) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
        setCurrentPage(1); // Reset về trang 1 khi lọc
    };

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    const handleClearFilters = () => {
        setFilters({});
        setCurrentPage(1);
    };

    // Render nội dung
    const renderContent = () => {
        if (status === 'loading') return <div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}><Spinner /></div>;
        if (status === 'failed') return <div style={{ color: 'red' }}>Lỗi: {error}</div>;

        if (!products || products.length === 0) {
            return <div style={{ textAlign: 'center', marginTop: '2rem' }}>Không tìm thấy sản phẩm nào.</div>;
        }

        return (
            <div>
                <ProductList products={products} />

                {/* Pagination component */}
                {pagination && pagination.totalPages > 1 && (
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
                        <Pagination
                            totalRows={pagination.total}
                            limit={limit}
                            currentPage={currentPage}
                            onPageChange={handlePageChange}
                        />
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="products-list-page-container">
            {/* Truyền hàm update filters xuống Sidebar */}
            <ProductSidebar
                currentFilters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearFilters} // Truyền prop này vào
            />
            <main className="product-page-content">
                <h2>Danh sách sản phẩm</h2>
                {renderContent()}
            </main>
        </div>
    );
}