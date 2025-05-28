import React from 'react';
import type { Review } from '../../types';
import ReviewCard from '../../components/reviews/ReviewCard';

interface ReviewGridProps {
  reviews: Review[] | undefined;
}

const ReviewGrid: React.FC<ReviewGridProps> = ({ reviews }) => {
  if (!reviews?.length) return null;

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {reviews.map((review) => (
        <ReviewCard key={review.id} review={review} />
      ))}
    </div>
  );
};

export default ReviewGrid; 