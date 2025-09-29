import api from './api';
import { 
  Post, 
  PostsResponse, 
  CreatePostRequest, 
  UpdatePostRequest 
} from '../types';

export interface PostQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  search?: string;
  tags?: string;
  authorId?: number;
}

export const postService = {
  async getPosts(query: PostQuery = {}): Promise<PostsResponse> {
    const params = new URLSearchParams();
    
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined) {
        params.append(key, value.toString());
      }
    });
    
    const response = await api.get<PostsResponse>(`/posts?${params.toString()}`);
    return response.data;
  },

  async getPostById(id: number): Promise<{
    tags: { post: Post; } | undefined; post: Post 
}> {
    const response = await api.get<{ post: Post }>(`/posts/${id}`);
    return response.data;
  },

  async createPost(postData: CreatePostRequest): Promise<{ message: string; post: Post }> {
    const response = await api.post<{ message: string; post: Post }>('/posts', postData);
    return response.data;
  },

  async updatePost(id: number, postData: UpdatePostRequest): Promise<{ message: string; post: Post }> {
    const response = await api.put<{ message: string; post: Post }>(`/posts/${id}`, postData);
    return response.data;
  },

  async deletePost(id: number): Promise<{ message: string }> {
    const response = await api.delete<{ message: string }>(`/posts/${id}`);
    return response.data;
  },

  async likePost(id: number): Promise<{ message: string; liked: boolean }> {
    const response = await api.post<{ message: string; liked: boolean }>(`/posts/${id}/like`);
    return response.data;
  },
};