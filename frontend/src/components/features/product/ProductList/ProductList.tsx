import type { IProduct } from '../../../../types';
import { ProductCard } from '../ProductCard/ProductCard';
import { useAppDispatch } from '../../../../store/hooks';
import { addItem } from '../../../../store/slices/cartSlice';

interface ProductListProps {
    products: IProduct[];
}

export function ProductList  ({ products }:ProductListProps){
    const dispatch = useAppDispatch();

    // Logic thêm vào giỏ hàng được quản lý ở đây
    const handleAddToCart = (product: IProduct) => {
        dispatch(addItem(product));
        alert(`Đã thêm ${product.product_name} vào giỏ!`);
    };

    if (products.length === 0) {
        return <div>Không tìm thấy sản phẩm nào.</div>;
    }

    // Dùng .product-grid CSS
    return (
        <div className="product-grid">
            {products.map((product) => (
                <ProductCard
                    key={product.product_id}
                    product={product}
                    onAddToCart={handleAddToCart}
                />
            ))}
        </div>
    );
};