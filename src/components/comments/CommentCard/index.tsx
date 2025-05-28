import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { commentService } from '../../../services/commentService';
import toast from 'react-hot-toast';
import type { Comment } from '../../../types';
import CommentForm from '../CommentForm';

interface CommentCardProps {
  comment: Comment;
  reviewId: number;
  isReply?: boolean;
}

const CommentCard = ({ comment, reviewId, isReply = false }: CommentCardProps) => {
  const [isReplying, setIsReplying] = useState(false);
  const queryClient = useQueryClient();

  const { mutate: likeComment } = useMutation({
    mutationFn: () => commentService.likeComment(reviewId, comment.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', reviewId] });
      toast.success('Comment liked');
    },
    onError: () => {
      toast.error('Failed to like comment');
    },
  });

  const { mutate: dislikeComment } = useMutation({
    mutationFn: () => commentService.dislikeComment(reviewId, comment.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', reviewId] });
      toast.success('Comment disliked');
    },
    onError: () => {
      toast.error('Failed to dislike comment');
    },
  });

  return (
    <div className={`bg-gray-50 rounded-lg p-4 ${isReply ? 'border-l-4 border-blue-200' : ''}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <span className="font-medium text-gray-900">{comment.commenterName}</span>
          <span className="text-sm text-gray-500">
            {new Date(comment.createdAt).toLocaleDateString()}
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => likeComment()}
            className="flex items-center space-x-1 hover:text-blue-600"
          >
            <span>👍</span>
            <span>{comment.likeCount}</span>
          </button>
          <button 
            onClick={() => dislikeComment()}
            className="flex items-center space-x-1 hover:text-blue-600"
          >
            <span>👎</span>
            <span>{comment.dislikeCount}</span>
          </button>
        </div>
      </div>

      <p className="text-gray-700 mb-4">{comment.content}</p>

      {!isReply && (
        <>
          <button
            onClick={() => setIsReplying(!isReplying)}
            className="text-sm text-blue-600 hover:text-blue-800 mb-4"
          >
            {isReplying ? 'Cancel Reply' : 'Reply'}
          </button>

          {isReplying && (
            <div className="mt-4">
              <CommentForm 
                reviewId={reviewId} 
                parentId={comment.id}
                onSuccess={() => setIsReplying(false)}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CommentCard; 