import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchProductById } from '../store/slices/productSlice';
import { addItem } from '../store/slices/cartSlice';

/**
 * Custom hook để quản lý logic cho ProductDetailPage
 * Tách biệt business logic khỏi UI components
 */
export function useProductDetail() {
    const { id } = useParams<{ id: string }>();
    const dispatch = useAppDispatch();

    const { selectedProduct } = useAppSelector((state) => state.products);
    const { data: product, status, error } = selectedProduct;

    const [quantity, setQuantity] = useState(1);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    // Fetch product data khi component mount
    useEffect(() => {
        if (id) {
            dispatch(fetchProductById(id));
        }
    }, [id, dispatch]);

    // Reset selected image khi product thay đổi
    useEffect(() => {
        setSelectedImageIndex(0);
    }, [product?.productId]);

    // Handler: Thay đổi số lượng
    const handleQuantityChange = (delta: number) => {
        setQuantity((prev) => Math.max(1, prev + delta));
    };

    // Handler: Thêm vào giỏ hàng
    const handleAddToCart = () => {
        if (product) {
            for (let i = 0; i < quantity; i++) {
                dispatch(addItem(product));
            }
            return { success: true, message: `Đã thêm ${quantity} ${product.productName} vào giỏ hàng!` };
        }
        return { success: false, message: 'Không thể thêm sản phẩm vào giỏ hàng' };
    };

    // Handler: Chọn ảnh
    const handleSelectImage = (index: number) => {
        setSelectedImageIndex(index);
    };

    return {
        // Data
        product,
        status,
        error,
        quantity,
        selectedImageIndex,

        // Handlers
        handleQuantityChange,
        handleAddToCart,
        handleSelectImage,
    };
}