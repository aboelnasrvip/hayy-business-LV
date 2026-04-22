import axiosInstance from './axiosInstance';

export interface Place {
  id: string;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  coverImage?: string;
  categoryId: string;
  businessId: string;
  tagIds: string[];
  openingHours: OpeningHour[];
  createdAt?: string;
}

export interface OpeningHour {
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, etc.
  openTime: string;  // "09:00"
  closeTime: string; // "18:00"
}

export interface CreatePlaceRequest {
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  coverImage?: string;
  categoryId: string;
  businessId: string;
  tagIds: string[];
  openingHours: OpeningHour[];
}

export const placesAPI = {
  // Get all places
  getPlaces: async (): Promise<Place[]> => {
    const response = await axiosInstance.get('/api/Places');
    return response.data;
  },

  // Get place by ID
  getPlaceById: async (id: string): Promise<Place> => {
    const response = await axiosInstance.get(`/api/Places/${id}`);
    return response.data;
  },

  // Create new place
  createPlace: async (data: CreatePlaceRequest): Promise<Place> => {
    const response = await axiosInstance.post('/api/Places', data);
    return response.data;
  },

  // Get places by category
  getPlacesByCategory: async (categoryId: string): Promise<Place[]> => {
    const response = await axiosInstance.get(`/api/Places/category/${categoryId}`);
    return response.data;
  },
};