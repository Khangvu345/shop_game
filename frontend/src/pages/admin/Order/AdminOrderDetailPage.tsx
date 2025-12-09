import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchAdminOrderDetail, updateOrderStatusThunk, resetOrderState } from '../../../store/slices/OrderBlock/orderSlice';
import { Button } from '../../../components/ui/button/Button';
import { Card } from '../../../components/ui/card/Card';
import { Spinner } from '../../../components/ui/loading/Spinner';
import { createShipment } from "../../../store/slices/OrderBlock/shipmentSlice.ts";
import { Modal } from "../../../components/ui/Modal/Modal.tsx";
import { Input } from "../../../components/ui/input/Input.tsx";
import { getStatusColor, translateStatus } from "../../../store/utils/statusTranslator.ts";
import { AdminPageHeader } from '../../../components/features/admin/AdminPageHeader/AdminPageHeader.tsx';
import '../../../components/features/admin/AdminPageHeader/AdminPageHeader.css';

export function AdminOrderDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { currentOrder, status: orderStatus } = useAppSelector((state) => state.orders);
    const { status: shipmentStatus } = useAppSelector((state: any) => state.shipments); // State của shipment

    const [isShipModalOpen, setIsShipModalOpen] = useState(false);
    const [shipForm, setShipForm] = useState({ carrier: '', trackingNo: '' });


    useEffect(() => {
        if (id) dispatch(fetchAdminOrderDetail(id));
        return () => { dispatch(resetOrderState()); };
    }, [id, dispatch]);

    const handleUpdateStatus = async (newStatus: string) => {
        if (!id) return;
        if (window.confirm(`Xác nhận?`)) {
            try {
                // Bước 1: Gọi API cập nhật
                await dispatch(updateOrderStatusThunk({
                    id,
                    payload: { status: newStatus }
                })).unwrap();

                dispatch(fetchAdminOrderDetail(id));

                alert("Cập nhật thành công!");
            } catch (error) {
                alert("Cập nhật thất bại!");
            }
        }
    };

    const handleCreateShipment = async () => {
        if (!shipForm.carrier || !shipForm.trackingNo) return alert("Vui lòng điền đủ thông tin");
        if (!currentOrder || !id) return;

        try {
            await dispatch(createShipment({
                orderId: currentOrder.orderId,
                carrier: shipForm.carrier,
                trackingNo: shipForm.trackingNo
            })).unwrap();

            dispatch(fetchAdminOrderDetail(id));

            setIsShipModalOpen(false);
            alert("Đã tạo vận đơn và bàn giao cho đơn vị vận chuyểb");
        } catch (error) {
            alert("Tạo vận đơn thất bại");
        }
    };


    if (!currentOrder) return <div style={{ padding: '20px' }}>{orderStatus === 'loading' ? <Spinner /> : 'Không tìm thấy đơn hàng'}</div>;

    const address = (currentOrder as any).shippingAddress || currentOrder.address;

    // --- LOGIC HIỂN THỊ NÚT BẤM ---
    const renderActionButtons = () => {
        const orderStatus = currentOrder.status;
        const paymentStatus = currentOrder.paymentStatus
        return (
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px', flexWrap: 'wrap' }}>
                {orderStatus === 'PENDING' && (
                    <>
                        <button
                            onClick={() => handleUpdateStatus('CONFIRMED')}
                            style={{
                                padding: '10px 20px',
                                borderRadius: '6px',
                                border: '1px solid #06b6d4',
                                background: '#06b6d4',
                                color: '#fff',
                                fontSize: '14px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(6, 182, 212, 0.4)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        >
                            Xác nhận đơn
                        </button>
                        <button
                            onClick={() => handleUpdateStatus('CANCELLED')}
                            style={{
                                padding: '10px 20px',
                                borderRadius: '6px',
                                border: '1px solid #ef4444',
                                background: '#ef4444',
                                color: '#fff',
                                fontSize: '14px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.4)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        >
                            Hủy đơn
                        </button>
                    </>
                )}
                {orderStatus === 'CONFIRMED' && (
                    <button
                        onClick={() => handleUpdateStatus('PREPARING')}
                        style={{
                            padding: '10px 20px',
                            borderRadius: '6px',
                            border: '1px solid #06b6d4',
                            background: '#06b6d4',
                            color: '#fff',
                            fontSize: '14px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(6, 182, 212, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                        }}
                    >
                        Chuẩn bị hàng
                    </button>
                )}
                {orderStatus === 'PREPARING' && (
                    <button
                        onClick={() => setIsShipModalOpen(true)}
                        style={{
                            padding: '10px 20px',
                            borderRadius: '6px',
                            border: '1px solid #06b6d4',
                            background: '#06b6d4',
                            color: '#fff',
                            fontSize: '14px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(6, 182, 212, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                        }}
                    >
                        📦 Tạo vận đơn & Giao hàng
                    </button>
                )}
                {orderStatus === 'SHIPPED' && (
                    <button
                        style={{
                            padding: '10px 20px',
                            borderRadius: '6px',
                            border: '1px solid #6b7280',
                            background: '#6b7280',
                            color: '#fff',
                            fontSize: '14px',
                            fontWeight: '600',
                            cursor: 'not-allowed',
                            opacity: 0.7
                        }}
                        disabled
                    >
                        Đơn vị vận chuyển đang chuyển hàng
                    </button>
                )}
                {orderStatus === 'DELIVERED' && (paymentStatus === 'COD_PENDING' || paymentStatus === 'FAILED') && (
                    <button
                        onClick={() => handleUpdateStatus('COMPLETED')}
                        style={{
                            padding: '10px 20px',
                            borderRadius: '6px',
                            border: '1px solid #06b6d4',
                            background: '#06b6d4',
                            color: '#fff',
                            fontSize: '14px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(6, 182, 212, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                        }}
                    >
                        Khách hàng đã thanh toán
                    </button>
                )}
                {orderStatus === 'DELIVERED' && (paymentStatus === 'COD_COLLECTED' || paymentStatus === 'PAID') && (
                    <button
                        onClick={() => handleUpdateStatus('COMPLETED')}
                        style={{
                            padding: '10px 20px',
                            borderRadius: '6px',
                            border: '1px solid #06b6d4',
                            background: '#06b6d4',
                            color: '#fff',
                            fontSize: '14px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(6, 182, 212, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                        }}
                    >
                        Hoàn tất đơn hàng
                    </button>
                )}
                {/* Các trạng thái cuối: COMPLETED, CANCELLED, RETURNED không có nút tiếp theo */}
            </div>
        );
    };

    return (
        <div className="admin-page-container">
            <AdminPageHeader title={`Chi tiết đơn hàng #${currentOrder.orderId}`} />

            {/* Action Bar with Back Button */}
            <div style={{
                marginBottom: '20px',
                padding: '15px',
                background: '#fff',
                borderRadius: '8px',
                border: '1px solid #eee',
                display: 'flex',
                gap: '15px',
                alignItems: 'center'
            }}>
                <button
                    onClick={() => navigate('/admin/orders')}
                    style={{
                        padding: '10px 20px',
                        borderRadius: '6px',
                        border: '1px solid #ddd',
                        background: '#f5f5f5',
                        fontSize: '14px',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                        transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#06b6d4';
                        e.currentTarget.style.color = '#06b6d4';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = '#ddd';
                        e.currentTarget.style.color = 'inherit';
                    }}
                >
                    ← Quay lại
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
                {/* CỘT TRÁI */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {/* Sản phẩm */}
                    <Card>
                        <h3>Sản phẩm</h3>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid #eee', textAlign: 'left' }}>
                                    <th style={{ padding: '10px' }}>Tên SP</th>
                                    <th style={{ padding: '10px' }}>SL</th>
                                    <th style={{ padding: '10px' }}>Giá</th>
                                    <th style={{ padding: '10px' }}>Tổng</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentOrder.items?.map((item: any, idx: number) => (
                                    <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
                                        <td style={{ padding: '10px' }}>{item.productName}</td>
                                        <td style={{ padding: '10px' }}>x{item.quantity}</td>
                                        <td style={{ padding: '10px' }}>{item.price?.toLocaleString()}</td>
                                        <td style={{ padding: '10px' }}>{item.lineTotal?.toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div style={{ textAlign: 'right', marginTop: '15px', fontSize: '1.2rem', fontWeight: 'bold' }}>
                            Tổng cộng: {currentOrder.grandTotal?.toLocaleString()} đ
                        </div>
                    </Card>

                    {/* Xử lý đơn hàng */}
                    <Card>
                        <h3>Xử lý đơn hàng</h3>
                        <p>Trạng thái hiện tại: <strong style={{ fontSize: '1.1rem', color: getStatusColor(currentOrder.status) }}>{translateStatus(currentOrder.status, 'order')}</strong></p>
                        {renderActionButtons()}
                    </Card>
                </div>

                {/* CỘT PHẢI */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <Card>
                        <h3>Khách hàng</h3>
                        <p><strong>Tên:</strong> {address?.recipientName}</p>
                        <p><strong>SĐT:</strong> {address?.phone}</p>
                        <p><strong>Địa chỉ:</strong> {address?.street}, {address?.ward}, {address?.city}</p>
                    </Card>

                    <Card>
                        <h3>Thanh toán</h3>
                        <p><strong>Phương thức:</strong> {currentOrder.paymentMethod}</p>
                        <p><strong>Trạng thái:</strong> <span style={{ fontWeight: 'bold', color: getStatusColor(currentOrder.paymentStatus) }}>{translateStatus(currentOrder.paymentStatus, 'payment')}</span></p>
                    </Card>
                </div>
            </div>
            <Modal isOpen={isShipModalOpen} onClose={() => setIsShipModalOpen(false)} title="Tạo vận đơn">
                <div style={{ minWidth: '400px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <Input label="Đơn vị vận chuyển" placeholder="VD: GHTK, GHN..."
                        value={shipForm.carrier} onChange={e => setShipForm({ ...shipForm, carrier: e.target.value })} />
                    <Input label="Mã vận đơn (Tracking No)" placeholder="VD: GHTK_123456789"
                        value={shipForm.trackingNo} onChange={e => setShipForm({ ...shipForm, trackingNo: e.target.value })} />
                    <Button onClick={handleCreateShipment} disabled={shipmentStatus === 'loading'}>
                        {shipmentStatus === 'loading' ? <Spinner /> : 'Tạo & Giao hàng'}
                    </Button>
                </div>
            </Modal>
        </div>
    );
}