import React from 'react';
import {Button} from "../../../ui/button/Button.tsx";

import './ProductSlidebar.css'

export function ProductSidebar() {
    return (
        <aside className="product-sidebar">
            <h3>BỘ LỌC</h3>

            <div className="filter-group">
                <h4>Loại sản phẩm</h4>
                {}
                <label>
                    <input type="checkbox" /> Consoles
                </label>
                <label>
                    <input type="checkbox" /> Thiết bị cầm tay
                </label>
                <label>
                    <input type="checkbox" /> Phụ kiện
                </label>
                <label>
                    <input type="checkbox" /> Trò chơi
                </label>
            </div>

            {}
            <div className="filter-group">
                <h4>Tình trạng</h4>
                <label>
                    <input type="radio" name="status" /> Mới
                </label>
                <label>
                    <input type="radio" name="status" /> Đã qua sử dụng
                </label>
            </div>

            <div className="filter-group">
                <h4>Mức giá</h4>
                <label>
                    <input type="radio" name="price" /> Tất cả
                </label>
                <label>
                    <input type="radio" name="price" /> Dưới 1 Triệu
                </label>
                <label>
                    <input type="radio" name="price" /> 1 - 5 Triệu
                </label>
                <label>
                    <input type="radio" name="price" /> 5 - 10 Triệu
                </label>
                <label>
                    <input type="radio" name="price" /> Trên 10 Triệu
                </label>
            </div>

            <Button className={''} >
                Áp dụng bộ lọc
            </Button>
        </aside>
    );
};