"use client";

import React, { useState } from "react";
import { 
  X, 
  Star, 
  ThumbsUp, 
  Camera, 
  Clock, 
  Flame, 
  MessageSquare, 
  ShieldAlert, 
  ChefHat, 
  Share2 
} from "lucide-react";
import { MenuItem } from "@/types";
import { formatPrice, formatRelativeTime, getSpicyIcon, getSentimentColor } from "@/lib/utils";
import { StarRating } from "@/components/shared/StarRating";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AISummaryCard } from "./AISummaryCard";
import { menuVerseStore } from "@/lib/seed-data";

interface DishDetailModalProps {
  dish: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenWriteReview: (dish: MenuItem) => void;
}

export function DishDetailModal({
  dish,
  isOpen,
  onClose,
  onOpenWriteReview,
}: DishDetailModalProps) {
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [reviewFilter, setReviewFilter] = useState<"ALL" | "POSITIVE" | "PHOTOS" | "CRITICAL">("ALL");
  const [upvotedReviews, setUpvotedReviews] = useState<Record<string, number>>({});
  const [reportedReviews, setReportedReviews] = useState<Record<string, boolean>>({});

  if (!isOpen || !dish) return null;

  const stats = dish.statistics;
  const allImages = [
    ...(dish.images || []),
    ...(dish.reviews?.flatMap((r) => r.images || []) || []).map((img, i) => ({
      id: img.id || `img-${i}`,
      menuItemId: dish.id,
      url: img.url,
      altText: img.caption || "Customer photo",
      isPrimary: false,
      displayOrder: i + 10,
    })),
  ];

  const currentImage = allImages[activeImageIdx]?.url || (dish.images && dish.images[0]?.url) || null;

  // Filter reviews
  const filteredReviews = (dish.reviews || [])
    .filter((r) => r.moderationStatus === "APPROVED")
    .filter((r) => {
      if (reviewFilter === "POSITIVE") return r.rating >= 4 || r.aiSentiment === "POSITIVE";
      if (reviewFilter === "CRITICAL") return r.rating <= 3;
      if (reviewFilter === "PHOTOS") return r.images && r.images.length > 0;
      return true;
    });

  const handleUpvote = (reviewId: string) => {
    if (upvotedReviews[reviewId]) return;
    const newCount = menuVerseStore.upvoteReview(reviewId);
    setUpvotedReviews((prev) => ({ ...prev, [reviewId]: newCount }));
  };

  const handleReport = (reviewId: string) => {
    if (reportedReviews[reviewId]) return;
    menuVerseStore.updateReviewModeration(reviewId, "FLAGGED", "Reported by diner for review");
    setReportedReviews((prev) => ({ ...prev, [reviewId]: true }));
    alert("Thank you. This review has been submitted to platform moderation for audit.");
  };

  const handleShare = () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      navigator.share({
        title: dish.name,
        text: `Check out ${dish.name} on MenuVerse!`,
        url: window.location.href,
      }).catch(() => {});
    } else if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      alert("Dish link copied to clipboard!");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white text-stone-900 rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-6 max-h-[92vh] flex flex-col">
        {/* Top Floating Close & Share */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
          <button
            onClick={handleShare}
            className="h-9 w-9 rounded-full bg-white/90 hover:bg-white text-stone-800 shadow-md backdrop-blur-md border border-stone-200 flex items-center justify-center transition-all hover:scale-105 active:scale-95"
            title="Share Dish"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="h-9 w-9 rounded-full bg-white/90 hover:bg-white text-stone-800 shadow-md backdrop-blur-md border border-stone-200 flex items-center justify-center transition-all hover:scale-105 active:scale-95"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Container */}
        <div className="overflow-y-auto flex-1 hide-scrollbar">
          {/* Main Gallery Hero */}
          <div className="relative h-56 sm:h-72 w-full bg-stone-100 overflow-hidden">
            {currentImage ? (
              <img
                src={currentImage}
                alt={dish.name}
                className="w-full h-full object-cover transition-all duration-500 ease-out"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-stone-800 via-stone-900 to-black flex items-center justify-center text-center p-6">
                <div className="space-y-1">
                  <span className="text-xs font-black text-orange-400 uppercase tracking-widest block">
                    Verified Culinary Item
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-white">
                    {dish.name}
                  </h2>
                </div>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

            {/* Badges Over Image */}
            <div className="absolute top-4 left-4 flex items-center gap-1.5 flex-wrap">
              {dish.isSignature && (
                <div className="bg-amber-500 text-stone-950 font-black text-xs px-3 py-1 rounded-full shadow-xl flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 fill-stone-950 text-stone-950 shrink-0" />
                  <span>Signature Dish</span>
                </div>
              )}
              {dish.isChefSpecial && (
                <div className="bg-rose-600 text-white font-bold text-xs px-3 py-1 rounded-full shadow-xl flex items-center gap-1.5">
                  <ChefHat className="w-3.5 h-3.5 text-white shrink-0" />
                  <span>Chef Special</span>
                </div>
              )}
            </div>

            {/* Bottom Info Over Image */}
            <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between text-white">
              <div>
                <span className="text-xs font-bold text-orange-400 uppercase tracking-wider">
                  Social Dish Item
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
                  {dish.name}
                </h2>
              </div>
              <div className="text-right">
                <span className="text-xl sm:text-2xl font-black text-orange-400">
                  {formatPrice(dish.price, dish.currency)}
                </span>
              </div>
            </div>
          </div>

          {/* Gallery Thumbnails Carousel */}
          {allImages.length > 1 && (
            <div className="flex gap-2 p-3 bg-stone-50 border-b border-stone-200 overflow-x-auto hide-scrollbar">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIdx(idx)}
                  className={`relative h-14 w-14 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                    activeImageIdx === idx
                      ? "border-orange-500 scale-105 shadow-md"
                      : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Main Body */}
          <div className="p-5 sm:p-6 space-y-6 bg-white">
            {/* Reputation Highlights Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200/80 text-center">
                <div className="flex items-center justify-center gap-1.5 text-amber-600">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="text-lg font-black text-stone-900">
                    {stats?.averageRating ? stats.averageRating.toFixed(1) : "5.0"} Stars
                  </span>
                </div>
                <span className="text-[11px] font-bold text-stone-600 uppercase mt-0.5 block">
                  Reviewed by {stats?.totalReviews || dish.reviews?.length || 12} Diners
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200/80 text-center">
                <div className="flex items-center justify-center gap-1 text-emerald-600">
                  <ThumbsUp className="w-4 h-4" />
                  <span className="text-lg font-black text-stone-900">
                    {stats?.recommendationPercentage || 95}%
                  </span>
                </div>
                <span className="text-[11px] font-bold text-stone-600 uppercase mt-0.5 block">
                  Recommend Rate
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-orange-50 border border-orange-200/80 text-center">
                <div className="flex items-center justify-center gap-1 text-orange-600">
                  <Camera className="w-4 h-4" />
                  <span className="text-base font-black text-stone-900">
                    {stats?.customerPhotoCount || allImages.length}
                  </span>
                </div>
                <span className="text-[10px] font-bold text-stone-600 uppercase mt-0.5 block">
                  Guest Snaps
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-200/80 text-center">
                <div className="flex items-center justify-center gap-1 text-purple-600">
                  <Flame className="w-4 h-4" />
                  <span className="text-base font-black text-stone-900">
                    #{Math.round(stats?.trendScore || 85)}
                  </span>
                </div>
                <span className="text-[10px] font-bold text-stone-600 uppercase mt-0.5 block">
                  Trend Velocity
                </span>
              </div>
            </div>

            {/* Description & Dietary */}
            <div className="space-y-2.5">
              <p className="text-sm text-stone-700 leading-relaxed font-medium">
                {dish.description}
              </p>

              <div className="flex items-center gap-2 flex-wrap text-xs">
                {dish.preparationTimeMinutes && (
                  <span className="inline-flex items-center gap-1 text-stone-600 font-semibold bg-stone-100 px-2.5 py-1 rounded-xl">
                    <Clock className="w-3.5 h-3.5 text-stone-500" /> {dish.preparationTimeMinutes} mins prep
                  </span>
                )}
                {dish.isVegetarian && (
                  <Badge variant="success">Vegetarian</Badge>
                )}
                {dish.isGlutenFree && (
                  <Badge variant="warning">Gluten-Free</Badge>
                )}
                {dish.spicyLevel > 0 && (
                  <Badge variant="hot">{getSpicyIcon(dish.spicyLevel)}</Badge>
                )}
              </div>
            </div>

            {/* Ingredients & Allergens */}
            {dish.ingredients && dish.ingredients.length > 0 && (
              <div className="space-y-1.5 p-4 rounded-2xl bg-stone-50 border border-stone-200/80 text-xs">
                <span className="font-bold text-stone-900">
                  Key Ingredients:
                </span>
                <p className="text-stone-700 font-medium leading-relaxed">
                  {dish.ingredients.join(" • ")}
                </p>
                {dish.allergens && dish.allergens.length > 0 && (
                  <p className="text-[11px] text-rose-600 font-bold pt-1">
                    Contains Allergens: {dish.allergens.join(", ")}
                  </p>
                )}
              </div>
            )}

            {/* AI Summary Card */}
            <AISummaryCard summary={dish.aiSummary} dishName={dish.name} />

            {/* Permanent Reviews Section Header */}
            <div className="space-y-4 pt-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200 pb-3">
                <div>
                  <h3 className="text-lg font-black text-stone-900 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-orange-500" />
                    Permanent Diner Review Feed
                  </h3>
                  <p className="text-xs text-stone-500 font-medium">
                    Public, unalterable feedback from real guests who tasted this dish
                  </p>
                </div>

                <Button
                  onClick={() => onOpenWriteReview(dish)}
                  className="bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl shadow-md shadow-orange-500/20 hover:scale-105 active:scale-95 transition-all"
                  size="sm"
                >
                  + Write Review
                </Button>
              </div>

              {/* Review Filters */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                <button
                  onClick={() => setReviewFilter("ALL")}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                    reviewFilter === "ALL"
                      ? "bg-stone-900 text-white shadow-xs"
                      : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                  }`}
                >
                  All ({dish.reviews?.length || 0})
                </button>
                <button
                  onClick={() => setReviewFilter("POSITIVE")}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-xl font-bold transition-all ${
                    reviewFilter === "POSITIVE"
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                  }`}
                >
                  <Star className="w-3 h-3 fill-current" />
                  <span>Positive (4-5 Stars)</span>
                </button>
                <button
                  onClick={() => setReviewFilter("PHOTOS")}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                    reviewFilter === "PHOTOS"
                      ? "bg-orange-600 text-white shadow-xs"
                      : "bg-orange-50 text-orange-700 hover:bg-orange-100"
                  }`}
                >
                  With Photos
                </button>
                <button
                  onClick={() => setReviewFilter("CRITICAL")}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                    reviewFilter === "CRITICAL"
                      ? "bg-rose-600 text-white shadow-xs"
                      : "bg-rose-50 text-rose-700 hover:bg-rose-100"
                  }`}
                >
                  Constructive
                </button>
              </div>

              {/* Review Feed List */}
              <div className="space-y-4">
                {filteredReviews.length === 0 ? (
                  <div className="text-center py-8 text-stone-500 text-xs font-medium">
                    No reviews in this filter yet. Be the first to share!
                  </div>
                ) : (
                  filteredReviews.map((rev) => {
                    const sentimentStyle = getSentimentColor(rev.aiSentiment);
                    const currentHelpful = upvotedReviews[rev.id] || rev.helpfulVotes;
                    const isReported = reportedReviews[rev.id];

                    return (
                      <div
                        key={rev.id}
                        className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-3 transition-all hover:shadow-md hover:border-orange-300"
                      >
                        {/* Review User & Rating */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <div className="h-9 w-9 rounded-full overflow-hidden bg-stone-200 shrink-0">
                              {rev.avatarUrl ? (
                                <img src={rev.avatarUrl} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center font-black text-xs text-stone-600">
                                  {rev.displayName.charAt(0)}
                                </div>
                              )}
                            </div>

                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-xs text-stone-900">
                                  {rev.displayName}
                                </span>
                                <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-700 font-bold border border-emerald-200">
                                  Verified Diner
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-[11px] text-stone-500">
                                <StarRating rating={rev.rating} size="sm" />
                                <span>•</span>
                                <span>{formatRelativeTime(rev.createdAt)}</span>
                              </div>
                            </div>
                          </div>

                          <div className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${sentimentStyle.bg} ${sentimentStyle.text} border border-current/20`}>
                            AI: {rev.aiSentiment}
                          </div>
                        </div>

                        {/* Review Text */}
                        <p className="text-xs sm:text-sm text-stone-800 leading-relaxed font-medium">
                          {rev.reviewText}
                        </p>

                        {/* Attached Photos */}
                        {rev.images && rev.images.length > 0 && (
                          <div className="flex gap-2 overflow-x-auto pt-1 hide-scrollbar">
                            {rev.images.map((img, i) => (
                              <div
                                key={i}
                                className="relative h-24 w-24 rounded-xl overflow-hidden shrink-0 border border-stone-200 shadow-sm"
                              >
                                <img src={img.url} alt={img.caption || ""} className="w-full h-full object-cover" />
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Owner Reply Bubble */}
                        {rev.ownerReplyText && (
                          <div className="p-3 rounded-xl bg-orange-50/80 border border-orange-200 space-y-1 ml-4 text-xs">
                            <div className="flex items-center gap-1.5 text-orange-700 font-bold text-[11px]">
                              <ChefHat className="w-3.5 h-3.5" />
                              <span>Restaurant Response</span>
                              {rev.ownerRepliedAt && (
                                <span className="text-stone-500 font-normal">
                                  • {formatRelativeTime(rev.ownerRepliedAt)}
                                </span>
                              )}
                            </div>
                            <p className="text-stone-700 italic font-medium">
                              "{rev.ownerReplyText}"
                            </p>
                          </div>
                        )}

                        {/* Review Action Buttons */}
                        <div className="flex items-center justify-between pt-1 border-t border-stone-200 text-xs">
                          <button
                            onClick={() => handleUpvote(rev.id)}
                            className="flex items-center gap-1 text-stone-600 hover:text-orange-600 transition-colors font-bold"
                          >
                            <ThumbsUp className="w-3.5 h-3.5" />
                            <span>Helpful ({currentHelpful})</span>
                          </button>

                          <button
                            onClick={() => handleReport(rev.id)}
                            disabled={isReported}
                            className="flex items-center gap-1 text-stone-400 hover:text-rose-600 text-[11px] transition-colors font-semibold"
                          >
                            <ShieldAlert className="w-3.5 h-3.5" />
                            <span>{isReported ? "Reported" : "Report"}</span>
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
