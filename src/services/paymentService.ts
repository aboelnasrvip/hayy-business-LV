import axios from 'axios';
import { authAPI } from './authService';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

// ✅ Request Interceptor
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

// ✅ Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        
        if (!refreshToken) {
          localStorage.clear();
          window.location.href = '/login';
          return Promise.reject(error);
        }

        const response = await authAPI.refreshToken(refreshToken);
        const { token, refreshToken: newRefreshToken, expiration, refreshTokenExpirationDateTime } = response;

        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', newRefreshToken);
        localStorage.setItem('tokenExpiration', expiration);
        localStorage.setItem('refreshTokenExpiration', refreshTokenExpirationDateTime);

        originalRequest.headers.Authorization = `Bearer ${token}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export const paymentAPI = {
  // Initiate Payment
  initiatePayment: async (data: { planId: string; businessId: string }) => {
    const response = await axiosInstance.post('/api/web/Payment/initiate', data);
    return response.data;
  },

  // Verify Payment
  verifyPayment: async (paymentId: string) => {
    const response = await axiosInstance.get(`/api/web/Payment/verify/${paymentId}`);
    return response.data;
  },

  // Get Subscription Info
  getSubscription: async () => {
    const response = await axiosInstance.get('/api/web/Payment/subscription');
    return response.data;
  },
};