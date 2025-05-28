import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewService } from '../../services/reviewService';
import { commentService } from '../../services/commentService';
import Loading from '../../components/common/Loading';
import CommentList from '../../components/comments/CommentList';
import CommentForm from '../../components/comments/CommentForm';
import toast from 'react-hot-toast';

const ReviewDetail = () => {
  const { id } = useParams<{ id: string }>();
  const reviewId = parseInt(id || '0');
  const queryClient = useQueryClient();

  const { data: review, isLoading: isLoadingReview } = useQuery({
    queryKey: ['review', reviewId],
    queryFn: () => reviewService.getReviewById(reviewId),
    enabled: !!reviewId,
  });

  const { data: commentsData, isLoading: isLoadingComments } = useQuery({
    queryKey: ['comments', reviewId],
    queryFn: () => commentService.getComments(reviewId),
    enabled: !!reviewId,
  });

  const likeMutation = useMutation({
    mutationFn: () => reviewService.likeReview(reviewId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['review', reviewId] });
      toast.success('Review liked');
    },
    onError: () => {
      toast.error('Failed to like review');
    },
  });

  const dislikeMutation = useMutation({
    mutationFn: () => reviewService.dislikeReview(reviewId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['review', reviewId] });
      toast.success('Review disliked');
    },
    onError: () => {
      toast.error('Failed to dislike review');
    },
  });

  if (isLoadingReview || isLoadingComments) {
    return <Loading />;
  }

  if (!review) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Review not found</h2>
      </div>
    );
  }

  // Determine employment status based on dates
  const getEmploymentStatus = () => {
    if (!review.isEmployee) return null;
    if (review.workEndDate) return 'Former Employee';
    return 'Employee';
  };

  const employmentStatus = getEmploymentStatus();

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Review Content */}
      <article className="bg-white rounded-lg shadow-md p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">{review.title}</h1>
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => likeMutation.mutate()}
              disabled={likeMutation.isPending}
              className="flex items-center space-x-1 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>👍</span>
              <span>{review.likeCount}</span>
            </button>
            <button 
              onClick={() => dislikeMutation.mutate()}
              disabled={dislikeMutation.isPending}
              className="flex items-center space-x-1 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>👎</span>
              <span>{review.dislikeCount}</span>
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6 text-gray-600">
          <div className="flex items-center space-x-4">
            <span>By {review.reviewerName}</span>
            <span>•</span>
            <span>{new Date(review.createdAt).toLocaleDateString()}</span>
            {employmentStatus && (
              <span className="px-2 py-1 text-xs font-medium text-blue-600 bg-blue-100 rounded-full">
                {employmentStatus}
              </span>
            )}
          </div>
          <a 
            href={`/companies/${review.companyName}/reviews`}
            className="text-blue-600 hover:text-blue-800"
          >
            {review.companyName}
          </a>
        </div>

        <div className="prose max-w-none">
          <div 
            className="text-gray-700"
            dangerouslySetInnerHTML={{ __html: review.contentHtml }}
          />
        </div>

        {review.isEmployee && review.dept && review.role && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Employee Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-gray-600">Department:</span>
                <span className="ml-2 font-medium">{review.dept}</span>
              </div>
              <div>
                <span className="text-gray-600">Role:</span>
                <span className="ml-2 font-medium">{review.role}</span>
              </div>
              {review.workStartDate && (
                <div>
                  <span className="text-gray-600">Start Date:</span>
                  <span className="ml-2 font-medium">
                    {new Date(review.workStartDate).toLocaleDateString()}
                  </span>
                </div>
              )}
              {review.workEndDate && (
                <div>
                  <span className="text-gray-600">End Date:</span>
                  <span className="ml-2 font-medium">
                    {new Date(review.workEndDate).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </article>

      {/* Comments Section */}
      <section className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Comments</h2>
        
        <CommentForm reviewId={reviewId} />
        
        <div className="mt-8">
          <CommentList 
            comments={commentsData?.content || []} 
            reviewId={reviewId} 
          />
          {commentsData?.content.length === 0 && (
            <p className="text-gray-500 text-center py-4">No comments yet. Be the first to comment!</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default ReviewDetail; 