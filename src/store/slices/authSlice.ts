import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  authAPI,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
} from "@/services/authService";

interface User {
  id: string;
  fullName: string;
  email: string;
  userType?: string;
  isEmailConfirmed?: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  tokenExpiration: string | null;
  refreshTokenExpiration: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  verificationStatus: string | null;
  hasActiveSubscription: boolean;
}

const initialState: AuthState = {
  user: JSON.parse(localStorage.getItem("user") || "null"),
  token: localStorage.getItem("token"),
  refreshToken: localStorage.getItem("refreshToken"),
  tokenExpiration: localStorage.getItem("tokenExpiration"),
  refreshTokenExpiration: localStorage.getItem("refreshTokenExpiration"),
  isAuthenticated: !!localStorage.getItem("token"),
  isLoading: false,
  error: null,
  verificationStatus: localStorage.getItem("verificationStatus"),
  hasActiveSubscription: localStorage.getItem('hasActiveSubscription') === 'true',

};

// Login Thunk
export const login = createAsyncThunk(
  "auth/login",
  async (credentials: LoginRequest, { rejectWithValue }) => {
    try {
      const response: LoginResponse = await authAPI.login(credentials);
      return response;
    } catch (error: any) {
      const message =
        error.response?.data?.error ||
        error.response?.data?.title ||
        error.response?.data?.message ||
        error.message ||
        "Login failed";
      return rejectWithValue(message);
    }
  },
);

export const googleLoginBusiness = createAsyncThunk(
  "auth/googleLogin",
  async (idToken: string, { rejectWithValue }) => {
    try {
      const response: LoginResponse = await authAPI.googleLogin({
        provider: "Google",
        idToken,
      });
      return response;
    } catch (error: any) {
      const message =
        error.response?.data?.error ||
        error.response?.data?.title ||
        error.response?.data?.message ||
        error.message ||
        "Login failed";
      return rejectWithValue(message);
    }
  },
);

// Register Thunk
export const register = createAsyncThunk(
  "auth/register",
  async (userData: FormData | RegisterRequest, { rejectWithValue }) => {
    try {
      const response = await authAPI.register(userData);
      return response;
    } catch (error: any) {
      const message =
        error.response?.data?.error ||
        error.response?.data?.title ||
        error.response?.data?.message ||
        error.message ||
        "Registration failed";
      return rejectWithValue(message);
    }
  },
);

// Logout Thunk
export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await authAPI.logout();
    } catch (error: any) {
      console.error("Logout error:", error);
    } finally {
      localStorage.clear();
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setVerificationStatus: (state, action: PayloadAction<string>) => {
      state.verificationStatus = action.payload;
      localStorage.setItem("verificationStatus", action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
        state.tokenExpiration = action.payload.expiration;
        state.refreshTokenExpiration =
          action.payload.refreshTokenExpirationDateTime;
        state.isAuthenticated = true;
        state.verificationStatus = action.payload.verificationStatus;
        state.hasActiveSubscription = action.payload.hasActiveSubscription;
localStorage.setItem('hasActiveSubscription', String(action.payload.hasActiveSubscription));

        // ✅ استخدام الـ ID مباشرة من الـ Response
        state.user = {
          id: action.payload.id,
          fullName: action.payload.personName,
          email: action.payload.email,
          userType: action.payload.userType,
          isEmailConfirmed: true,
        };

        localStorage.setItem("user", JSON.stringify(state.user));
        localStorage.setItem("token", action.payload.token);
        localStorage.setItem("refreshToken", action.payload.refreshToken);
        localStorage.setItem("tokenExpiration", action.payload.expiration);
        localStorage.setItem(
          "refreshTokenExpiration",
          action.payload.refreshTokenExpirationDateTime,
        );
        localStorage.setItem(
          "verificationStatus",
          action.payload.verificationStatus,
        );
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      .addCase(googleLoginBusiness.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(googleLoginBusiness.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
        state.tokenExpiration = action.payload.expiration;
        state.refreshTokenExpiration =
          action.payload.refreshTokenExpirationDateTime;
        state.isAuthenticated = true;
        state.verificationStatus = action.payload.verificationStatus;
        state.hasActiveSubscription = action.payload.hasActiveSubscription;
localStorage.setItem('hasActiveSubscription', String(action.payload.hasActiveSubscription));
        state.user = {
          id: action.payload.id,
          fullName: action.payload.personName,
          email: action.payload.email,
          userType: action.payload.userType,
          isEmailConfirmed: true,
        };
        localStorage.setItem("user", JSON.stringify(state.user));
        localStorage.setItem("token", action.payload.token);
        localStorage.setItem("refreshToken", action.payload.refreshToken);
        localStorage.setItem("tokenExpiration", action.payload.expiration);
        localStorage.setItem(
          "refreshTokenExpiration",
          action.payload.refreshTokenExpirationDateTime,
        );
        localStorage.setItem(
          "verificationStatus",
          action.payload.verificationStatus,
        );
      })
      .addCase(googleLoginBusiness.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

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

      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.tokenExpiration = null;
        state.refreshTokenExpiration = null;
        state.isAuthenticated = false;
        state.verificationStatus = null;
        state.error = null;
        state.hasActiveSubscription = false;
      });
  },
});

export const { clearError, setVerificationStatus } = authSlice.actions;
export default authSlice.reducer;
