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

export const placesAPI = {
  getMyPlaces: async (): Promise<Place[]> => {
    const response = await axiosInstance.get('/api/Places/my-places');
    return response.data;
  },

  getPlaceById: async (id: string): Promise<Place> => {
    const response = await axiosInstance.get(`/api/Places/${id}`);
    return response.data;
  },

  createPlace: async (data: CreatePlaceRequest): Promise<Place> => {
    const response = await axiosInstance.post('/api/Places', data);
    return response.data;
  },

  updatePlace: async (id: string, data: CreatePlaceRequest): Promise<Place> => {
    const response = await axiosInstance.put(`/api/Places/${id}`, data);
    return response.data;
  },

  deletePlace: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/api/Places/${id}`);
  },
};