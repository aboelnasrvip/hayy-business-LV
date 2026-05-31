import axiosInstance from "./axiosInstance";

export interface Post {
  id: string;
  content: string;
  postAttachments: string;
  createdAt: string;
  placeName: string | null;
  placeImage: string | null;
  likesCount: number;
  commentsCount: number;
  placeId: string;
}

export interface PostsResponse {
  data: Post[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface CreatePostRequest {
  placeId: string;
  content: string;
  postAttachments: string;
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  parentCommentId: string | null;
  content: string;
  userName: string;
  userImage: string | null;
  createdAt: string;
  replies: Comment[];
}

export const postsAPI = {
  getAllPosts: async (page = 1, pageSize = 10): Promise<PostsResponse> => {
    const response = await axiosInstance.get(
      `/api/BusinessPosts/all?page=${page}&pageSize=${pageSize}`,
    );
    return response.data;
  },

  getPostsByPlace: async (
    placeId: string,
    page = 1,
  ): Promise<PostsResponse> => {
    const response = await axiosInstance.get(
      `/api/BusinessPosts/${placeId}?page=${page}&pageSize=10`,
    );
    return response.data;
  },

  createPost: async (data: CreatePostRequest): Promise<Post> => {
    const response = await axiosInstance.post("/api/BusinessPosts", data);
    return response.data;
  },

  updatePost: async (
    postId: string,
    data: Partial<CreatePostRequest>,
  ): Promise<Post> => {
    const response = await axiosInstance.put(
      `/api/BusinessPosts/${postId}`,
      data,
    );
    return response.data;
  },

  deletePost: async (postId: string): Promise<void> => {
    await axiosInstance.delete(`/api/BusinessPosts/${postId}`);
  },

  getComments: async (postId: string): Promise<Comment[]> => {
    const response = await axiosInstance.get(
      `/api/BusinessPosts/${postId}/comments`,
    );
    return response.data;
  },

  replyToComment: async (commentId: string, content: string): Promise<void> => {
    await axiosInstance.post(`/api/BusinessPosts/${commentId}/reply`, { content });
  },
};

