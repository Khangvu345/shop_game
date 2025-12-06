import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchOrderDetail, cancelOrderThunk, resetOrderState } from '../../../store/slices/OrderBlock/orderSlice';
import { Button } from '../../../components/ui/button/Button';
import { Card } from '../../../components/ui/card/Card';
import { Spinner } from '../../../components/ui/loading/Spinner';
import { Modal } from '../../../components/ui/Modal/Modal';
import { Input } from '../../../components/ui/input/Input';
import './OrderDetailPage.css';
export function OrderDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const { currentOrder, status, error } = useAppSelector((state) => state.orders);
    const { user } = useAppSelector((state) => state.auth);

    // State cho Modal Hủy
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [cancelReason, setCancelReason] = useState('');

    useEffect(() => {
        if (id) {
            dispatch(fetchOrderDetail(id));
        }
        return () => {
            // Optional: Reset state khi rời trang
            // dispatch(resetOrderState());
        };
    }, [id, dispatch]);

    const handleCancelSubmit = async () => {
        if (!cancelReason.trim()) {
            alert('Vui lòng nhập lý do hủy đơn');
            return;
        }

        if (id && user) {
            await dispatch(cancelOrderThunk({
                id,
                payload: {
                    reason: cancelReason,
                    cancelledBy: user.username || 'Khách hàng'
                }
            }));
            setIsCancelModalOpen(false);
            setCancelReason('');
        }
    };

    // Format tiền
    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

    // Helper hiển thị trạng thái
    const translateStatus = (status: string) => {
        const map: Record<string, string> = {
            PENDING: 'Chờ xử lý',
            CONFIRMED: 'Đã xác nhận',
            PREPARING: 'Đang chuẩn bị',
            SHIPPED: 'Đang giao hàng',
            DELIVERED: 'Giao thành công',
            COMPLETED: 'Hoàn thành',
            CANCELLED: 'Đã hủy',
            RETURNED: 'Đã trả hàng'
        };
        return map[status] || status;
    };

    if (status === 'loading' && !currentOrder) return <div style={{display:'flex', justifyContent:'center', padding:'50px'}}><Spinner /></div>;
    if (error) return <div className="container" style={{color:'red', padding:'20px'}}>Lỗi: {error}</div>;
    if (!currentOrder) return <div className="container" style={{padding:'20px'}}>Không tìm thấy đơn hàng.</div>;

    // Kiểm tra xem có được phép hủy không (Chỉ PENDING hoặc CONFIRMED)
    const canCancel = ['PENDING', 'CONFIRMED'].includes(currentOrder.status);

    // Mapping field address (Backend trả về shippingAddress trong OrderResponse)
    // TypeScript có thể báo lỗi nếu type IOrder chưa update, ta dùng as any tạm hoặc update type
    const address = (currentOrder as any).shippingAddress || currentOrder.address;

    return (
        <div className="container" style={{ padding: '20px 0' }}>
            {/* HEADER */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                    <h2 style={{ margin: 0 }}>Chi tiết đơn hàng #{currentOrder.orderId}</h2>
                    <p style={{ color: '#666', margin: '5px 0 0' }}>
                        Đặt ngày: {new Date(currentOrder.createdAt).toLocaleString('vi-VN')}
                    </p>
                </div>
                <div style={{textAlign: 'right'}}>
                    <div style={{
                        fontSize: '1.2rem',
                        fontWeight: 'bold',
                        color: currentOrder.status === 'CANCELLED' ? 'red' : 'var(--color-secondary-0)'
                    }}>
                        {translateStatus(currentOrder.status)}
                    </div>
                    {canCancel && (
                        <Button
                            onClick={() => setIsCancelModalOpen(true)}
                            style={{backgroundColor: '#ef4444', borderColor: '#ef4444', marginTop: '10px'}}
                            size="small"
                        >
                            Hủy đơn hàng
                        </Button>
                    )}
                    <Button onClick={() => navigate('/my-orders')} color="0" size="small" style={{marginLeft: '10px'}}>
                        Quay lại
                    </Button>
                </div>
            </div>

            {/* Cảnh báo nếu đơn đã hủy */}
            {currentOrder.status === 'CANCELLED' && (
                <div style={{backgroundColor: '#fee2e2', color: '#b91c1c', padding: '15px', borderRadius: '8px', marginBottom: '20px'}}>
                    <strong>Đơn hàng đã bị hủy.</strong>
                    <br/>Lý do: {currentOrder.cancelReason || currentOrder.cancelReason}
                    <br/>Bởi: {currentOrder.cancelledBy} vào lúc {new Date(currentOrder.cancelledAt!).toLocaleString('vi-VN')}
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
                {/* CỘT TRÁI: DANH SÁCH SẢN PHẨM */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <Card>
                        <h3 style={{borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '15px'}}>Sản phẩm</h3>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                            <tr style={{borderBottom: '2px solid #eee', textAlign: 'left'}}>
                                <th style={{padding: '10px'}}>Sản phẩm</th>
                                <th style={{padding: '10px', textAlign: 'center'}}>SL</th>
                                <th style={{padding: '10px', textAlign: 'right'}}>Đơn giá</th>
                                <th style={{padding: '10px', textAlign: 'right'}}>Tổng</th>
                            </tr>
                            </thead>
                            <tbody>
                            {currentOrder.items?.map((item: any, idx: number) => (
                                <tr key={idx} style={{borderBottom: '1px solid #eee'}}>
                                    <td style={{padding: '15px 10px'}}>
                                        <div style={{fontWeight: 500}}>{item.productName}</div>
                                        <div style={{fontSize: '0.85rem', color: '#888'}}>ID: {item.productId}</div>
                                    </td>
                                    <td style={{padding: '10px', textAlign: 'center'}}>x{item.quantity}</td>
                                    <td style={{padding: '10px', textAlign: 'right'}}>{formatCurrency(item.price)}</td>
                                    <td style={{padding: '10px', textAlign: 'right', fontWeight: 'bold'}}>
                                        {formatCurrency(item.lineTotal)}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </Card>
                </div>

                {/* CỘT PHẢI: THÔNG TIN THANH TOÁN & GIAO HÀNG */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <Card>
                        <h3 style={{borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '15px'}}>Thông tin giao hàng</h3>
                        {address ? (
                            <div style={{fontSize: '0.95rem', lineHeight: '1.6'}}>
                                <strong>{address.recipientName || address.receiverName}</strong><br/>
                                {address.phone || address.receiverPhone}<br/>
                                {address.street || address.line1}, {address.ward}, {address.city}
                            </div>
                        ) : (
                            <p>Không có thông tin địa chỉ</p>
                        )}
                    </Card>

                    <Card>
                        <h3 style={{borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '15px'}}>Thanh toán</h3>
                        <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '10px'}}>
                            <span style={{color:'#666'}}>Phương thức:</span>
                            <span style={{fontWeight: 500}}>{currentOrder.paymentMethod}</span>
                        </div>
                        <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '10px'}}>
                            <span style={{color:'#666'}}>Trạng thái TT:</span>
                            <span style={{
                                color: currentOrder.paymentStatus === 'PAID' ? 'green' : 'orange',
                                fontWeight: 'bold'
                            }}>
                                {currentOrder.paymentStatus}
                            </span>
                        </div>
                        <div style={{borderTop: '1px dashed #eee', margin: '10px 0'}}></div>

                        <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '5px'}}>
                            <span>Tạm tính:</span>
                            <span>{formatCurrency(currentOrder.subTotal)}</span>
                        </div>
                        <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '5px'}}>
                            <span>Giảm giá:</span>
                            <span>{formatCurrency(currentOrder.discountAmount || 0)}</span>
                        </div>
                        {/* Nếu có phí ship hay giảm giá thì thêm vào đây */}

                        <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '15px', fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--color-secondary-0)'}}>
                            <span>Tổng cộng:</span>
                            <span>{formatCurrency(currentOrder.grandTotal)}</span>
                        </div>
                    </Card>
                </div>
            </div>

            {/* MODAL HỦY ĐƠN */}
            <Modal
                isOpen={isCancelModalOpen}
                onClose={() => setIsCancelModalOpen(false)}
                title="Xác nhận hủy đơn hàng"
            >
                <div style={{minWidth: '400px'}}>
                    <p>Bạn có chắc chắn muốn hủy đơn hàng <strong>#{currentOrder.orderId}</strong> không?</p>
                    <p style={{fontSize: '0.9rem', color: '#666', marginBottom: '15px'}}>Hành động này không thể hoàn tác.</p>

                    <div className="form-group">
                        <label className="form-label">Lý do hủy đơn <span style={{color: 'red'}}>*</span></label>
                        <Input
                            value={cancelReason}
                            onChange={(e) => setCancelReason(e.target.value)}
                            placeholder="VD: Đổi ý, đặt nhầm sản phẩm..."
                        />
                    </div>

                    <div style={{display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px'}}>
                        <Button color="0" onClick={() => setIsCancelModalOpen(false)}>Đóng</Button>
                        <Button
                            onClick={handleCancelSubmit}
                            style={{backgroundColor: '#ef4444', borderColor: '#ef4444'}}
                            disabled={status === 'loading'}
                        >
                            {status === 'loading' ? <Spinner /> : 'Xác nhận Hủy'}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}