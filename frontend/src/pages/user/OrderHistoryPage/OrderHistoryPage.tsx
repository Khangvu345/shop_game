import React, { useEffect, useState } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchMyOrders } from '../../../store/slices/OrderBlock/orderSlice';
import { Card } from '../../../components/ui/card/Card';
import { Button } from '../../../components/ui/button/Button';
import { Spinner } from '../../../components/ui/loading/Spinner';
import { Pagination } from '../../../components/ui/pagination/Pagination';
import type { IOrder } from '../../../types';

export function OrderHistoryPage() {
    const dispatch = useAppDispatch();

    const navigate = useNavigate()
    const { myOrders } = useAppSelector((state) => state.orders);
    const { data: orders, status, pagination, error } = myOrders;

    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 5; // Số đơn hàng mỗi trang

    useEffect(() => {
        dispatch(fetchMyOrders({ page: currentPage - 1, size: pageSize }));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [dispatch, currentPage]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    // Helper: Format tiền tệ
    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

    // Helper: Màu sắc trạng thái
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'COMPLETED': return 'green';
            case 'DELIVERED': return 'blue';
            case 'SHIPPED': return 'blue';
            case 'CONFIRMED': return 'teal';
            case 'PENDING': return 'orange';
            case 'CANCELLED': return 'red';
            case 'RETURNED': return 'gray';
            default: return 'black';
        }
    };

    // Helper: Dịch trạng thái sang tiếng Việt
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

    if (status === 'loading') {
        return <div style={{ height: '50vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><Spinner /></div>;
    }

    if (error) {
        return <div className="container" style={{ padding: '2rem', color: 'red', textAlign: 'center' }}>Lỗi: {error}</div>;
    }

    if (!orders || orders.length === 0) {
        return (
            <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
                <h2>Bạn chưa có đơn hàng nào</h2>
                <p style={{ color: '#666', marginBottom: '2rem' }}>Hãy khám phá các sản phẩm tuyệt vời của chúng tôi!</p>
                <Link to="/products"><Button>Mua sắm ngay</Button></Link>
            </div>
        );
    }

    return (
        <div className="container" style={{ padding: '2rem 0' }}>
            <h2 style={{ marginBottom: '2rem', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>Lịch sử mua hàng</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {orders.map((order: IOrder) => (
                    <Card key={order.orderId} style={{ padding: '0', overflow: 'hidden', border: '1px solid #eee' }}>
                        {/* Header đơn hàng */}
                        <div style={{
                            backgroundColor: '#f9fafb',
                            padding: '1rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            borderBottom: '1px solid #eee',
                            flexWrap: 'wrap',
                            gap: '10px'
                        }}>
                            <div>
                                <span style={{ fontWeight: 'bold', marginRight: '10px' }}>
                                    Đặt ngày: {new Date(order.createdAt || order.orderDate).toLocaleDateString('vi-VN')}
                                </span>
                            </div>
                            <div>
                                <span style={{
                                    padding: '4px 12px',
                                    borderRadius: '20px',
                                    backgroundColor: getStatusColor(order.status),
                                    color: 'white',
                                    fontSize: '0.85rem',
                                    fontWeight: 600
                                }}>
                                    {translateStatus(order.status)}
                                </span>
                            </div>
                        </div>

                        {/* Danh sách sản phẩm trong đơn */}
                        <div style={{ padding: '1rem' }}>
                            {order.items?.map((item: any, idx: number) => (
                                <div key={idx} style={{
                                    display: 'flex',
                                    gap: '15px',
                                    marginBottom: idx < (order.items?.length || 0) - 1 ? '1rem' : '0',
                                    borderBottom: idx < (order.items?.length || 0) - 1 ? '1px dashed #eee' : 'none',
                                    paddingBottom: idx < (order.items?.length || 0) - 1 ? '1rem' : '0'
                                }}>
                                    {/* Ảnh sản phẩm (Dùng placeholder nếu API chưa trả về ảnh trong order items) */}
                                    <img
                                        src={'https://placehold.co/80'}
                                        alt={item.productName}
                                        style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px' }}
                                    />
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 500, marginBottom: '4px' }}>{item.productName}</div>
                                        <div style={{ fontSize: '0.9rem', color: '#666' }}>x{item.quantity}</div>
                                    </div>
                                    <div style={{ fontWeight: 500 }}>
                                        {formatCurrency(item.price || 0)}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Footer đơn hàng: Tổng tiền & Nút */}
                        <div style={{
                            padding: '1rem',
                            borderTop: '1px solid #eee',
                            display: 'flex',
                            justifyContent: 'flex-end',
                            alignItems: 'center',
                            gap: '1rem'
                        }}>
                            <div style={{ marginRight: 'auto' }}>
                                <span style={{ color: '#666', marginRight: '5px' }}>Thành tiền:</span>
                                <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--color-secondary-0)' }}>
                                    {formatCurrency(order.grandTotal || 0)}
                                </span>
                            </div>

                            {/* Nút Xem chi tiết (Optional - Có thể làm sau) */}
                            <Button size="small" color="0" onClick={() => navigate(`/my-orders/${order.orderId}`)}>
                                Xem chi tiết
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Phân trang */}
            {pagination && pagination.totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
                    <Pagination
                        totalRows={pagination.total}
                        limit={pageSize}
                        currentPage={currentPage}
                        onPageChange={handlePageChange}
                    />
                </div>
            )}
        </div>
    );
}