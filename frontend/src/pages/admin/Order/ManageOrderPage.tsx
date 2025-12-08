import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../store/hooks.ts';
import { fetchAdminOrders } from '../../../store/slices/OrderBlock/orderSlice.ts';
import { AdminTable } from '../../../components/features/admin/AdminTable/AdminTable.tsx';
import { AdminPageHeader } from '../../../components/features/admin/AdminPageHeader/AdminPageHeader.tsx';
import '../../../components/features/admin/AdminPageHeader/AdminPageHeader.css';
import { Pagination } from '../../../components/ui/pagination/Pagination.tsx';
import type { IColumn, IOrder } from '../../../types';
import {getStatusColor, translateStatus} from "../../../store/utils/statusTranslator.ts";

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
                    {translateStatus(item.status, "order")}
                </span>
            )
        },
        {
            title: 'Thanh toán',
            key: 'paymentStatus',
            render: (item) => (
                <span style={{ color: getStatusColor(item.paymentStatus )}}>
                     {translateStatus(item.paymentStatus, 'payment')}
                </span>
            )
        }
    ];

    return (
        <div className="admin-page-container">
            <AdminPageHeader title="Quản Lý Đơn Hàng" />

            {/* FILTER BAR */}
            <div style={{
                display: 'flex',
                gap: '15px',
                marginBottom: '20px',
                background: '#fff',
                padding: '15px',
                borderRadius: '8px',
                border: '1px solid #eee',
                flexWrap: 'wrap',
                alignItems: 'center'
            }}>
                {/* Status Select */}
                <select
                    value={filters.status}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                    style={{
                        width: '200px',
                        padding: '10px 14px',
                        borderRadius: '6px',
                        border: '1px solid #ddd',
                        fontSize: '14px',
                        cursor: 'pointer',
                        transition: 'border-color 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.borderColor = '#06b6d4'}
                    onMouseLeave={(e) => e.currentTarget.style.borderColor = '#ddd'}
                >
                    <option value="">-- Tất cả trạng thái --</option>
                    <option value="PENDING">Chờ xử lý (Pending)</option>
                    <option value="CONFIRMED">Đã xác nhận (Confirmed)</option>
                    <option value="SHIPPED">Đang giao (Shipped)</option>
                    <option value="COMPLETED">Hoàn thành (Completed)</option>
                    <option value="CANCELLED">Đã hủy (Cancelled)</option>
                </select>

                {/* From Date */}
                <input
                    type="date"
                    value={filters.fromDate}
                    onChange={(e) => handleFilterChange('fromDate', e.target.value)}
                    placeholder="Từ ngày"
                    style={{
                        width: '180px',
                        padding: '10px 14px',
                        borderRadius: '6px',
                        border: '1px solid #ddd',
                        fontSize: '14px',
                        transition: 'border-color 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.borderColor = '#06b6d4'}
                    onMouseLeave={(e) => e.currentTarget.style.borderColor = '#ddd'}
                />

                {/* To Date */}
                <input
                    type="date"
                    value={filters.toDate}
                    onChange={(e) => handleFilterChange('toDate', e.target.value)}
                    placeholder="Đến ngày"
                    style={{
                        width: '180px',
                        padding: '10px 14px',
                        borderRadius: '6px',
                        border: '1px solid #ddd',
                        fontSize: '14px',
                        transition: 'border-color 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.borderColor = '#06b6d4'}
                    onMouseLeave={(e) => e.currentTarget.style.borderColor = '#ddd'}
                />

                {/* Clear Button */}
                <button
                    onClick={() => setFilters({ status: '', fromDate: '', toDate: '', page: 0 })}
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
                    Xóa lọc
                </button>
            </div>

            <AdminTable<IOrder>
                columns={columns}
                data={data || []}
                isLoading={status === 'loading'}
                rowKey={(item) => item.orderId}
                onEdit={(item) => navigate(`/admin/orders/${item.orderId}`)} // Xem chi tiết
                editButtonText="Xem"
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