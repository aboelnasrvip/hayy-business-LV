import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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

export const authAPI = {
  register: async (formData: FormData) => {
    const response = await axios.post(`${API_BASE_URL}/api/web/auth/register`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  login: async (credentials: { email: string; password: string }) => {
    const response = await axios.post(`${API_BASE_URL}/api/web/auth/login`, credentials);
    return response.data;
  },

  // Google Login for Business (من الصورة)
  googleLoginBusiness: async (data: { provider: string; idToken: string }) => {
    const response = await axios.post(`${API_BASE_URL}/api/web/auth/google-login-business`, data);
    return response.data;
  },

  // Google Login (الأصلي)
  googleLogin: async (data: { provider: string; idToken: string }) => {
    const response = await axios.post(`${API_BASE_URL}/api/web/auth/google-login`, data);
    return response.data;
  },

  logout: async () => {
    const response = await axiosInstance.post('/api/web/auth/logout');
    return response.data;
  },

  changePassword: async (data: { currentPassword: string; newPassword: string; confirmNewPassword: string }) => {
    const response = await axiosInstance.post('/api/web/auth/change-password', data);
    return response.data;
  },

  forgotPassword: async (email: string) => {
    const response = await axios.post(`${API_BASE_URL}/api/web/auth/forgot-password`, { email });
    return response.data;
  },

  resetPassword: async (data: { email: string; token: string; newPassword: string; confirmPassword: string }) => {
    const response = await axios.post(`${API_BASE_URL}/api/web/auth/reset-password`, data);
    return response.data;
  },

  confirmEmail: async (userId: string, token: string) => {
    const response = await axios.get(`${API_BASE_URL}/api/web/auth/confirm-email`, {
      params: { userId, token },
    });
    return response.data;
  },

  resendConfirmation: async (email: string) => {
    const response = await axios.post(`${API_BASE_URL}/api/web/auth/resend-confirmation`, { email });
    return response.data;
  },

  checkEmail: async (email: string) => {
    const response = await axios.get(`${API_BASE_URL}/api/web/auth/check-email`, {
      params: { email },
    });
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await axiosInstance.get('/api/web/auth/me');
    return response.data;
  },

  refreshToken: async (accessToken: string, refreshToken: string) => {
    const response = await axios.post(`${API_BASE_URL}/api/web/auth/refresh-token`, {
      accessToken,
      refreshToken,
    });
    return response.data;
  },

  revokeToken: async (token: string) => {
    const response = await axiosInstance.post('/api/web/auth/revoke-token', { token });
    return response.data;
  },

  // Create Admin (يتطلب صلاحيات Admin)
  createAdmin: async (formData: FormData) => {
    const response = await axiosInstance.post('/api/web/auth/create-admin', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Make Admin (يتطلب صلاحيات Admin)
  makeAdmin: async (email: string) => {
    const response = await axiosInstance.post(`/api/web/auth/make-admin?email=${encodeURIComponent(email)}`);
    return response.data;
  },
};