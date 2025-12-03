import { BaseApi } from '../baseApi.ts';
import type { IProduct, IServerResponse } from '../../types';
import axiosClient from '../axiosClient.ts';

class ProductApi extends BaseApi<IProduct> {

    // Ghi đè create để xử lý upload ảnh
    async create(data: any): Promise<IProduct> {
        const formData = new FormData();

        // Tách file ảnh ra khỏi dữ liệu JSON
        // Lưu ý: AdminForm lưu file vào field 'productImageUrl'
        const { productImageUrl, ...productJson } = data;

        // 1.1. Thêm phần JSON (Bắt buộc phải bọc trong Blob với type application/json)
        formData.append("data", new Blob([JSON.stringify(productJson)], { type: "application/json" }));

        // 1.2. Thêm phần File (Nếu có)
        if (productImageUrl instanceof File) {
            formData.append("image", productImageUrl);
        }

        // 1.3. Gọi API với Header multipart/form-data
        const response = await axiosClient.post<IServerResponse<IProduct>>(`/${this.resource}`, formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });
        return response.data.data;
    }

    // Ghi đè update để xử lý upload ảnh
    async update(id: string | number, data: Partial<IProduct>): Promise<IProduct> {
        const { productImageUrl, ...productJson } = data;

        // Kiểm tra xem user có upload ảnh mới không
        // @ts-ignore
        const hasNewImage = productImageUrl && productImageUrl instanceof File;

        if (hasNewImage) {
            // Scenario 1: Có ảnh mới → Dùng endpoint /with-image
            const formData = new FormData();

            // 1. JSON part
            formData.append("data", new Blob([JSON.stringify(productJson)], { type: "application/json" }));

            // 2. File part
            formData.append("image", productImageUrl);

            const response = await axiosClient.put<IServerResponse<IProduct>>(
                `/${this.resource}/${id}/with-image`,
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );
            return response.data.data;
        } else {
            // Scenario 2: Không có ảnh mới → Dùng endpoint thường (chỉ JSON)
            // Gọi lại method update() của BaseApi
            return super.update(id, data);
        }
    }

    // Hàm search dùng chung cho cả User và Admin
    async search(query: string): Promise<any> {
        return this.getAll({ keyword: query });
    }

    // Kiểm tra SKU đã tồn tại hay chưa
    async checkSku(sku: string, excludeProductId?: number): Promise<{ exists: boolean; message: string }> {
        const response = await axiosClient.get(`/${this.resource}/check-sku`, {
            params: { sku, excludeProductId }
        });
        return response.data;
    }
}

export const productApi = new ProductApi('products');