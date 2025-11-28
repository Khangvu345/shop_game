import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
// Import actions từ productSlice (để lọc và sắp xếp)
import {
    setServerFilters,
    setSort
} from '../../../../store/slices/productSlice';
// Import action từ categorySlice (để lấy danh mục về hiển thị)
import { fetchCategories } from '../../../../store/slices/categorySlice';
import { Button } from '../../../ui/button/Button';
import type { IProductFilters} from "../../../../types";

import './ProductSlidebar.css';

export const ProductSidebar: React.FC = () => {
    const dispatch = useAppDispatch();

    // 1. Lấy danh sách danh mục từ categorySlice
    // Lưu ý: Dữ liệu nằm trong state.categories.data
    const { data: categories } = useAppSelector((state) => state.categories);

    // 2. Lấy bộ lọc hiện tại từ productSlice
    const { serverFilters, clientFilters  } = useAppSelector((state) => state.products);

    // State nội bộ để quản lý UI của Radio button giá (để biết cái nào đang được checked)
    const [selectedPriceRange, setSelectedPriceRange] = useState<string>('all');

    // Gọi API lấy danh mục khi component mount (nếu chưa có dữ liệu)
    useEffect(() => {
        if (!categories || categories.length === 0) {
            dispatch(fetchCategories());
        }
    }, [dispatch, categories]);

    // --- HANDLERS ---

    // 3. Xử lý Sắp xếp (Client-side Sort)
    const handleSortChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Ép kiểu an toàn thay vì dùng 'any'
        const value = e.target.value as IProductFilters['sortBy'];
        dispatch(setSort(value));
    };

    // 4. Xử lý chọn Danh mục (Server-side Filter)
    const handleCategoryChange = (categoryId: number) => {
        // Logic toggle: Nếu đang chọn cái này rồi thì bỏ chọn (undefined), ngược lại thì chọn nó
        const newId = serverFilters.categoryId === categoryId ? undefined : categoryId;
        dispatch(setServerFilters({ categoryId: newId }));
    };

    // 5. Xử lý chọn Giá (Server-side Filter)
    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSelectedPriceRange(value);

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

        // Gửi minPrice/maxPrice lên Redux -> Redux sẽ gọi API fetchProducts
        dispatch(setServerFilters({ minPrice, maxPrice }));
    };

    // 6. Xóa tất cả bộ lọc
    const handleClearFilters = () => {
        setSelectedPriceRange('all');
        dispatch(setServerFilters({
            categoryId: undefined,
            minPrice: undefined,
            maxPrice: undefined,
            keyword: undefined
        }));
        dispatch(setSort('default'));
    };

    return (
        <aside className="page-sidebar">
            <h3 /* style={{ marginBottom: '1.5rem', fontSize: '1.2rem' }} */>BỘ LỌC & SẮP XẾP</h3>

            {/* --- NHÓM 1: SẮP XẾP --- */}
            <div className="filter-group">
                <h4>Sắp xếp</h4>
                <label  /*style={{ display: 'block', marginBottom: '0.5rem', cursor: 'pointer' }} */>
                    <input
                        type="radio"
                        name="sort"
                        value="default"
                        checked={clientFilters.sortBy === 'default'}
                        onChange={handleSortChange}
                    /> Mặc định
                </label>
                <label /* style={{ display: 'block', marginBottom: '0.5rem', cursor: 'pointer' }} */>
                    <input
                        type="radio"
                        name="sort"
                        value="price-asc"
                        checked={clientFilters.sortBy === 'price-asc'}
                        onChange={handleSortChange}
                    /> Giá tăng dần
                </label>
                <label  /* style={{ display: 'block', marginBottom: '0.5rem', cursor: 'pointer' }} */ >
                    <input
                        type="radio"
                        name="sort"
                        value="price-desc"
                        checked={clientFilters.sortBy === 'price-desc'}
                        onChange={handleSortChange}
                    /> Giá giảm dần
                </label>
            </div>

            {/* --- NHÓM 2: DANH MỤC (Render động từ API) --- */}
            <div className="filter-group">
                <h4>Danh mục</h4>
                {categories && categories.length > 0 ? (
                    categories.map((cat) => (
                        <label key={cat.categoryId} /*style={{ display: 'block', marginBottom: '0.5rem', cursor: 'pointer' }} */>
                            <input
                                type="checkbox"
                                // Kiểm tra xem categoryId này có đang được chọn trong Redux không
                                checked={serverFilters.categoryId === cat.categoryId}
                                onChange={() => handleCategoryChange(cat.categoryId)}
                                style={{ marginRight: '0.5rem' }}
                            />
                            {cat.categoryName}
                        </label>
                    ))
                ) : (
                    <p style={{fontSize: '0.9rem', color: '#666'}}>Đang tải danh mục...</p>
                )}
            </div>

            {/* --- NHÓM 3: MỨC GIÁ --- */}
            <div className="filter-group">
                <h4>Mức giá</h4>
                <label /*style={{ display: 'block', marginBottom: '0.5rem', cursor: 'pointer' }} */>
                    <input
                        type="radio"
                        name="price"
                        value="all"
                        checked={selectedPriceRange === 'all'}
                        onChange={handlePriceChange}
                    /> Tất cả
                </label>
                <label /*style={{ display: 'block', marginBottom: '0.5rem', cursor: 'pointer' }} */>
                    <input
                        type="radio"
                        name="price"
                        value="under-1m"
                        checked={selectedPriceRange === 'under-1m'}
                        onChange={handlePriceChange}
                    /> Dưới 1 Triệu
                </label>
                <label /* style={{ display: 'block', marginBottom: '0.5rem', cursor: 'pointer' }} */>
                    <input
                        type="radio"
                        name="price"
                        value="1m-5m"
                        checked={selectedPriceRange === '1m-5m'}
                        onChange={handlePriceChange}
                    /> 1 - 5 Triệu
                </label>
                <label /* style={{ display: 'block', marginBottom: '0.5rem', cursor: 'pointer' }} */>
                    <input
                        type="radio"
                        name="price"
                        value="5m-10m"
                        checked={selectedPriceRange === '5m-10m'}
                        onChange={handlePriceChange}
                    /> 5 - 10 Triệu
                </label>
                <label /* style={{ display: 'block', marginBottom: '0.5rem', cursor: 'pointer' }} */>
                    <input
                        type="radio"
                        name="price"
                        value="above-10m"
                        checked={selectedPriceRange === 'above-10m'}
                        onChange={handlePriceChange}
                    /> Trên 10 Triệu
                </label>
            </div>

            {/* Nút Xóa bộ lọc */}
            <Button
                // style={{ width: '100%', marginTop: '1rem' }}
                onClick={handleClearFilters}
            >
                Xóa bộ lọc
            </Button>
        </aside>
    );
};