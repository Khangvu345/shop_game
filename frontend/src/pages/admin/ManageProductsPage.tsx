import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from "../../store/hooks.ts";
// Import actions từ slice mới (Generic)
import {
    fetchProducts,
    addProduct,
    editProduct,
    deleteProduct, resetProductState
} from "../../store/slices/ProductBlock/productSlice.ts";
import { fetchCategories } from "../../store/slices/ProductBlock/categorySlice.ts";
import { AdminManage } from "../../components/features/admin/AdminManager/AdminManage.tsx";
import type { IProduct, IFieldConfig, IColumn } from "../../types";

export function ManageProductsPage() {
    const dispatch = useAppDispatch();
    // Lấy danh mục để đổ vào dropdown
    const { data: categories } = useAppSelector((state) => state.categories);

    // --- Filter State ---
    const [keyword, setKeyword] = useState('');
    const [filterCategoryId, setFilterCategoryId] = useState<string>('');
    const [filterStatus, setFilterStatus] = useState<string>('');
    dispatch(resetProductState())

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
                    style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
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
        {
            title: 'Tồn kho',
            key: 'stockQuantity',
            render: (item) => (
                <span style={{ fontWeight: 'bold', color: item.stockQuantity > 0 ? 'inherit' : 'red' }}>
                    {item.stockQuantity}
                </span>
            )
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
        { label: 'Số lượng tồn', name: 'stockQuantity', type: 'number', required: false, disabled: true },
        {
            label: 'Danh Mục',
            name: 'categoryId',
            type: 'select',
            required: true,
            options: [
                { label: '-- Chọn danh mục --', value: '' },
                ...(categories?.map(c => ({ label: c.categoryName, value: c.categoryId })) || [])
            ]
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

    // 3. Render Custom Filters
    const renderFilters = () => (
        <>
            {/* Search Input */}
            <input
                type="text"
                placeholder="Tìm kiếm sản phẩm theo tên hoặc Mã SP..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                style={{
                    flex: 1,
                    minWidth: '200px',
                    padding: '10px 14px',
                    borderRadius: '6px',
                    border: '1px solid #ddd',
                    fontSize: '14px'
                }}
            />

            {/* Category Select */}
            <select
                value={filterCategoryId}
                onChange={(e) => setFilterCategoryId(e.target.value)}
                style={{
                    width: '180px',
                    padding: '10px 14px',
                    borderRadius: '6px',
                    border: '1px solid #ddd',
                    fontSize: '14px'
                }}
            >
                <option value="">-- Tất cả danh mục --</option>
                {categories?.map((c) => (
                    <option key={c.categoryId} value={c.categoryId}>
                        {c.categoryName}
                    </option>
                ))}
            </select>

            {/* Status Select */}
            <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                style={{
                    width: '160px',
                    padding: '10px 14px',
                    borderRadius: '6px',
                    border: '1px solid #ddd',
                    fontSize: '14px'
                }}
            >
                <option value="">-- Tất cả trạng thái --</option>
                <option value="Active">Đang kinh doanh</option>
                <option value="Inactive">Ngừng kinh doanh</option>
            </select>
        </>
    );

    // Prepare extra params for fetchAll
    const extraParams = {
        keyword: keyword || undefined,
        categoryId: filterCategoryId || undefined,
        status: filterStatus || undefined
    };

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
            renderFilters={renderFilters}
            extraParams={extraParams}
        />
    );
}