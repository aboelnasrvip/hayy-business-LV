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
  discount: number;
  startDate: string;
  endDate: string;
}

const buildFormData = (data: CreateOfferRequest, imageFile?: File) => {
  const fd = new FormData();
  fd.append('PlaceId', data.placeId);
  fd.append('Title', data.title);
  fd.append('Description', data.description);
  fd.append('Discount', String(data.discount));
  fd.append('StartDate', data.startDate);
  fd.append('EndDate', data.endDate);
  if (imageFile) fd.append('ImageFile', imageFile);
  return fd;
};

export const offersAPI = {
  getByPlace: async (placeId: string): Promise<Offer[]> => {
    const response = await axiosInstance.get(`/api/Offers/place/${placeId}`);
    return response.data;
  },

  create: async (data: CreateOfferRequest, imageFile?: File): Promise<Offer> => {
    const response = await axiosInstance.post('/api/Offers', buildFormData(data, imageFile), {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  update: async (
    id: string,
    data: CreateOfferRequest,
    imageFile?: File,
  ): Promise<Offer> => {
    const response = await axiosInstance.put(
      `/api/Offers/${id}`,
      buildFormData(data, imageFile),
      { headers: { 'Content-Type': 'multipart/form-data' } },
    );
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/api/Offers/${id}`);
  },
};
