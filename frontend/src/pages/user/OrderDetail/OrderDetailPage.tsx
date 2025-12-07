import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchOrderDetail, cancelOrderThunk } from '../../../store/slices/OrderBlock/orderSlice';
import { Button } from '../../../components/ui/button/Button';
import { Spinner } from '../../../components/ui/loading/Spinner';
import { Modal } from '../../../components/ui/Modal/Modal';
import { Input } from '../../../components/ui/input/Input';
import './OrderDetailPage.css';
import {vnpayAPI} from "../../../api/PaymentBlock/paymentApi.ts";

export function OrderDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const { currentOrder, status, error } = useAppSelector((state) => state.orders);
    const { user } = useAppSelector((state) => state.auth);

    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [cancelReason, setCancelReason] = useState('');

    useEffect(() => {
        if (id) {
            dispatch(fetchOrderDetail(id));
        }
    }, [id, dispatch]);

    // Handle Cancel
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

    // Format Helpers
    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

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

    // Stepper Logic: Xác định bước hiện tại (1-4)
    const getStepStatus = (status: string) => {
        const steps = ['PENDING', 'CONFIRMED', 'SHIPPED', 'COMPLETED'];
        if (status === 'DELIVERED') return 3; // Coi như bước 3 (Giao hàng) đã xong
        if (status === 'CANCELLED' || status === 'RETURNED') return -1;
        
        // Tìm vị trí trong mảng steps
        const index = steps.indexOf(status);
        // PREPARING nằm giữa CONFIRMED và SHIPPED
        if (status === 'PREPARING') return 1; 
        
        return index > -1 ? index : 0;
    };

    const handleMakePayment = () => {
        if (!currentOrder) return;
        vnpayAPI.createPpayment({
            orderId: currentOrder.orderId,
            bankCode: '',
            language: ''
        })
            .then(data => {
                if (data.paymentUrl) {
                    window.location.href = data.paymentUrl;
                } else {
                    alert("Không lấy được link thanh toán. Vui lòng thử lại.");
                }
            })
            .catch(error => {
                console.error(error);
                alert("Lỗi khi khởi tạo thanh toán.");
            })


    }

    if (status === 'loading' && !currentOrder) return <div style={{height:'100vh', display:'flex', justifyContent:'center', alignItems:'center'}}><Spinner /></div>;
    if (error) return <div className="container" style={{color:'red', padding:'2rem'}}>Error: {error}</div>;
    if (!currentOrder) return <div className="container" style={{padding:'2rem'}}>Đơn hàng không tồn tại.</div>;

    const currentStep = getStepStatus(currentOrder.status);
    const canCancel = ['PENDING', 'CONFIRMED'].includes(currentOrder.status);
    const address = (currentOrder as any).shippingAddress || currentOrder.address;

    return (
        <div className="order-detail-wrapper">
            <div className="container">
                {/* 1. Breadcrumb */}
                <div className="od-breadcrumb">
                    <Link to="/">Trang chủ</Link> <span>/</span>
                    <Link to="/my-orders">Lịch sử đơn hàng</Link> <span>/</span>
                    <span style={{color: '#0f172a'}}>#{currentOrder.orderId}</span>
                </div>

                {/* 2. Header: Title & Actions */}
                <div className="od-header">
                    <div className="od-title-group">
                        <h1>Chi tiết đơn hàng</h1>
                        <div className="od-meta">
                            <span>Mã: <strong>#{currentOrder.orderId}</strong></span>
                            <span>|</span>
                            <span>Ngày đặt: {new Date(currentOrder.createdAt).toLocaleDateString('vi-VN')}</span>
                            <span>|</span>
                            <span className={`od-status-badge status-${currentOrder.status.toLowerCase()}`}>
                                {translateStatus(currentOrder.status)}
                            </span>
                        </div>
                    </div>
                    
                    <div style={{display:'flex', gap: '10px'}}>
                        {canCancel && (
                            <Button 
                                onClick={() => setIsCancelModalOpen(true)}
                                style={{backgroundColor: 'white', color: '#ef4444', border: '1px solid #ef4444'}}
                            >
                                Hủy đơn hàng
                            </Button>
                        )}
                        <Button onClick={() => navigate('/my-orders')} color="0">Quay lại</Button>
                    </div>
                </div>

                {/* 3. Stepper (Progress Bar) */}
                {currentOrder.status !== 'CANCELLED' && currentOrder.status !== 'RETURNED' && (
                    <div className="od-stepper">
                        <div className="stepper-container">
                            {[
                                { label: 'Đặt hàng', step: 0 },
                                { label: 'Xác nhận', step: 1 },
                                { label: 'Giao hàng', step: 2 },
                                { label: 'Hoàn thành', step: 3 }
                            ].map((s, idx) => (
                                <div key={idx} className={`step-item ${currentStep >= idx ? 'active' : ''} ${currentStep > idx ? 'completed' : ''}`}>
                                    <div className="step-circle">
                                        {currentStep > idx ? '✓' : idx + 1}
                                    </div>
                                    <div className="step-label">{s.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 4. Canceled Alert */}
                {currentOrder.status === 'CANCELLED' && (
                    <div className="cancelled-alert">
                        <strong>Đơn hàng đã bị hủy</strong>
                        <p style={{margin: '5px 0 0', fontSize:'0.9rem'}}>Lý do: {currentOrder.cancelReason} &bull; Bởi: {currentOrder.cancelledBy}</p>
                    </div>
                )}

                {/* 5. Main Layout */}
                <div className="od-layout">
                    {/* LEFT COLUMN: PRODUCTS */}
                    <div className="od-section-left">
                        <div className="od-card">
                            <div className="od-card-header">
                                <h3 className="od-card-title">Sản phẩm ({currentOrder.items?.length})</h3>
                            </div>
                            <div className="od-product-list">
                                {currentOrder.items?.map((item: any, idx: number) => (
                                    <div key={idx} className="od-product-item">
                                        <div className="od-img-wrapper">
                                            <img 
                                                src={item.productImageUrl || item.thumbnailUrl || 'https://placehold.co/100'} 
                                                alt={item.productName} 
                                            />
                                        </div>
                                        <div className="od-item-info">
                                            <div className="od-item-name">{item.productName}</div>
                                            <div className="od-item-meta">Số lượng: x{item.quantity}</div>
                                            <div className="od-item-meta">Đơn giá: {formatCurrency(item.price)}</div>
                                        </div>
                                        <div className="od-item-total">
                                            {formatCurrency(item.lineTotal)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            {/* Summary Footer */}
                            <div className="od-card-footer">
                                <div className="od-summary-row">
                                    <span>Tạm tính</span>
                                    <span>{formatCurrency(currentOrder.subTotal || 0)}</span>
                                </div>
                                <div className="od-summary-row">
                                    <span>Phí vận chuyển</span>
                                    <span>{formatCurrency(30000)}</span> {/* Giả định phí ship */}
                                </div>
                                <div className="od-summary-total">
                                    <span className="od-total-label">Tổng cộng</span>
                                    <span className="od-total-value">{formatCurrency(currentOrder.grandTotal)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: INFO */}
                    <div className="od-section-right">
                        {/* Customer Info */}
                        <div className="od-card">
                            <div className="od-card-header">
                                <h3 className="od-card-title">Địa chỉ nhận hàng</h3>
                            </div>
                            <div className="info-group">
                                <div className="info-row">
                                    <div className="info-label">Người nhận</div>
                                    <div className="info-content" style={{fontWeight: 700}}>{address?.recipientName}</div>
                                </div>
                                <div className="info-row">
                                    <div className="info-label">Số điện thoại</div>
                                    <div className="info-content">{address?.phone}</div>
                                </div>
                                <div className="info-row">
                                    <div className="info-label">Địa chỉ</div>
                                    <div className="info-content">
                                        {address?.street}<br/>
                                        {address?.ward}, {address?.city}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Payment Info */}
                        <div className="od-card">
                            <div className="od-card-header">
                                <h3 className="od-card-title">Thanh toán</h3>
                            </div>
                            <div className="info-group">
                                <div className="info-row">
                                    <div className="info-label">Phương thức</div>
                                    <div className="info-content">{currentOrder.paymentMethod}</div>
                                </div>
                                <div className="info-row">
                                    <div className="info-label">Trạng thái</div>
                                    <div className="info-content" style={{
                                        fontWeight: 700
                                    }}>
                                        {currentOrder.paymentStatus}
                                    </div>
                                </div>
                                <div className="info-row">
                                    {currentOrder.paymentStatus === 'FAILED' || currentOrder.paymentStatus === 'PENDING' && (currentOrder.status != 'CANCELLED') &&(
                                        <Button onClick={() => handleMakePayment()} color="1">Thanh toán</Button>
                                    )}
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Cancel Modal */}
            <Modal isOpen={isCancelModalOpen} onClose={() => setIsCancelModalOpen(false)} title="Hủy Đơn Hàng">
                <div style={{minWidth: '400px'}}>
                    <p style={{color: '#64748b', marginBottom: '1.5rem'}}>
                        Bạn có chắc chắn muốn hủy đơn hàng <strong>#{currentOrder.orderId}</strong> không? Hành động này không thể hoàn tác.
                    </p>
                    <Input 
                        label="Lý do hủy đơn" 
                        value={cancelReason} 
                        onChange={(e) => setCancelReason(e.target.value)} 
                        placeholder="VD: Đặt nhầm, thay đổi địa chỉ..."
                    />
                    <div style={{display:'flex', justifyContent:'flex-end', gap:'10px', marginTop:'20px'}}>
                        <Button color="0" onClick={() => setIsCancelModalOpen(false)}>Đóng</Button>
                        <Button 
                            onClick={handleCancelSubmit} 
                            style={{backgroundColor: '#ef4444', borderColor: '#ef4444'}}
                        >
                            Xác nhận Hủy
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
