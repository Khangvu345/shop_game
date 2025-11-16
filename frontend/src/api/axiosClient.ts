import axios from 'axios';

const axiosClient = axios.create({
    baseURL:  import.meta.env.VITE_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});


/*
axiosClient.interceptors.request.use(
  (config) => {
    // Lỗi đang ở dòng này vì authSlice chưa tồn tại
    const token = store.getState().auth.token;
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
*/

export default axiosClient;