import React from 'react';
import { AdminManager} from "../../components/features/admin/AdminManager/AdminManage.tsx";
import {
    fetchProducts, addProduct, editProduct, deleteProduct
} from '../../store/slices/productSlice';
import type { IProduct } from '../../types';

export const ManageProductsPage: React.FC = () => {

    // 1. Tạo một object mẫu rỗng (để Form biết cần vẽ những ô input nào)
    const productTemplate: IProduct = {
        productId: 0,
        sku: '',
        productName: '',
        listPrice: 0,
        categoryId: 0,
        status: 'Active',
        thumbnailUrl: '',
        description: '',
        // Các trường optional khác...
    };

    return (
        <AdminManager<IProduct>
            title="Quản lý Sản phẩm (Auto)"
            template={productTemplate} // Truyền mẫu vào
            idKey="productId"
            stateSelector={(state) => state.products}
            actions={{
                fetchAll: fetchProducts,
                create: addProduct,
                update: editProduct,
                delete: deleteProduct
            }}
        />
    );
};