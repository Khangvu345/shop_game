import React from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { removeItem, updateQuantity } from '../../../store/slices/cartSlice';
import { Button } from '../../../components/ui/button/Button';
import './CartPage.css';

const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

export const CartPage: React.FC = () => {
    const dispatch = useAppDispatch();
    const cartItems = useAppSelector((state) => state.cart.items);

    const totalPrice = cartItems.reduce((total, item) => {
        return total + (item.product.listPrice * item.quantity);
    }, 0);

    const handleQuantityChange = (productId: number, newQuantity: number) => {
        if (newQuantity < 1) return;
        dispatch(updateQuantity({ productId, quantity: newQuantity }));
    };

    const handleRemove = (productId: number) => {
        if (window.confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
            dispatch(removeItem(productId));
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="container empty-cart">
                <img
                    src="https://cdn-icons-png.flaticon.com/512/11329/11329060.png"
                    alt="Empty Cart"
                />
                <h2>Giỏ hàng của bạn đang trống</h2>
                <p>Hãy dạo quanh cửa hàng để tìm những món đồ ưng ý nhé!</p>
                <Link to="/products">
                    <Button>Tiếp tục mua sắm</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="container cart-page">
            <h2 className="cart-title">
                Giỏ hàng <span className="cart-count">{cartItems.length} sản phẩm</span>
            </h2>

            <div className="cart-layout">
                {/* Cart Items List */}
                <div className="cart-items-container">
                    <div className="cart-header-row">
                        <div>Sản phẩm</div>
                        <div>Đơn giá</div>
                        <div>Số lượng</div>
                        <div>Thành tiền</div>
                        <div></div>
                    </div>

                    {cartItems.map((item) => (
                        <div key={item.product.productId} className="cart-item">
                            <div className="item-info">
                                <img
                                    src={item.product.productImageUrl || 'https://placehold.co/80'}
                                    alt={item.product.productName}
                                    className="item-image"
                                />
                                <div className="item-details">
                                    <h4>
                                        <Link to={`/products/${item.product.productId}`}>
                                            {item.product.productName}
                                        </Link>
                                    </h4>
                                    <span className="item-sku">SKU: {item.product.sku}</span>
                                </div>
                            </div>

                            <div className="item-price">
                                {formatCurrency(item.product.listPrice)}
                            </div>

                            <div className="quantity-wrapper">
                                <button
                                    className="qty-btn"
                                    onClick={() => handleQuantityChange(item.product.productId, item.quantity - 1)}
                                >-</button>
                                <div className="qty-value">{item.quantity}</div>
                                <button
                                    className="qty-btn"
                                    onClick={() => handleQuantityChange(item.product.productId, item.quantity + 1)}
                                >+</button>
                            </div>

                            <div className="item-total">
                                {formatCurrency(item.product.listPrice * item.quantity)}
                            </div>

                            <button
                                className="remove-btn"
                                onClick={() => handleRemove(item.product.productId)}
                                title="Xóa sản phẩm"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="3 6 5 6 21 6"></polyline>
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                </svg>
                            </button>
                        </div>
                    ))}
                </div>

                {/* Order Summary */}
                <div className="cart-summary-card">
                    <h3 className="summary-title">Tổng đơn hàng</h3>

                    <div className="summary-row">
                        <span>Tạm tính</span>
                        <span>{formatCurrency(totalPrice)}</span>
                    </div>
                    <div className="summary-row">
                        <span>Phí vận chuyển</span>
                        <span>Liên hệ sau</span>
                    </div>

                    <div className="summary-row total">
                        <span>Tổng cộng</span>
                        <span>{formatCurrency(totalPrice)}</span>
                    </div>

                    <Link to="/checkout">
                        <Button className="checkout-btn">Tiến hành thanh toán</Button>
                    </Link>

                    <Link to="/products" className="continue-shopping">
                        ← Tiếp tục mua sắm
                    </Link>
                </div>
            </div>
        </div>
    );
};