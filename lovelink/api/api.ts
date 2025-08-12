import axios from 'axios'
import Constants from "expo-constants";
import { useAuthStore } from '@/store/hooks/useAuthStore';

const api = axios.create({
    baseURL: "https://lovelink-cjgx.onrender.com/api",
    headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// Response interceptor: handle 401
api.interceptors.response.use(
    (res) => res,
    (err) => {
        if (err.response?.status === 401) {
            useAuthStore.getState().logout();
        }
        return Promise.reject(err);
    }
);

export default api