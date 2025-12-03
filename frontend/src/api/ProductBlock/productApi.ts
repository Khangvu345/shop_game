import { BaseApi } from '../baseApi.ts';
import type { IProduct, IServerResponse } from '../../types';
import axiosClient from '../axiosClient.ts';

class ProductApi extends BaseApi<IProduct> {

    // Ghi đè create để xử lý upload ảnh
    async create(data: Partial<IProduct> & { image?: File }): Promise<IProduct> {
        const formData = new FormData();

        // Tách file ảnh ra khỏi data json
        // Lưu ý: Ở AdminForm, ta đang lưu File vào field 'productImageUrl' hoặc tên field do config quy định
        // Chúng ta cần lấy file đó ra gán vào part 'image'

        const { productImageUrl, ...productJson } = data;
        // productImageUrl ở đây sẽ là File object do component ImageUpload trả về

        // 1. JSON part
        formData.append("data", new Blob([JSON.stringify(productJson)], { type: "application/json" }));

        // 2. File part (Nếu có file)
        // @ts-ignore
        if (productImageUrl && productImageUrl instanceof File) {
            formData.append("image", productImageUrl);
        }

        const response = await axiosClient.post<IServerResponse<IProduct>>(`/${this.resource}`, formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });
        return response.data.data;
    }

    // Hàm search dùng chung cho cả User và Admin
    async search(query: string): Promise<any> {
        return this.getAll({ keyword: query });
    }
}

export const productApi = new ProductApi('products');