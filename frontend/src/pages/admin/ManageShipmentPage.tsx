import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchShipments, updateShipmentStatus } from '../../store/slices/OrderBlock/shipmentSlice';
// 1. Import action updateOrder để cập nhật thanh toán
import {updateOrderStatusThunk, updatePaymentStatusThunk} from '../../store/slices/OrderBlock/orderSlice';
import { AdminTable } from '../../components/features/admin/AdminTable/AdminTable';
import { Pagination } from '../../components/ui/pagination/Pagination';
import { Button } from '../../components/ui/button/Button';
import { Modal } from '../../components/ui/Modal/Modal';
import { Spinner } from '../../components/ui/loading/Spinner';
import type { IColumn, IShipment } from '../../types';

export function ManageShipmentPage() {
    const dispatch = useAppDispatch();
    const { data, status: shipmentStatus, pagination } = useAppSelector((state: any) => state.shipments);

    const [currentPage, setCurrentPage] = useState(1);
    const [selectedShipment, setSelectedShipment] = useState<IShipment | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // 2. Sửa useEffect: Bỏ selectedShipment?.status ra khỏi dependency để tránh loop hoặc reload không kiểm soát
    useEffect(() => {
        dispatch(fetchShipments({ page: currentPage - 1, size: 10 }));
    }, [dispatch, currentPage]);

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
        setIsModalOpen(true);
    };

    // --- XỬ LÝ KHI CHUYỂN TRẠNG THÁI SHIPPED ---
    const shippedSubmit = async () => {
        if (!selectedShipment) return;
        try {
            await dispatch(updateShipmentStatus({
                id: selectedShipment.shipmentId,
                payload: { status: 'Shipped' }
            })).unwrap();

            dispatch(fetchShipments({ page: currentPage - 1, size: 10 }));

            alert("Đã chuyển trạng thái đang giao (Shipped)!");
            setIsModalOpen(false);
        } catch (error) {
            alert("Lỗi cập nhật trạng thái");
        }
    };

    // --- XỬ LÝ KHI GIAO THÀNH CÔNG (DELIVERED) & CẬP NHẬT THANH TOÁN ---
    const doneSubmit = async () => {
        if (!selectedShipment) return;

        // Hỏi xác nhận cho chắc chắn
        if (!window.confirm("Xác nhận đã giao hàng và đã thu tiền COD?")) return;

        try {
            await dispatch(updateShipmentStatus({
                id: selectedShipment.shipmentId,
                payload: { status: 'Delivered' }
            })).unwrap();


            if (selectedShipment.orderId) {
                await dispatch(updatePaymentStatusThunk({
                    id: selectedShipment.orderId,
                    payload: { paymentStatus: 'COD_COLLECTED' }
                })).unwrap();
            }

            dispatch(fetchShipments({ page: currentPage - 1, size: 10 }));

            alert("Đã giao hàng & Cập nhật trạng thái đã thu tiền (COD Collected)!");
            setIsModalOpen(false);
        } catch (error) {
            console.error(error);
            alert("Có lỗi xảy ra khi cập nhật!");
        }
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
            render: (item) => item.shippedAt ? new Date(item.shippedAt).toLocaleDateString('vi-VN') : '-'
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
                isLoading={shipmentStatus === 'loading'}
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

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`Cập nhật vận đơn #${selectedShipment?.trackingNo}`}>
                <div style={{minWidth: '400px', display: 'flex', flexDirection: 'column', gap: '15px'}}>
                    <p>Trạng thái hiện tại: <strong>{selectedShipment?.status}</strong></p>

                    {/* Nút bấm chuyển trạng thái */}
                    {selectedShipment?.status === 'Ready' && (
                        <Button onClick={shippedSubmit} disabled={shipmentStatus === 'loading'}>
                            {shipmentStatus === 'loading' ? <Spinner/> : '📦 Xác nhận đã gửi hàng (Shipped)'}
                        </Button>
                    )}

                    {selectedShipment?.status === 'Shipped' && (
                        <Button onClick={doneSubmit} disabled={shipmentStatus === 'loading'} style={{background: 'green', borderColor: 'green'}}>
                            {shipmentStatus  === 'loading' ? <Spinner/> : '✅ Đã giao & Đã thu tiền (Delivered)'}
                        </Button>
                    )}

                    <div style={{display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px'}}>
                        <Button color="0" onClick={() => setIsModalOpen(false)}>Đóng</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}