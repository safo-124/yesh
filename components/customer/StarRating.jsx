'use client';

import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function StarRating({ rating, totalReviews, size = 4 }) {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  
  if (totalReviews === 0) {
    return <div className="text-xs text-muted-foreground">No reviews yet</div>;
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={cn(
              `h-${size} w-${size}`,
              i < fullStars ? 'text-amber-400 fill-amber-400' : 'text-gray-300'
            )}
          />
        ))}
      </div>
      <span className="text-xs text-muted-foreground">({totalReviews})</span>
    </div>
  );
}