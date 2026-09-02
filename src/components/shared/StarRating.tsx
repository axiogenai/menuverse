"use client";

import React from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number; // 0 to 5
  maxRating?: number;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
  className?: string;
  showValue?: boolean;
}

export function StarRating({
  rating,
  maxRating = 5,
  size = "md",
  interactive = false,
  onRatingChange,
  className,
  showValue = false,
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = React.useState<number | null>(null);

  const sizeClasses = {
    sm: "w-3.5 h-3.5",
    md: "w-4 h-4",
    lg: "w-6 h-6",
  };

  const currentVal = hoverRating !== null ? hoverRating : rating;

  return (
    <div className={cn("inline-flex items-center gap-1", className)}>
      <div className="flex items-center gap-0.5">
        {Array.from({ length: maxRating }).map((_, i) => {
          const starValue = i + 1;
          const isFilled = currentVal >= starValue;
          const isHalf = !isFilled && currentVal >= starValue - 0.5;

          return (
            <button
              key={i}
              type="button"
              disabled={!interactive}
              onClick={() => interactive && onRatingChange?.(starValue)}
              onMouseEnter={() => interactive && setHoverRating(starValue)}
              onMouseLeave={() => interactive && setHoverRating(null)}
              className={cn(
                "transition-transform",
                interactive && "cursor-pointer hover:scale-110 active:scale-95 focus:outline-none"
              )}
            >
              <Star
                className={cn(
                  sizeClasses[size],
                  isFilled
                    ? "fill-amber-400 text-amber-400 drop-shadow-sm"
                    : isHalf
                    ? "fill-amber-400/50 text-amber-400"
                    : "fill-stone-200 dark:fill-stone-800 text-stone-300 dark:text-stone-700"
                )}
              />
            </button>
          );
        })}
      </div>
      {showValue && (
        <span className="text-xs font-semibold text-stone-700 dark:text-stone-300 ml-1">
          {rating > 0 ? rating.toFixed(1) : "New"}
        </span>
      )}
    </div>
  );
}
