import { Link } from 'react-router-dom';
import type { Review } from '../../../types';

interface ReviewCardProps {
  review: Review;
}

const ReviewCard = ({ review }: ReviewCardProps) => {
  const isUpdated = review.updatedAt !== review.createdAt;

  // Determine employment status based on dates
  const getEmploymentStatus = () => {
    if (!review.isEmployee) return null;
    if (review.workEndDate) return 'Former Employee';
    return 'Employee';
  };

  const employmentStatus = getEmploymentStatus();

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 p-6 relative group border border-gray-100 h-full flex flex-col">
      <Link 
        to={`/reviews/${review.id}`}
        className="absolute inset-0 z-0"
        aria-label={`View review: ${review.title}`}
      />
      <div className="relative z-10 flex flex-col h-full">
        {/* Header Section */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex flex-col space-y-2">
            <Link 
              to={`/reviews?companyName=${encodeURIComponent(review.companyName)}`}
              className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              {review.companyName}
            </Link>
            <div className="flex items-center space-x-2">
              <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                review.reviewType === 'POSITIVE' 
                  ? 'text-green-700 bg-green-50' 
                  : review.reviewType === 'NEGATIVE'
                  ? 'text-red-700 bg-red-50'
                  : 'text-yellow-700 bg-yellow-50'
              }`}>
                {review.reviewType}
              </span>
              {employmentStatus && (
                <span className="px-2.5 py-1 text-xs font-medium text-blue-700 bg-blue-50 rounded-full">
                  {employmentStatus}
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-col items-end space-y-1">
            <span className="text-sm text-gray-500">
              {new Date(review.createdAt).toLocaleDateString()}
            </span>
            {isUpdated && (
              <span className="text-xs text-gray-400">(Updated)</span>
            )}
          </div>
        </div>

        {/* Title Section */}
        <h2 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
          {review.title}
        </h2>

        {/* Content Section */}
        <div 
          className="text-gray-600 mb-4 line-clamp-3 prose prose-sm flex-grow"
          dangerouslySetInnerHTML={{ __html: review.contentHtml }}
        />

        {/* Footer Section */}
        <div className="flex items-center justify-between pt-4 mt-auto border-t border-gray-100">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-1.5 text-gray-500">
              <span className="text-base">👍</span>
              <span className="text-sm font-medium">{review.likeCount}</span>
            </div>
            <div className="flex items-center space-x-1.5 text-gray-500">
              <span className="text-base">👎</span>
              <span className="text-sm font-medium">{review.dislikeCount}</span>
            </div>
            {review.totalComments > 0 && (
              <div className="flex items-center space-x-1.5 text-gray-500">
                <span className="text-base">💬</span>
                <span className="text-sm font-medium">{review.totalComments}</span>
              </div>
            )}
          </div>
          <Link
            to={`/reviews/${review.id}`}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            onClick={(e) => e.stopPropagation()}
          >
            Read more
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard; 