"use client";

import React from "react";
import { 
  Star, 
  ThumbsUp, 
  Camera, 
  ChefHat, 
  Plus,
  Utensils
} from "lucide-react";
import { MenuItem } from "@/types";
import { formatPrice } from "@/lib/utils";

interface DishCardProps {
  dish: MenuItem;
  onSelect: (dish: MenuItem) => void;
  onOpenReviewModal?: (dish: MenuItem) => void;
}

export function DishCard({ dish, onSelect, onOpenReviewModal }: DishCardProps) {
  const stats = dish.statistics;
  const validImages = (dish.images || []).filter(
    (img) => img && typeof img.url === "string" && img.url.trim().startsWith("http")
  );
  const primaryImg =
    validImages.length > 0
      ? validImages[0].url
      : "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=800&q=80";
  const photoCount = stats?.customerPhotoCount || (dish.images ? dish.images.length : 0);
  const recPct = stats?.recommendationPercentage || 100;
  const reviewCount = stats?.totalReviews || (dish.reviews ? dish.reviews.length : 0);
  const avgRating = stats?.averageRating ? stats.averageRating.toFixed(1) : "5.0";

  // Sort reviews newest first to get the true latest review
  const latestReview = dish.reviews
    ? [...dish.reviews]
        .filter((r) => r.moderationStatus === "APPROVED" || !r.moderationStatus)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]
    : null;

  return (
    <div
      onClick={() => onSelect(dish)}
      className={`group relative bg-white rounded-2xl border border-stone-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_28px_-6px_rgba(0,0,0,0.08),0_4px_10px_-6px_rgba(0,0,0,0.04)] hover:border-amber-400/50 hover:-translate-y-1 active:translate-y-0 active:scale-[0.99] transition-all duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] overflow-hidden flex flex-col cursor-pointer transform-gpu will-change-transform ${
        !dish.isAvailable ? "opacity-75" : ""
      }`}
    >
      {/* Visual Header - Compact & Centered */}
      <div className="relative h-40 sm:h-44 w-full overflow-hidden bg-stone-100 shrink-0">
        {primaryImg ? (
          <>
            <img
              src={primaryImg}
              alt=""
              loading="lazy"
              decoding="async"
              className="absolute inset-0 w-full h-full object-cover blur-md scale-110 opacity-30 pointer-events-none"
              aria-hidden="true"
            />
            <img
              src={primaryImg}
              alt={dish.name}
              loading="lazy"
              decoding="async"
              className="relative z-10 w-full h-full object-cover object-center group-hover:scale-[1.03] transition-transform duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] will-change-transform"
            />
          </>
        ) : (
          <div className="w-full h-full bg-stone-50 flex flex-col items-center justify-center p-4 text-center">
            <Utensils className="w-6 h-6 text-stone-400 mb-1" />
            <span className="text-[11px] font-semibold text-stone-600 line-clamp-1">
              {dish.name}
            </span>
          </div>
        )}

        {/* Floating Badges Over Image */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none z-20">
          <div className="flex items-center gap-1.5 flex-wrap">
            {!dish.isAvailable && (
              <div className="bg-rose-600 text-white font-semibold text-[10px] px-2 py-0.5 rounded shadow-xs">
                <span>Sold Out</span>
              </div>
            )}
            {dish.isSignature && dish.isAvailable && (
              <div className="bg-white/95 text-stone-900 font-semibold text-[10px] px-2 py-0.5 rounded shadow-xs flex items-center gap-1 backdrop-blur-xs">
                <Star className="w-3 h-3 fill-amber-500 text-amber-500 shrink-0" />
                <span>Signature</span>
              </div>
            )}
            {dish.isChefSpecial && dish.isAvailable && (
              <div className="bg-amber-600 text-white font-semibold text-[10px] px-2 py-0.5 rounded shadow-xs flex items-center gap-1">
                <ChefHat className="w-3 h-3 text-white shrink-0" />
                <span>Chef Pick</span>
              </div>
            )}
          </div>

          {photoCount > 1 && (
            <div className="flex items-center gap-1 bg-black/60 backdrop-blur-xs text-white text-[10px] font-medium px-2 py-0.5 rounded shadow-xs">
              <Camera className="w-3 h-3 text-amber-300" />
              <span>{photoCount}</span>
            </div>
          )}
        </div>

        {/* Rating Pill in Bottom Left of Photo */}
        <div className="absolute bottom-2 left-2 z-20 pointer-events-none">
          <div className="flex items-center gap-1 bg-white/95 backdrop-blur-xs px-2 py-0.5 rounded shadow-xs text-stone-900 border border-stone-200/80">
            <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
            <span className="text-[11px] font-bold">{avgRating}</span>
            <span className="text-[10px] text-stone-400 font-normal">({reviewCount})</span>
          </div>
        </div>
      </div>

      {/* Dish Content Body - Compact & Professional */}
      <div className="p-3.5 flex flex-col flex-1 justify-between gap-2.5 bg-white">
        <div className="space-y-1.5">
          {/* Title & Price */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm font-bold text-stone-900 group-hover:text-amber-700 transition-colors leading-snug line-clamp-1">
              {dish.name}
            </h3>
            <span className="text-xs font-mono font-bold text-stone-900 bg-stone-100 px-2 py-0.5 rounded shrink-0">
              {formatPrice(dish.price, dish.currency)}
            </span>
          </div>

          {/* Description */}
          {dish.description && (
            <p className="text-[11px] text-stone-500 line-clamp-2 leading-relaxed font-normal">
              {dish.description}
            </p>
          )}

          {/* Dietary Tags */}
          <div className="flex flex-wrap items-center gap-1 pt-0.5">
            {dish.isVegetarian && (
              <span className="bg-emerald-50 text-emerald-700 text-[9px] font-semibold px-1.5 py-0.5 rounded border border-emerald-200/70">
                Vegetarian
              </span>
            )}
            {dish.isGlutenFree && (
              <span className="bg-amber-50 text-amber-800 text-[9px] font-semibold px-1.5 py-0.5 rounded border border-amber-200/70">
                Gluten-Free
              </span>
            )}
            {dish.preparationTimeMinutes && (
              <span className="bg-stone-50 text-stone-600 text-[9px] font-medium px-1.5 py-0.5 rounded border border-stone-200/60">
                {dish.preparationTimeMinutes}m prep
              </span>
            )}
            {recPct > 0 && (
              <span className="text-[9px] text-stone-400 font-medium ml-auto">
                {recPct}% loved
              </span>
            )}
          </div>

          {/* Latest Diner Review - Profile Name, Avatar & Review Quote */}
          {latestReview && (
            <div className="bg-stone-50/95 rounded-xl p-2.5 border border-stone-200/80 space-y-1 mt-1" suppressHydrationWarning>
              <div className="flex items-center justify-between gap-2" suppressHydrationWarning>
                <div className="flex items-center gap-1.5 min-w-0" suppressHydrationWarning>
                  <div className="w-5 h-5 rounded-full overflow-hidden bg-stone-200 shrink-0 flex items-center justify-center text-[10px] font-bold text-stone-700" suppressHydrationWarning>
                    {latestReview.avatarUrl ? (
                      <img src={latestReview.avatarUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      latestReview.displayName.charAt(0)
                    )}
                  </div>
                  <span className="font-semibold text-xs text-stone-900 truncate" suppressHydrationWarning>
                    {latestReview.displayName}
                  </span>
                </div>
                <div className="flex items-center gap-0.5 text-amber-600 font-bold shrink-0 text-xs" suppressHydrationWarning>
                  <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                  <span>{latestReview.rating}.0</span>
                </div>
              </div>
              <p className="text-[11px] text-stone-600 line-clamp-1 italic font-normal leading-tight" suppressHydrationWarning>
                &ldquo;{latestReview.reviewText}&rdquo;
              </p>
            </div>
          )}
        </div>

        {/* Action Footer */}
        <div className="flex items-center justify-between pt-1.5 border-t border-stone-100 text-xs">
          <span className="text-[11px] font-semibold text-stone-600 group-hover:text-amber-800 transition-colors duration-200">
            View Details →
          </span>

          {onOpenReviewModal && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenReviewModal(dish);
              }}
              className="px-2.5 py-1 rounded-lg bg-stone-900 hover:bg-amber-700 text-white font-medium text-[11px] flex items-center gap-1 transition-colors duration-200 cursor-pointer shadow-xs active:scale-95"
            >
              <Plus className="w-3 h-3" />
              <span>Review</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
