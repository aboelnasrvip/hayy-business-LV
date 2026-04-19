import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import businessReducer from './slices/businessSlice';
import paymentReducer from './slices/paymentSlice';



export const store = configureStore({
  reducer: {
    auth: authReducer,
    business: businessReducer,
    payment: paymentReducer,


  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;