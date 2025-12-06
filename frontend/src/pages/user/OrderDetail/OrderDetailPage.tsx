import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchOrderDetail, cancelOrderThunk } from '../../../store/slices/OrderBlock/orderSlice';
import { Button } from '../../../components/ui/button/Button';
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

    // Helper hiển thị trạng thái (Text)
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

    // Helper hiển thị trạng thái (Style class)
    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'PENDING': return 'pending';
            case 'CONFIRMED': return 'confirmed';
            case 'SHIPPING': return 'shipping';
            case 'DELIVERED':
            case 'COMPLETED': return 'completed';
            case 'CANCELLED': return 'cancelled';
            default: return 'pending';
        }
    };

    // Status Timeline Steps
    const steps = [
        { key: 'PENDING', label: 'Đặt hàng' },
        { key: 'CONFIRMED', label: 'Xác nhận' },
        { key: 'SHIPPING', label: 'Vận chuyển' },
        { key: 'COMPLETED', label: 'Hoàn thành' }
    ];

    const getCurrentStepIndex = (status: string) => {
        if (status === 'CANCELLED') return -1;
        const map: Record<string, number> = {
            'PENDING': 0,
            'CONFIRMED': 1,
            'PREPARING': 1,
            'SHIPPED': 2,
            'DELIVERED': 3,
            'COMPLETED': 3
        };
        return map[status] ?? 0;
    };

    if (status === 'loading' && !currentOrder) return <div style={{ display: 'flex', justifyContent: 'center', minHeight: '50vh', alignItems: 'center' }}><Spinner /></div>;
    if (error) return <div className="container" style={{ padding: '20px', textAlign: 'center' }}><h3>Lỗi tải đơn hàng</h3><p>{error}</p></div>;
    if (!currentOrder) return <div className="container" style={{ padding: '20px', textAlign: 'center' }}><h3>Không tìm thấy đơn hàng</h3></div>;

    const currentStepIndex = getCurrentStepIndex(currentOrder.status);
    const canCancel = ['PENDING', 'CONFIRMED'].includes(currentOrder.status);

    // Cast for safety if type isn't updated
    const address = (currentOrder as any).shippingAddress || currentOrder.address;

    return (
        <div className="order-detail-page">
            <div className="container">
                {/* 1. HEADER */}
                <header className="page-header">
                    <div className="order-title">
                        <h2>Đơn hàng #{currentOrder.orderId}</h2>
                        <div className="order-meta">
                            <span>📅 {new Date(currentOrder.createdAt).toLocaleString('vi-VN')}</span>
                            <span>•</span>
                            <span>{currentOrder.items?.length || 0} sản phẩm</span>
                        </div>
                    </div>
                    <div className={`status-badge ${getStatusStyle(currentOrder.status)}`}>
                        {translateStatus(currentOrder.status)}
                    </div>
                </header>

                {/* 2. TIMELINE (Ẩn nếu đã hủy) */}
                {currentOrder.status !== 'CANCELLED' && (
                    <div className="timeline-card">
                        <div className="timeline">
                            {steps.map((step, index) => {
                                const isActive = index <= currentStepIndex;
                                const isCompleted = index < currentStepIndex;

                                return (
                                    <div key={step.key} className={`timeline-step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}>
                                        <div className="timeline-icon">
                                            {isCompleted ? '✓' : (index + 1)}
                                        </div>
                                        <div className="timeline-label">{step.label}</div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* 3. CANCELLED ALERT */}
                {currentOrder.status === 'CANCELLED' && (
                    <div className="cancelled-alert">
                        <div style={{ fontSize: '1.5rem' }}>⚠️</div>
                        <div>
                            <strong>Đơn hàng đã hủy</strong>
                            <p style={{ margin: '0.25rem 0 0' }}>"{currentOrder.cancelReason || 'Không có lý do'}"</p>
                            <span style={{ fontSize: '0.85rem', opacity: 0.8 }}>
                                Hủy bởi {currentOrder.cancelledBy} vào {new Date(currentOrder.cancelledAt!).toLocaleDateString('vi-VN')}
                            </span>
                        </div>
                    </div>
                )}

                {/* 4. MAIN LAYOUT */}
                <div className="order-grid">

                    {/* CỘT TRÁI - DANH SÁCH SẢN PHẨM */}
                    <div className="main-content">
                        <section className="detail-card">
                            <div className="card-title">📦 Danh sách sản phẩm</div>
                            <div className="product-list">
                                {currentOrder.items?.map((item: any, idx: number) => (
                                    <div key={idx} className="product-item">
                                        <img
                                            src={item.productImage || 'https://placehold.co/70'}
                                            alt={item.productName}
                                            className="product-thumb"
                                        />
                                        <div className="product-info">
                                            <Link to={`/products/${item.productId}`} className="product-name">
                                                {item.productName}
                                            </Link>
                                            <div className="product-meta">
                                                Đơn giá: {formatCurrency(item.price)}
                                            </div>
                                        </div>
                                        <div className="product-price">
                                            x{item.quantity}
                                            <div style={{ color: 'var(--primary)' }}>{formatCurrency(item.lineTotal)}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* CỘT PHẢI - THÔNG TIN */}
                    <div className="sidebar-content">

                        {/* THÔNG TIN THANH TOÁN */}
                        <section className="detail-card">
                            <div className="card-title">💳 Thanh toán</div>
                            <div className="info-row">
                                <span className="info-label">Phương thức</span>
                                <span className="info-value">{currentOrder.paymentMethod}</span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">Trạng thái</span>
                                <span className="info-value" style={{
                                    color: currentOrder.paymentStatus === 'PAID' ? 'var(--success)' : 'var(--warning)'
                                }}>
                                    {currentOrder.paymentStatus}
                                </span>
                            </div>

                            <div style={{ margin: '1.5rem 0', borderTop: '1px dashed var(--border-color)' }}></div>

                            <div className="info-row">
                                <span className="info-label">Tạm tính</span>
                                <span className="info-value">{formatCurrency(currentOrder.subTotal)}</span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">Vận chuyển</span>
                                <span className="info-value">{formatCurrency(currentOrder.shippingFee || 0)}</span>
                            </div>

                            <div className="total-row">
                                <span>Tổng cộng</span>
                                <span>{formatCurrency(currentOrder.grandTotal)}</span>
                            </div>
                        </section>

                        {/* THÔNG TIN GIAO HÀNG */}
                        <section className="detail-card">
                            <div className="card-title">📍 Giao hàng</div>
                            {address ? (
                                <div style={{ fontSize: '0.95rem', lineHeight: '1.6' }}>
                                    <div style={{ fontWeight: '600', marginBottom: '4px' }}>{address.recipientName}</div>
                                    <div style={{ color: 'var(--text-muted)', marginBottom: '8px' }}>{address.phone}</div>
                                    <div>{address.street}</div>
                                    <div>{address.ward}, {address.city}</div>
                                </div>
                            ) : (
                                <div className="text-muted">Không có thông tin địa chỉ</div>
                            )}
                        </section>

                        {/* ACTIONS */}
                        <div className="action-bar" style={{ flexDirection: 'column' }}>
                            {canCancel && (
                                <button
                                    onClick={() => setIsCancelModalOpen(true)}
                                    className="btn-premium btn-danger"
                                    style={{ width: '100%' }}
                                >
                                    Hủy đơn hàng
                                </button>
                            )}
                            <button
                                onClick={() => navigate('/my-orders')}
                                className="btn-premium btn-outline"
                                style={{ width: '100%' }}
                            >
                                Quay lại danh sách
                            </button>
                        </div>

                    </div>
                </div>

                {/* MODAL HỦY */}
                <Modal
                    isOpen={isCancelModalOpen}
                    onClose={() => setIsCancelModalOpen(false)}
                    title="Xác nhận hủy đơn hàng"
                >
                    <div style={{ minWidth: 'min(400px, 90vw)' }}>
                        <p style={{ marginBottom: '1rem' }}>
                            Bạn có chắc chắn muốn hủy đơn hàng <strong>#{currentOrder.orderId}</strong>?
                        </p>
                        <div className="form-group">
                            <label className="form-label" style={{ fontSize: '0.9rem', marginBottom: '0.5rem', display: 'block' }}>
                                Lý do hủy <span style={{ color: 'red' }}>*</span>
                            </label>
                            <Input
                                value={cancelReason}
                                onChange={(e) => setCancelReason(e.target.value)}
                                placeholder="Nhập lý do hủy..."
                            />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '1.5rem' }}>
                            <Button color="0" onClick={() => setIsCancelModalOpen(false)}>Đóng</Button>
                            <Button
                                onClick={handleCancelSubmit}
                                style={{ backgroundColor: '#ef4444', borderColor: '#ef4444' }}
                                disabled={status === 'loading'}
                            >
                                {status === 'loading' ? <Spinner /> : 'Xác nhận'}
                            </Button>
                        </div>
                    </div>
                </Modal>
            </div>
        </div>
    );
}