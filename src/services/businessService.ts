import axiosInstance from './axiosInstance';

export interface BusinessProfile {
  id: string;
  brandName: string;
  legalName: string;
  commercialRegNumber: string;
  taxNumber: string;
  logoImage: string | null;
  verificationStatus: string;
  rejectionReason: string | null;
}

export const businessAPI = {
  submitOnboarding: async (data: FormData) => {
    const response = await axiosInstance.post('/api/Business/onboarding', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  getProfile: async (): Promise<BusinessProfile> => {
    const response = await axiosInstance.get('/api/Business/profile');
    return response.data.data;
  },

  updateProfile: async (brandName: string, legalName: string, logoFile?: File): Promise<void> => {
    const fd = new FormData();
    fd.append('BrandName', brandName);
    fd.append('LegalName', legalName);
    if (logoFile) fd.append('NewLogoImage', logoFile);
    await axiosInstance.put('/api/Business/profile', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  changePassword: async (currentPassword: string, newPassword: string, confirmNewPassword: string): Promise<void> => {
    await axiosInstance.post('/api/web/auth/change-password', {
      currentPassword,
      newPassword,
      confirmNewPassword,
    });
  },
};