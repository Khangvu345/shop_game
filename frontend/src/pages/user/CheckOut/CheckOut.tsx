import React, {useState, useEffect, useRef} from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { placeOrder } from '../../../store/slices/OrderBlock/orderSlice';
import { clearCart } from '../../../store/slices/cartSlice';
import { Input } from '../../../components/ui/input/Input';
import type { ICreateOrderPayload } from '../../../types';
import { TruckOrderButton } from '../../../components/ui/button/TruckOrderButton.tsx';
import './CheckOut.css';
import {fetchMyAddress, fetchMyProfile} from "../../../store/slices/AccountBlock/customerSlice.tsx";
import {AddressSelector} from "../../../components/ui/input/AddressSelector.tsx";
import {customerApi} from "../../../api/AccountBlock/customerApi.ts";

export function CheckoutPage() {

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    dispatch(fetchMyProfile());
    dispatch(fetchMyAddress());

    const cartItems = useAppSelector((state) => state.cart.items);
    const { user } = useAppSelector((state) => state.auth);
    const { status, error } = useAppSelector((state) => state.orders);

    const isOrderSuccess = useRef(false);

    const [formData, setFormData] = useState({
        recipientName: '',
        phone: '',
        city: '',
        ward: '',
        street: '',
        paymentMethod: 'COD'
    });

    const subTotal = cartItems.reduce((sum, item) => sum + (item.product.listPrice * item.quantity), 0);
    const shippingFee = 0;
    const grandTotal = subTotal + shippingFee;



    useEffect(() => {
        if (user) {
            const loadDefaultAddress = async () => {
                try {
                    const profile = await customerApi.getProfile()
                    if (profile) {
                        setFormData(prev => ({
                            ...prev,
                            recipientName: profile.fullName,
                            phone: profile.phone,

                        }));
                    }
                } catch (err) {
                    console.log("Chưa có địa chỉ mặc định hoặc lỗi tải địa chỉ");
                }
                try {
                    const address = await customerApi.getDefaultAddress();
                    if ( address) {
                        setFormData(prev => ({
                            ...prev,
                            city: address.city || '',
                            ward: address.ward || '',
                            street: address.line1 || '',

                        }));
                    }
                } catch (err) {
                    console.log("Chưa có địa chỉ mặc định hoặc lỗi tải địa chỉ");
                }
            };
            loadDefaultAddress();
        }
    }, [user]);


    useEffect(() => {
        if (cartItems.length === 0 && !isOrderSuccess.current) {
            navigate('/products');
        }
    }, [cartItems, navigate]);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLocationChange = (data: { city: string; ward: string }) => {
        setFormData(prev => ({
            ...prev,
            city: data.city,
            ward: data.ward
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const orderPayload: ICreateOrderPayload = {
            paymentMethod: formData.paymentMethod,
            address: {
                recipientName: formData.recipientName,
                phone: formData.phone,
                street: formData.street,
                ward: formData.ward,
                city: formData.city
            },
            items: cartItems.map(item => ({
                productId: item.product.productId,
                productName: item.product.productName,
                quantity: item.quantity,
                price: item.product.listPrice,
                lineTotal: item.product.listPrice * item.quantity
            }))
        };

        const resultAction = await dispatch(placeOrder(orderPayload));


        if (placeOrder.fulfilled.match(resultAction)) {
            isOrderSuccess.current = true;
            dispatch(clearCart());
            alert("Đặt hàng thành công!");
            navigate(`/my-orders/${resultAction.payload.orderId}`);
        } else {
            alert("Đặt hàng thất bại: " + resultAction.payload);
        }
    };

    return (
        <div className="checkout-page-wrapper">
            <div className="container checkout-layout">

                {/* CỘT TRÁI: FORM ĐIỀN THÔNG TIN */}
                <div className="checkout-section-left">
                    <div className="checkout-header">
                        <h2>Thông tin giao hàng</h2>
                        <p>Vui lòng kiểm tra kỹ thông tin trước khi đặt hàng</p>
                    </div>

                    <form id="checkoutForm" onSubmit={handleSubmit} className="modern-form">

                        <div className="form-group-row">
                            <Input
                                label="Họ tên người nhận" name="recipientName"
                                value={formData.recipientName} onChange={handleChange} required
                                placeholder="Nhập họ tên"
                            />
                            <Input
                                label="Số điện thoại" name="phone"
                                value={formData.phone} onChange={handleChange} required
                                placeholder="Nhập số điện thoại"
                            />
                        </div>

                        <div className="form-full-width">
                            <AddressSelector
                                initialCity={formData.city}
                                initialWard={formData.ward}
                                onChange={handleLocationChange}
                            />
                        </div>

                        <div className="form-full-width">
                            <Input
                                label="Địa chỉ chi tiết (Số nhà, đường)" name="street"
                                value={formData.street} onChange={handleChange} required
                                placeholder="Ví dụ: 123 Nguyễn Trãi"
                            />
                        </div>

                        <div className="payment-section">
                            <h3>Phương thức thanh toán</h3>
                            <div className="payment-options">
                                <label className={`payment-option ${formData.paymentMethod === 'COD' ? 'active' : ''}`}>
                                    <input
                                        type="radio" name="paymentMethod" value="COD"
                                        checked={formData.paymentMethod === 'COD'}
                                        onChange={handleChange}
                                    />
                                    <span className="radio-dot"></span>
                                    <div className="payment-content">
                                        <span className="payment-title">Thanh toán khi nhận hàng (COD)</span>
                                        <span className="payment-desc">Bạn sẽ thanh toán tiền mặt cho shipper khi nhận được hàng.</span>
                                    </div>
                                </label>

                                <label className={`payment-option ${formData.paymentMethod === 'VNPAY' ? 'active' : ''}`}>
                                    <input
                                        type="radio" name="paymentMethod" value="VNPAY"
                                        checked={formData.paymentMethod === 'VNPAY'}
                                        onChange={handleChange}
                                    />
                                    <span className="radio-dot"></span>
                                    <div className="payment-content">
                                        <span className="payment-title">Thanh toán VNPAY (QR, Thẻ, Ví)</span>
                                        <span className="payment-desc">Quét mã QR hoặc dùng thẻ ATM/Visa an toàn, nhanh chóng.</span>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </form>
                </div>

                {/* CỘT PHẢI: TỔNG KẾT ĐƠN HÀNG */}
                <div className="checkout-section-right">
                    <div className="order-summary-card">
                        <h3 className="summary-title">Đơn hàng của bạn <span className="item-count">({cartItems.length})</span></h3>

                        <div className="order-items-list">
                            {cartItems.map(item => (
                                <div key={item.product.productId} className="order-item">
                                    <div className="item-image-wrapper">
                                        <img
                                            src={item.product.productImageUrl || 'https://placehold.co/60'}
                                            alt={item.product.productName}
                                        />
                                        <span className="item-quantity-badge">{item.quantity}</span>
                                    </div>
                                    <div className="item-details">
                                        <div className="item-name">{item.product.productName}</div>
                                        <div className="item-price">{formatCurrency(item.product.listPrice)}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="summary-calculations">
                            <div className="calc-row">
                                <span>Tạm tính</span>
                                <span>{formatCurrency(subTotal)}</span>
                            </div>
                            <div className="calc-row">
                                <span>Phí vận chuyển</span>
                                <span>{formatCurrency(shippingFee)}</span>
                            </div>
                            <div className="divider"></div>
                            <div className="calc-row total">
                                <span>Tổng cộng</span>
                                <span className="total-amount">{formatCurrency(grandTotal)}</span>
                            </div>
                        </div>

                        {error && <div className="checkout-error-msg">⚠️ {error}</div>}

                        <TruckOrderButton 
                            form="checkoutForm"
                            isLoading={status === 'loading'}
                        />
                        
                        <p className="secure-note">🔒 Thông tin thanh toán được bảo mật an toàn</p>
                    </div>
                </div>

            </div>
        </div>
    );
}