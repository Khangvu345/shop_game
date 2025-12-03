import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { type AsyncThunk } from '@reduxjs/toolkit';
import { AdminTable } from '../AdminTable/AdminTable';
import { AdminForm } from '../AdminForm/AdminForm';
import { Modal } from '../../../ui/Modal/Modal';
import { Button } from '../../../ui/button/Button';
import { Pagination } from '../../../ui/pagination/Pagination'; // Import Pagination
import type { IColumn, IFieldConfig } from "../../../../types";

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
}

export function AdminManage<T extends object>({
                                                  title,
                                                  idKey,
                                                  columns,
                                                  formFields,
                                                  stateSelector,
                                                  actions
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
        dispatch(actions.fetchAll({ page: currentPage - 1, size: pageSize }));
    }, [dispatch, actions, currentPage]); // Gọi lại khi đổi trang

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
            dispatch(actions.fetchAll({ page: currentPage - 1, size: pageSize }));
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
        return <div style={{color: 'red', padding: '20px'}}>Lỗi hệ thống: {error}</div>;
    }

    return (
        <div>
            {/* HEADER */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ margin: 0, fontSize: '1.8rem' }}>{title}</h2>
                <Button onClick={handleOpenAdd} size="medium">+ Thêm Mới</Button>
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
                <div style={{display: 'flex', justifyContent: 'center', marginTop: '20px'}}>
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
                <div style={{textAlign: 'center', marginTop: '10px', color: '#666', fontSize: '0.9rem'}}>
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