"use client";

import React, { useState, useEffect } from "react";
import { 
  MessageSquareQuote, 
  ChefHat, 
  Utensils,
} from "lucide-react";
import { Review, Restaurant } from "@/types";
import { menuVerseStore } from "@/lib/seed-data";
import { formatRelativeTime, getSentimentColor } from "@/lib/utils";
import { StarRating } from "@/components/shared/StarRating";
import { Button } from "@/components/ui/button";
import { ReviewReplyModal } from "@/components/dashboard/ReviewReplyModal";

export default function ReviewsManagementPage() {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [filter, setFilter] = useState<"ALL" | "UNREPLIED" | "POSITIVE" | "NEGATIVE">("ALL");
  const [replyingReview, setReplyingReview] = useState<Review | null>(null);

  useEffect(() => {
    const update = () => {
      const rest = menuVerseStore.getRestaurantBySlug();
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
    const updated = menuVerseStore.getRestaurantBySlug("gusto-trattoria");
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
      <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
        <button
          onClick={() => setFilter("ALL")}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors shrink-0 ${
            filter === "ALL"
              ? "bg-slate-900 text-white font-semibold shadow-xs"
              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          All Reviews ({reviews.length})
        </button>
        <button
          onClick={() => setFilter("UNREPLIED")}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors shrink-0 ${
            filter === "UNREPLIED"
              ? "bg-slate-900 text-white font-semibold shadow-xs"
              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          Needs Reply ({unrepliedCount})
        </button>
        <button
          onClick={() => setFilter("POSITIVE")}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors shrink-0 ${
            filter === "POSITIVE"
              ? "bg-slate-900 text-white font-semibold shadow-xs"
              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          Positive Sentiment
        </button>
        <button
          onClick={() => setFilter("NEGATIVE")}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors shrink-0 ${
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
        <div className="space-y-3">
          {filteredReviews.map((rev) => {
            const dish = restaurant.menuItems?.find((d) => d.id === rev.menuItemId);
            const dishImage = dish?.images?.[0]?.url || rev.images?.[0]?.url;

            return (
              <div
                key={rev.id}
                className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-2.5 hover:border-slate-300 transition-colors"
              >
                {/* Header Row: User Info & Star Rating on Left + Dish Thumbnail on Right */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="h-8 w-8 rounded-full overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                      {rev.avatarUrl ? (
                        <img src={rev.avatarUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-bold text-xs text-slate-700">
                          {rev.displayName.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-wrap min-w-0">
                      <span className="font-semibold text-xs text-slate-900 truncate">
                        {rev.displayName}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-medium">
                        Verified Diner
                      </span>
                      <span className="text-slate-300 hidden sm:inline">•</span>
                      <div className="flex items-center">
                        <StarRating rating={rev.rating} size="sm" showValue={true} />
                      </div>
                      <span className="text-[11px] text-slate-400 font-normal">
                        {formatRelativeTime(rev.createdAt)}
                      </span>
                    </div>
                  </div>

                  {/* Dish Tag with Integrated Image on Right */}
                  {dish && (
                    <div className="flex items-center gap-1.5 p-1 pl-1.5 pr-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 font-medium text-xs shrink-0">
                      {dishImage ? (
                        <img
                          src={dishImage}
                          alt={dish.name}
                          className="w-5 h-5 rounded object-cover shrink-0 border border-slate-200"
                        />
                      ) : (
                        <Utensils className="w-3.5 h-3.5 text-slate-500" />
                      )}
                      <span className="truncate max-w-[120px] sm:max-w-[180px]">{dish.name}</span>
                    </div>
                  )}
                </div>

                {/* Review Text */}
                <p className="text-xs text-slate-700 leading-relaxed font-normal sm:pl-10.5">
                  {rev.reviewText}
                </p>

                {/* Owner Reply Section - Ultra Slim */}
                {rev.ownerReplyText ? (
                  <div className="sm:ml-10.5 p-2.5 rounded-lg bg-slate-50 border-l-2 border-slate-900 text-xs flex items-start justify-between gap-2">
                    <div className="space-y-0.5 min-w-0">
                      <span className="font-semibold text-[11px] text-slate-900 block">Owner Response:</span>
                      <p className="text-slate-600 italic font-normal text-xs">{rev.ownerReplyText}</p>
                    </div>
                    <button
                      onClick={() => setReplyingReview(rev)}
                      className="text-xs text-slate-500 hover:text-slate-900 font-medium shrink-0 pt-0.5"
                    >
                      Edit
                    </button>
                  </div>
                ) : (
                  <div className="sm:pl-10.5 flex items-center justify-between text-xs text-slate-400 pt-0.5">
                    <span className="text-[11px]">
                      {rev.helpfulVotes > 0 ? `${rev.helpfulVotes} diners found this helpful` : ""}
                    </span>
                    <Button
                      onClick={() => setReplyingReview(rev)}
                      className="h-7 px-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md shadow-xs flex items-center gap-1.5 transition-colors"
                      size="sm"
                    >
                      <ChefHat className="w-3 h-3 text-orange-400" />
                      <span>Reply</span>
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
