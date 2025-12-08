import React, { useMemo } from 'react';
import { useAppSelector } from "../../store/hooks";
import {
    fetchCategories,
    addCategory,
    updateCategory,
    deleteCategory
} from "../../store/slices/ProductBlock/categorySlice.ts";
import { AdminManage } from "../../components/features/admin/AdminManager/AdminManage.tsx";
import type { ICategory, IColumn, IFieldConfig } from "../../types";

export function ManageCategoriesPage() {
    const { data: categories } = useAppSelector((state) => state.categories);

    const columns: IColumn<ICategory>[] = [
        { title: 'ID', key: 'categoryId' },
        { title: 'Tên Danh Mục', key: 'categoryName' },
        { title: 'Mô tả', key: 'description' },
        { title: 'Danh mục cha', key: 'parentName' }
    ];

    // Memoize formFields để tránh re-create mỗi lần render
    const formFields: IFieldConfig<ICategory>[] = useMemo(() => [
        { label: 'Tên Danh Mục', name: 'categoryName', type: 'text', required: true },
        { label: 'Mô tả', name: 'description', type: 'textarea', colSpan: 2 },
        {
            label: 'Danh mục cha',
            name: 'parentId',
            type: 'select',
            options: [
                { value: '', label: '-- Không chọn (Danh mục gốc) --' },
                ...(categories || []).map(c => ({
                    value: c.categoryId,
                    label: c.categoryName
                }))
            ],
            required: false
        }
    ], [categories]);

    // Memoize actions để tránh tạo object mới mỗi lần render
    const actions = useMemo(() => ({
        fetchAll: fetchCategories,
        create: addCategory,
        update: updateCategory,
        delete: deleteCategory
    }), []);

    return (
        <AdminManage
            title="Quản Lý Danh Mục"
            idKey="categoryId"
            columns={columns}
            formFields={formFields}
            stateSelector={(state) => state.categories}
            actions={actions}
        />
    );
}
