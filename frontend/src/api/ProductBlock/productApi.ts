import { BaseApi } from '../baseApi.ts';
import type { IProduct } from '../../types';

class ProductApi extends BaseApi<IProduct> {

    async search(query: string): Promise<IProduct[]> {
        return this.getAll({ q: query });
    }
}

export const productApi = new ProductApi('products');