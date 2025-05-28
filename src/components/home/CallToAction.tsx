import React from 'react';
import { Link } from 'react-router-dom';
import { PencilSquareIcon } from '@heroicons/react/24/outline';

interface CallToActionProps {
  stats: {
    totalReviews: number;
    totalCompanies: number;
    activeUsers: number;
    reviewsThisMonth: number;
    totalLikes: number;
    totalDislikes: number;
    averageLikesPerReview: number;
    countByReviewType: Record<string, number>;
  } | undefined;
}

const CallToAction: React.FC<CallToActionProps> = ({ stats }) => {
  if (!stats) return null;

  return (
    <div className="bg-blue-600 rounded-2xl shadow-xl overflow-hidden">
      <div className="px-6 py-12 sm:px-12 sm:py-16 lg:py-20 lg:px-16">
        <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Share Your Experience
            </h2>
            <p className="mt-4 text-lg text-blue-100">
              Join {(stats.activeUsers ?? 0).toLocaleString()} of users who have shared their experiences.
              Help others make informed decisions by writing a review.
            </p>
            <div className="mt-8">
              <Link
                to="/submit-review"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50"
              >
                <PencilSquareIcon className="h-5 w-5 mr-2" />
                Write a Review
              </Link>
            </div>
          </div>
          <div className="mt-8 lg:mt-0">
            <dl className="grid grid-cols-2 gap-4">
              <div className="bg-blue-500 rounded-lg p-4">
                <dt className="text-sm font-medium text-blue-100">Total Reviews</dt>
                <dd className="mt-1 text-3xl font-semibold text-white">
                  {(stats.totalReviews ?? 0).toLocaleString()}
                </dd>
              </div>
              <div className="bg-blue-500 rounded-lg p-4">
                <dt className="text-sm font-medium text-blue-100">Companies</dt>
                <dd className="mt-1 text-3xl font-semibold text-white">
                  {(stats.totalCompanies ?? 0).toLocaleString()}
                </dd>
              </div>
              <div className="bg-blue-500 rounded-lg p-4">
                <dt className="text-sm font-medium text-blue-100">Active Users</dt>
                <dd className="mt-1 text-3xl font-semibold text-white">
                  {(stats.activeUsers ?? 0).toLocaleString()}
                </dd>
              </div>
              <div className="bg-blue-500 rounded-lg p-4">
                <dt className="text-sm font-medium text-blue-100">This Month</dt>
                <dd className="mt-1 text-3xl font-semibold text-white">
                  {(stats.reviewsThisMonth ?? 0).toLocaleString()}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallToAction; 