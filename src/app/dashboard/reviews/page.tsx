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
  const [restaurant, setRestaurant] = useState<Restaurant | null>(
    () => menuVerseStore.getRestaurantBySlug() || null
  );
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-stone-900 flex items-center gap-2">
            <MessageSquareQuote className="w-6 h-6 text-orange-600" />
            Permanent Review Feed & Replies
          </h1>
          <p className="text-xs text-stone-500 font-medium">
            Monitor diner sentiment, respond to reviews with verified owner badge, and review flagged posts
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white border border-stone-200 p-2 rounded-2xl text-xs shadow-xs">
          <span className="px-2 font-bold text-stone-600">Unreplied:</span>
          <span className="px-2.5 py-0.5 rounded-lg bg-orange-600 text-white font-black">
            {unrepliedCount}
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar text-xs">
        <button
          onClick={() => setFilter("ALL")}
          className={`px-4 py-2 rounded-2xl font-black transition-all ${
            filter === "ALL"
              ? "bg-orange-600 text-white shadow-md shadow-orange-600/20"
              : "bg-white text-stone-700 border border-stone-200 hover:bg-stone-100 shadow-xs"
          }`}
        >
          All Reviews ({reviews.length})
        </button>
        <button
          onClick={() => setFilter("UNREPLIED")}
          className={`px-4 py-2 rounded-2xl font-black transition-all ${
            filter === "UNREPLIED"
              ? "bg-orange-600 text-white shadow-md shadow-orange-600/20"
              : "bg-white text-stone-700 border border-stone-200 hover:bg-stone-100 shadow-xs"
          }`}
        >
          Needs Reply ({unrepliedCount})
        </button>
        <button
          onClick={() => setFilter("POSITIVE")}
          className={`px-4 py-2 rounded-2xl font-black transition-all ${
            filter === "POSITIVE"
              ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
              : "bg-white text-stone-700 border border-stone-200 hover:bg-stone-100 shadow-xs"
          }`}
        >
          Positive Sentiment
        </button>
        <button
          onClick={() => setFilter("NEGATIVE")}
          className={`px-4 py-2 rounded-2xl font-black transition-all ${
            filter === "NEGATIVE"
              ? "bg-rose-600 text-white shadow-md shadow-rose-600/20"
              : "bg-white text-stone-700 border border-stone-200 hover:bg-stone-100 shadow-xs"
          }`}
        >
          Critical Sentiment
        </button>
      </div>

      {/* Review List */}
      {filteredReviews.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-stone-200/90 shadow-sm p-6 space-y-3">
          <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-2xl bg-orange-50 text-orange-600">
            <MessageSquareQuote className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-stone-900">No reviews found</h3>
          <p className="text-xs text-stone-500 font-medium max-w-sm mx-auto">
            When diners scan your live QR menu and submit dish reviews, they will appear here in real-time.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReviews.map((rev) => {
            const dish = restaurant.menuItems?.find((d) => d.id === rev.menuItemId);
            const sentimentStyle = getSentimentColor(rev.aiSentiment);

            return (
              <div
                key={rev.id}
                className="p-5 rounded-3xl bg-white border border-stone-200/90 space-y-4 shadow-sm hover:border-orange-300 transition-colors"
              >
                {/* Top Row: User & Dish Tag */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full overflow-hidden bg-stone-100 shrink-0 border border-stone-200">
                      {rev.avatarUrl ? (
                        <img src={rev.avatarUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-bold text-stone-700">
                          {rev.displayName.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-sm text-stone-900">
                          {rev.displayName}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                          Verified Diner
                        </span>
                      </div>
                      <span className="text-[11px] text-stone-500 font-medium">
                        {formatRelativeTime(rev.createdAt)}
                      </span>
                    </div>
                  </div>

                  {dish && (
                    <div className="px-3 py-1 rounded-xl bg-orange-50 border border-orange-200 text-orange-700 font-bold text-xs flex items-center gap-1.5">
                      <Utensils className="w-3.5 h-3.5" />
                      <span>{dish.name}</span>
                    </div>
                  )}
                </div>

                {/* Star & Sentiment Bar */}
                <div className="flex items-center gap-3 flex-wrap">
                  <StarRating rating={rev.rating} size="sm" />
                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${sentimentStyle.bg} ${sentimentStyle.text} ${sentimentStyle.border}`}>
                    AI Sentiment: {rev.aiSentiment}
                  </span>
                  <span className="text-[11px] text-stone-500 font-medium">
                    • {rev.helpfulVotes} found helpful
                  </span>
                </div>

                {/* Review Text */}
                <p className="text-xs text-stone-800 leading-relaxed font-medium">
                  {rev.reviewText}
                </p>

                {/* Photo Attachments */}
                {rev.images && rev.images.length > 0 && (
                  <div className="flex gap-2">
                    {rev.images.map((img) => (
                      <div key={img.id} className="h-16 w-16 rounded-xl overflow-hidden border border-stone-200">
                        <img src={img.url} alt="" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}

                {/* Owner Reply Section */}
                {rev.ownerReplyText ? (
                  <div className="p-3.5 rounded-2xl bg-orange-50/70 border border-orange-200/80 text-xs space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-black text-orange-800">
                      <span className="flex items-center gap-1">
                        <ChefHat className="w-3.5 h-3.5" />
                        Executive Chef / Owner Official Reply:
                      </span>
                      <button
                        onClick={() => setReplyingReview(rev)}
                        className="text-orange-600 hover:underline font-bold"
                      >
                        Edit Reply
                      </button>
                    </div>
                    <p className="text-stone-700 italic font-medium">"{rev.ownerReplyText}"</p>
                  </div>
                ) : (
                  <div className="pt-2 flex items-center justify-end">
                    <Button
                      onClick={() => setReplyingReview(rev)}
                      className="bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl flex items-center gap-1.5 shadow-md shadow-orange-600/20 hover:scale-105 active:scale-95 transition-all"
                      size="sm"
                    >
                      <ChefHat className="w-4 h-4" />
                      <span>Reply as Restaurant Owner</span>
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
