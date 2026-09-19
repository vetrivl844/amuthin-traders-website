import React from 'react';
import { CheckCircle, Quote } from 'lucide-react';
import { Review } from '../../types';
import { RatingStars } from '../ui/RatingStars';

interface ReviewCardProps {
  review: Review;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  return (
    <div className="bg-white p-6 rounded-2xl border border-stone-200/90 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow relative">
      <Quote className="w-8 h-8 text-amber-200/80 absolute top-4 right-4 pointer-events-none" />

      <div>
        <div className="flex items-center justify-between mb-3">
          <RatingStars rating={review.rating} showCount={false} size="sm" />
          <span className="text-[11px] text-stone-600 font-medium">{review.date}</span>
        </div>

        {review.productName && (
          <span className="inline-block text-[11px] font-bold text-[#166534] bg-emerald-50 px-2 py-0.5 rounded-md mb-2">
            {review.productName}
          </span>
        )}

        <p className="text-sm text-stone-700 italic leading-relaxed mb-4">
          &ldquo;{review.comment}&rdquo;
        </p>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-stone-100">
        <div>
          <h4 className="text-xs font-bold text-stone-900">{review.userName}</h4>
          {review.userLocation && (
            <p className="text-[11px] text-stone-600">{review.userLocation}</p>
          )}
        </div>
        {review.verifiedPurchase && (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            <CheckCircle className="w-3 h-3 text-emerald-600" />
            <span>Verified</span>
          </span>
        )}
      </div>
    </div>
  );
};
