import type { IProduct } from '../../../../types';
import { ProductCard } from '../ProductCard/ProductCard';
import { useAppDispatch } from '../../../../store/hooks';
import { addItem } from '../../../../store/slices/cartSlice';

import './ProductList.css'

interface ProductListProps {
    products: IProduct[];
}

export function ProductList  ({ products }:ProductListProps){
    const dispatch = useAppDispatch();

    // Logic thêm vào giỏ hàng được quản lý ở đây
    const handleAddToCart = (product: IProduct) => {
        dispatch(addItem(product));
        alert(`Đã thêm ${product.productName} vào giỏ!`);
    };

    if (products.length === 0) {
        return <div>Không tìm thấy sản phẩm nào.</div>;
    }

    return (
        <div className="product-grid">
            {products.map((product) => (
                <ProductCard
                    key={product.productId}
                    product={product}
                    onAddToCart={handleAddToCart}
                />
            ))}
        </div>
    );
};