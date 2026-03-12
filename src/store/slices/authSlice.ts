import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authAPI } from '@/services/authService';

interface User {
  id: string;
  fullName: string;
  email: string;
  imageUrl?: string;
  userType: string;
  isEmailConfirmed: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  refreshToken: localStorage.getItem('refreshToken'),
  isLoading: false,
  error: null,
  isAuthenticated: !!localStorage.getItem('token'),
};

export const register = createAsyncThunk(
  'auth/register',
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const response = await authAPI.register(formData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.title || 'Registration failed');
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await authAPI.login(credentials);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.title || 'Login failed');
    }
  }
);

// Google Login Business (من الصورة - للاستخدام في صفحات التسجيل)
export const googleLoginBusiness = createAsyncThunk(
  'auth/googleLoginBusiness',
  async (data: { provider: string; idToken: string }, { rejectWithValue }) => {
    try {
      const response = await authAPI.googleLoginBusiness(data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.title || 'Google login failed');
    }
  }
);

// Google Login (الأصلي)
export const googleLogin = createAsyncThunk(
  'auth/googleLogin',
  async (data: { provider: string; idToken: string }, { rejectWithValue }) => {
    try {
      const response = await authAPI.googleLogin(data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.title || 'Google login failed');
    }
  }
);

export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authAPI.getCurrentUser();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.title || 'Failed to fetch user');
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authAPI.logout();
      return null;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.title || 'Logout failed');
    }
  }
);

export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async (data: { currentPassword: string; newPassword: string; confirmNewPassword: string }, { rejectWithValue }) => {
    try {
      await authAPI.changePassword(data);
      return null;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.title || 'Password change failed');
    }
  }
);

export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (email: string, { rejectWithValue }) => {
    try {
      await authAPI.forgotPassword(email);
      return null;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.title || 'Failed to send reset email');
    }
  }
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (data: { email: string; token: string; newPassword: string; confirmPassword: string }, { rejectWithValue }) => {
    try {
      await authAPI.resetPassword(data);
      return null;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.title || 'Password reset failed');
    }
  }
);

export const checkEmail = createAsyncThunk(
  'auth/checkEmail',
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await authAPI.checkEmail(email);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.title || 'Failed to check email');
    }
  }
);

export const resendConfirmation = createAsyncThunk(
  'auth/resendConfirmation',
  async (email: string, { rejectWithValue }) => {
    try {
      await authAPI.resendConfirmation(email);
      return null;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.title || 'Failed to resend confirmation');
    }
  }
);

export const createAdmin = createAsyncThunk(
  'auth/createAdmin',
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const response = await authAPI.createAdmin(formData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.title || 'Failed to create admin');
    }
  }
);

export const makeAdmin = createAsyncThunk(
  'auth/makeAdmin',
  async (email: string, { rejectWithValue }) => {
    try {
      await authAPI.makeAdmin(email);
      return null;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.title || 'Failed to make admin');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCredentials: (state, action) => {
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('refreshToken', action.payload.refreshToken);
    },
    logoutLocal: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = true;
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('refreshToken', action.payload.refreshToken);
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Google Login Business
      .addCase(googleLoginBusiness.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(googleLoginBusiness.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = true;
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('refreshToken', action.payload.refreshToken);
      })
      .addCase(googleLoginBusiness.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Google Login
      .addCase(googleLogin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(googleLogin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = true;
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('refreshToken', action.payload.refreshToken);
      })
      .addCase(googleLogin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Get Current User
      .addCase(getCurrentUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
        state.token = null;
        state.refreshToken = null;
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
      })
      // Create Admin
      .addCase(createAdmin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createAdmin.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(createAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Make Admin
      .addCase(makeAdmin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(makeAdmin.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(makeAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setCredentials, logoutLocal } = authSlice.actions;
export default authSlice.reducer;