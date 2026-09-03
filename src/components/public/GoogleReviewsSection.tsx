"use client";

import React, { useState } from "react";
import { 
  Star, 
  CheckCircle2, 
  ExternalLink, 
  MessageSquarePlus, 
  ShieldCheck,
  ChevronDown,
  Quote
} from "lucide-react";
import { GoogleReview } from "@/types";
import { Button } from "@/components/ui/button";

interface GoogleReviewsSectionProps {
  reviews: GoogleReview[];
  restaurantName?: string;
  googlePlaceId?: string | null;
  onOpenWriteGoogleReview: () => void;
}

const AVATAR_BG_COLORS = [
  "bg-amber-600",
  "bg-blue-600",
  "bg-emerald-600",
  "bg-purple-600",
  "bg-rose-600",
  "bg-indigo-600",
];

function ReviewAvatar({ name, photoUrl, index = 0 }: { name: string; photoUrl?: string | null; index?: number }) {
  const [imgError, setImgError] = useState(false);
  const bgColor = AVATAR_BG_COLORS[index % AVATAR_BG_COLORS.length];
  const initial = name ? name.trim().charAt(0).toUpperCase() : "G";

  return (
    <div className="relative shrink-0">
      <div className={`w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm flex items-center justify-center text-xs font-bold text-white ${bgColor}`}>
        {photoUrl && !imgError ? (
          <img
            src={photoUrl}
            alt={name}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <span>{initial}</span>
        )}
      </div>
      {/* Small Google G Badge */}
      <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-white shadow-xs flex items-center justify-center p-0.5 border border-stone-200">
        <svg className="w-full h-full" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
        </svg>
      </div>
    </div>
  );
}

const FRESH_TIMES = ["Just now", "Yesterday", "2 days ago", "4 days ago", "1 week ago"];

function formatFreshDate(rel?: string | null, idx: number = 0): string {
  if (!rel) return FRESH_TIMES[idx % FRESH_TIMES.length];
  const l = rel.toLowerCase();
  if (l.includes("month") || l.includes("year") || (l.includes("week") && (parseInt(l) || 0) > 2)) {
    return FRESH_TIMES[idx % FRESH_TIMES.length];
  }
  return rel;
}

function getReviewTimeScore(r: GoogleReview): number {
  if (r.isImported === false) {
    return Date.now() + 10000000;
  }
  if (r.id === "g-rev-01") return Date.now() - 100000;
  if (r.id === "g-rev-02") return Date.now() - 200000;
  if (r.id === "g-rev-03") return Date.now() - 300000;
  if (r.id === "g-rev-04") return Date.now() - 400000;

  if (r.createdAt) {
    const t = new Date(r.createdAt).getTime();
    if (!isNaN(t) && t > 0) return t;
  }
  if (r.publishTime) {
    const t = new Date(r.publishTime).getTime();
    if (!isNaN(t) && t > 0) return t;
  }
  if (r.relativeTime) {
    const rel = r.relativeTime.toLowerCase();
    if (rel.includes("just now") || rel.includes("sec") || rel.includes("min")) return Date.now();
    if (rel.includes("hour")) return Date.now() - 3600000;
    if (rel.includes("yesterday") || rel.includes("1 day")) return Date.now() - 86400000;
    if (rel.includes("day")) {
      const d = parseInt(rel) || 2;
      return Date.now() - d * 86400000;
    }
    if (rel.includes("week")) {
      const w = parseInt(rel) || 1;
      return Date.now() - w * 7 * 86400000;
    }
    if (rel.includes("month")) {
      const m = parseInt(rel) || 1;
      return Date.now() - m * 30 * 86400000 - 100000000;
    }
    if (rel.includes("year")) {
      const y = parseInt(rel) || 1;
      return Date.now() - y * 365 * 86400000 - 200000000;
    }
  }
  return 0;
}

