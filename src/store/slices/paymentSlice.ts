import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { paymentAPI, SubscriptionPlan, InitiatePaymentRequest } from '@/services/paymentService';
import { setSubscriptionStatus } from './authSlice';

interface PaymentState {
  plans: SubscriptionPlan[];
  selectedPlan: SubscriptionPlan | null;
  isLoading: boolean;
  error: string | null;
  isProcessing: boolean;
}

const initialState: PaymentState = {
  plans: [],
  selectedPlan: null,
  isLoading: false,
  error: null,
  isProcessing: false,
};

export const fetchSubscriptionPlans = createAsyncThunk(
  'payment/fetchPlans',
  async (_, { rejectWithValue }) => {
    try {
      const response = await paymentAPI.getSubscriptionPlans();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.title || 'Failed to fetch plans');
    }
  }
);

export const initiatePayment = createAsyncThunk(
  'payment/initiatePayment',
  async (data: InitiatePaymentRequest, { rejectWithValue }) => {
    try {
      const response = await paymentAPI.initiatePayment(data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.title || 'Payment initiation failed');
    }
  }
);

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    selectPlan: (state, action) => {
      state.selectedPlan = action.payload;
    },
    clearSelectedPlan: (state) => {
      state.selectedPlan = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubscriptionPlans.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSubscriptionPlans.fulfilled, (state, action) => {
        state.isLoading = false;
        state.plans = action.payload;
      })
      .addCase(fetchSubscriptionPlans.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(initiatePayment.pending, (state) => {
        state.isProcessing = true;
        state.error = null;
      })
      .addCase(initiatePayment.fulfilled, (state) => {
        state.isProcessing = false;
      })
      .addCase(initiatePayment.rejected, (state, action) => {
        state.isProcessing = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, selectPlan, clearSelectedPlan } = paymentSlice.actions;
export default paymentSlice.reducer;