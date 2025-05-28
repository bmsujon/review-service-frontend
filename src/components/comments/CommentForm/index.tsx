import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { commentService } from '../../../services/commentService';
import toast from 'react-hot-toast';

interface CommentFormProps {
  reviewId: number;
  parentId?: number;
  onSuccess?: () => void;
}

const CommentForm = ({ reviewId, parentId, onSuccess }: CommentFormProps) => {
  const [content, setContent] = useState('');
  const queryClient = useQueryClient();

  const { mutate: submitComment, isPending } = useMutation({
    mutationFn: () => commentService.createComment(reviewId, content, parentId),
    onSuccess: () => {
      setContent('');
      queryClient.invalidateQueries({ queryKey: ['comments', reviewId] });
      toast.success('Comment posted successfully');
      onSuccess?.();
    },
    onError: () => {
      toast.error('Failed to post comment');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      toast.error('Please enter a comment');
      return;
    }
    submitComment();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your comment..."
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:shadow-[0_0_0_2px_theme(colors.blue.500)]"
          rows={4}
        />
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isPending}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isPending ? 'Posting...' : 'Post Comment'}
        </button>
      </div>
    </form>
  );
};

export default CommentForm; 