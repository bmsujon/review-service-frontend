import { useState } from 'react';
import type { Comment } from '../../../types';
import CommentCard from '../CommentCard';

interface CommentListProps {
  comments: Comment[];
  reviewId: number;
}

const CommentList = ({ comments, reviewId }: CommentListProps) => {
  const [expandedReplies, setExpandedReplies] = useState<number[]>([]);

  const toggleReplies = (commentId: number) => {
    setExpandedReplies(prev =>
      prev.includes(commentId)
        ? prev.filter(id => id !== commentId)
        : [...prev, commentId]
    );
  };

  const topLevelComments = comments.filter(comment => !comment.parentId);
  const replies = comments.filter(comment => comment.parentId);

  return (
    <div className="space-y-6">
      {topLevelComments.map(comment => (
        <div key={comment.id}>
          <CommentCard comment={comment} reviewId={reviewId} />
          
          {/* Replies */}
          {replies.some(reply => reply.parentId === comment.id) && (
            <div className="ml-8 mt-4">
              <button
                onClick={() => toggleReplies(comment.id)}
                className="text-sm text-blue-600 hover:text-blue-800 mb-2"
              >
                {expandedReplies.includes(comment.id) ? 'Hide replies' : 'Show replies'}
              </button>
              
              {expandedReplies.includes(comment.id) && (
                <div className="space-y-4">
                  {replies
                    .filter(reply => reply.parentId === comment.id)
                    .map(reply => (
                      <CommentCard
                        key={reply.id}
                        comment={reply}
                        reviewId={reviewId}
                        isReply
                      />
                    ))}
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CommentList; 