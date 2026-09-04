"use client";

import React, { useState } from "react";
import { Flame, Star, Camera } from "lucide-react";
import { motion } from "framer-motion";
import { MenuItem } from "@/types";
import { formatPrice } from "@/lib/utils";

interface TrendingRibbonProps {
  dishes: MenuItem[];
  onSelectDish: (dish: MenuItem) => void;
}

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=600&q=80";

export function TrendingRibbon({ dishes, onSelectDish }: TrendingRibbonProps) {
  const [isPaused, setIsPaused] = useState(false);

  const trendingDishes = dishes
    .filter((d) => d.isAvailable)
    .sort((a, b) => (b.statistics?.trendScore || 0) - (a.statistics?.trendScore || 0))
    .slice(0, 6);

  if (trendingDishes.length === 0) return null;

  // Triplicate items for seamless infinite auto-scrolling loop
  const loopedDishes = [...trendingDishes, ...trendingDishes, ...trendingDishes];

  return (
    <div className="w-full bg-white rounded-3xl border border-stone-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-4 sm:p-5 space-y-3.5 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/10 text-amber-700 border border-amber-500/20 shrink-0">
            <Flame className="w-4 h-4 text-amber-600 animate-pulse" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-stone-900 flex items-center gap-2">
              Trending Right Now
              <span className="text-[10px] py-0.5 px-2.5 rounded-full font-bold bg-amber-100 text-amber-900 border border-amber-200">
                Live Loop
              </span>
            </h2>
            <p className="text-[11px] text-stone-500 font-normal">
              Auto-rotating most discussed & highly rated dinner dishes (Hover to pause)
            </p>
          </div>
        </div>
      </div>

      {/* Silky-Smooth Auto-Looping Marquee Container */}
      <div
        className="relative w-full overflow-hidden py-1"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Soft Left/Right Fade Edges */}
        <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-white via-white/80 to-transparent z-20 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white via-white/80 to-transparent z-20 pointer-events-none" />

        <motion.div
          className="flex gap-4 w-max cursor-pointer"
          animate={{
            x: isPaused ? undefined : ["0%", "-33.333%"],
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 32,
              ease: "linear",
            },
          }}
        >
          {loopedDishes.map((dish, i) => {
            const originalIndex = i % trendingDishes.length;
            const stats = dish.statistics;
            const photoCount = stats?.customerPhotoCount || dish.images.length;
            const recPct = stats?.recommendationPercentage || 100;
            const primaryImage = dish.images[0]?.url || FALLBACK_IMAGE;

            // Get true latest approved review
            const latestReview = dish.reviews
              ? [...dish.reviews]
                  .filter((r) => r.moderationStatus === "APPROVED" || !r.moderationStatus)
                  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]
              : null;

            return (
              <div
                key={`${dish.id}-${i}`}
                onClick={() => onSelectDish(dish)}
                className="shrink-0 w-64 group bg-white rounded-2xl border border-stone-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-xl hover:border-amber-400/60 hover:-translate-y-1 active:translate-y-0 active:scale-[0.99] transition-all duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] overflow-hidden flex flex-col cursor-pointer transform-gpu will-change-transform"
              >
                {/* Image with Rank & Badges */}
                <div className="relative h-36 w-full overflow-hidden bg-stone-900 shrink-0">
                  {/* Ambient Blurred Backdrop */}
                  <img
                    src={primaryImage}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover blur-md scale-110 opacity-30 pointer-events-none"
                    aria-hidden="true"
                  />
                  <img
                    src={primaryImage}
                    alt={dish.name}
                    onError={(e) => {
                      e.currentTarget.src = FALLBACK_IMAGE;
                    }}
                    className="relative z-10 w-full h-full object-cover object-center group-hover:scale-[1.03] transition-transform duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] will-change-transform"
                  />

                  {/* Rank Badge */}
                  <div className="absolute top-2.5 left-2.5 z-20 flex items-center bg-white/95 text-stone-900 font-bold px-2 py-0.5 rounded text-[11px] shadow-xs backdrop-blur-xs">
                    <span>#{originalIndex + 1}</span>
                  </div>

                  {/* Photos Badge */}
                  {photoCount > 1 && (
                    <div className="absolute top-2.5 right-2.5 z-20 flex items-center gap-1 bg-black/60 backdrop-blur-xs text-white text-[10px] font-medium px-2 py-0.5 rounded shadow-xs">
                      <Camera className="w-3 h-3 text-amber-300" />
                      <span>{photoCount}</span>
                    </div>
                  )}

                  {/* Recommendation Rate */}
                  <div className="absolute bottom-2 right-2.5 z-20">
                    <div className="bg-emerald-600/95 backdrop-blur-xs px-2 py-0.5 rounded text-[10px] font-bold text-white shadow-xs">
                      <span>{recPct}% Loved</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-3 flex flex-col flex-1 justify-between gap-2 bg-white">
                  <div className="space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-xs text-stone-900 line-clamp-1 group-hover:text-amber-700 transition-colors">
                        {dish.name}
                      </h3>
                      <span className="font-mono font-bold text-xs text-stone-900 bg-stone-100 px-1.5 py-0.5 rounded shrink-0">
                        {formatPrice(dish.price, dish.currency)}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-500 line-clamp-1 font-normal">
                      {dish.description}
                    </p>
                  </div>

                  {/* Latest Diner Review Box */}
                  {latestReview && (
                    <div className="bg-stone-50/95 rounded-xl p-2 border border-stone-200/80 space-y-0.5 mt-0.5" suppressHydrationWarning>
                      <div className="flex items-center justify-between gap-1.5" suppressHydrationWarning>
                        <div className="flex items-center gap-1 min-w-0" suppressHydrationWarning>
                          <div className="w-4 h-4 rounded-full overflow-hidden bg-stone-200 shrink-0 flex items-center justify-center text-[9px] font-bold text-stone-700" suppressHydrationWarning>
                            {latestReview.avatarUrl ? (
                              <img src={latestReview.avatarUrl} alt="" className="w-full h-full object-cover" />
                            ) : (
                              latestReview.displayName.charAt(0)
                            )}
                          </div>
                          <span className="font-semibold text-[10px] text-stone-900 truncate" suppressHydrationWarning>
                            {latestReview.displayName}
                          </span>
                        </div>
                        <div className="flex items-center gap-0.5 text-amber-600 font-bold shrink-0 text-[10px]" suppressHydrationWarning>
                          <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                          <span>{latestReview.rating}.0</span>
                        </div>
                      </div>
                      <p className="text-[10px] text-stone-600 line-clamp-1 italic font-normal" suppressHydrationWarning>
                        &ldquo;{latestReview.reviewText}&rdquo;
                      </p>
                    </div>
                  )}

                  {/* Footer Metrics */}
                  <div className="pt-1.5 border-t border-stone-100 flex items-center justify-between text-[10px] text-stone-500">
                    <div className="flex items-center gap-1 font-bold text-stone-900">
                      <Star className="w-3 h-3 fill-amber-500 text-amber-500 shrink-0" />
                      <span>{stats?.averageRating ? stats.averageRating.toFixed(1) : "5.0"}</span>
                      <span className="text-stone-400 font-normal">({stats?.totalReviews || dish.reviews?.length || 1} reviews)</span>
                    </div>
                    <span className="font-semibold text-amber-700 group-hover:underline">
                      View Dish →
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
