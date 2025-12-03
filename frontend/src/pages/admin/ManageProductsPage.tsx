import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from "../../store/hooks.ts";
// Import actions từ slice mới (Generic)
import {
    fetchProducts,
    addProduct,
    editProduct,
    deleteProduct
} from "../../store/slices/ProductBlock/productSlice.ts";
import { fetchCategories } from "../../store/slices/ProductBlock/categorySlice.ts";
import { AdminManage } from "../../components/features/admin/AdminManager/AdminManage.tsx";
import type { IProduct, IFieldConfig, IColumn } from "../../types";

export function ManageProductsPage() {
    const dispatch = useAppDispatch();
    // Lấy danh mục để đổ vào dropdown
    const { data: categories } = useAppSelector((state) => state.categories);

    useEffect(() => {
        if (!categories || categories.length === 0) {
            dispatch(fetchCategories({}));
        }
    }, [dispatch, categories]);

    // 1. Định nghĩa Cột hiển thị
    const columns: IColumn<IProduct>[] = [
        { title: 'ID', key: 'productId' },
        {
            title: 'Ảnh',
            key: 'productImageUrl',
            render: (item) => (
                <img
                    src={item.productImageUrl || 'https://placehold.co/50'}
                    alt="sp"
                    style={{width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px'}}
                />
            )
        },
        { title: 'Tên Sản Phẩm', key: 'productName' },
        { title: 'SKU', key: 'sku' },
        {
            title: 'Giá',
            key: 'listPrice',
            render: (item) => item.listPrice.toLocaleString('vi-VN') + ' đ'
        },
        { title: 'Danh Mục', key: 'categoryName' },
        {
            title: 'Trạng thái',
            key: 'status',
            render: (item) => (
                <span style={{
                    color: item.status === 'Active' ? 'green' : 'red',
                    fontWeight: 'bold'
                }}>
                    {item.status}
                </span>
            )
        },
    ];

    // 2. Định nghĩa Form nhập liệu
    const formFields: IFieldConfig<IProduct>[] = [
        { label: 'Tên Sản Phẩm', name: 'productName', type: 'text', required: true, colSpan: 2 },
        { label: 'Mã SKU', name: 'sku', type: 'text', required: true },
        { label: 'Giá Niêm Yết', name: 'listPrice', type: 'number', required: true },
        {
            label: 'Danh Mục',
            name: 'categoryId',
            type: 'select',
            required: true,
            options: categories?.map(c => ({ label: c.categoryName, value: c.categoryId })) || []
        },
        {
            label: 'Trạng Thái',
            name: 'status',
            type: 'select',
            required: true,
            options: [
                { label: 'Đang kinh doanh (Active)', value: 'Active' },
                { label: 'Ngừng kinh doanh (Inactive)', value: 'Inactive' }
            ]
        },
        { label: 'Mô tả sản phẩm', name: 'description', type: 'textarea', required: false, colSpan: 2 },
        {
            label: 'Ảnh sản phẩm',
            name: 'productImageUrl', // Field này sẽ chứa File object khi upload
            type: 'image',           // Dùng type image mới tạo
            required: false,
            colSpan: 2
        },
    ];

    return (
        <AdminManage
            title="Quản Lý Sản Phẩm"
            idKey="productId"
            columns={columns}
            formFields={formFields}
            stateSelector={(state) => state.products} // Chọn đúng slice products
            actions={{
                fetchAll: fetchProducts,
                create: addProduct,
                update: editProduct,
                delete: deleteProduct
            }}
        />
    );
}