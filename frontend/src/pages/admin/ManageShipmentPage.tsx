import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchShipments, updateShipmentStatus } from '../../store/slices/OrderBlock/shipmentSlice';
import { AdminTable } from '../../components/features/admin/AdminTable/AdminTable';
import { Pagination } from '../../components/ui/pagination/Pagination';
import { Button } from '../../components/ui/button/Button';
import { Modal } from '../../components/ui/Modal/Modal';
import { Select } from '../../components/ui/input/Select';
import { Input } from '../../components/ui/input/Input';
import { Spinner } from '../../components/ui/loading/Spinner';
import type { IColumn, IShipment, TShipmentStatus } from '../../types';

export function ManageShipmentPage() {
    const dispatch = useAppDispatch();
    const { data, status, pagination } = useAppSelector((state: any) => state.shipments); // Đảm bảo store có key 'shipments'

    const [currentPage, setCurrentPage] = useState(1);
    const [selectedShipment, setSelectedShipment] = useState<IShipment | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [statusForm, setStatusForm] = useState<{ status: TShipmentStatus}>({
        status: 'Shipped' ,
    });

    useEffect(() => {
        dispatch(fetchShipments({ page: currentPage - 1, size: 10 }));
    }, [dispatch, currentPage]);

    // Helper: Màu sắc trạng thái
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Delivered': return 'green';
            case 'Returned': return 'gray';
            case 'Shipped': return 'blue';
            default: return 'orange';
        }
    };

    const handleEdit = (item: IShipment) => {
        setSelectedShipment(item);
        setStatusForm({
            status: item.status as TShipmentStatus,
        });
        setIsModalOpen(true);
    };

    const handleUpdateSubmit = async () => {
        if (!selectedShipment) return;

        await dispatch(updateShipmentStatus({
            id: selectedShipment.shipmentId,
            payload: statusForm
        }));

        alert("Cập nhật trạng thái vận đơn thành công!");
        setIsModalOpen(false);
    };

    const columns: IColumn<IShipment>[] = [
        { title: 'ID', key: 'shipmentId' },
        {
            title: 'Mã Đơn Hàng',
            key: 'orderId',
            render: (item) => <strong>#{item.orderId}</strong>
        },
        { title: 'ĐVVC', key: 'carrier' },
        {
            title: 'Mã Vận Đơn',
            key: 'trackingNo',
            render: (item) => <span style={{fontFamily: 'monospace', background: '#eee', padding: '2px 5px'}}>{item.trackingNo}</span>
        },
        {
            title: 'Ngày gửi',
            key: 'shippedAt',
            render: (item) => new Date(item.shippedAt).toLocaleDateString('vi-VN')
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
                    fontSize: '0.8rem'
                }}>
                    {item.status}
                </span>
            )
        }
    ];

    return (
        <div style={{ padding: '20px' }}>
            <h2 style={{ marginBottom: '20px' }}>Quản Lý Vận Đơn</h2>

            <AdminTable<IShipment>
                columns={columns}
                data={data || []}
                isLoading={status === 'loading'}
                rowKey={(item) => item.shipmentId}
                onEdit={handleEdit}
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

            {/* MODAL UPDATE STATUS */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`Cập nhật vận đơn #${selectedShipment?.trackingNo}`}>
                <div style={{minWidth: '400px', display: 'flex', flexDirection: 'column', gap: '15px'}}>
                    <div style={{display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px'}}>


                        <Button color="0" onClick={() => setIsModalOpen(false)}>Hủy</Button>
                        <Button onClick={handleUpdateSubmit} disabled={status === 'loading'}>
                            {status === 'loading' ? <Spinner/> : 'Lưu Thay Đổi'}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}