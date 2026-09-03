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
  ChefHat
} from "lucide-react";
import { MenuItem } from "@/types";
import { formatPrice, formatRelativeTime, getSpicyIcon, getSentimentColor, cn } from "@/lib/utils";
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
  dish: initialDish,
  isOpen,
  onClose,
  onOpenWriteReview,
}: DishDetailModalProps) {
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [reviewFilter, setReviewFilter] = useState<"ALL" | "POSITIVE" | "PHOTOS" | "CRITICAL">("ALL");
  const [upvotedReviews, setUpvotedReviews] = useState<Record<string, number>>({});
  const [reportedReviews, setReportedReviews] = useState<Record<string, boolean>>({});
  const [liveDish, setLiveDish] = useState<MenuItem | null>(initialDish);

  // Reset active image index whenever modal opens or dish changes
  React.useEffect(() => {
    if (isOpen) {
      setActiveImageIdx(0);
      setReviewFilter("ALL");
    }
  }, [isOpen, initialDish?.id]);

  // Sync when initialDish changes or store notifies
  React.useEffect(() => {
    setLiveDish(initialDish);
  }, [initialDish]);

  React.useEffect(() => {
    if (!initialDish) return;
    const update = () => {
      const fresh = menuVerseStore.getDishById(initialDish.id);
      if (fresh) setLiveDish({ ...fresh });
    };
    const unsubscribe = menuVerseStore.subscribe(update);
    return () => unsubscribe();
  }, [initialDish?.id]);

  if (!isOpen || !liveDish) return null;

  const dish = liveDish;
  const stats = dish.statistics;

  // Collect and strictly sanitize all valid image URLs (deduplicated)
  const rawImages = [
    ...(dish.images || []),
    ...(dish.reviews?.flatMap((r) => r.images || []) || []).map((img, i) => ({
      id: img.id || `img-rev-${i}`,
      menuItemId: dish.id,
      url: img.url,
      altText: img.caption || "Customer photo",
      isPrimary: false,
      displayOrder: i + 10,
    })),
  ];

  const seenUrls = new Set<string>();
  const allImages: { id: string; url: string; isPrimary?: boolean }[] = [];
  for (const img of rawImages) {
    if (img && typeof img.url === "string" && img.url.trim().startsWith("http")) {
      const cleanUrl = img.url.trim();
      if (!seenUrls.has(cleanUrl)) {
        seenUrls.add(cleanUrl);
        allImages.push({
          id: img.id,
          url: cleanUrl,
          isPrimary: img.isPrimary,
        });
      }
    }
  }

  // Guaranteed fallback image if dish has no valid images
  if (allImages.length === 0) {
    allImages.push({
      id: `fallback-${dish.id}`,
      url: "https://images.unsplash.com/photo-1621996346565-e3d5d6281292?auto=format&fit=crop&w=2560&q=90",
      isPrimary: true,
    });
  }

  const safeImageIdx = (activeImageIdx >= 0 && activeImageIdx < allImages.length) ? activeImageIdx : 0;
  const currentImage = allImages[safeImageIdx]?.url;

  // Filter reviews and sort newest first
  const filteredReviews = (dish.reviews || [])
    .filter((r) => r.moderationStatus === "APPROVED")
    .filter((r) => {
      if (reviewFilter === "POSITIVE") return r.rating >= 4 || r.aiSentiment === "POSITIVE";
      if (reviewFilter === "CRITICAL") return r.rating <= 3;
      if (reviewFilter === "PHOTOS") return r.images && r.images.length > 0;
      return true;
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/60 backdrop-blur-xs animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-md bg-white text-stone-900 rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-3 max-h-[85vh] flex flex-col">
        {/* Top Floating Close Button */}
        <div className="absolute top-3 right-3 z-20">
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-full bg-white/95 hover:bg-white text-stone-700 hover:text-stone-950 shadow-md backdrop-blur-md border border-stone-200/90 flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95"
            title="Close"
          >
            <X className="w-4 h-4 stroke-[2.2]" />
          </button>
        </div>

        {/* Scrollable Container */}
        <div className="overflow-y-auto flex-1 hide-scrollbar">
          {/* Main Gallery Hero - Flawless Centered Food Viewport with Ambient Backdrop */}
          <div className="relative h-56 sm:h-64 w-full bg-stone-900 overflow-hidden flex items-center justify-center border-b border-stone-100">
            {currentImage ? (
              <>
                {/* Ambient Blurred Backdrop ensures vertical, square, or wide photos blend seamlessly */}
                <img
                  key={`bg-${currentImage}`}
                  src={currentImage}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover blur-xl scale-125 opacity-35 pointer-events-none"
                  aria-hidden="true"
                />
                <img
                  key={`main-${currentImage}`}
                  src={currentImage}
                  alt={dish.name}
                  className="relative z-10 w-full h-full object-cover object-center transition-all duration-300 ease-out"
                />
              </>
            ) : (
              <div className="w-full h-full bg-stone-100 flex items-center justify-center text-center p-4">
                <ChefHat className="w-8 h-8 text-stone-400" />
              </div>
            )}

            {/* Badges Over Image */}
            <div className="absolute top-2.5 left-2.5 z-20 flex items-center gap-1 flex-wrap">
              {dish.isSignature && (
                <div className="bg-white/95 text-stone-900 font-semibold text-[10px] px-2 py-0.5 rounded shadow-xs flex items-center gap-1 backdrop-blur-xs">
                  <Star className="w-3 h-3 fill-amber-500 text-amber-500 shrink-0" />
                  <span>Signature</span>
                </div>
              )}
              {dish.isChefSpecial && (
                <div className="bg-amber-600 text-white font-semibold text-[10px] px-2 py-0.5 rounded shadow-xs flex items-center gap-1">
                  <ChefHat className="w-3 h-3 text-white shrink-0" />
                  <span>Chef Special</span>
                </div>
              )}
            </div>
          </div>

          {/* Gallery Thumbnails Carousel */}
          {allImages.length > 1 && (
            <div className="flex gap-2 p-2.5 bg-stone-50 border-b border-stone-200 overflow-x-auto hide-scrollbar">
              {allImages.map((img, idx) => (
                <button
                  key={img.id || idx}
                  type="button"
                  onClick={() => setActiveImageIdx(idx)}
                  className={`relative h-12 w-12 rounded-lg overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                    safeImageIdx === idx
                      ? "border-amber-500 ring-2 ring-amber-500/40 shadow-xs scale-105"
                      : "border-stone-200 opacity-70 hover:opacity-100"
                  }`}
                >
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Main Body */}
          <div className="p-4 space-y-3.5 bg-white">
            {/* Title & Price Header */}
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <h2 className="text-base sm:text-lg font-bold text-stone-900 leading-tight">
                  {dish.name}
                </h2>
              </div>
              <div className="text-right shrink-0">
                <span className="text-base sm:text-lg font-bold font-mono text-stone-900">
                  {formatPrice(dish.price, dish.currency)}
                </span>
              </div>
            </div>

            {/* Slim Unified Reputation Metrics Strip */}
            <div className="grid grid-cols-4 divide-x divide-stone-200 rounded-xl bg-stone-50 border border-stone-200/90 py-2 px-1 text-center">
              <div>
                <div className="flex items-center justify-center gap-0.5 text-xs font-bold text-stone-900 font-mono">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500 shrink-0" />
                  <span>{stats?.averageRating ? stats.averageRating.toFixed(1) : "5.0"}</span>
                </div>
                <span className="text-[10px] text-stone-500 block">Rating</span>
              </div>

              <div>
                <div className="text-[11px] font-bold text-stone-900 font-mono">
                  {stats?.recommendationPercentage || 100}%
                </div>
                <span className="text-[9px] text-stone-500 block">Recommend</span>
              </div>

              <div>
                <div className="text-[11px] font-bold text-stone-900 font-mono">
                  {stats?.customerPhotoCount || allImages.length}
                </div>
                <span className="text-[9px] text-stone-500 block">Photos</span>
              </div>

              <div>
                <div className="text-[11px] font-bold text-stone-900 font-mono">
                  #{Math.round(stats?.trendScore || 23)}
                </div>
                <span className="text-[9px] text-stone-500 block">Velocity</span>
              </div>
            </div>

            {/* Description & Dietary */}
            <div className="space-y-2">
              <p className="text-xs text-stone-600 leading-relaxed font-normal">
                {dish.description}
              </p>

              <div className="flex items-center gap-1.5 flex-wrap text-xs">
                {dish.preparationTimeMinutes && (
                  <span className="inline-flex items-center gap-1 text-stone-600 font-medium bg-stone-100 px-2 py-0.5 rounded text-[11px] border border-stone-200/60">
                    <Clock className="w-3 h-3 text-stone-400" /> {dish.preparationTimeMinutes} mins prep
                  </span>
                )}
                {dish.isVegetarian && (
                  <Badge variant="success" className="text-[10px] py-0 px-2">Vegetarian</Badge>
                )}
                {dish.isGlutenFree && (
                  <Badge variant="warning" className="text-[10px] py-0 px-2">Gluten-Free</Badge>
                )}
                {dish.spicyLevel > 0 && (
                  <Badge variant="hot" className="text-[10px] py-0 px-2">{getSpicyIcon(dish.spicyLevel)}</Badge>
                )}
              </div>
            </div>

            {/* Ingredients & Allergens */}
            {dish.ingredients && dish.ingredients.length > 0 && (
              <div className="space-y-1 p-3 rounded-xl bg-stone-50 border border-stone-200/80 text-xs">
                <span className="font-semibold text-stone-900 block text-[11px]">
                  Key Ingredients:
                </span>
                <p className="text-stone-600 font-normal leading-relaxed text-[11px]">
                  {dish.ingredients.join(" • ")}
                </p>
                {dish.allergens && dish.allergens.length > 0 && (
                  <p className="text-[10px] text-rose-600 font-semibold pt-0.5">
                    Contains Allergens: {dish.allergens.join(", ")}
                  </p>
                )}
              </div>
            )}

            {/* AI Summary Card */}
            <AISummaryCard summary={dish.aiSummary} dishName={dish.name} />

            {/* Reviews Section */}
            <div className="space-y-3 pt-1 border-t border-stone-100">
              <div className="flex items-center justify-between gap-2 pt-1">
                <div>
                  <h3 className="text-xs font-bold text-stone-900 flex items-center gap-1.5 uppercase tracking-wider">
                    <MessageSquare className="w-3.5 h-3.5 text-stone-600" />
                    Verified Diner Reviews
                  </h3>
                </div>

                <Button
                  onClick={() => onOpenWriteReview(dish)}
                  className="bg-stone-900 hover:bg-stone-800 text-white font-semibold rounded-lg text-xs h-7.5 px-2.5 shadow-xs cursor-pointer"
                  size="sm"
                >
                  + Write Review
                </Button>
              </div>

              {/* Review Filters */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs hide-scrollbar">
                <button
                  onClick={() => setReviewFilter("ALL")}
                  className={cn(
                    "px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer border",
                    reviewFilter === "ALL"
                      ? "bg-stone-900 text-white border-stone-900 font-semibold shadow-xs"
                      : "bg-white text-stone-600 hover:bg-stone-50 border-stone-200"
                  )}
                >
                  All ({dish.reviews?.length || 0})
                </button>
                <button
                  onClick={() => setReviewFilter("POSITIVE")}
                  className={cn(
                    "flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer border",
                    reviewFilter === "POSITIVE"
                      ? "bg-emerald-600 text-white border-emerald-600 font-semibold shadow-xs"
                      : "bg-white text-emerald-700 hover:bg-emerald-50 border-emerald-200"
                  )}
                >
                  <Star className="w-3 h-3 fill-current" />
                  <span>Positive</span>
                </button>
                <button
                  onClick={() => setReviewFilter("PHOTOS")}
                  className={cn(
                    "px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer border",
                    reviewFilter === "PHOTOS"
                      ? "bg-amber-600 text-white border-amber-600 font-semibold shadow-xs"
                      : "bg-white text-stone-600 hover:bg-stone-50 border-stone-200"
                  )}
                >
                  With Photos
                </button>
                <button
                  onClick={() => setReviewFilter("CRITICAL")}
                  className={cn(
                    "px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer border",
                    reviewFilter === "CRITICAL"
                      ? "bg-rose-600 text-white border-rose-600 font-semibold shadow-xs"
                      : "bg-white text-rose-700 hover:bg-rose-50 border-rose-200"
                  )}
                >
                  Constructive
                </button>
              </div>

              {/* Review Feed List */}
              <div className="space-y-2.5">
                {filteredReviews.length === 0 ? (
                  <div className="text-center py-6 text-stone-400 text-xs font-normal">
                    No reviews in this category yet.
                  </div>
                ) : (
                  filteredReviews.map((rev) => {
                    const sentimentStyle = getSentimentColor(rev.aiSentiment);
                    const currentHelpful = upvotedReviews[rev.id] || rev.helpfulVotes;
                    const isReported = reportedReviews[rev.id];

                    return (
                      <div
                        key={rev.id}
                        className="p-3.5 rounded-2xl bg-stone-50/80 border border-stone-200/90 space-y-2.5 text-xs shadow-2xs"
                      >
                        {/* Review Header, Text & Right-Aligned Photo Thumbnail */}
                        <div className="flex items-start justify-between gap-3">
                          {/* Left Column: Author info & Review Text */}
                          <div className="space-y-1.5 flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <div className="h-7 w-7 rounded-full overflow-hidden bg-stone-200 shrink-0 border border-stone-200 shadow-2xs flex items-center justify-center text-[11px] font-bold text-stone-700">
                                {rev.avatarUrl ? (
                                  <img src={rev.avatarUrl} alt="" className="w-full h-full object-cover" />
                                ) : (
                                  <span>{rev.displayName.charAt(0)}</span>
                                )}
                              </div>

                              <div className="min-w-0">
                                <span className="font-bold text-xs text-stone-900 block truncate leading-tight">
                                  {rev.displayName}
                                </span>
                                <div className="flex items-center gap-1.5 text-[10px] text-stone-400 mt-0.5">
                                  <StarRating rating={rev.rating} size="sm" />
                                  <span>•</span>
                                  <span>{formatRelativeTime(rev.createdAt)}</span>
                                </div>
                              </div>
                            </div>

                            {/* Review Text */}
                            <p className="text-xs text-stone-700 leading-relaxed font-normal pt-0.5">
                              {rev.reviewText}
                            </p>
                          </div>

                          {/* Right Column: Clean Attached Photo Thumbnail */}
                          {rev.images && rev.images.length > 0 && (
                            <div className="shrink-0 flex items-center gap-1.5 pt-0.5">
                              {rev.images.map((img, i) => (
                                <div
                                  key={i}
                                  className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-xl overflow-hidden shrink-0 border border-stone-200/90 shadow-xs bg-stone-100 cursor-pointer hover:opacity-90 hover:scale-105 transition-all"
                                >
                                  <img
                                    src={img.url}
                                    alt={img.caption || "Review photo"}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Owner Reply */}
                        {rev.ownerReplyText && (
                          <div className="p-2.5 rounded-xl bg-stone-100/90 border border-stone-200 space-y-1 ml-2 text-xs">
                            <div className="flex items-center gap-1 text-stone-800 font-semibold text-[10px]">
                              <ChefHat className="w-3 h-3 text-amber-700" />
                              <span>Restaurant Response</span>
                            </div>
                            <p className="text-stone-600 italic font-normal text-[11px]">
                              &quot;{rev.ownerReplyText}&quot;
                            </p>
                          </div>
                        )}

                        {/* Helpful / Report Actions */}
                        <div className="flex items-center justify-between pt-2 border-t border-stone-200/60 text-[11px]">
                          <button
                            onClick={() => handleUpvote(rev.id)}
                            className="flex items-center gap-1 text-stone-500 hover:text-stone-900 transition-colors font-medium cursor-pointer"
                          >
                            <ThumbsUp className="w-3.5 h-3.5" />
                            <span>Helpful ({currentHelpful})</span>
                          </button>

                          <button
                            onClick={() => handleReport(rev.id)}
                            disabled={isReported}
                            className="flex items-center gap-1 text-stone-400 hover:text-rose-600 text-[10px] transition-colors cursor-pointer"
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
