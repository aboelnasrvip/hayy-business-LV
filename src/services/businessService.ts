import axiosInstance from './axiosInstance';

export const businessAPI = {
  // ✅ Submit Business Onboarding
  submitOnboarding: async (data: FormData) => {
    const response = await axiosInstance.post('/api/Business/onboarding', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};