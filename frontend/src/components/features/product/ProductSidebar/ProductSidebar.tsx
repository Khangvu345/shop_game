import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { fetchCategories } from '../../../../store/slices/ProductBlock/categorySlice';
import { Button } from '../../../ui/button/Button';
import type { IServerProductFilters } from '../../../../types';

import './ProductSlidebar.css';

interface ProductSidebarProps {
    currentFilters: IServerProductFilters;
    onFilterChange: (newFilters: IServerProductFilters) => void;
    onClearFilters: () => void;
}

export const ProductSidebar: React.FC<ProductSidebarProps> = ({
                                                                  currentFilters,
                                                                  onFilterChange,
                                                                  onClearFilters
                                                              }) => {
    const dispatch = useAppDispatch();
    const { data: categories } = useAppSelector((state) => state.categories);

    // Load danh mục nếu chưa có
    useEffect(() => {
        if (!categories || categories.length === 0) {
            dispatch(fetchCategories({}));
        }
    }, [dispatch, categories]);

    // --- HANDLERS ---

    // 1. Xử lý chọn Danh mục (Toggle)
    const handleCategoryChange = (categoryId: number) => {
        // Nếu đang chọn danh mục này thì bỏ chọn (undefined), ngược lại thì chọn nó
        const newCategoryId = currentFilters.categoryId === categoryId ? undefined : categoryId;
        onFilterChange({ categoryId: newCategoryId });
    };

    // 2. Xử lý chọn Giá
    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        let minPrice: number | undefined;
        let maxPrice: number | undefined;

        switch (value) {
            case 'under-1m':
                maxPrice = 1000000;
                break;
            case '1m-5m':
                minPrice = 1000000;
                maxPrice = 5000000;
                break;
            case '5m-10m':
                minPrice = 5000000;
                maxPrice = 10000000;
                break;
            case 'above-10m':
                minPrice = 10000000;
                break;
            default: // 'all'
                minPrice = undefined;
                maxPrice = undefined;
        }

        onFilterChange({ minPrice, maxPrice });
    };

    // Helper: Xác định radio nào đang active dựa trên minPrice/maxPrice hiện tại
    const getCurrentPriceValue = () => {
        const { minPrice, maxPrice } = currentFilters;
        if (!minPrice && !maxPrice) return 'all';
        if (!minPrice && maxPrice === 1000000) return 'under-1m';
        if (minPrice === 1000000 && maxPrice === 5000000) return '1m-5m';
        if (minPrice === 5000000 && maxPrice === 10000000) return '5m-10m';
        if (minPrice === 10000000 && !maxPrice) return 'above-10m';
        return 'custom'; // Trường hợp khác
    };

    const activePriceValue = getCurrentPriceValue();

    return (
        <aside className="page-sidebar">
            <h3 >BỘ LỌC & SẮP XẾP</h3>

            {/* --- NHÓM 1: SẮP XẾP --- */}
            <div className="filter-group">
                <h4>Sắp xếp</h4>
                <label >
                    <input
                        type="radio"
                        name="sort"
                        value="default"
                        checked={clientFilters.sortBy === 'default'}
                        onChange={handleSortChange}
                    /> Mặc định
                </label>
                <label>
                    <input
                        type="radio"
                        name="sort"
                        value="price-asc"
                        checked={clientFilters.sortBy === 'price-asc'}
                        onChange={handleSortChange}
                    /> Giá tăng dần
                </label>
                <label>
                    <input
                        type="radio"
                        name="sort"
                        value="price-desc"
                        checked={clientFilters.sortBy === 'price-desc'}
                        onChange={handleSortChange}
                    /> Giá giảm dần
                </label>
            </div>

            {/* --- NHÓM DANH MỤC --- */}
            <div className="filter-group">
                <h4>Danh mục</h4>
                {categories && categories.length > 0 ? (
                    categories.map((cat) => (
                        <label key={cat.categoryId} className="filter-label">
                            <input
                                type="checkbox"
                                checked={currentFilters.categoryId === cat.categoryId}
                                onChange={() => handleCategoryChange(cat.categoryId)}
                            />
                            <span className="checkmark"></span>
                            {cat.categoryName}
                        </label>
                    ))
                ) : (
                    <p style={{fontSize: '0.9rem', color: '#888', fontStyle: 'italic'}}>Đang tải danh mục...</p>
                )}
            </div>

            {/* --- NHÓM MỨC GIÁ --- */}
            <div className="filter-group">
                <h4>Mức giá</h4>
                <label className="filter-label">
                    <input
                        type="radio"
                        name="price"
                        value="all"
                        checked={activePriceValue === 'all'}
                        onChange={handlePriceChange}
                    />
                    Tất cả
                </label>
                <label className="filter-label">
                    <input
                        type="radio"
                        name="price"
                        value="under-1m"
                        checked={activePriceValue === 'under-1m'}
                        onChange={handlePriceChange}
                    />
                    Dưới 1 Triệu
                </label>
                <label className="filter-label">
                    <input
                        type="radio"
                        name="price"
                        value="1m-5m"
                        checked={activePriceValue === '1m-5m'}
                        onChange={handlePriceChange}
                    />
                    1 - 5 Triệu
                </label>
                <label className="filter-label">
                    <input
                        type="radio"
                        name="price"
                        value="5m-10m"
                        checked={activePriceValue === '5m-10m'}
                        onChange={handlePriceChange}
                    />
                    5 - 10 Triệu
                </label>
                <label className="filter-label">
                    <input
                        type="radio"
                        name="price"
                        value="above-10m"
                        checked={activePriceValue === 'above-10m'}
                        onChange={handlePriceChange}
                    />
                    Trên 10 Triệu
                </label>
            </div>

            {/* Nút Xóa bộ lọc */}
            <Button onClick={onClearFilters}>
                Xóa bộ lọc
            </Button>
        </aside>
    );
};