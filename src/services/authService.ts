import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  city: string;
}

export interface LoginResponse {
  personName: string;
  id: string; 
  email: string;
  token: string;
  expiration: string;
  refreshToken: string;
  refreshTokenExpirationDateTime: string;
  userType: string;
  verificationStatus: string;
}

export interface RefreshTokenResponse {
  token: string;
  expiration: string;
  refreshToken: string;
  refreshTokenExpirationDateTime: string;
}

export interface VerifyEmailOtpRequest {
  email: string;
  otp: string;
}

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

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Response Types
export const authAPI = {
  // Login
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await axios.post(`${API_BASE_URL}/api/web/auth/login`, credentials);
    return response.data;
  },

  // داخل authAPI object، بعد login:
  googleLogin: async (data: { provider: string; idToken: string }): Promise<LoginResponse> => {
    const response = await axios.post(`${API_BASE_URL}/api/web/auth/google-login`, data);
    return response.data;
  },

  // Register
  register: async (data: FormData | RegisterRequest) => {
    const config = data instanceof FormData 
      ? { headers: { 'Content-Type': 'multipart/form-data' } }
      : {};
    
    const response = await axios.post(`${API_BASE_URL}/api/web/auth/register`, data, config);
    return response.data;
  },

  // ✅ Refresh Token
  refreshToken: async (refreshToken: string): Promise<RefreshTokenResponse> => {
    const response = await axios.post(`${API_BASE_URL}/api/web/auth/refresh-token`, {
      refreshToken,
    });
    return response.data;
  },

  // Verify Email OTP
  verifyEmailOtp: async (data: VerifyEmailOtpRequest) => {
    const response = await axios.post(`${API_BASE_URL}/api/web/auth/verify-email-otp`, data);
    return response.data;
  },

  // Resend Verification Email
  resendVerificationEmail: async (email: string) => {
    const response = await axios.post(`${API_BASE_URL}/api/web/auth/resend-verification-email`, { email });
    return response.data;
  },

  // Forgot Password
  forgotPassword: async (email: string) => {
    const response = await axios.post(`${API_BASE_URL}/api/web/auth/forgot-password`, { email });
    return response.data;
  },

  // Reset Password
  resetPassword: async (data: { email: string; token: string; password: string; confirmPassword: string }) => {
    const response = await axios.post(`${API_BASE_URL}/api/web/auth/reset-password`, data);
    return response.data;
  },

  // Logout
  logout: async () => {
    const token = localStorage.getItem('token');
    const response = await axios.post(
      `${API_BASE_URL}/api/web/auth/logout`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  },
};