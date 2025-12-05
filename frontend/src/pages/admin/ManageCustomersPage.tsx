import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchCustomers } from '../../store/slices/AccountBlock/customerSlice';
import { AdminTable } from '../../components/features/admin/AdminTable/AdminTable';
import { Pagination } from '../../components/ui/pagination/Pagination';
import { Input } from '../../components/ui/input/Input';
import { Button } from '../../components/ui/button/Button';
import { Modal } from '../../components/ui/Modal/Modal';
import { Card } from '../../components/ui/card/Card';
import type { IColumn, ICustomerListItem } from '../../types';
import { customerApi } from '../../api/AccountBlock/customerApi'; // Import API để gọi detail

export function ManageCustomersPage() {
    const dispatch = useAppDispatch();
    const { data, status, pagination } = useAppSelector((state: any) => state.customer.adminList);

    const [keyword, setKeyword] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    // Fetch Data
    useEffect(() => {
        // Debounce could be added here
        dispatch(fetchCustomers({
            page: currentPage - 1,
            size: 10,
            keyword: keyword || undefined
        }));
    }, [dispatch, currentPage, keyword]);

    // Handlers
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setKeyword(e.target.value);
        setCurrentPage(1);
    };

    const handleViewDetail = async (item: ICustomerListItem) => {
        try {
            // Gọi API lấy chi tiết đầy đủ khi bấm xem
            const detail = await customerApi.getCustomerById(item.id);
            setSelectedCustomer(detail);
            setIsDetailOpen(true);
        } catch (error) {
            alert("Không tải được chi tiết khách hàng");
        }
    };

    // Columns Configuration
    const columns: IColumn<ICustomerListItem>[] = [
        { title: 'ID', key: 'id' },
        { title: 'Họ Tên', key: 'fullName' },
        { title: 'Email', key: 'email' },
        { title: 'SĐT', key: 'phone' },
        {
            title: 'Hạng',
            key: 'tier',
            render: (item) => (
                <span style={{
                    fontWeight: 'bold',
                    color: item.tier === 'GOLD' ? '#d4af37' : (item.tier === 'SILVER' ? '#a8a9ad' : '#cd7f32')
                }}>
                    {item.tier}
                </span>
            )
        },
        {
            title: 'Tổng Chi Tiêu',
            key: 'totalSpent',
            render: (item) => item.totalSpent.toLocaleString('vi-VN') + ' đ'
        },
    ];

    return (
        <div style={{ padding: '20px' }}>
            <h2 style={{ marginBottom: '20px' }}>Quản Lý Khách Hàng</h2>

            {/* Filter Bar */}
            <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
                <Input
                    placeholder="Tìm kiếm theo tên, email, sđt..."
                    value={keyword}
                    onChange={handleSearch}
                    style={{width: '300px'}}
                />
            </div>

            <AdminTable<ICustomerListItem>
                columns={columns}
                data={data || []}
                isLoading={status === 'loading'}
                rowKey={(item) => item.id}
                onEdit={handleViewDetail} // Tạm dùng icon Edit để xem chi tiết
            />

            {/* Pagination */}
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

            {/* Detail Modal */}
            <Modal isOpen={isDetailOpen} onClose={() => setIsDetailOpen(false)} title="Chi tiết khách hàng">
                {selectedCustomer && (
                    <div style={{minWidth: '500px'}}>
                        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px'}}>
                            <Card>
                                <h4>Thông tin cá nhân</h4>
                                <p><strong>ID:</strong> {selectedCustomer.id}</p>
                                <p><strong>Họ tên:</strong> {selectedCustomer.fullName}</p>
                                <p><strong>Email:</strong> {selectedCustomer.email}</p>
                                <p><strong>SĐT:</strong> {selectedCustomer.phone}</p>
                                <p><strong>Ngày sinh:</strong> {selectedCustomer.birthDate}</p>
                            </Card>
                            <Card>
                                <h4>Thống kê mua hàng</h4>
                                <p><strong>Hạng thành viên:</strong> {selectedCustomer.tier}</p>
                                <p><strong>Điểm tích lũy:</strong> {selectedCustomer.points}</p>
                                <p><strong>Tổng đơn hàng:</strong> {selectedCustomer.totalOrders}</p>
                                <p><strong>Tổng chi tiêu:</strong> {selectedCustomer.totalSpent.toLocaleString()} đ</p>
                            </Card>
                        </div>
                        <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                            <Button color="0" onClick={() => setIsDetailOpen(false)}>Đóng</Button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}