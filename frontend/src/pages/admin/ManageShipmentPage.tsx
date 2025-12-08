import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchShipments, updateShipmentStatus } from '../../store/slices/OrderBlock/shipmentSlice';
// 1. Import action updateOrder để cập nhật thanh toán
import {
    fetchAdminOrderDetail,
    fetchOrderDetail,
    updateOrderStatusThunk,
    updatePaymentStatusThunk
} from '../../store/slices/OrderBlock/orderSlice';
import { AdminTable } from '../../components/features/admin/AdminTable/AdminTable';
import { AdminPageHeader } from '../../components/features/admin/AdminPageHeader/AdminPageHeader';
import '../../components/features/admin/AdminPageHeader/AdminPageHeader.css';
import { Pagination } from '../../components/ui/pagination/Pagination';
import { Button } from '../../components/ui/button/Button';
import { Modal } from '../../components/ui/Modal/Modal';
import { Spinner } from '../../components/ui/loading/Spinner';
import '../../components/features/admin/AdminForm/AdminForm.css';
import type { IColumn, IShipment } from '../../types';

export function ManageShipmentPage() {
    const dispatch = useAppDispatch();
    const { data, status: shipmentStatus, pagination } = useAppSelector((state: any) => state.shipments);
    const {currentOrder} = useAppSelector((state: any) => state.orders)


    const [currentPage, setCurrentPage] = useState(1);
    const [selectedShipment, setSelectedShipment] = useState<IShipment | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [carrierFilter, setCarrierFilter] = useState('');

    useEffect(() => {
        dispatch(fetchShipments({ page: currentPage - 1, size: 10 }));
    }, [dispatch, currentPage]);

    useEffect(() => {
        if (selectedShipment?.orderId) {
            dispatch(fetchAdminOrderDetail(selectedShipment.orderId));
        }
    }, [selectedShipment?.orderId, dispatch]);

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
            alert("Đã bắt đầu giao hàng!");

            dispatch(fetchShipments({ page: currentPage - 1, size: 10 }));

            setIsModalOpen(false);
        } catch (error) {
            console.log(error)
            dispatch(fetchShipments({ page: currentPage - 1, size: 10 }));
        }
    };

    // --- XỬ LÝ KHI GIAO THÀNH CÔNG (DELIVERED) & CẬP NHẬT THANH TOÁN ---
    const doneSubmit = async () => {
        if (!selectedShipment) return;

        if (!window.confirm("Xác nhận đã giao hàng thành công?")) return;

        try {
            if (selectedShipment.orderId && currentOrder.paymentMethod === 'COD') {
                await dispatch(updatePaymentStatusThunk({
                    id: selectedShipment.orderId,
                    payload: {
                        paymentStatus: 'COD_COLLECTED',
                        note: 'Shipper thu tiền'
                    }
                })).unwrap();
            }

            await dispatch(updateShipmentStatus({
                id: selectedShipment.shipmentId,
                payload: { status: 'Delivered' }
            })).unwrap();
            alert("Giao hàng thành công!");
            dispatch(fetchShipments({ page: currentPage - 1, size: 10 }));

            setIsModalOpen(false);
        } catch (error) {
            console.error(error);
            dispatch(fetchShipments({ page: currentPage - 1, size: 10 }));
        }
    };

    const returnSUbmit = async () => {
        if (!selectedShipment) return;

        if (!window.confirm("Xác nhận đã giao hàng và đã thu tiền COD?")) return;

        try {
            if (selectedShipment.orderId && currentOrder.paymentMethod === 'COD') {

                await dispatch(updateOrderStatusThunk({
                    id: selectedShipment.orderId,
                    payload: { status: 'RETURNED' }
                })).unwrap();
                await dispatch(updateShipmentStatus({
                    id: selectedShipment.shipmentId,
                    payload: { status: 'Returned' }
                })).unwrap();
                alert("Đã hoàn hàng về shop");

            }


            dispatch(fetchShipments({ page: currentPage - 1, size: 10 }));

            setIsModalOpen(false);
        } catch (error) {
            console.error(error);
            dispatch(fetchShipments({ page: currentPage - 1, size: 10 }));
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
            render: (item) => <span style={{ fontFamily: 'monospace', background: '#eee', padding: '2px 5px' }}>{item.trackingNo}</span>
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

    // Filter data based on search and filters
    const filteredData = (data || []).filter((shipment: IShipment) => {
        const matchesSearch = !searchKeyword ||
            shipment.trackingNo?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
            shipment.orderId?.toString().includes(searchKeyword);
        const matchesStatus = !statusFilter || shipment.status === statusFilter;
        const matchesCarrier = !carrierFilter || shipment.carrier === carrierFilter;

        return matchesSearch && matchesStatus && matchesCarrier;
    });

    return (
        <div className="admin-page-container">
            <AdminPageHeader title="Quản Lý Vận Đơn" />

            {/* Filter Bar */}
            <div style={{
                marginBottom: '20px',
                padding: '15px',
                background: '#fff',
                borderRadius: '8px',
                border: '1px solid #eee',
                display: 'flex',
                gap: '15px',
                alignItems: 'center',
                flexWrap: 'wrap'
            }}>
                {/* Search Input */}
                <input
                    type="text"
                    placeholder="Tìm theo mã vận đơn hoặc mã đơn hàng..."
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    style={{
                        flex: 1,
                        minWidth: '200px',
                        padding: '10px 14px',
                        borderRadius: '6px',
                        border: '1px solid #ddd',
                        fontSize: '14px',
                        transition: 'border-color 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.borderColor = '#06b6d4'}
                    onMouseLeave={(e) => e.currentTarget.style.borderColor = '#ddd'}
                />

                {/* Status Select */}
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    style={{
                        width: '180px',
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
                    <option value="Ready">Ready</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Returned">Returned</option>
                </select>

                {/* Carrier Select */}
                <select
                    value={carrierFilter}
                    onChange={(e) => setCarrierFilter(e.target.value)}
                    style={{
                        width: '180px',
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
                    <option value="">-- Tất cả ĐVVC --</option>
                    <option value="GHN">GHN</option>
                    <option value="GHTK">GHTK</option>
                    <option value="Viettel Post">Viettel Post</option>
                    <option value="VNPost">VNPost</option>
                </select>
            </div>

            <AdminTable<IShipment>
                columns={columns}
                data={filteredData}
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
                <div style={{ minWidth: '400px', display: 'flex', flexDirection: 'column', gap: '15px', backgroundColor: "white" }}>

                    {selectedShipment && (
                        <div>
                            <p>Mã đơn hàng: <strong>{selectedShipment?.orderId}</strong></p>
                            <p>Mã vận đơn: <strong>{selectedShipment?.trackingNo}</strong></p>
                            <p>Đơn vị vận chuyển: <strong>{selectedShipment?.carrier}</strong></p>
                            <p>Ghi chú: <strong>{selectedShipment?.notes}</strong></p>
                            <p>Trạng thái hiện tại: <strong style={{ color: getStatusColor(selectedShipment?.status), }}>{selectedShipment?.status}</strong></p>
                        </div>

                    )}

                    {/* Nút bấm chuyển trạng thái */}
                    {selectedShipment?.status === 'Ready' && (
                        <Button onClick={shippedSubmit} disabled={shipmentStatus === 'loading'}>
                            {shipmentStatus === 'loading' ? <Spinner /> : '📦 Bắt đầu vận chuyển hàng'}
                        </Button>
                    )}

                    {selectedShipment?.status === 'Shipped' && (
                        <>
                            <Button onClick={doneSubmit} disabled={shipmentStatus === 'loading'} style={{ background: 'green', borderColor: 'green' }}>
                                {shipmentStatus === 'loading' ? <Spinner /> : '✅ Giao hàng thành công'}
                            </Button>
                            <Button onClick={returnSUbmit} disabled={shipmentStatus === 'loading'} style={{ background: 'red', borderColor: 'red' }}>
                                {shipmentStatus === 'loading' ? <Spinner /> : '↩Khách hàng không nhận hàng'}
                            </Button>
                        </>

                    )}


                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                        <Button color="0" onClick={() => setIsModalOpen(false)}>Đóng</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}