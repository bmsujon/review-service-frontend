import api from './api';
import type { Comment, PaginatedResponse } from '../types';

export const commentService = {
  getComments: async (reviewId: number, page = 0, limit = 10): Promise<PaginatedResponse<Comment>> => {
    const response = await api.get(`/reviews/${reviewId}/comments`, {
      params: { page, limit },
    });
    return response.data;
  },

  getReplies: async (reviewId: number, commentId: number, page = 0, size = 10): Promise<PaginatedResponse<Comment>> => {
    const { data } = await api.get(`/reviews/${reviewId}/comments/${commentId}/replies`, {
      params: { page, size }
    });
    return data;
  },

  createComment: async (reviewId: number, content: string, parentId?: number): Promise<Comment> => {
    const response = await api.post(`/reviews/${reviewId}/comments`, {
      content,
      parentId,
    });
    return response.data;
  },

  updateComment: async (reviewId: number, commentId: number, content: string): Promise<Comment> => {
    const response = await api.put(`/reviews/${reviewId}/comments/${commentId}`, {
      content,
    });
    return response.data;
  },

  deleteComment: async (reviewId: number, commentId: number): Promise<void> => {
    await api.delete(`/reviews/${reviewId}/comments/${commentId}`);
  },

  likeComment: async (reviewId: number, commentId: number): Promise<Comment> => {
    const response = await api.post(`/reviews/${reviewId}/comments/${commentId}/like`);
    return response.data;
  },

  dislikeComment: async (reviewId: number, commentId: number): Promise<Comment> => {
    const response = await api.post(`/reviews/${reviewId}/comments/${commentId}/dislike`);
    return response.data;
  },
}; 