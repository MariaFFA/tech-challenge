import { Request } from 'express';
import { ParsedQs } from 'qs';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
    username: string;
  };
}

export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface CreatePostRequest {
  title: string;
  content: string;
  excerpt?: string;
  imageUrl?: string;
  tags?: string[];
}

export interface UpdatePostRequest {
  title?: string;
  content?: string;
  excerpt?: string;
  imageUrl?: string;
  tags?: string[];
}

export interface CreateCommentRequest {
  content: string;
  postId: number;
  parentId?: number;
}

export interface PaginationQuery {
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface PostQuery extends ParsedQs {
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  search?: string;
  tags?: string;
  authorId?: string;
}
export interface JWTPayload {
  id: number;
  email: string;
  username: string;
  iat: number;
  exp: number;
}

export interface S3UploadResult {
  Location: string;
  ETag: string;
  Bucket: string;
  Key: string;
}