// src/components/features/product/ProductCard.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import type { IProduct } from '../../../../types';
import { Button } from '../../../ui/button/Button.tsx';
import { Card } from '../../../ui/card/Card.tsx';

import './ProductCard.css'


const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(amount);
};

interface ProductCardProps {
    product: IProduct;
    onAddToCart: (product: IProduct) => void;
}

export const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {

    const handleAddToCartClick = () => {
        onAddToCart(product);
    };

    return (
        <Card className="product-card">
            <Link to={`/products/${product.product_id}`}>
                <img
                    src={'../../../../assets/images/products' + product.product_id}
                    alt={product.product_name}
                    className="product-card-image"
                />
            </Link>

            {/* Nội dung card */}
            <div className="product-card-content">
                <Link to={`/products/${product.product_id}`} style={{textDecoration: 'none'}}>
                    <h3 className="product-card-title">{product.product_name}</h3>
                </Link>

                <p className="product-card-price">
                    {formatCurrency(product.list_price)}
                </p>

                <Button
                    onClick={handleAddToCartClick}
                    style={{ width: '100%' }}
                >
                    Thêm vào giỏ
                </Button>
            </div>
        </Card>
    );
};