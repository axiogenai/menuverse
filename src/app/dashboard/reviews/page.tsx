"use client";

import React, { useState, useEffect } from "react";
import { 
  MessageSquareQuote, 
  ChefHat, 
  Utensils,
  ThumbsUp,
  AlertTriangle,
  Globe,
  Crown,
} from "lucide-react";
import { Review, Restaurant } from "@/types";
import { menuVerseStore } from "@/lib/seed-data";
import { formatRelativeTime } from "@/lib/utils";
import { StarRating } from "@/components/shared/StarRating";
import { Button } from "@/components/ui/button";
import { ReviewReplyModal } from "@/components/dashboard/ReviewReplyModal";

export default function ReviewsManagementPage() {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [filter, setFilter] = useState<"ALL" | "UNREPLIED" | "POSITIVE" | "NEGATIVE">("ALL");
  const [replyingReview, setReplyingReview] = useState<Review | null>(null);

  useEffect(() => {
    const update = () => {
      const rest = menuVerseStore.getRestaurantBySlug("hotel-gypsy") || menuVerseStore.getRestaurants()[0];
      if (rest) setRestaurant({ ...rest });
    };
    update();
    const unsub = menuVerseStore.subscribe(update);
    return () => unsub();
  }, []);

  if (!restaurant) return null;

  const reviews = restaurant.reviews || [];
  const unrepliedCount = reviews.filter((r) => !r.ownerReplyText).length;

  const filteredReviews = reviews.filter((r) => {
    if (filter === "UNREPLIED") return !r.ownerReplyText;
    if (filter === "POSITIVE") return r.aiSentiment === "POSITIVE";
    if (filter === "NEGATIVE") return r.aiSentiment === "NEGATIVE";
    return true;
  });

  const handleSendReply = (reviewId: string, replyText: string) => {
    menuVerseStore.replyToReview(reviewId, replyText);
    const updated = menuVerseStore.getRestaurantBySlug("hotel-gypsy");
    if (updated) setRestaurant(updated);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-200/80">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Reviews & Replies
            </h1>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
              {reviews.length} Reviews Total
            </span>
          </div>
          <p className="text-xs text-slate-500 font-normal">
            Monitor diner sentiment, respond to reviews with verified owner authority, and track ratings.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-xs shadow-2xs">
            <span className="font-medium text-slate-600">Pending Replies:</span>
            <span className="px-2 py-0.5 rounded font-bold text-xs bg-orange-50 text-orange-700 border border-orange-200">
              {unrepliedCount}
            </span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto text-xs pb-1">
        <button
          onClick={() => setFilter("ALL")}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors shrink-0 cursor-pointer ${
            filter === "ALL"
              ? "bg-slate-900 text-white font-semibold shadow-xs"
              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          All Reviews ({reviews.length})
        </button>
        <button
          onClick={() => setFilter("UNREPLIED")}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors shrink-0 cursor-pointer ${
            filter === "UNREPLIED"
              ? "bg-slate-900 text-white font-semibold shadow-xs"
              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          Needs Reply ({unrepliedCount})
        </button>
        <button
          onClick={() => setFilter("POSITIVE")}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors shrink-0 cursor-pointer ${
            filter === "POSITIVE"
              ? "bg-slate-900 text-white font-semibold shadow-xs"
              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          Positive Sentiment
        </button>
        <button
          onClick={() => setFilter("NEGATIVE")}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors shrink-0 cursor-pointer ${
            filter === "NEGATIVE"
              ? "bg-slate-900 text-white font-semibold shadow-xs"
              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          Needs Attention
        </button>
      </div>

      {/* Review List */}
      {filteredReviews.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-3">
          <div className="flex h-10 w-10 mx-auto items-center justify-center rounded-lg bg-slate-100 text-slate-600">
            <MessageSquareQuote className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-semibold text-slate-900">No reviews found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            When diners scan your live QR menu and submit reviews, they will appear here in real-time.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReviews.map((rev) => {
            const dish = restaurant.menuItems?.find((d) => d.id === rev.menuItemId);
            const dishImage = dish?.images?.[0]?.url || rev.images?.[0]?.url;

            return (
              <div
                key={rev.id}
                className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-[0_1px_4px_rgba(0,0,0,0.04)] space-y-3.5 hover:border-slate-300 transition-all"
              >
                {/* 1. TOP BAR: Dish Image & Name on TOP (never squeezed to the right) */}
                {dish && (
                  <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="h-7 w-7 rounded-lg bg-slate-100 overflow-hidden shrink-0 border border-slate-200 shadow-2xs">
                        {dishImage ? (
                          <img
                            src={dishImage}
                            alt={dish.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400">
                            <Utensils className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <span className="font-semibold text-xs sm:text-sm text-slate-900 block truncate">
                          {dish.name}
                        </span>
                      </div>
                    </div>

                    {/* Sentiment Badge */}
                    <div className="shrink-0">
                      {rev.aiSentiment === "POSITIVE" ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <ThumbsUp className="w-2.5 h-2.5" />
                          <span>Positive</span>
                        </span>
                      ) : rev.aiSentiment === "NEGATIVE" ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                          <AlertTriangle className="w-2.5 h-2.5" />
                          <span>Needs Attention</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-600">
                          Neutral
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* 2. REVIEWER PROFILE & RATING ROW */}
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 shrink-0 border border-slate-200 shadow-2xs flex items-center justify-center">
                    {rev.avatarUrl ? (
                      <img src={rev.avatarUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="font-bold text-xs text-slate-700">
                        {rev.displayName.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0 space-y-0.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-xs sm:text-sm text-slate-900">
                        {rev.displayName}
                      </span>
                      {rev.isGoogleReview ? (
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-50 text-blue-700 border border-blue-200 font-semibold inline-flex items-center gap-1">
                          <Globe className="w-2.5 h-2.5" /> Google Review
                        </span>
                      ) : (
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-medium">
                          Verified Diner
                        </span>
                      )}
                      <span className="text-[11px] text-slate-400 font-normal">
                        • {formatRelativeTime(rev.createdAt)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 pt-0.5">
                      <StarRating rating={rev.rating} size="sm" showValue={true} />
                    </div>
                  </div>
                </div>

                {/* 3. REVIEW TEXT & CUSTOMER PHOTOS */}
                <div className="space-y-2">
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                    {rev.reviewText}
                  </p>

                  {rev.images && rev.images.length > 0 && (
                    <div className="flex items-center gap-2 pt-1 flex-wrap">
                      {rev.images.map((img, i) => (
                        <div
                          key={img.id || i}
                          className="h-16 w-16 rounded-xl overflow-hidden border border-slate-200 shadow-2xs shrink-0"
                        >
                          <img src={img.url} alt="" className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 4. OWNER RESPONSE OR ACTION BAR */}
                {rev.ownerReplyText ? (
                  <div className="p-3 rounded-xl bg-slate-50 border-l-3 border-orange-500 text-xs space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-[11px] text-slate-900 flex items-center gap-1">
                        <Crown className="w-3 h-3 text-amber-500" />
                        Hotel Gypsy (Owner Response)
                      </span>
                      <button
                        onClick={() => setReplyingReview(rev)}
                        className="text-[11px] text-slate-500 hover:text-slate-900 font-semibold cursor-pointer"
                      >
                        Edit
                      </button>
                    </div>
                    <p className="text-slate-600 italic font-normal text-xs sm:text-sm leading-relaxed">
                      {rev.ownerReplyText}
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-2 pt-1">
                    <span className="text-[11px] text-slate-400 font-normal">
                      {rev.helpfulVotes > 0 ? `👍 ${rev.helpfulVotes} diners found this helpful` : "No replies yet"}
                    </span>
                    <Button
                      onClick={() => setReplyingReview(rev)}
                      className="h-7.5 px-3 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                      size="sm"
                    >
                      <ChefHat className="w-3.5 h-3.5 text-orange-400" />
                      <span>Reply to Diner</span>
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <ReviewReplyModal
        review={replyingReview}
        isOpen={!!replyingReview}
        onClose={() => setReplyingReview(null)}
        onSendReply={handleSendReply}
      />
    </div>
  );
}
