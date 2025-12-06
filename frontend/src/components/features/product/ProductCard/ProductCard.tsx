import React from 'react';
import { Link } from 'react-router-dom';
import type { IProduct } from '../../../../types';
import { Button } from '../../../ui/button/Button.tsx';
import { Card } from '../../../ui/card/Card.tsx';
import { CartIcon } from '../../../ui/icon/icon.tsx'; // Import CartIcon nếu muốn dùng trong nút

import './ProductCard.css';

const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

interface ProductCardProps {
    product: IProduct;
    onAddToCart: (product: IProduct) => void;
}

export const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
    // Tính toán giảm giá giả lập hoặc logic badge (nếu có data thực thì thay thế)
    // Ví dụ: Nếu hàng tồn kho < 5 thì hiện "Sắp hết"
    const isLowStock = product.stockQuantity > 0 && product.stockQuantity < 5;

    return (
        <Card className="product-card-container">
            {/* Vùng Ảnh */}
            <div className="product-card-image-wrapper">
                {/* Badge trạng thái */}
                {isLowStock && <span className="product-badge badge-low-stock">Sắp hết</span>}
                {product.status === 'Inactive' && <span className="product-badge badge-out-stock">Ngừng bán</span>}
                
                <Link to={`/products/${product.productId}`} className="product-image-link">
                    <img
                        src={product.productImageUrl || 'https://placehold.co/400x400?text=No+Image'}
                        alt={product.productName}
                        className="product-card-image"
                        loading="lazy"
                    />
                </Link>
                
                {/* Quick Action Overlay (Tùy chọn: hiện nút khi hover vào ảnh) */}
                <div className="product-card-overlay">
                    <button 
                        className="quick-add-btn"
                        onClick={() => onAddToCart(product)}
                        title="Thêm nhanh vào giỏ"
                    >
                        <CartIcon width={20} height={20} />
                    </button>
                </div>
            </div>

            {/* Vùng Nội dung */}
            <div className="product-card-body">
                <div className="product-category">{product.categoryName || 'Game'}</div>
                
                <Link to={`/products/${product.productId}`} className="product-title-link">
                    <h3 className="product-card-title" title={product.productName}>
                        {product.productName}
                    </h3>
                </Link>

                <div className="product-card-footer">
                    <div className="product-price-wrapper">
                        <span className="product-card-price">
                            {formatCurrency(product.listPrice)}
                        </span>
                    </div>

                    <Button
                        onClick={() => onAddToCart(product)}
                        className="add-to-cart-btn"
                        size="small"
                        color="1" // Dùng màu secondary (xanh teal)
                        disabled={product.stockQuantity === 0 || product.status === 'Inactive'}
                    >
                        {product.stockQuantity === 0 ? 'Hết hàng' : 'Thêm vào giỏ'}
                    </Button>
                </div>
            </div>
        </Card>
    );
};