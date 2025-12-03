// src/pages/CartPage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { removeItem, updateQuantity } from '../../../store/slices/cartSlice';
import { Button } from '../../../components/ui/button/Button';

// Hàm format tiền (nên đưa vào utils/formatters.ts)
const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

export const CartPage: React.FC = () => {
    const dispatch = useAppDispatch();

    // 1. Lấy danh sách item từ Redux
    const cartItems = useAppSelector((state) => state.cart.items);

    // 2. Tính tổng tiền (dùng listPrice và quantity)
    const totalPrice = cartItems.reduce((total, item) => {
        return total + (item.product.listPrice * item.quantity);
    }, 0);

    // 3. Xử lý tăng/giảm số lượng
    const handleQuantityChange = (productId: number, newQuantity: number) => {
        if (newQuantity < 1) return; // Không cho giảm dưới 1 (hoặc có thể cho phép để xóa)
        dispatch(updateQuantity({ productId, quantity: newQuantity }));
    };

    // 4. Xử lý xóa sản phẩm
    const handleRemove = (productId: number) => {
        if (window.confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
            dispatch(removeItem(productId));
        }
    };

    // Trường hợp giỏ hàng trống
    if (cartItems.length === 0) {
        return (
            <div className="container cart-page" style={{ textAlign: 'center', padding: '4rem 0' }}>
                <img
                    src="https://cdn-icons-png.flaticon.com/512/11329/11329060.png"
                    alt="Empty Cart"
                    style={{ width: '150px', marginBottom: '1rem', opacity: 0.5 }}
                />
                <h2>Giỏ hàng của bạn đang trống</h2>
                <p style={{ color: 'var(--secondary-color)', marginBottom: '2rem' }}>
                    Hãy dạo quanh cửa hàng để tìm những món đồ ưng ý nhé!
                </p>
                <Link to="/products">
                    <Button >Tiếp tục mua sắm</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="container cart-page">
            <h2 style={{ marginBottom: '2rem' }}>Giỏ hàng ({cartItems.length} sản phẩm)</h2>

            {/* BẢNG SẢN PHẨM */}
            <table className="cart-table">
                <thead>
                <tr>
                    <th style={{ width: '40%' }}>Sản phẩm</th>
                    <th style={{ width: '20%' }}>Đơn giá</th>
                    <th style={{ width: '20%' }}>Số lượng</th>
                    <th style={{ width: '20%' }}>Thành tiền</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                {cartItems.map((item) => (
                    <tr key={item.product.productId}>
                        <td>
                            <div className="cart-item-info">
                                <img
                                    src={item.product.productImageUrl || 'https://placehold.co/80'}
                                    alt={item.product.productName}
                                    className="cart-item-image"
                                />
                                <div>
                                    <Link
                                        to={`/products/${item.product.productId}`}
                                        style={{ fontWeight: 'bold', color: 'inherit', textDecoration: 'none' }}
                                    >
                                        {item.product.productName}
                                    </Link>
                                    {/* Có thể hiển thị thêm SKU hoặc thuộc tính khác ở đây */}
                                    <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.25rem' }}>
                                        SKU: {item.product.sku}
                                    </div>
                                </div>
                            </div>
                        </td>

                        <td>{formatCurrency(item.product.listPrice)}</td>

                        <td>
                            <div className="quantity-control">
                                <button
                                    className="quantity-btn"
                                    onClick={() => handleQuantityChange(item.product.productId, item.quantity - 1)}
                                >
                                    -
                                </button>
                                <span style={{ minWidth: '30px', textAlign: 'center' }}>{item.quantity}</span>
                                <button
                                    className="quantity-btn"
                                    onClick={() => handleQuantityChange(item.product.productId, item.quantity + 1)}
                                >
                                    +
                                </button>
                            </div>
                        </td>

                        <td style={{ fontWeight: 'bold', color: 'var(--primary-color)' }}>
                            {formatCurrency(item.product.listPrice * item.quantity)}
                        </td>

                        <td>
                            <button
                                onClick={() => handleRemove(item.product.productId)}
                                style={{ background: 'none', border: 'none', color: '#ff4d4f', cursor: 'pointer' }}
                                title="Xóa sản phẩm"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="3 6 5 6 21 6"></polyline>
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                </svg>
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {/* TỔNG KẾT & THANH TOÁN */}
            <div className="cart-summary">
                <div className="summary-row">
                    <span>Tạm tính:</span>
                    <span>{formatCurrency(totalPrice)}</span>
                </div>
                <div className="summary-row">
                    <span>Phí vận chuyển:</span>
                    <span>Liên hệ sau</span>
                </div>
                <div className="summary-row summary-total">
                    <span>Tổng cộng:</span>
                    <span>{formatCurrency(totalPrice)}</span>
                </div>

                <p style={{ fontSize: '0.9rem', color: '#666', margin: '1rem 0', fontStyle: 'italic' }}>
                    * Phí vận chuyển và mã giảm giá sẽ được tính ở bước thanh toán.
                </p>

                <Link to="/checkout" style={{ display: 'block' }}>
                    <Button style={{ width: '100%' }}>
                        Tiến hành thanh toán
                    </Button>
                </Link>

                <Link to="/products" style={{ display: 'block', textAlign: 'center', marginTop: '1rem', fontSize: '0.9rem', textDecoration: 'none' }}>
                    ← Tiếp tục mua sắm
                </Link>
            </div>
        </div>
    );
};