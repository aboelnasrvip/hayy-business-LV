import axiosInstance from './axiosInstance';

export interface Place {
  id: string;
  name: string;
  description: string;
  coverImage?: string;
  rating: number;
  categoryName: string;
  latitude: number;
  longitude: number;
  tags: string[];
  openingHours: OpeningHour[];
}

export interface OpeningHour {
  dayOfWeek: number;
  openTime: string;
  closeTime: string;
}

export interface CreatePlaceRequest {
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  coverImage?: string;
  categoryId: string | null;
  businessId: string;
  tagIds: string[];
  openingHours: OpeningHour[];
}

/* ── builds FormData from CreatePlaceRequest + optional File ── */
const buildFormData = (data: CreatePlaceRequest, imageFile?: File): FormData => {
  const fd = new FormData();
  fd.append('name', data.name);
  fd.append('description', data.description);
  fd.append('latitude', String(data.latitude));
  fd.append('longitude', String(data.longitude));
  fd.append('businessId', data.businessId);
  if (data.categoryId) fd.append('categoryId', data.categoryId);
  if (imageFile) {
    fd.append('coverImage', imageFile);
  } else if (data.coverImage && !data.coverImage.startsWith('data:')) {
    fd.append('coverImage', data.coverImage);
  }
  data.tagIds.forEach(id => fd.append('tagIds', id));
  data.openingHours.forEach((h, i) => {
    fd.append(`openingHours[${i}].dayOfWeek`, String(h.dayOfWeek));
    fd.append(`openingHours[${i}].openTime`, h.openTime);
    fd.append(`openingHours[${i}].closeTime`, h.closeTime);
  });
  return fd;
};

export const placesAPI = {
  getMyPlaces: async (): Promise<Place[]> => {
    const response = await axiosInstance.get('/api/Places/my-places');
    return response.data;
  },

  getPlaceById: async (id: string): Promise<Place> => {
    const response = await axiosInstance.get(`/api/Places/${id}`);
    return response.data;
  },

  createPlace: async (data: CreatePlaceRequest, imageFile?: File): Promise<Place> => {
    const response = await axiosInstance.post('/api/Places', buildFormData(data, imageFile), {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  updatePlace: async (id: string, data: CreatePlaceRequest, imageFile?: File): Promise<Place> => {
    const response = await axiosInstance.put(`/api/Places/${id}`, buildFormData(data, imageFile), {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  deletePlace: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/api/Places/${id}`);
  },
};