import { Link } from 'react-router-dom';
import type { IProduct } from '../../../../types';
import { Button } from '../../../ui/button/Button';

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

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {

    const handleAddToCartClick = () => {
        onAddToCart(product);
    };

    return (
        <div>
            <h1>${product.product_name}</h1>
            <Button
                onClick={handleAddToCartClick}

            >
                Thêm vào giỏ
            </Button>
        </div>

    );
};