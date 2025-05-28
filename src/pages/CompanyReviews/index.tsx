import { useSearchParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { reviewService } from '../../services/reviewService';
import ReviewGrid from '../../components/home/ReviewGrid';
import Pagination from '../../components/common/Pagination';
import { useState } from 'react';
import { REVIEW_TYPES } from '../../constants';
import type { ReviewType } from '../../constants';

export const CompanyReviews = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const companyName = searchParams.get('companyName') || '';
  const [page, setPage] = useState(0);
  const [sort, setSort] = useState('createdAt,desc');
  const [searchQuery, setSearchQuery] = useState(companyName);
  const [reviewType, setReviewType] = useState<ReviewType | ''>('');
  const size = 10;

  const { data, isLoading, error } = useQuery({
    queryKey: ['reviews', companyName, page, sort, size, reviewType],
    queryFn: () => reviewService.getReviews({ 
      companyName, 
      page, 
      sort, 
      size,
      reviewType: reviewType || undefined 
    }),
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams({ companyName: searchQuery });
    setPage(0);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSort(e.target.value);
    setPage(0);
  };

  const handleReviewTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setReviewType(e.target.value as ReviewType | '');
    setPage(0);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading reviews...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Reviews</h2>
          <p className="text-gray-600 mb-8">
            We encountered an error while loading the reviews. Please try again later.
          </p>
          <Link 
            to="/"
            className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            {companyName ? `Reviews for ${companyName}` : 'All Reviews'}
          </h1>
          
          <form onSubmit={handleSearch} className="flex gap-4 mb-6">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by company name..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Search
            </button>
            {companyName && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSearchParams({});
                  setPage(0);
                }}
                className="px-6 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
              >
                Clear
              </button>
            )}
          </form>

          <div className="flex flex-wrap gap-4 items-center justify-between mb-6">
            <div className="flex gap-4">
              <select
                value={sort}
                onChange={handleSortChange}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="createdAt,desc">Newest First</option>
                <option value="createdAt,asc">Oldest First</option>
                <option value="likeCount,desc">Most Liked</option>
                <option value="dislikeCount,desc">Most Disliked</option>
              </select>

              <select
                value={reviewType}
                onChange={handleReviewTypeChange}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Review Types</option>
                <option value={REVIEW_TYPES.POSITIVE}>Positive</option>
                <option value={REVIEW_TYPES.MIXED}>Mixed</option>
                <option value={REVIEW_TYPES.NEGATIVE}>Negative</option>
              </select>
            </div>

            <Link 
              to="/submit-review"
              className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Write a Review
            </Link>
          </div>
        </div>

        {!data || data.empty ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No Reviews Found</h2>
            <p className="text-gray-600 mb-8">
              {companyName 
                ? `There are no reviews yet for ${companyName}. Be the first to share your experience!`
                : 'There are no reviews available at the moment.'}
            </p>
            <Link 
              to="/submit-review"
              className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Write a Review
            </Link>
          </div>
        ) : (
          <>
            <ReviewGrid reviews={data.content} />
            <div className="mt-8">
              <Pagination
                currentPage={page}
                totalPages={data.totalPages}
                onPageChange={setPage}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}; 