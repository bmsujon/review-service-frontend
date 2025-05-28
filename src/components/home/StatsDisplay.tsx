import React from 'react';
import { ChartBarIcon, BuildingOfficeIcon, UserGroupIcon, CalendarIcon } from '@heroicons/react/24/outline';

interface StatsDisplayProps {
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

const StatsDisplay: React.FC<StatsDisplayProps> = ({ stats }) => {
  if (!stats) return null;

  const statItems = [
    {
      name: 'Total Reviews',
      value: stats.totalReviews,
      icon: ChartBarIcon,
    },
    {
      name: 'Companies',
      value: stats.totalCompanies,
      icon: BuildingOfficeIcon,
    },
    {
      name: 'Active Users',
      value: stats.activeUsers,
      icon: UserGroupIcon,
    },
    {
      name: 'Reviews This Month',
      value: stats.reviewsThisMonth,
      icon: CalendarIcon,
    },
  ];

  return (
    <div className="mt-8">
      <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statItems.map((item) => (
          <div
            key={item.name}
            className="relative overflow-hidden rounded-lg bg-white px-4 pb-12 pt-5 shadow sm:px-6 sm:pt-6"
          >
            <dt>
              <div className="absolute rounded-md bg-blue-500 p-3">
                <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-500">{item.name}</p>
            </dt>
            <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
              <p className="text-2xl font-semibold text-gray-900">
                {(item.value ?? 0).toLocaleString()}
              </p>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
};

export default StatsDisplay; 