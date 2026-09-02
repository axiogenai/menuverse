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

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1621996346565-e3d5d6281691?auto=format&fit=crop&w=600&q=80";

export function TrendingRibbon({ dishes, onSelectDish }: TrendingRibbonProps) {
  const [isPaused, setIsPaused] = useState(false);

  const trendingDishes = dishes
    .filter((d) => d.isAvailable)
    .sort((a, b) => (b.statistics?.trendScore || 0) - (a.statistics?.trendScore || 0))
    .slice(0, 6);

  if (trendingDishes.length === 0) return null;

  // Duplicate items for continuous infinite loop marquee
  const loopedDishes = [...trendingDishes, ...trendingDishes, ...trendingDishes];

  return (
    <div className="w-full bg-white rounded-3xl border border-stone-200/90 shadow-sm p-4 sm:p-5 space-y-3.5 overflow-hidden">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
            <Flame className="w-4 h-4 fill-orange-500 text-orange-500 animate-pulse" />
          </div>
          <div>
            <h2 className="text-base font-black text-stone-900 flex items-center gap-2">
              Trending Right Now
              <span className="text-[10px] py-0.5 px-2.5 rounded-full font-extrabold bg-rose-50 text-rose-600 border border-rose-200">
                Live Loop
              </span>
            </h2>
            <p className="text-xs text-stone-500 font-medium">Auto-rotating most discussed & highly rated dinner dishes</p>
          </div>
        </div>
      </div>

      {/* Auto-looping Marquee Container */}
      <div 
        className="relative w-full overflow-hidden py-1"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        <motion.div
          className="flex gap-4 w-max cursor-pointer"
          animate={{
            x: isPaused ? undefined : ["0%", "-33.333%"]
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 25,
              ease: "linear"
            }
          }}
        >
          {loopedDishes.map((dish, i) => {
            const originalIndex = i % trendingDishes.length;
            const stats = dish.statistics;
            const photoCount = stats?.customerPhotoCount || dish.images.length;
            const recPct = stats?.recommendationPercentage || 95;
            const primaryImage = dish.images[0]?.url || FALLBACK_IMAGE;

            return (
              <div
                key={`${dish.id}-${i}`}
                onClick={() => onSelectDish(dish)}
                className="shrink-0 w-64 group bg-stone-50/70 hover:bg-white rounded-2xl border border-stone-200/80 shadow-xs hover:shadow-xl hover:border-orange-400/80 transition-all duration-300 overflow-hidden flex flex-col hover:-translate-y-1.5"
              >
                {/* Image with Rank & Photos */}
                <div className="relative h-36 w-full overflow-hidden bg-stone-100">
                  <img
                    src={primaryImage}
                    alt={dish.name}
                    onError={(e) => {
                      e.currentTarget.src = FALLBACK_IMAGE;
                    }}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/20" />

                  {/* Rank Badge */}
                  <div className="absolute top-2.5 left-2.5 flex items-center bg-black/75 backdrop-blur-md text-amber-400 px-2 py-0.5 rounded-lg text-xs font-black border border-white/15 shadow">
                    <span>#{originalIndex + 1}</span>
                  </div>

                  {/* Photos & Recommendation */}
                  <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-[11px] text-white font-medium">
                    <div className="flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-md font-semibold">
                      <Camera className="w-3 h-3 text-orange-400" />
                      <span>{photoCount} photos</span>
                    </div>

                    <div className="flex items-center gap-1 bg-emerald-600 backdrop-blur-md px-2 py-0.5 rounded-md font-bold text-white shadow">
                      <span>{recPct}% Rec</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-3 flex flex-col flex-1 justify-between gap-2">
                  <div>
                    <h3 className="font-black text-sm text-stone-900 line-clamp-1 group-hover:text-orange-600 transition-colors">
                      {dish.name}
                    </h3>
                    <p className="text-xs text-stone-500 line-clamp-1 mt-0.5 font-medium">
                      {dish.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-stone-200/80 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-sm font-black text-orange-600">
                        {formatPrice(dish.price, dish.currency)}
                      </span>
                      <div className="flex items-center gap-1 font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{stats?.averageRating ? stats.averageRating.toFixed(1) : "5.0"} Stars</span>
                      </div>
                    </div>
                    <div className="text-[11px] font-bold text-stone-500 flex items-center justify-between">
                      <span>Reviewed by <strong className="text-stone-900 font-black">{stats?.totalReviews || dish.reviews?.length || 12}</strong> diners</span>
                    </div>
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
