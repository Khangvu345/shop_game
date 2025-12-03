import { productApi } from '../../../api/ProductBlock/productApi.ts';
import type { IProduct } from '../../../types';
import { createGenericSlice } from '../GenericSlice.ts';

const productSlice = createGenericSlice<IProduct>(
    'products',      // Tên slice
    productApi,      // Instance API
    'productId'      // Tên trường ID để update/delete
);

// Export các actions tự động
export const {
    fetchAll: fetchProducts,
    fetchById: fetchProductById,
    create: addProduct,
    update: editProduct,
    remove: deleteProduct,
    resetState: resetProductState
} = productSlice.actions;

export default productSlice.reducer;