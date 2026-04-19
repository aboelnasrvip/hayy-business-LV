import axios from 'axios';
import { authAPI } from './authService';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

// ✅ Request Interceptor - إضافة Token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Response Interceptor - تجديد Token عند انتهاء صلاحيته
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // إذا كان الخطأ 401 ومفيش retry سابق
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        
        if (!refreshToken) {
          // مفيش refresh token، روح login
          localStorage.clear();
          window.location.href = '/login';
          return Promise.reject(error);
        }

        // ✅ طلب token جديد
        const response = await authAPI.refreshToken(refreshToken);
        const { token, refreshToken: newRefreshToken, expiration, refreshTokenExpirationDateTime } = response;

        // حفظ الـ tokens الجديدة
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', newRefreshToken);
        localStorage.setItem('tokenExpiration', expiration);
        localStorage.setItem('refreshTokenExpiration', refreshTokenExpirationDateTime);

        // إعادة المحاولة بالـ token الجديد
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // فشل التجديد -> تسجيل خروج
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export const businessAPI = {
  // Submit Business Onboarding
  submitOnboarding: async (data: FormData) => {
    const response = await axiosInstance.post('/api/Business/onboarding', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  
};