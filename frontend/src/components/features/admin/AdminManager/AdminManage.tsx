import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { type AsyncThunk } from '@reduxjs/toolkit';
import { AdminTable } from '../AdminTable/AdminTable';
import { AdminForm } from '../AdminForm/AdminForm';
import { Modal } from '../../../ui/Modal/Modal';
import { Button } from '../../../ui/button/Button';
import { Pagination } from '../../../ui/pagination/Pagination';
import type { IColumn, IFieldConfig } from "../../../../types";
import '../../../../assets/styles/admin.css';
import '../AdminPageHeader/AdminPageHeader.css';

// Interface cho State Redux (phải khớp với GenericSlice)
interface IReduxState<T> {
    data: T[] | null;
    status: string;
    error: any;
    pagination?: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

interface AdminManageProps<T> {
    title: string;
    idKey: keyof T;

    // Cấu hình hiển thị
    columns: IColumn<T>[];
    formFields: IFieldConfig<T>[];

    // Selector lấy state từ Redux
    stateSelector: (state: any) => IReduxState<T>;

    // Các Actions (Thunk)
    actions: {
        fetchAll: AsyncThunk<any, any, any>;
        create: AsyncThunk<any, any, any>;
        update: AsyncThunk<any, any, any>;
        delete: AsyncThunk<any, any, any>;
    };

    // Optional: Render custom filters above the table
    renderFilters?: () => React.ReactNode;
    // Optional: Extra params to pass to fetchAll (e.g. filters)
    extraParams?: Record<string, any>;
}

export function AdminManage<T extends object>({
    title,
    idKey,
    columns,
    formFields,
    stateSelector,
    actions,
    renderFilters,
    extraParams
}: AdminManageProps<T>) {

    const dispatch = useAppDispatch();
    // Lấy cả pagination từ Redux
    const { data, status, error, pagination } = useAppSelector(stateSelector);

    // State quản lý trang hiện tại (Local State)
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10; // Mặc định 10 dòng/trang

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<T | undefined>(undefined);

    // --- 1. FETCH DATA (Có phân trang) ---
    useEffect(() => {
        // Backend Spring Boot dùng page index bắt đầu từ 0
        dispatch(actions.fetchAll({ page: currentPage - 1, size: pageSize, ...extraParams }));
    }, [dispatch, actions, currentPage, extraParams]); // Gọi lại khi đổi trang hoặc filter thay đổi

    // --- 2. HANDLERS ---
    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    const handleOpenAdd = () => {
        setEditingItem(undefined);
        setIsModalOpen(true);
    };

    const handleOpenEdit = (item: T) => {
        setEditingItem(item);
        setIsModalOpen(true);
    };

    const handleDelete = async (item: T) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa dòng này?')) {
            await dispatch(actions.delete(item[idKey]));
            // Sau khi xóa, load lại trang hiện tại
            dispatch(actions.fetchAll({ page: currentPage - 1, size: pageSize, ...extraParams }));
        }
    };

    const handleSubmit = async (formData: T) => {
        try {
            if (editingItem) {
                await dispatch(actions.update({ id: editingItem[idKey], data: formData })).unwrap();
            } else {
                await dispatch(actions.create(formData)).unwrap();
                // Nếu tạo mới thành công, có thể quay về trang 1 để thấy item mới
                setCurrentPage(1);
            }
            setIsModalOpen(false);
        } catch (error: any) {
            alert('Lỗi: ' + (error.message || "Thao tác thất bại"));
        }
    };

    if (error) {
        return <div style={{ color: 'red', padding: '20px' }}>Lỗi hệ thống: {error}</div>;
    }

    return (
        <div className="admin-page-container">
            {/* HEADER - 3 column grid: Logo | Spacer | Title */}
            <div className="admin-page-header">
                <span className="admin-logo-header">Admin</span>
                <div></div> {/* Spacer column */}
                <h2 className="admin-page-title">{title}</h2>
            </div>

            {/* ACTION BAR - Filters (left) and Button (right) */}
            <div className="admin-action-bar">
                <div className="filter-group">
                    {renderFilters && renderFilters()}
                </div>
                <Button
                    onClick={handleOpenAdd}
                    style={{
                        background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
                        color: '#fff',
                        fontWeight: 600,
                        padding: '0.75rem 1.5rem',
                        borderRadius: '6px',
                        border: 'none',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                        flexShrink: 0
                    }}
                >
                    + Thêm Mới
                </Button>
            </div>

            {/* TABLE */}
            <AdminTable<T>
                columns={columns}
                data={data || []}
                isLoading={status === 'loading'}
                rowKey={(item) => item[idKey] as string}
                onEdit={handleOpenEdit}
                onDelete={handleDelete}
            />

            {/* PAGINATION */}
            {pagination && pagination.totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                    <Pagination
                        totalRows={pagination.total}
                        limit={pageSize}
                        currentPage={currentPage}
                        onPageChange={handlePageChange}
                    />
                </div>
            )}

            {/* Pagination Info Text */}
            {pagination && (
                <div style={{ textAlign: 'center', marginTop: '10px', color: '#666', fontSize: '0.9rem' }}>
                    Hiển thị trang {pagination.page + 1} trên {pagination.totalPages}
                </div>
            )}

            {/* MODAL FORM */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingItem ? `Cập nhật ${title}` : `Thêm mới ${title}`}
            >
                <AdminForm<T>
                    fields={formFields}
                    initialData={editingItem}
                    onSubmit={handleSubmit}
                    onCancel={() => setIsModalOpen(false)}
                    isSubmitting={status === 'loading'}
                />
            </Modal>
        </div>
    );
}