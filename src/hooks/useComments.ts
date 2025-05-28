import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { commentService } from '../services/commentService';
import type { Comment } from '../types';
import toast from 'react-hot-toast';

export const useComments = (reviewId: number, page = 0, size = 10) => {
  const queryClient = useQueryClient();

  const {
    data: comments,
    isLoading,
    error
  } = useQuery({
    queryKey: ['comments', reviewId, page, size],
    queryFn: () => commentService.getComments(reviewId, page, size)
  });

  const createCommentMutation = useMutation({
    mutationFn: ({ content, parentId }: { content: string; parentId?: number }) =>
      commentService.createComment(reviewId, { content, parentId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', reviewId] });
      toast.success('Comment added successfully!');
    },
    onError: (error) => {
      toast.error('Failed to add comment. Please try again.');
      console.error('Create comment error:', error);
    }
  });

  const likeCommentMutation = useMutation({
    mutationFn: (commentId: number) => commentService.likeComment(reviewId, commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', reviewId] });
    },
    onError: (error) => {
      toast.error('Failed to like comment. Please try again.');
      console.error('Like comment error:', error);
    }
  });

  const dislikeCommentMutation = useMutation({
    mutationFn: (commentId: number) => commentService.dislikeComment(reviewId, commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', reviewId] });
    },
    onError: (error) => {
      toast.error('Failed to dislike comment. Please try again.');
      console.error('Dislike comment error:', error);
    }
  });

  return {
    comments,
    isLoading,
    error,
    createComment: createCommentMutation.mutate,
    likeComment: likeCommentMutation.mutate,
    dislikeComment: dislikeCommentMutation.mutate,
    isCreating: createCommentMutation.isPending,
    isLiking: likeCommentMutation.isPending,
    isDisliking: dislikeCommentMutation.isPending
  };
}; 