import { BaseApi } from '../baseApi.ts';
import type { ISupplier } from '../../types';

export class SupplierApi extends BaseApi<ISupplier> {
    constructor() {
        super('admin/suppliers');
    }
}

export const supplierApi = new SupplierApi();