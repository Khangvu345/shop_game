import axios from 'axios';

// Định nghĩa Type cho API PTIT
export interface IPTITLocation {
    _id: string;
    tenDonVi: string;
    ma: string;
    cap: number;
    maDonViTrucThuoc: string | null;
}

export interface IPTITResponse {
    success: boolean;
    data: IPTITLocation[];
}

const BASE_URL = 'https://gwdu.ptit.edu.vn/core/don-vi-hanh-chinh-v2/public';

const locationAxios = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    timeout: 5000
});

export const locationApi = {
    getProvinces: async (): Promise<IPTITLocation[]> => {
        try {
            const response = await locationAxios.get<IPTITResponse>('/tinh');
            return response.data.success ? response.data.data : [];
        } catch (error) {
            console.error("Lỗi lấy danh sách tỉnh:", error);
            return [];
        }
    },

    getSubLocations: async (provinceId: string): Promise<IPTITLocation[]> => {
        try {
            const response = await locationAxios.get<IPTITResponse>(`/xa-phuong/maTinh/${provinceId}`);
            return response.data.success ? response.data.data : [];
        } catch (error) {
            console.error(`Lỗi lấy xã/phường cho tỉnh ${provinceId}:`, error);
            return [];
        }
    }
};