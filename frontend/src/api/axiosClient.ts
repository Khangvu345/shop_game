import axios from 'axios';

const axiosClient = axios.create({
    baseURL:  import.meta.env.VITE_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});


axiosClient.interceptors.response.use(
    (response) => {
        const res = response.data;


        if (res.success === false) {
            return Promise.reject(new Error(res.message || 'Lỗi nghiệp vụ'));
        }

        return response;
    },
    (error) => {
        console.error("API Error:", error?.response?.data?.message || error.message);
        return Promise.reject(error.response.data);
    }
);


export default axiosClient;