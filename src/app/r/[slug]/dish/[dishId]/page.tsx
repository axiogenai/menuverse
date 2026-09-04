"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, 
  Star, 
  ThumbsUp, 
  Camera, 
  MessageSquare, 
  ChefHat, 
  Share2, 
  Clock, 
  Flame 
} from "lucide-react";
import { MenuItem } from "@/types";
import { menuVerseStore } from "@/lib/seed-data";
import { formatPrice, formatRelativeTime, getSpicyIcon, getSentimentColor } from "@/lib/utils";
import { StarRating } from "@/components/shared/StarRating";
import { Button } from "@/components/ui/button";
import { AISummaryCard } from "@/components/public/AISummaryCard";
import { WriteReviewModal } from "@/components/public/WriteReviewModal";

export default function StandaloneDishSocialPage() {
  const params = useParams();
  const slug = (params?.slug as string) || "hotel-gypsy";
  const dishId = (params?.dishId as string) || "dish-01";

  const [dish, setDish] = useState<MenuItem | null>(
    () => menuVerseStore.getDishById(dishId) || menuVerseStore.getDishById("dish-01") || null
  );
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [isWriteReviewOpen, setIsWriteReviewOpen] = useState(false);
  const [upvotedReviews, setUpvotedReviews] = useState<Record<string, number>>({});

  useEffect(() => {
    const d = menuVerseStore.getDishById(dishId) || menuVerseStore.getDishById("dish-01");
    if (d) setDish(d);
  }, [dishId]);

  if (!dish) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[#faf8f5]">
        <div className="text-center space-y-3">
          <p className="text-stone-500 font-medium">Loading social dish object...</p>
          <Link href={`/r/${slug}`}>
            <Button variant="outline" className="bg-white border-stone-200">Back to Menu</Button>
          </Link>
        </div>
      </div>
    );
  }

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

  const currentImage = allImages[activeImageIdx]?.url || dish.images[0]?.url || "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=800&q=80";

  const handleUpvote = (reviewId: string) => {
    if (upvotedReviews[reviewId]) return;
    const newCount = menuVerseStore.upvoteReview(reviewId);
    setUpvotedReviews((prev) => ({ ...prev, [reviewId]: newCount }));
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
    <div className="min-h-screen bg-[#faf8f5] text-stone-900 pb-20">
      <div className="container mx-auto max-w-4xl px-4 pt-6 space-y-6">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between">
          <Link
            href={`/r/${slug}`}
            className="flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-stone-950 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Full Menu</span>
          </Link>

          <Button
            onClick={handleShare}
            variant="outline"
            size="sm"
            className="rounded-xl border-stone-200 bg-white text-stone-700 hover:bg-stone-50 flex items-center gap-1.5 font-bold shadow-xs hover:scale-105 active:scale-95 transition-all"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share Dish</span>
          </Button>
        </div>

        {/* Hero Gallery */}
        <div className="relative h-72 sm:h-96 w-full rounded-3xl overflow-hidden bg-stone-100 border border-stone-200/80 shadow-xl">
          <img
            src={currentImage}
            alt={dish.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

          {/* Top Badges */}
          <div className="absolute top-4 left-4 flex items-center gap-2">
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

          {/* Bottom Title */}
          <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between">
            <div>
              <span className="text-xs font-bold text-orange-400 uppercase tracking-wider">
                Social Dish Item
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-white">
                {dish.name}
              </h1>
            </div>
            <div className="text-right">
              <span className="text-2xl sm:text-3xl font-black text-orange-400">
                {formatPrice(dish.price, dish.currency)}
              </span>
            </div>
          </div>
        </div>

        {/* Thumbnail Carousel */}
        {allImages.length > 1 && (
          <div className="flex gap-2.5 overflow-x-auto pb-2 hide-scrollbar">
            {allImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIdx(idx)}
                className={`relative h-16 w-16 rounded-2xl overflow-hidden shrink-0 border-2 transition-all ${
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

        {/* Stats Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-4 rounded-3xl bg-white border border-stone-200/80 text-center shadow-xs">
            <div className="flex items-center justify-center gap-1.5 text-amber-500">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="text-xl font-black text-stone-900">{stats?.averageRating ? stats.averageRating.toFixed(1) : "5.0"} Stars</span>
            </div>
            <span className="text-[11px] font-bold text-stone-500 uppercase mt-0.5 block">
              Reviewed by {stats?.totalReviews || dish.reviews?.length || 12} Diners
            </span>
          </div>

          <div className="p-4 rounded-3xl bg-white border border-stone-200/80 text-center shadow-xs">
            <div className="flex items-center justify-center gap-1 text-emerald-600">
              <ThumbsUp className="w-4 h-4" />
              <span className="text-xl font-black text-stone-900">{stats?.recommendationPercentage || 95}%</span>
            </div>
            <span className="text-[11px] font-bold text-stone-500 uppercase mt-0.5 block">
              Recommendation Rate
            </span>
          </div>

          <div className="p-4 rounded-3xl bg-white border border-stone-200/80 text-center shadow-xs">
            <div className="flex items-center justify-center gap-1 text-orange-600">
              <Camera className="w-4 h-4" />
              <span className="text-xl font-black text-stone-900">{stats?.customerPhotoCount || allImages.length}</span>
            </div>
            <span className="text-[10px] font-bold text-stone-500 uppercase">
              Customer Snaps
            </span>
          </div>

          <div className="p-4 rounded-3xl bg-white border border-stone-200/80 text-center shadow-xs">
            <div className="flex items-center justify-center gap-1 text-purple-600">
              <Flame className="w-4 h-4" />
              <span className="text-xl font-black text-stone-900">#{Math.round(stats?.trendScore || 88)}</span>
            </div>
            <span className="text-[10px] font-bold text-stone-500 uppercase">
              Trend Rank
            </span>
          </div>
        </div>

        {/* AI Summary Card */}
        <AISummaryCard summary={dish.aiSummary} dishName={dish.name} />

        {/* Permanent Review Feed */}
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between border-b border-stone-200 pb-3">
            <div>
              <h2 className="text-xl font-black text-stone-900 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-orange-500" />
                Permanent Diner Reviews
              </h2>
              <p className="text-xs text-stone-500 font-medium">Public customer reviews & photo uploads</p>
            </div>
            <Button
              onClick={() => setIsWriteReviewOpen(true)}
              className="bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl shadow-md shadow-orange-500/20 hover:scale-105 active:scale-95 transition-all"
            >
              + Write Review
            </Button>
          </div>

          <div className="space-y-4">
            {dish.reviews?.map((rev) => {
              const sentimentStyle = getSentimentColor(rev.aiSentiment);
              const currentHelpful = upvotedReviews[rev.id] || rev.helpfulVotes;

              return (
                <div
                  key={rev.id}
                  className="p-5 rounded-3xl bg-white border border-stone-200/80 space-y-3 shadow-xs hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full overflow-hidden bg-stone-100">
                        {rev.avatarUrl ? (
                          <img src={rev.avatarUrl} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center font-bold text-stone-600">
                            {rev.displayName.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-stone-900">{rev.displayName}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 font-bold border border-emerald-200">
                            Verified Diner
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-stone-500">
                          <StarRating rating={rev.rating} size="sm" />
                          <span>•</span>
                          <span>{formatRelativeTime(rev.createdAt)}</span>
                        </div>
                      </div>
                    </div>

                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${sentimentStyle.bg} ${sentimentStyle.text} border border-current/20`}>
                      AI: {rev.aiSentiment}
                    </span>
                  </div>

                  <p className="text-sm text-stone-700 leading-relaxed font-medium">
                    {rev.reviewText}
                  </p>

                  {rev.images && rev.images.length > 0 && (
                    <div className="flex gap-2 overflow-x-auto pt-1 hide-scrollbar">
                      {rev.images.map((img, i) => (
                        <div key={i} className="h-28 w-28 rounded-xl overflow-hidden border border-stone-200 shadow-sm shrink-0">
                          <img src={img.url} alt="" className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  )}

                  {rev.ownerReplyText && (
                    <div className="p-3.5 rounded-2xl bg-orange-50 border border-orange-200 space-y-1 ml-4 text-xs">
                      <div className="flex items-center gap-1.5 text-orange-700 font-bold">
                        <ChefHat className="w-4 h-4" />
                        <span>Official Restaurant Response</span>
                      </div>
                      <p className="text-stone-700 italic font-medium">"{rev.ownerReplyText}"</p>
                    </div>
                  )}

                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                    <button
                      onClick={() => handleUpvote(rev.id)}
                      className="flex items-center gap-1 text-stone-600 hover:text-orange-600 font-bold transition-colors"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>Helpful ({currentHelpful})</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {isWriteReviewOpen && (
        <WriteReviewModal
          dish={dish}
          isOpen={isWriteReviewOpen}
          onClose={() => setIsWriteReviewOpen(false)}
          onReviewSubmitted={() => {
            const updated = menuVerseStore.getDishById(dish.id);
            if (updated) setDish(updated);
          }}
        />
      )}
    </div>
  );
}
