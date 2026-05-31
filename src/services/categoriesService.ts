import axiosInstance from './axiosInstance';

export interface Category {
  id: string;
  name: string;
  imageUrl: string;
  tags: { id: string; name: string }[];
}

export const categoriesAPI = {
  getAll: async (): Promise<Category[]> => {
    const response = await axiosInstance.get('/api/Categories/Get All');
    return response.data;
  },
};