import React, { useEffect, useState } from 'react';
import {useAppDispatch, useAppSelector} from '../../../../store/hooks';
import {type AsyncThunk} from '@reduxjs/toolkit';
import {AdminTable} from '../AdminTable/AdminTable';
import {AdminForm} from '../AdminForm/AdminForm';
import { Modal } from '../../../ui/Modal/Modal';
import { Button } from '../../../ui/button/Button';

import type {IColumn, IFieldConfig} from "../../../../types";


interface AdminManageProps<T> {
    title: string;
    idKey: keyof T;

    // CẤU HÌNH (MAPS)
    columns: IColumn<T>[];
    formFields: IFieldConfig<T>[];


    stateSelector: (state: any) => { data: T[]; status: string; error: any };
    // Các hành động Async Thunk
    actions: {
        fetchAll: AsyncThunk<any, any, any>;
        create: AsyncThunk<any, any, any>;
        update: AsyncThunk<any, any, any>;
        delete: AsyncThunk<any, any, any>;
    };
}

export function AdminManage<T extends object>({title, idKey, columns, formFields, stateSelector, actions}: AdminManageProps<T>) {

    const dispatch = useAppDispatch();
    const { data, status } = useAppSelector(stateSelector);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<T | undefined>(undefined);


    useEffect(() => {
        dispatch(actions.fetchAll({}));
    }, [dispatch, actions]);

    const handleOpenAdd = () => {
        setEditingItem(undefined); // Reset về Thêm mới
        setIsModalOpen(true);
    };

    const handleOpenEdit = (item: T) => {
        setEditingItem(item); // Set item đang sửa
        setIsModalOpen(true);
    };
    const handleDelete = (item: T) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa?')) {
            dispatch(actions.delete(item[idKey]));
        }
    };

    const handleSubmit = async (formData: T) => {
        try {
            if (editingItem) {
                // SỬA: Gửi ID và Data
                await dispatch(actions.update({ id: editingItem[idKey], data: formData })).unwrap();
            } else {
                // THÊM: Gửi Data
                await dispatch(actions.create(formData)).unwrap();
            }
            setIsModalOpen(false); // Đóng modal
        } catch (error) {
            alert('Lỗi: ' + error);
        }
    };
    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <h2 style={{ margin: 0 }}>{title}</h2>
                <Button onClick={handleOpenAdd}>+ Thêm mới</Button>
            </div>

            {/* BẢNG HIỂN THỊ */}
            <AdminTable<T>
                columns={columns}
                data={data || []}
                isLoading={status === 'loading'}
                rowKey={(item) => item[idKey] as string}
                onEdit={handleOpenEdit}
                onDelete={handleDelete}
            />

            {/* FORM NHẬP LIỆU (MODAL) */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingItem ? `Sửa ${title}` : `Thêm ${title}`}
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

