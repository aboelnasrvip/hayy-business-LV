import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { businessAPI } from '@/services/businessService';

interface BusinessState {
  isLoading: boolean;
  error: string | null;
  onboardingStatus: 'idle' | 'pending' | 'approved' | 'rejected';
}

const initialState: BusinessState = {
  isLoading: false,
  error: null,
  onboardingStatus: 'idle',
};

// Submit Onboarding
export const submitOnboarding = createAsyncThunk(
  'business/submitOnboarding',
  async (data: FormData, { rejectWithValue }) => {
    try {
      const response = await businessAPI.submitOnboarding(data);
      return response;
    } catch (error: any) {
      const message = error.response?.data?.title || error.message || 'Submission failed';
      return rejectWithValue(message);
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitOnboarding.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(submitOnboarding.fulfilled, (state) => {
        state.isLoading = false;
        state.onboardingStatus = 'pending';
      })
      .addCase(submitOnboarding.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = businessSlice.actions;
export default businessSlice.reducer;