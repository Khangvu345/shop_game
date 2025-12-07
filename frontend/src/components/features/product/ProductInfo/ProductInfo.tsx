import { StarRating } from '../../../ui/starRating/starRating';
import './ProductInfo.css';

// Hàm format tiền VNĐ
const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

interface ProductInfoProps {
    productName: string;
    listPrice: number;
    description?: string;
    status: string;           // ← Thêm
    stockQuantity: number;    // ← Thêm
    averageRating: number;
    totalReviews: number;
    quantity: number;
    onQuantityChange: (delta: number) => void;
    onAddToCart: () => void;
}

/**
 * ProductInfo component
 * Hiển thị thông tin sản phẩm và action buttons
 */
export function ProductInfo({
    productName,
    listPrice,
    description,
    status,              // ← Thêm
    stockQuantity,       // ← Thêm
    averageRating,
    totalReviews,
    quantity,
    onQuantityChange,
    onAddToCart,
}: ProductInfoProps) {
    const handleAddToCart = () => {
        onAddToCart();
    };

    // Kiểm tra trạng thái sản phẩm
    const isInactive = status === 'Inactive';
    const isOutOfStock = stockQuantity === 0;
    const canPurchase = !isInactive && !isOutOfStock;

    return (
        <div className="product-info">
            <h1 className="product-title">{productName}</h1>

            <div className="product-rating">
                <StarRating rating={Math.round(averageRating)} />
                <span className="rating-text">
                    {averageRating.toFixed(1)} ({totalReviews} Reviews)
                </span>
            </div>

            <p className="product-price">{formatCurrency(listPrice)}</p>

            <p className="product-short-description">
                {description
                    ? description.split('\n').slice(0, 3).join(' ').substring(0, 200) + '...'
                    : 'Sản phẩm chính hãng, bảo hành đầy đủ. Liên hệ shop để được tư vấn chi tiết.'}
            </p>

            <div className="product-actions">
                <div className="quantity-selector">
                    <span className="quantity-label">Số lượng:</span>
                    <div className="quantity-controls">
                        <button
                            className="quantity-btn"
                            onClick={() => onQuantityChange(-1)}
                            disabled={quantity <= 1 || !canPurchase}
                        >
                            −
                        </button>
                        <span className="quantity-value">{quantity}</span>
                        <button
                            className="quantity-btn"
                            onClick={() => onQuantityChange(1)}
                            disabled={!canPurchase}
                        >
                            +
                        </button>
                    </div>
                </div>

                {isInactive ? (
                    <button className="add-to-cart-btn disabled" disabled>
                        Sản phẩm ngừng kinh doanh
                    </button>
                ) : isOutOfStock ? (
                    <button className="add-to-cart-btn disabled" disabled>
                        Sản phẩm này đã hết hàng
                    </button>
                ) : (
                    <button className="add-to-cart-btn" onClick={handleAddToCart}>
                        Thêm vào giỏ hàng
                    </button>
                )}
            </div>
        </div>
    );
}
