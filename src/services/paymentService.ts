import axiosInstance from './axiosInstance';

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  durationDays: number;
  aiPowerLevel: number;
  isActive: boolean;
}

export interface PaymentInitiateRequest {
  planId: string;
  businessId: string;
  eventBookingId?: string;
}

export interface PaymentInitiateResponse {
  paymentUrl: string;
  orderId: string;
}

export interface PaymobWebhookPayload {
  type: string;
  obj: {
    id: number;
    order: {
      id: number;
    };
    success: boolean;
    amount_cents: number;
    currency: string;
    created_at: string;
    error_occured: boolean;
    source_data: {
      pan: string;
      sub_type: string;
      type: string;
    };
    has_parent_transaction: boolean;
    integration_id: number;
    is_3d_secure: boolean;
    is_auth: boolean;
    is_capture: boolean;
    is_refunded: boolean;
    is_standalone_payment: boolean;
    is_voided: boolean;
    owner: number;
    pending: boolean;
  };
  hmac: string;
}

export const paymentAPI = {
  // ✅ GET /api/SubscriptionPlans - جلب كل الخطط
  getPlans: async (): Promise<SubscriptionPlan[]> => {
    const response = await axiosInstance.get('/api/SubscriptionPlans');
    return response.data;
  },

  // ✅ GET /api/SubscriptionPlans/{id} - جلب خطة محددة
  getPlanById: async (id: string): Promise<SubscriptionPlan> => {
    const response = await axiosInstance.get(`/api/SubscriptionPlans/${id}`);
    return response.data;
  },

  // ✅ POST /api/Payments/initiate - بدء عملية الدفع
  initiatePayment: async (data: PaymentInitiateRequest): Promise<PaymentInitiateResponse> => {
    const response = await axiosInstance.post('/api/Payments/initiate', data);
    return response.data;
  },

  // ✅ POST /api/Payments/webhook - معالجة Webhook من Paymob
  handleWebhook: async (data: PaymobWebhookPayload, hmac: string) => {
    const response = await axiosInstance.post(`/api/Payments/webhook?hmac=${hmac}`, data);
    return response.data;
  },
};