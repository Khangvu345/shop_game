import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../store/hooks.ts';
import { fetchGoodsReceipts } from '../../../store/slices/InventoryBlock/goodsReceiptSlice.ts';
import { AdminTable } from '../../../components/features/admin/AdminTable/AdminTable.tsx';
import { Button } from '../../../components/ui/button/Button.tsx';
import { Pagination } from '../../../components/ui/pagination/Pagination.tsx';
import type { IColumn, IGoodsReceipt } from '../../../types';

export function ManageGoodsReceiptPage() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { data, status, pagination } = useAppSelector((state: any) => state.goodsReceipts);

    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        dispatch(fetchGoodsReceipts({ page: currentPage - 1, size: 10 }));
    }, [dispatch, currentPage]);

    const columns: IColumn<IGoodsReceipt>[] = [
        { title: 'ID', key: 'receiptId' },
        { title: 'Số Hóa Đơn', key: 'invoiceNumber' },
        {
            title: 'Nhà Cung Cấp',
            key: 'supplier',
            render: (item) => item.supplier?.name
        },
        {
            title: 'Ngày Nhập',
            key: 'receiptDate',
            render: (item) => new Date(item.receiptDate).toLocaleString('vi-VN')
        },
        {
            title: 'Tổng Tiền',
            key: 'totalCost',
            render: (item) => item.totalCost?.toLocaleString('vi-VN') + ' đ'
        }
    ];

    return (
        <div style={{padding: '20px'}}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <h2>Quản Lý Nhập Hàng</h2>
                <Button onClick={() => navigate('/admin/goods-receipts/create')}>+ Nhập Hàng Mới</Button>
            </div>

            <AdminTable<IGoodsReceipt>
                columns={columns}
                data={data || []}
                isLoading={status === 'loading'}
                rowKey={(item) => item.receiptId}
                // Nút sửa đóng vai trò xem chi tiết
                onEdit={(item) => navigate(`/admin/goods-receipts/${item.receiptId}`)}
            />

            {pagination && pagination.totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                    <Pagination
                        totalRows={pagination.total}
                        limit={10}
                        currentPage={currentPage}
                        onPageChange={setCurrentPage}
                    />
                </div>
            )}
        </div>
    );
}