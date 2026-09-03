"use client";

import React from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number; // 0 to 5
  maxRating?: number;
  size?: "sm" | "md" | "lg" | "xl";
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
    sm: "w-3 h-3",
    md: "w-3.5 h-3.5",
    lg: "w-5 h-5",
    xl: "w-7 h-7 sm:w-8 sm:h-8",
  };

  const currentVal = hoverRating !== null ? hoverRating : rating;

  return (
    <div className={cn("inline-flex items-center gap-1.5", className)}>
      <div className={cn("flex items-center", interactive ? "gap-1 sm:gap-1.5" : "gap-0.5")}>
        {Array.from({ length: maxRating }).map((_, i) => {
          const starValue = i + 1;
          const isFilled = currentVal >= starValue;
          const isHalf = !isFilled && currentVal >= starValue - 0.5;
          const isHovered = hoverRating !== null && hoverRating >= starValue;

          return (
            <button
              key={i}
              type="button"
              disabled={!interactive}
              onClick={() => interactive && onRatingChange?.(starValue)}
              onMouseEnter={() => interactive && setHoverRating(starValue)}
              onMouseLeave={() => interactive && setHoverRating(null)}
              className={cn(
                "p-1 rounded-full transition-transform duration-200 ease-out focus:outline-none",
                interactive && "cursor-pointer hover:scale-115 active:scale-95"
              )}
            >
              <Star
                className={cn(
                  sizeClasses[size],
                  "transition-all duration-200 ease-out",
                  isFilled
                    ? "fill-amber-400 text-amber-400 filter drop-shadow-[0_1px_2px_rgba(251,191,36,0.3)]"
                    : isHalf
                    ? "fill-amber-400/40 text-amber-400"
                    : "fill-stone-200 text-stone-300"
                )}
                strokeWidth={1.5}
              />
            </button>
          );
        })}
      </div>
      {showValue && (
        <span className="text-xs font-semibold text-stone-800 ml-1 font-mono">
          {rating > 0 ? rating.toFixed(1) : "New"}
        </span>
      )}
    </div>
  );
}
