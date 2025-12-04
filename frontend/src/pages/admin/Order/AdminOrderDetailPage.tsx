import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchOrderDetail, updateOrderStatusThunk, resetOrderState } from '../../../store/slices/OrderBlock/orderSlice';
import { Button } from '../../../components/ui/button/Button';
import { Card } from '../../../components/ui/card/Card';
import { Spinner } from '../../../components/ui/loading/Spinner';

export function AdminOrderDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { currentOrder, status } = useAppSelector((state) => state.orders);

    useEffect(() => {
        if (id) dispatch(fetchOrderDetail(id));
        return () => { dispatch(resetOrderState()); };
    }, [id, dispatch]);

    const handleUpdateStatus = async (newStatus: string) => {
        if (!id) return;
        if (window.confirm(`Bạn có chắc muốn chuyển trạng thái sang ${newStatus}?`)) {
            await dispatch(updateOrderStatusThunk({
                id,
                payload: { status: newStatus }
            })).unwrap();
            alert("Cập nhật thành công!");
        }
    };

    if (!currentOrder) return <div style={{padding:'20px'}}>{status === 'loading' ? <Spinner/> : 'Không tìm thấy đơn hàng'}</div>;

    const address = (currentOrder as any).shippingAddress || currentOrder.address;

    // --- LOGIC HIỂN THỊ NÚT BẤM ---
    const renderActionButtons = () => {
        const s = currentOrder.status;
        // Workflow: PENDING -> CONFIRMED -> PREPARING -> SHIPPED -> DELIVERED -> COMPLETED
        return (
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                {s === 'PENDING' && (
                    <>
                        <Button onClick={() => handleUpdateStatus('CONFIRMED')} color="1">Xác nhận đơn</Button>
                        <Button onClick={() => handleUpdateStatus('CANCELLED')} style={{background:'#ef4444', borderColor:'#ef4444'}}>Hủy đơn</Button>
                    </>
                )}
                {s === 'CONFIRMED' && (
                    <Button onClick={() => handleUpdateStatus('PREPARING')} color="1">Chuẩn bị hàng</Button>
                )}
                {s === 'PREPARING' && (
                    <Button onClick={() => handleUpdateStatus('SHIPPED')} color="1">Bắt đầu giao hàng</Button>
                )}
                {s === 'SHIPPED' && (
                    <Button onClick={() => handleUpdateStatus('DELIVERED')} color="1">Đã giao hàng</Button>
                )}
                {s === 'DELIVERED' && (
                    <Button onClick={() => handleUpdateStatus('COMPLETED')} color="1">Hoàn tất đơn hàng</Button>
                )}
                {/* Các trạng thái cuối: COMPLETED, CANCELLED, RETURNED không có nút tiếp theo */}
            </div>
        );
    };

    return (
        <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>Chi tiết đơn hàng #{currentOrder.orderId}</h2>
                <Button onClick={() => navigate('/admin/orders')} color="0">Quay lại</Button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
                {/* CỘT TRÁI */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {/* Sản phẩm */}
                    <Card>
                        <h3>Sản phẩm</h3>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                            <tr style={{borderBottom:'1px solid #eee', textAlign:'left'}}>
                                <th style={{padding:'10px'}}>Tên SP</th>
                                <th style={{padding:'10px'}}>SL</th>
                                <th style={{padding:'10px'}}>Giá</th>
                                <th style={{padding:'10px'}}>Tổng</th>
                            </tr>
                            </thead>
                            <tbody>
                            {currentOrder.items?.map((item: any, idx: number) => (
                                <tr key={idx} style={{borderBottom:'1px solid #eee'}}>
                                    <td style={{padding:'10px'}}>{item.productName}</td>
                                    <td style={{padding:'10px'}}>x{item.quantity}</td>
                                    <td style={{padding:'10px'}}>{item.price?.toLocaleString()}</td>
                                    <td style={{padding:'10px'}}>{item.lineTotal?.toLocaleString()}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                        <div style={{textAlign:'right', marginTop:'15px', fontSize:'1.2rem', fontWeight:'bold'}}>
                            Tổng cộng: {currentOrder.grandTotal?.toLocaleString()} đ
                        </div>
                    </Card>

                    {/* Xử lý đơn hàng */}
                    <Card>
                        <h3>Xử lý đơn hàng</h3>
                        <p>Trạng thái hiện tại: <strong style={{fontSize:'1.1rem', color:'var(--color-secondary-0)'}}>{currentOrder.status}</strong></p>
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
                        <p><strong>Trạng thái:</strong> <span style={{fontWeight:'bold', color: currentOrder.paymentStatus === 'PAID' ? 'green' : 'orange'}}>{currentOrder.paymentStatus}</span></p>
                    </Card>
                </div>
            </div>
        </div>
    );
}