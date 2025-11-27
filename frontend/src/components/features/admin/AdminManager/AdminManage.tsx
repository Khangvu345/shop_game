// src/components/features/admin/AdminManager.tsx
import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { type AsyncThunk } from '@reduxjs/toolkit';
import {AdminTable} from '../AdminTable/AdminTable';
import {AdminForm} from '../AdminForm/AdminForm';
import { Modal } from '../../../ui/Modal/Modal';
import { Button } from '../../../ui/button/Button';

interface AdminManagerProps<T> {
    title: string;
    template: T; // Object mẫu rỗng (QUAN TRỌNG)
    idKey: keyof T; // Tên trường ID để biết đường xóa/sửa

    stateSelector: (state: never) => { data: T[]; status: string };
    actions: {
        fetchAll: AsyncThunk<unknown, unknown, never>;
        create: AsyncThunk<unknown, unknown, never>;
        update: AsyncThunk<unknown, unknown, never>;
        delete: AsyncThunk<unknown, unknown, never>;
    };
}

export const AdminManager = <T extends Record<string, never>>({
                                                                    title, template, idKey, stateSelector, actions
                                                                }: AdminManagerProps<T>) => {

    const dispatch = useAppDispatch();
    const { data, status } = useAppSelector(stateSelector);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<T | undefined>(undefined);

    useEffect(() => {
        dispatch(actions.fetchAll({}));
    }, [dispatch, actions]);

    const handleSave = async (formData: T) => {
        try {
            if (editingItem) {
                // Sửa
                await dispatch(actions.update({ id: editingItem[idKey], data: formData })).unwrap();
            } else {
                // Thêm
                await dispatch(actions.create(formData)).unwrap();
            }
            setIsModalOpen(false);
        } catch (e) { alert('Lỗi: ' + e); }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">{title}</h2>
                <Button onClick={() => { setEditingItem(undefined); setIsModalOpen(true); }}>
                    + Thêm mới
                </Button>
            </div>

            <AdminTable<T>
                data={data || []}
                isLoading={status === 'loading'}
                rowKey={idKey}
                onEdit={(item) => { setEditingItem(item); setIsModalOpen(true); }}
                onDelete={(item) => { if(confirm('Xóa?')) dispatch(actions.delete(item[idKey])); }}
            />

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={`${editingItem ? 'Sửa' : 'Thêm'} ${title}`}
            >
                <AdminForm<T>
                    template={template}
                    initialData={editingItem}
                    onSubmit={handleSave}
                    onCancel={() => setIsModalOpen(false)}
                    isSubmitting={status === 'loading'}
                />
            </Modal>
        </div>
    );
};