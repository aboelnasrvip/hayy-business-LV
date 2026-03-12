import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { businessAPI } from '@/services/businessService';

export enum OnboardingStatus {
  Cancelled = 0,
  Completed = 1,
  Pending = 2,
}

interface BusinessState {
  status: OnboardingStatus | null;
  isLoading: boolean;
  error: string | null;
  isOnboarded: boolean;
}

const initialState: BusinessState = {
  status: null,
  isLoading: false,
  error: null,
  isOnboarded: false,
};

export const submitOnboarding = createAsyncThunk(
  'business/submitOnboarding',
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const response = await businessAPI.onboarding(formData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.title || 'Onboarding submission failed');
    }
  }
);

export const getOnboardingStatus = createAsyncThunk(
  'business/getStatus',
  async (_, { rejectWithValue }) => {
    try {
      const response = await businessAPI.getStatus();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.title || 'Failed to fetch status');
    }
  }
);

const businessSlice = createSlice({
  name: 'business',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setOnboardingStatus: (state, action) => {
      state.status = action.payload;
      state.isOnboarded = action.payload === OnboardingStatus.Completed;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitOnboarding.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(submitOnboarding.fulfilled, (state, action) => {
        state.isLoading = false;
        state.status = OnboardingStatus.Pending;
      })
      .addCase(submitOnboarding.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(getOnboardingStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOnboardingStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.status = action.payload.status;
        state.isOnboarded = action.payload.status === OnboardingStatus.Completed;
      })
      .addCase(getOnboardingStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setOnboardingStatus } = businessSlice.actions;
export default businessSlice.reducer;