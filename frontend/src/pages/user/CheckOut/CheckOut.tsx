import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { placeOrder } from '../../../store/slices/OrderBlock/orderSlice';
import { clearCart } from '../../../store/slices/cartSlice';
import { Button } from '../../../components/ui//button/Button';
import { Input } from '../../../components/ui/input/Input';
import { Select } from '../../../components/ui/input/Select';
import type { ICreateOrderPayload } from '../../../types';
import {Spinner} from "../../../components/ui/loading/Spinner";
import {fetchMyAddress, fetchMyProfile} from "../../../store/slices/AccountBlock/customerSlice.tsx";

export function CheckoutPage() {

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const cartItems = useAppSelector((state) => state.cart.items);
    const { profile, address } = useAppSelector(state => state.customer);
    const { status ,error } = useAppSelector((state) => state.orders);

    const user = profile.data

    const [formData, setFormData] = useState({
        recipientName: user?.fullName || '',
        phone: user?.phone || '',
        city: address.data?.city || '',
        ward: address.data?.ward || '',
        street: address.data?.line1  || '',
        paymentMethod: 'COD'
    });

    const subTotal = cartItems.reduce((sum, item) => sum + (item.product.listPrice * item.quantity), 0);
    const shippingFee = 30000;
    const grandTotal = subTotal + shippingFee;

    useEffect(() => {
        dispatch(fetchMyProfile());
        dispatch(fetchMyAddress());
    }, [dispatch]);


    useEffect(() => {

            setFormData(prev => ({
                ...prev,
                receiverName: user?.fullName || '',
                phone: user?.phone || '',
                city: address.data?.city || '',
                ward: address.data?.ward || '',
                street: address.data?.line1  || '',
            }));



    }, [user, address]);

    useEffect(() => {
        if (cartItems.length === 0) {
            navigate('/my-orders');
        }
    }, [cartItems, navigate]);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // 1. Chuẩn bị Payload theo đúng mẫu JSON mới
        const orderPayload: ICreateOrderPayload = {

            paymentMethod: formData.paymentMethod,

            // Object address lồng nhau
            address: {
                recipientName: formData.recipientName,
                phone: formData.phone,
                street: formData.street,
                ward: formData.ward,
                city: formData.city
            },

            // Mảng items map từ giỏ hàng
            items: cartItems.map(item => ({
                productId: item.product.productId,
                productName: item.product.productName,
                quantity: item.quantity,
                price: item.product.listPrice,
                lineTotal: item.product.listPrice * item.quantity
            }))
        };

        // 2. Gửi API
        const resultAction = await dispatch(placeOrder(orderPayload));

        if (placeOrder.fulfilled.match(resultAction)) {
            dispatch(clearCart());
        } else {
            alert("Đặt hàng thất bại: " + resultAction.payload);
        }
    };

    return (
        <div className="container checkout-container">
            <div className="checkout-form-col">
                <h2>Thông tin giao hàng</h2>
                <form id="checkoutForm" onSubmit={handleSubmit} className="checkout-card">
                    <Input
                        label="Họ tên người nhận" name="recipientName"
                        value={formData.recipientName} onChange={handleChange} required
                    />
                    <Input
                        label="Số điện thoại" name="phone"
                        value={formData.phone} onChange={handleChange} required
                    />

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <Input
                            label="Tỉnh / Thành phố" name="city"
                            value={formData.city} onChange={handleChange} required
                        />
                        <Input
                            label="Quận / Huyện / Phường" name="ward"
                            value={formData.ward} onChange={handleChange} required
                        />
                    </div>

                    <Input
                        label="Địa chỉ chi tiết (Số nhà, đường)" name="street"
                        value={formData.street} onChange={handleChange} required
                    />

                    <Select
                        label="Phương thức thanh toán" name="paymentMethod"
                        value={formData.paymentMethod} onChange={handleChange}
                        options={[
                            { label: 'Thanh toán khi nhận hàng (COD)', value: 'COD' },
                            { label: 'Thanh toán VNPAY', value: 'VNPAY' }
                        ]}
                    />
                </form>
            </div>

            {/* CỘT PHẢI: TỔNG KẾT ĐƠN HÀNG */}
            <div className="checkout-summary-col">
                <div className="checkout-card" style={{ position: 'sticky', top: '100px' }}>
                    <h3 style={{ marginBottom: '1rem' }}>Đơn hàng ({cartItems.length} món)</h3>

                    {/* List item rút gọn */}
                    <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '1rem' }}>
                        {cartItems.map(item => (
                            <div key={item.product.productId} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                                <img src={item.product.productImageUrl} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '0.9rem', fontWeight: 500 }}>{item.product.productName}</div>
                                    <div style={{ fontSize: '0.85rem', color: '#666' }}>
                                        {item.quantity} x {formatCurrency(item.product.listPrice)}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="summary-divider"></div>

                    <div className="summary-item">
                        <span>Tạm tính:</span>
                        <span>{formatCurrency(subTotal)}</span>
                    </div>
                    <div className="summary-item">
                        <span>Phí vận chuyển:</span>
                        <span>{formatCurrency(shippingFee)}</span>
                    </div>

                    <div className="summary-divider"></div>

                    <div className="summary-item summary-total">
                        <span>Tổng cộng:</span>
                        <span>{formatCurrency(grandTotal)}</span>
                    </div>

                    {error && <p style={{ color: 'red', marginTop: '1rem', fontSize: '0.9rem' }}>{error}</p>}

                    <Button
                        form="checkoutForm" // Link nút này với form bên kia
                        type="submit"
                        style={{ width: '100%', marginTop: '1.5rem', padding: '1rem' }}
                        disabled={status === 'loading'}
                    >
                        {status === 'loading' ? <Spinner /> : 'ĐẶT HÀNG NGAY'}
                    </Button>
                </div>
            </div>

        </div>
    );
}