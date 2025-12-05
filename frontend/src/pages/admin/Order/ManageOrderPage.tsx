import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../store/hooks.ts';
import { fetchAdminOrders } from '../../../store/slices/OrderBlock/orderSlice.ts';
import { AdminTable } from '../../../components/features/admin/AdminTable/AdminTable.tsx';
import { AdminPageHeader } from '../../../components/features/admin/AdminPageHeader/AdminPageHeader.tsx';
import '../../../components/features/admin/AdminPageHeader/AdminPageHeader.css';
import { Pagination } from '../../../components/ui/pagination/Pagination.tsx';
import { Select } from '../../../components/ui/input/Select.tsx';
import { Input } from '../../../components/ui/input/Input.tsx';
import { Button } from '../../../components/ui/button/Button.tsx';
import type { IColumn, IOrder } from '../../../types';

export function ManageOrderPage() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { adminOrders } = useAppSelector((state) => state.orders);
    const { data, status, pagination } = adminOrders;

    // State Filters
    const [filters, setFilters] = useState({
        status: '',
        fromDate: '',
        toDate: '',
        page: 0
    });

    // Fetch Data
    useEffect(() => {
        dispatch(fetchAdminOrders({
            page: filters.page,
            size: 10,
            status: filters.status || undefined,
            fromDate: filters.fromDate ? new Date(filters.fromDate).toISOString() : undefined,
            toDate: filters.toDate ? new Date(filters.toDate).toISOString() : undefined,
        }));
    }, [dispatch, filters]);

    // Handlers
    const handleFilterChange = (name: string, value: string) => {
        setFilters(prev => ({ ...prev, [name]: value, page: 0 })); // Reset về trang 1 khi filter
    };

    const handlePageChange = (newPage: number) => {
        setFilters(prev => ({ ...prev, page: newPage - 1 })); // Backend start 0
    };

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            PENDING: 'orange', CONFIRMED: 'blue', SHIPPED: 'purple',
            COMPLETED: 'green', CANCELLED: 'red', RETURNED: 'gray'
        };
        return colors[status] || 'black';
    };

    // Columns
    const columns: IColumn<IOrder>[] = [
        { title: 'ID', key: 'orderId' },
        {
            title: 'Khách hàng',
            key: 'customerName' as any, // Cần mapping từ BE response nếu có field này
            render: (item: any) => item.customerName || item.customer?.fullName || 'Khách lẻ'
        },
        {
            title: 'Ngày đặt',
            key: 'createdAt' as any,
            render: (item) => new Date(item.createdAt || item.orderDate).toLocaleDateString('vi-VN')
        },
        {
            title: 'Tổng tiền',
            key: 'grandTotal',
            render: (item) => item.grandTotal?.toLocaleString('vi-VN') + ' đ'
        },
        {
            title: 'Trạng thái',
            key: 'status',
            render: (item) => (
                <span style={{
                    color: getStatusColor(item.status),
                    fontWeight: 'bold',
                    border: `1px solid ${getStatusColor(item.status)}`,
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '0.85rem'
                }}>
                    {item.status}
                </span>
            )
        },
        {
            title: 'Thanh toán',
            key: 'paymentStatus',
            render: (item) => (
                <span style={{ color: item.paymentStatus === 'PAID' ? 'green' : 'orange' }}>
                    {item.paymentStatus}
                </span>
            )
        }
    ];

    return (
        <div className="admin-page-container">
            <AdminPageHeader title="Quản Lý Đơn Hàng" />

            {/* FILTER BAR */}
            <div style={{
                display: 'flex', gap: '15px', marginBottom: '20px',
                background: '#fff', padding: '15px', borderRadius: '8px', border: '1px solid #eee',
                flexWrap: 'wrap', alignItems: 'flex-end'
            }}>
                <div style={{ width: '200px' }}>
                    <Select
                        label="Trạng thái"
                        value={filters.status}
                        onChange={(e) => handleFilterChange('status', e.target.value)}
                        options={[
                            { label: 'Tất cả', value: '' },
                            { label: 'Chờ xử lý (Pending)', value: 'PENDING' },
                            { label: 'Đã xác nhận (Confirmed)', value: 'CONFIRMED' },
                            { label: 'Đang giao (Shipped)', value: 'SHIPPED' },
                            { label: 'Hoàn thành (Completed)', value: 'COMPLETED' },
                            { label: 'Đã hủy (Cancelled)', value: 'CANCELLED' },
                        ]}
                    />
                </div>
                <div style={{ width: '200px' }}>
                    <Input
                        label="Từ ngày"
                        type="date"
                        value={filters.fromDate}
                        onChange={(e) => handleFilterChange('fromDate', e.target.value)}
                    />
                </div>
                <div style={{ width: '200px' }}>
                    <Input
                        label="Đến ngày"
                        type="date"
                        value={filters.toDate}
                        onChange={(e) => handleFilterChange('toDate', e.target.value)}
                    />
                </div>
                <Button onClick={() => setFilters({ status: '', fromDate: '', toDate: '', page: 0 })} color="0">
                    Xóa lọc
                </Button>
            </div>

            <AdminTable<IOrder>
                columns={columns}
                data={data || []}
                isLoading={status === 'loading'}
                rowKey={(item) => item.orderId}
                onEdit={(item) => navigate(`/admin/orders/${item.orderId}`)} // Xem chi tiết
            />

            {pagination && pagination.totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                    <Pagination
                        totalRows={pagination.total}
                        limit={10}
                        currentPage={filters.page + 1}
                        onPageChange={handlePageChange}
                    />
                </div>
            )}
        </div>
    );
}