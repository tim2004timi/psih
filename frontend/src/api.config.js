import axios from 'axios';
import { serverUrl } from './API/productsApi';

export const refreshInstance = axios.create({
    baseURL: serverUrl,
});

refreshInstance.interceptors.request.use(
    (config) => {
        config.headers.Authorization = `Bearer ${localStorage.getItem("refresh_token")}`;
        return config;
    }
);

export const instance = axios.create({
    withCredentials: true,
    baseURL: serverUrl,
});

instance.interceptors.request.use(
    (config) => {
        config.headers.Authorization = `Bearer ${localStorage.getItem("access_token")}`;
        return config;
    }
);

instance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem("refresh_token");

                if (!refreshToken) {
                    console.log("Refresh token is missing");
                }

                const resp = await refreshInstance.post("/api/jwt/refresh/");
                localStorage.setItem("access_token", resp.data.access_token);

                originalRequest.headers.Authorization = `Bearer ${resp.data.access_token}`;
                return instance(originalRequest);
            } catch (refreshError) {
                console.error("Failed to refresh token:", refreshError);
                localStorage.removeItem("access_token");
                localStorage.removeItem("refresh_token");
                // window.location.href = "/login";
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);