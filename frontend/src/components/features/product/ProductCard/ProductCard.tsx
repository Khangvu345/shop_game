// src/components/features/product/ProductCard.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import type { IProduct } from '../../../../types';
import { Button } from '../../../ui/button/Button.tsx';
import { Card } from '../../../ui/card/Card.tsx';

import './ProductCard.css'


const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

interface ProductCardProps {
    product: IProduct;
    onAddToCart: (product: IProduct) => void;
}

export const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
    return (
        <Card className="product-card">
            {/* SỬA: Link dùng productId */}
            <Link to={`/products/${product.productId}`}>
                <img
                    // SỬA: dùng thumbnailUrl (nếu có) hoặc placeholder
                    src={product.thumbnailUrl || 'https://placehold.co/400x400?text=No+Image'}
                    // SỬA: dùng productName
                    alt={product.productName}
                    className="product-card-image"
                />
            </Link>

            <div className="product-card-content">
                <Link to={`/products/${product.productId}`} style={{textDecoration: 'none'}}>
                    {/* SỬA: dùng productName */}
                    <h3 className="product-card-title">{product.productName}</h3>
                </Link>

                {/* SỬA: dùng listPrice */}
                <p className="product-card-price">
                    {formatCurrency(product.listPrice)}
                </p>

                <Button
                    onClick={() => onAddToCart(product)}
                    // style={{ width: '100%' }}
                >
                    Thêm vào giỏ
                </Button>
            </div>
        </Card>
    );
};