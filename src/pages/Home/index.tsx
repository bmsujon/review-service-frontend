import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { reviewService } from '../../services/reviewService';
import toast from 'react-hot-toast';
import type { Review, PaginatedResponse } from '../../types';

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

// Components
import SearchBar from '../../components/home/SearchBar';
import StatsDisplay from '../../components/home/StatsDisplay';
import ReviewGrid from '../../components/home/ReviewGrid';
import CallToAction from '../../components/home/CallToAction';

const Home: React.FC = () => {
  // Fetch statistics
  const { data: stats, isLoading: isLoadingStats, isError: isStatsError } = useQuery<ReviewStats>({
    queryKey: ['stats'],
    queryFn: () => reviewService.getStats(),
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Fetch recent reviews
  const { data: recentReviews, isLoading: isLoadingReviews, isError: isReviewsError } = useQuery<PaginatedResponse<Review>>({
    queryKey: ['recentReviews'],
    queryFn: () => reviewService.getReviews({ 
      sort: 'createdAt,desc',
      size: 6,
      page: 0
    }),
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Handle errors
  React.useEffect(() => {
    if (isStatsError) {
      toast.error('Failed to load statistics. Please try again later.');
    }
  }, [isStatsError]);

  React.useEffect(() => {
    if (isReviewsError) {
      toast.error('Failed to load recent reviews. Please try again later.');
    }
  }, [isReviewsError]);

  return (
    <div className="app-container py-12">
      {/* Hero Section */}
      <section className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Find Honest Company Reviews
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Read and share experiences about companies you've worked with
        </p>
        <SearchBar />
        {isLoadingStats ? (
          <div className="mt-8 animate-pulse">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        ) : isStatsError ? (
          <div className="mt-8 p-4 bg-red-50 rounded-lg">
            <p className="text-red-600 text-center">
              Unable to load statistics. Please try again later.
            </p>
          </div>
        ) : (
          <StatsDisplay stats={stats} />
        )}
      </section>

      {/* Recent Reviews Section */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Recent Reviews</h2>
          <a
            href="/reviews"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            View all reviews →
          </a>
        </div>
        {isLoadingReviews ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded-lg animate-pulse"></div>
            ))}
          </div>
        ) : isReviewsError ? (
          <div className="p-4 bg-red-50 rounded-lg">
            <p className="text-red-600 text-center">
              Unable to load recent reviews. Please try again later.
            </p>
          </div>
        ) : (
          <ReviewGrid reviews={recentReviews?.content} />
        )}
      </section>

      {/* CTA Section */}
      <section>
        <CallToAction stats={stats} />
      </section>
    </div>
  );
};

export default Home; 