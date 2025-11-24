import React from 'react';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { setFilters } from '../../../../store/slices/productSlice';
import { Button } from '../../../ui/button/Button';

import './ProductSlidebar.css';

export function ProductSidebar(){
    const dispatch = useAppDispatch();
    const filters = useAppSelector((state) => state.products.filters);

    const handleCategoryChange = (categoryId: string) => {
        const currentIndex = filters.categoryIds.indexOf(categoryId);
        const newCategoryIds = [...filters.categoryIds];

        if (currentIndex === -1) {
            newCategoryIds.push(categoryId);
        } else {
            newCategoryIds.splice(currentIndex, 1);
        }

        dispatch(setFilters({ categoryIds: newCategoryIds }));
    };

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setFilters({ priceRange: e.target.value as never }));
    };

    const handleSortChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setFilters({ sortBy: e.target.value as never }));
    };

    return (
        <aside className="page-sidebar">
            <h3>BỘ LỌC</h3>

            <div className="filter-group">
                <h4>Loại sản phẩm</h4>
                {['consoles', 'handheld', 'accessories', 'games'].map((cat) => (
                    <label key={cat}>
                        <input
                            type="checkbox"
                            checked={filters.categoryIds.includes(cat)}
                            onChange={() => handleCategoryChange(cat)}
                        />{' '}
                        {cat}
                    </label>
                ))}
            </div>

            <div className="filter-group">
                <h4>Mức giá</h4>
                <label>
                    <input
                        type="radio"
                        name="price"
                        value="all"
                        checked={filters.priceRange === 'all'}
                        onChange={handlePriceChange}
                    />{' '}
                    Tất cả
                </label>
                <label>
                    <input
                        type="radio"
                        name="price"
                        value="under-1m"
                        checked={filters.priceRange === 'under-1m'}
                        onChange={handlePriceChange}
                    />{' '}
                    Dưới 1 Triệu
                </label>
                <label>
                    <input
                        type="radio"
                        name="price"
                        value="1m-5m"
                        checked={filters.priceRange === '1m-5m'}
                        onChange={handlePriceChange}
                    />{' '}
                    1 - 5 Triệu
                </label>
                <label> 
                    <input
                        type="radio"
                        name="price"
                        value="5m-10m"
                        checked={filters.priceRange === '5m-10m'}
                        onChange={handlePriceChange}
                    />{' '}
                    5 - 10 Triệu
                </label>
                <label>
                    <input
                        type="radio"
                        name="price"
                        value="above-10m"
                        checked={filters.priceRange === 'above-10m'}
                        onChange={handlePriceChange}
                    />{' '}
                    Trên 10 Triệu
                </label>
            </div>

            <div className="filter-group">
                <h4>Sắp xếp theo</h4>
                <label>
                    <input
                        type="radio"
                        name="sort"
                        value="default"
                        checked={filters.sortBy === 'default'}
                        onChange={handleSortChange}
                    />{' '}
                    Mặc định
                </label>
                <label>
                    <input
                        type="radio"
                        name="sort"
                        value="price-asc"
                        checked={filters.sortBy === 'price-asc'}
                        onChange={handleSortChange}
                    />{' '}
                    Giá thấp đến cao
                </label>
                <label>
                    <input
                        type="radio"
                        name="sort"
                        value="price-desc"
                        checked={filters.sortBy === 'price-desc'}
                        onChange={handleSortChange}
                    />{' '}
                    Giá cao đến thấp
                </label>
            </div>

            <Button
                onClick={() => dispatch(setFilters({ categoryIds: [], priceRange: 'all' }))}
            >
                Xóa bộ lọc
            </Button>
        </aside>
    );
}