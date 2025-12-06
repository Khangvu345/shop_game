import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchStockMovements, setStockFilter } from '../../store/slices/InventoryBlock/stockMovementSlice';
import { fetchProducts } from '../../store/slices/ProductBlock/productSlice'; // Để lấy list sản phẩm cho dropdown
import { AdminTable } from '../../components/features/admin/AdminTable/AdminTable';
import { AdminPageHeader } from '../../components/features/admin/AdminPageHeader/AdminPageHeader';
import '../../components/features/admin/AdminPageHeader/AdminPageHeader.css';
import { Pagination } from '../../components/ui/pagination/Pagination';
import { Button } from '../../components/ui/button/Button';
import { Input } from '../../components/ui/input/Input';
import { Select } from '../../components/ui/input/Select';
import type { IColumn, IStockMovement, TStockMovementReason } from '../../types';

export function ManageStockMovementPage() {
    const dispatch = useAppDispatch();

    const { data, status, pagination, filter } = useAppSelector((state: any) => state.stockMovements);
    // Lấy danh sách sản phẩm để lọc
    const { data: products } = useAppSelector((state) => state.products);

    // Local state cho filter input
    const [filterType, setFilterType] = useState<'date' | 'product' | 'reason'>('date');

    useEffect(() => {
        // Load sản phẩm để fill vào dropdown lọc
        if (!products || products.length === 0) {
            dispatch(fetchProducts({}));
        }
        // Load dữ liệu ban đầu
        dispatch(fetchStockMovements(filter));
    }, [dispatch]);

    // Xử lý thay đổi filter
    const handleFilterChange = (key: string, value: any) => {
        const newFilter = { ...filter, page: 0, [key]: value };

        // Reset các trường không liên quan để tránh xung đột API
        if (filterType === 'date') {
            newFilter.productId = undefined;
            newFilter.reason = '';
        } else if (filterType === 'product') {
            newFilter.startDate = undefined;
            newFilter.endDate = undefined;
            newFilter.reason = '';
        } else if (filterType === 'reason') {
            newFilter.startDate = undefined;
            newFilter.endDate = undefined;
            newFilter.productId = undefined;
        }

        dispatch(setStockFilter(newFilter));
        dispatch(fetchStockMovements(newFilter));
    };

    const handlePageChange = (newPage: number) => {
        const newFilter = { ...filter, page: newPage - 1 };
        dispatch(setStockFilter(newFilter));
        dispatch(fetchStockMovements(newFilter));
    };

    // --- Render Cột Bảng ---
    const columns: IColumn<IStockMovement>[] = [
        { title: 'ID', key: 'movementId' },
        {
            title: 'Thời gian',
            key: 'occurredAt',
            render: (item) => new Date(item.occurredAt).toLocaleString('vi-VN')
        },
        { title: 'Sản phẩm', key: 'productName' },
        {
            title: 'Thay đổi',
            key: 'quantityDelta',
            render: (item) => (
                <span style={{
                    color: item.quantityDelta > 0 ? 'green' : 'red',
                    fontWeight: 'bold'
                }}>
                    {item.quantityDelta > 0 ? `+${item.quantityDelta}` : item.quantityDelta}
                </span>
            )
        },
        {
            title: 'Lý do',
            key: 'reason',
            render: (item) => translateReason(item.reason)
        },
        {
            title: 'Tham chiếu',
            key: 'referenceNo',
            render: (item) => item.referenceNo || '-'
        }
    ];

    const translateReason = (reason: TStockMovementReason) => {
        const map: Record<string, string> = {
            'GoodsReceipt': 'Nhập hàng',
            'Sale': 'Bán hàng',
            'Return': 'Khách trả hàng',
            'DamagedAdjustment': 'Hủy hàng hỏng',
            'StocktakeAdjustment': 'Kiểm kê kho',
            'ManualAdjustment': 'Điều chỉnh thủ công'
        };
        return map[reason] || reason;
    };

    return (
        <div className="admin-page-container">
            <AdminPageHeader title="Lịch Sử Biến Động Kho" />

            {/* --- KHU VỰC BỘ LỌC --- */}
            <div style={{
                marginBottom: '20px', padding: '15px',
                background: '#fff', borderRadius: '8px', border: '1px solid #eee',
                display: 'flex', gap: '20px', alignItems: 'flex-end', flexWrap: 'wrap'
            }}>
                {/* 1. Chọn loại lọc */}
                <div style={{ minWidth: '200px' }}>
                    <Select
                        label="Chế độ xem"
                        value={filterType}
                        onChange={(e) => {
                            setFilterType(e.target.value as any);
                            // Reset filter khi đổi chế độ
                            dispatch(setStockFilter({ page: 0, productId: undefined, reason: '' }));
                        }}
                        options={[
                            { label: 'Theo khoảng thời gian', value: 'date' },
                            { label: 'Theo sản phẩm', value: 'product' },
                            { label: 'Theo lý do', value: 'reason' }
                        ]}
                    />
                </div>

                {/* 2. Render Input theo loại lọc */}
                {filterType === 'date' && (
                    <>
                        <div style={{ width: '150px' }}>
                            <Input
                                type="date" label="Từ ngày"
                                value={filter.startDate || ''}
                                onChange={(e) => handleFilterChange('startDate', e.target.value)}
                            />
                        </div>
                        <div style={{ width: '150px' }}>
                            <Input
                                type="date" label="Đến ngày"
                                value={filter.endDate || ''}
                                onChange={(e) => handleFilterChange('endDate', e.target.value)}
                            />
                        </div>
                    </>
                )}

                {filterType === 'product' && (
                    <div style={{ flex: 1, minWidth: '300px' }}>
                        <Select
                            label="Chọn sản phẩm"
                            value={filter.productId || ''}
                            onChange={(e) => handleFilterChange('productId', Number(e.target.value))}
                            options={[
                                { label: '-- Chọn sản phẩm --', value: '' },
                                ...(products?.map(p => ({ label: p.productName, value: p.productId })) || [])
                            ]}
                        />
                    </div>
                )}

                {filterType === 'reason' && (
                    <div style={{ minWidth: '200px' }}>
                        <Select
                            label="Chọn lý do"
                            value={filter.reason || ''}
                            onChange={(e) => handleFilterChange('reason', e.target.value)}
                            options={[
                                { label: '-- Chọn lý do --', value: '' },
                                { label: 'Nhập hàng (GoodsReceipt)', value: 'GoodsReceipt' },
                                { label: 'Bán hàng (Sale)', value: 'Sale' },
                                { label: 'Trả hàng (Return)', value: 'Return' },
                                { label: 'Điều chỉnh (Manual)', value: 'ManualAdjustment' }
                            ]}
                        />
                    </div>
                )}

                <Button onClick={() => dispatch(fetchStockMovements(filter))}>Lọc dữ liệu</Button>
            </div>

            {/* --- BẢNG DỮ LIỆU --- */}
            <AdminTable<IStockMovement>
                columns={columns}
                data={data || []}
                isLoading={status === 'loading'}
                rowKey={(item) => item.movementId}
            // Không cần nút Sửa/Xóa vì lịch sử kho là bất biến
            />

            {/* --- PHÂN TRANG --- */}
            {pagination && pagination.totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                    <Pagination
                        totalRows={pagination.total}
                        limit={pagination.limit}
                        currentPage={pagination.page + 1}
                        onPageChange={handlePageChange}
                    />
                </div>
            )}
        </div>
    );
}