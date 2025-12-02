import React, {useEffect, useState} from 'react';
import {addProduct, deleteProduct, editProduct, fetchProducts} from "../../store/slices/ProductBlock/productSlice.ts";
import {AdminManage} from "../../components/features/admin/AdminManager/AdminManage.tsx";
import type {IProduct ,IFieldConfig, IColumn} from "../../types";
import {useAppSelector,useAppDispatch} from "../../store/hooks.ts";
import {fetchCategories} from "../../store/slices/ProductBlock/categorySlice.ts";

export function ManageProductsPage() {

    const dispatch = useAppDispatch();

    const { data: categories } = useAppSelector((state) => state.categories);

    useEffect(() => {
        if (!categories || categories.length === 0) {
            dispatch(fetchCategories());
        }
    }, [dispatch, categories]);


    const columns: IColumn<IProduct>[] = [
        {title: 'Mã Sản Phẩm', key: 'productId' },
        {title: 'Tên Sản Phẩm', key: 'productName' },
        {title: 'Sku', key: 'sku'},
        {title: 'Giá' ,key: 'listPrice'},
        {title: 'Trạng thái', key: 'status'},
        {title: 'Danh Mục', key: 'categoryName' },
        {title: 'Mô tả', key: 'description'},
        {title: 'Ngày Tạo', key: 'createdAt'},
        {title: 'Ngày Cập Nhật', key: 'updatedAt'},
    ]

    const formFields: IFieldConfig<IProduct>[] = [
        {
            label: 'Tên Sản Phẩm:',
            name: 'productName', type: 'text',
            required: true },
        {
            label: 'Sku:',
            name: 'sku',
            type: 'text',
            required: true },
        {
            label: 'Giá:',
            name: 'listPrice',
            type: 'number',
            required: true
        },
        {
            label: 'Mô tả:',
            name: 'description',
            type: 'textarea',
            required: false
        },
        {
            label: 'Danh Mục:',
            name: 'categoryId',
            type: 'select',
            required: true,
            options:[
                ...(categories ? categories.map(cat => ({ label: cat.categoryName, value: cat.categoryId })) : [])
            ]
        },
        {
            label: "Trạng thái:",
            name: 'status',
            type: 'select',
            required: true,
            options: [
                { label: 'Active', value: 'Active' },
                { label: 'Inactive', value: 'Inactive' },
            ]
        }


    ]

    return (
        <AdminManage
            title={'Quản Lý Sản Phẩm'}
            idKey={'productId'}
            columns={columns}
            formFields={formFields}
            stateSelector={(state) => state.products}
            actions={{
                fetchAll: fetchProducts,
                create: addProduct,
                update: editProduct,
                delete: deleteProduct}}
        >

        </AdminManage>
        );
}

