import api from './api';
import type { Review, ReviewFilters, PaginatedResponse, CreateReviewPayload } from '../types';

interface ReviewStats {
  totalReviews: number;
  totalCompanies: number;
  activeUsers: number;
  reviewsThisMonth: number;
  totalLikes: number;
  totalDislikes: number;
  averageLikesPerReview: number;
  countByReviewType: Record<string, number>;
}

export const reviewService = {
  getReviews: async (filters: ReviewFilters = {}): Promise<PaginatedResponse<Review>> => {
    const { data } = await api.get('/reviews', { params: filters });
    return data;
  },

  getReviewById: async (id: number): Promise<Review> => {
    const { data } = await api.get(`/reviews/${id}`);
    return data;
  },

  createReview: async (review: CreateReviewPayload): Promise<Review> => {
    const { data } = await api.post('/reviews', review);
    return data;
  },

  likeReview: async (id: number): Promise<void> => {
    await api.put(`/reviews/${id}/like`);
  },

  dislikeReview: async (id: number): Promise<void> => {
    await api.put(`/reviews/${id}/dislike`);
  },

  getCompanyReviews: async (companyId: number, filters: Omit<ReviewFilters, 'companyName'> = {}): Promise<PaginatedResponse<Review>> => {
    const { data } = await api.get(`/companies/${companyId}/reviews`, { params: filters });
    return data;
  },

  getStats: async (): Promise<ReviewStats> => {
    const { data } = await api.get('/reviews/stats');
    return data;
  }
}; 