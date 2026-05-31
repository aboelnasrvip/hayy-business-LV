import axiosInstance from './axiosInstance';

export interface Offer {
  id: string;
  placeId: string;
  title: string;
  description: string;
  galleryImages: string;
  discount: number;
  startDate: string;
  endDate: string;
  status: string;
}

export interface CreateOfferRequest {
  placeId: string;
  title: string;
  description: string;
  galleryImages?: string;
  discount: number;
  startDate: string;
  endDate: string;
}

export const offersAPI = {
  getByPlace: async (placeId: string): Promise<Offer[]> => {
    const response = await axiosInstance.get(`/api/Offers/place/${placeId}`);
    return response.data;
  },

  create: async (data: CreateOfferRequest): Promise<Offer> => {
    const response = await axiosInstance.post('/api/Offers', data);
    return response.data;
  },

  update: async (id: string, data: Partial<CreateOfferRequest>): Promise<Offer> => {
    const response = await axiosInstance.put(`/api/Offers/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/api/Offers/${id}`);
  },
};