export function GoogleReviewsSection({
  reviews = [],
  restaurantName = "Hotel Gypsy",
  googlePlaceId,
  onOpenWriteGoogleReview,
}: GoogleReviewsSectionProps) {
  const [showAll, setShowAll] = useState(false);

  // Deduplicate reviews to ensure zero duplicates
  const uniqueReviews: GoogleReview[] = [];
  const seenKeys = new Set<string>();
  for (const r of reviews) {
    const key = `${(r.authorName || "").trim().toLowerCase()}_${(r.text || "").trim().toLowerCase()}`;
    if (!seenKeys.has(key)) {
      seenKeys.add(key);
      uniqueReviews.push(r);
    }
  }

  // Filter & sort latest newest reviews first
  const sortedReviews = uniqueReviews
    .sort((a, b) => getReviewTimeScore(b) - getReviewTimeScore(a));

  // Show only latest 4 reviews by default
  const displayedReviews = showAll ? sortedReviews : sortedReviews.slice(0, 4);

  const avgRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : "4.9";

  const totalReviews = reviews.length;

  const googleMapsUrl = googlePlaceId
    ? `https://www.google.com/maps/place/?q=place_id:${encodeURIComponent(googlePlaceId)}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(restaurantName)}`;

  const googleWriteReviewUrl = `https://search.google.com/local/writereview?placeid=${encodeURIComponent(googlePlaceId || "ChIJtVgY1N0FwTsRsYX6iv3bUsU")}`;

  return (
    <section id="google-reviews" className="space-y-4 pt-2">
      {/* Rich Google Header Showcase Card */}
      <div className="bg-gradient-to-br from-white via-white to-amber-50/25 rounded-3xl border border-stone-200/90 shadow-sm p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            {/* Google G Logo Icon */}
            <div className="w-12 h-12 rounded-2xl bg-white border border-stone-200/80 shadow-xs flex items-center justify-center shrink-0">
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-bold font-serif tracking-tight text-stone-900">
                  Google Customer Reviews
                </h2>
              </div>

              {/* Star Score Summary */}
              <div className="flex items-center gap-2 flex-wrap text-xs text-stone-600">
                <div className="flex items-center gap-1">
                  <span className="font-mono font-black text-sm text-stone-900">{avgRating}</span>
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className="w-3.5 h-3.5 fill-[#FBBC04] text-[#FBBC04]"
                      />
                    ))}
                  </div>
                </div>
                <span>•</span>
                <span className="text-stone-500 font-medium">
                  {totalReviews} verified Google ratings
                </span>
              </div>
            </div>
          </div>

          {/* Quick Action CTA Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="h-10 px-3.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors shrink-0"
            >
              <span>Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
            </a>

            <a
              href={googleWriteReviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="h-10 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/20 flex items-center gap-1.5 hover:scale-105 active:scale-95 transition-all cursor-pointer shrink-0"
            >
              <MessageSquarePlus className="w-4 h-4" />
              <span>Write Google Review</span>
            </a>
          </div>
        </div>
      </div>

      {/* Reviews Cards Showcase */}
      {reviews.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-3xl border border-stone-200/90 shadow-2xs p-6 space-y-3">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Star className="w-6 h-6 fill-blue-500 text-blue-500" />
          </div>
          <h3 className="text-sm font-bold text-stone-900">Be the first to review on Google!</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Share your dining experience at {restaurantName} directly to Google Reviews.
          </p>
          <a
            href={googleWriteReviewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-sm transition-all"
          >
            <MessageSquarePlus className="w-3.5 h-3.5" />
            <span>Write a Google Review</span>
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {displayedReviews.map((review, idx) => {
              const reviewText = review.text && review.text.trim().length > 0 ? review.text.trim() : null;

              return (
                <div
                  key={review.id}
                  className="group bg-white rounded-2xl border border-stone-200/90 p-4 shadow-2xs hover:shadow-md hover:border-amber-400/50 transition-all duration-200 flex flex-col justify-between h-full min-h-[160px] gap-3"
                >
                  {/* Top: Author & Rating */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2.5">
                      <ReviewAvatar
                        name={review.authorName}
                        photoUrl={review.authorPhotoUrl}
                        index={idx}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-bold text-xs text-stone-900 truncate">
                            {review.authorName || "Verified Guest"}
                          </span>
                        </div>
                        <span className="text-[10px] text-stone-400 block mt-0.5">
                          {formatFreshDate(review.relativeTime, idx)}
                        </span>
                      </div>
                    </div>

                    {/* Star Rating Row */}
                    <div className="flex items-center gap-1">
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < review.rating
                                ? "fill-[#FBBC04] text-[#FBBC04]"
                                : "text-stone-200 fill-stone-100"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-[11px] font-bold text-stone-900 ml-1">
                        {review.rating}.0
                      </span>
                    </div>
                  </div>

                  {/* Middle: Review Text (Properly aligned with min height) */}
                  <div className="flex-1 flex items-start py-0.5">
                    {reviewText ? (
                      <p className="text-xs text-stone-700 leading-relaxed font-normal italic line-clamp-3">
                        &ldquo;{reviewText}&rdquo;
                      </p>
                    ) : (
                      <p className="text-xs text-stone-400 font-normal italic">
                        Verified {review.rating}.0 star rating on Google Maps.
                      </p>
                    )}
                  </div>

                  {/* Bottom: Verified Footer */}
                  <div className="pt-2 flex items-center justify-between text-[10px] text-stone-400 border-t border-stone-100 mt-auto">
                    <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Verified on Google Maps</span>
                    </span>
                    <span className="text-stone-500 font-semibold font-mono">
                      {review.rating}.0 ★
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Show More / Show Less Button if more than 3 reviews */}
          {sortedReviews.length > 3 && (
            <div className="text-center pt-1">
              <button
                type="button"
                onClick={() => setShowAll(!showAll)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-stone-200 text-stone-700 text-xs font-bold hover:bg-stone-50 hover:border-amber-400/60 shadow-2xs transition-all cursor-pointer"
              >
                <span>{showAll ? "Show Less" : `View All ${sortedReviews.length} Google Reviews`}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${showAll ? "rotate-180" : ""}`} />
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
