import { supplierApi } from '../../../api/ProductBlock/supplierApi.ts';
import {type ISupplier } from '../../../types';
import { createGenericSlice } from '../GenericSlice.ts';

const SupplierSlice = createGenericSlice<ISupplier>(
    'suppliers',
    supplierApi,
    'supplierId'
);

export const {
    fetchAll: fetchSuppliers,
    create: addSupplier,
    update: updateSupplier,
    remove: deletSupplier
} = SupplierSlice.actions;

export default SupplierSlice.reducer;