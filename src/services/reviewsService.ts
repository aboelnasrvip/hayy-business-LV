import axiosInstance from "./axiosInstance";

export interface Review {
  id: string;
  userId: string;
  userName: string;
  placeId: string;
  rating: number;
  comment: string;
  reviewImages: string;
  createdAt: string;
}

export interface ReviewsResponse {
  data: Review[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ReviewReply {
  id: string;
  reviewId: string;
  replyText: string;
  replierId: string;
  createdAt: string;
}

export interface ReviewRepliesResponse {
  data: ReviewReply[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export const reviewsAPI = {
  getByPlace: async (placeId: string, page = 1): Promise<ReviewsResponse> => {
    const response = await axiosInstance.get(
      `/api/Reviews/${placeId}?page=${page}&pageSize=20`
    );
    return response.data;
  },

  getReplies: async (reviewId: string): Promise<ReviewRepliesResponse> => {
    const response = await axiosInstance.get(`/api/ReviewReplies/${reviewId}`);
    return response.data;
  },

  createReply: async (reviewId: string, replyText: string): Promise<void> => {
    await axiosInstance.post("/api/ReviewReplies", { reviewId, replyText });
  },

  updateReply: async (replyId: string, replyText: string): Promise<void> => {
    await axiosInstance.put(`/api/ReviewReplies/${replyId}`, { replyText });
  },

  deleteReply: async (replyId: string): Promise<void> => {
    await axiosInstance.delete(`/api/ReviewReplies/${replyId}`);
  },
};