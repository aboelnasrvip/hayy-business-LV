import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { paymentAPI, SubscriptionPlan, PaymentInitiateRequest } from '@/services/paymentService';

interface PaymentState {
  plans: SubscriptionPlan[];
  selectedPlan: SubscriptionPlan | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: PaymentState = {
  plans: [],
  selectedPlan: null,
  isLoading: false,
  error: null,
};

// ✅ Fetch All Subscription Plans
export const fetchSubscriptionPlans = createAsyncThunk(
  'payment/fetchPlans',
  async (_, { rejectWithValue }) => {
    try {
      const plans = await paymentAPI.getPlans();
      return plans;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch plans');
    }
  }
);

// ✅ Fetch Plan By ID
export const fetchPlanById = createAsyncThunk(
  'payment/fetchPlanById',
  async (id: string, { rejectWithValue }) => {
    try {
      const plan = await paymentAPI.getPlanById(id);
      return plan;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch plan');
    }
  }
);

// ✅ Initiate Payment
export const initiatePayment = createAsyncThunk(
  'payment/initiate',
  async (data: PaymentInitiateRequest, { rejectWithValue }) => {
    try {
      const response = await paymentAPI.initiatePayment(data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Payment initiation failed');
    }
  }
);

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    selectPlan: (state, action: PayloadAction<SubscriptionPlan>) => {
      state.selectedPlan = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedPlan: (state) => {
      state.selectedPlan = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Plans
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

      // Fetch Plan By ID
      .addCase(fetchPlanById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPlanById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedPlan = action.payload;
      })
      .addCase(fetchPlanById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Initiate Payment
      .addCase(initiatePayment.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(initiatePayment.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(initiatePayment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { selectPlan, clearError, clearSelectedPlan } = paymentSlice.actions;
export default paymentSlice.reducer;