import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewService } from '../services/reviewService';
import type { Review, ReviewFilters } from '../types';
import toast from 'react-hot-toast';

export const useReviews = (filters: ReviewFilters = {}) => {
  const queryClient = useQueryClient();

  const {
    data: reviews,
    isLoading,
    error
  } = useQuery({
    queryKey: ['reviews', filters],
    queryFn: () => reviewService.getReviews(filters)
  });

  const createReviewMutation = useMutation({
    mutationFn: reviewService.createReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      toast.success('Review created successfully!');
    },
    onError: (error) => {
      toast.error('Failed to create review. Please try again.');
      console.error('Create review error:', error);
    }
  });

  const likeReviewMutation = useMutation({
    mutationFn: reviewService.likeReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
    onError: (error) => {
      toast.error('Failed to like review. Please try again.');
      console.error('Like review error:', error);
    }
  });

  const dislikeReviewMutation = useMutation({
    mutationFn: reviewService.dislikeReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
    onError: (error) => {
      toast.error('Failed to dislike review. Please try again.');
      console.error('Dislike review error:', error);
    }
  });

  return {
    reviews,
    isLoading,
    error,
    createReview: createReviewMutation.mutate,
    likeReview: likeReviewMutation.mutate,
    dislikeReview: dislikeReviewMutation.mutate,
    isCreating: createReviewMutation.isPending,
    isLiking: likeReviewMutation.isPending,
    isDisliking: dislikeReviewMutation.isPending
  };
}; 