"use client";

import React from "react";
import { 
  Star, 
  ThumbsUp, 
  Camera, 
  MessageSquare, 
  ChefHat, 
  Sparkles,
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
  const primaryImg = dish.images && dish.images.length > 0 ? dish.images[0].url : null;
  const photoCount = stats?.customerPhotoCount || (dish.images ? dish.images.length : 0);
  const recPct = stats?.recommendationPercentage || 95;
  const reviewCount = stats?.totalReviews || (dish.reviews ? dish.reviews.length : 0);
  const avgRating = stats?.averageRating ? stats.averageRating.toFixed(1) : "5.0";

  // Pick top approved review for social preview
  const topReview = dish.reviews?.find((r) => r.moderationStatus === "APPROVED");

  return (
    <div
      onClick={() => onSelect(dish)}
      className={`group relative bg-white rounded-3xl border border-stone-200 shadow-sm hover:shadow-2xl hover:border-orange-400 transition-all duration-300 overflow-hidden flex flex-col cursor-pointer hover:-translate-y-1.5 ${
        !dish.isAvailable ? "opacity-85" : ""
      }`}
    >
      {/* Visual Header */}
      <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-stone-100">
        {primaryImg ? (
          <img
            src={primaryImg}
            alt={dish.name}
            className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-amber-50 via-orange-50 to-orange-100 flex flex-col items-center justify-center p-6 text-center relative">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-md text-orange-600 mb-2 group-hover:scale-110 transition-transform">
              <Utensils className="w-6 h-6" />
            </div>
            <span className="text-xs font-black text-stone-700 line-clamp-1 max-w-[200px]">
              {dish.name}
            </span>
            <span className="text-[10px] text-stone-400 font-bold mt-0.5">
              Tap to view details & photos
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between pointer-events-none z-10">
          <div className="flex items-center gap-1.5 flex-wrap">
            {!dish.isAvailable && (
              <div className="bg-rose-600 text-white font-black text-[11px] px-3 py-1 rounded-full shadow-lg">
                <span>Sold Out</span>
              </div>
            )}
            {dish.isSignature && dish.isAvailable && (
              <div className="bg-amber-500 text-stone-950 font-black text-[11px] px-3 py-1 rounded-full shadow-lg flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 fill-stone-950 text-stone-950 shrink-0" />
                <span>Signature</span>
              </div>
            )}
            {dish.isChefSpecial && dish.isAvailable && (
              <div className="bg-rose-600 text-white font-black text-[11px] px-3 py-1 rounded-full shadow-lg flex items-center gap-1.5">
                <ChefHat className="w-3.5 h-3.5 text-white shrink-0" />
                <span>Chef Pick</span>
              </div>
            )}
          </div>

          {photoCount > 0 && (
            <div className="flex items-center gap-1 bg-black/75 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-xl border border-white/20 shadow">
              <Camera className="w-3.5 h-3.5 text-orange-400" />
              <span>{photoCount}</span>
            </div>
          )}
        </div>

        {/* Bottom stats over image */}
        <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between pointer-events-none z-10">
          <div className="flex items-center gap-1.5 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-xl text-white border border-white/15 shadow">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="text-xs font-black text-amber-300">{avgRating}</span>
            <span className="text-[10px] text-stone-300 font-semibold">• {reviewCount} reviews</span>
          </div>

          <div className="flex items-center gap-1 bg-emerald-600 backdrop-blur-md text-white px-2.5 py-1 rounded-xl text-xs font-black shadow-md">
            <ThumbsUp className="w-3 h-3" />
            <span>{recPct}% rec</span>
          </div>
        </div>
      </div>

      {/* Dish Content Body */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between gap-3 bg-white">
        <div className="space-y-2.5">
          {/* Title & Price in clean layout */}
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-base sm:text-lg font-black text-stone-900 group-hover:text-orange-600 transition-colors leading-tight line-clamp-2">
              {dish.name}
            </h3>
            <div className="px-3 py-1 rounded-xl bg-orange-50 border border-orange-200 shrink-0">
              <span className="text-sm font-black text-orange-600">
                {formatPrice(dish.price, dish.currency)}
              </span>
            </div>
          </div>

          {/* Description */}
          {dish.description && (
            <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed font-medium">
              {dish.description}
            </p>
          )}

          {/* Dietary tags */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {dish.isVegetarian && (
              <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-lg border border-emerald-200">
                Vegetarian
              </span>
            )}
            {dish.isGlutenFree && (
              <span className="bg-amber-50 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-lg border border-amber-200">
                Gluten-Free
              </span>
            )}
            {dish.preparationTimeMinutes && (
              <span className="bg-stone-50 text-stone-600 text-[10px] font-bold px-2 py-0.5 rounded-lg border border-stone-200">
                {dish.preparationTimeMinutes} mins
              </span>
            )}
          </div>
        </div>

        {/* Action and Social Snippet Footer */}
        <div className="space-y-2.5 pt-2 border-t border-stone-100">
          {topReview && (
            <div className="bg-stone-50 rounded-2xl p-2.5 border border-stone-200/80 space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-stone-800">{topReview.displayName}</span>
                <span className="text-amber-600 font-black">★ {topReview.rating}.0</span>
              </div>
              <p className="text-[11px] text-stone-600 line-clamp-1 italic font-medium">
                "{topReview.reviewText}"
              </p>
            </div>
          )}

          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-bold text-orange-600 group-hover:underline">
              View Social Profile →
            </span>

            {onOpenReviewModal && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenReviewModal(dish);
                }}
                className="px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-orange-600 text-white font-bold text-xs flex items-center gap-1 transition-all hover:scale-105 active:scale-95 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Review</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
