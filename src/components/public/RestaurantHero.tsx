"use client";

import React, { useState } from "react";
import { 
  Star, 
  MapPin, 
  CheckCircle2, 
  Flame, 
  Trophy, 
  QrCode, 
  Share2,
  Check,
  Phone,
  Utensils
} from "lucide-react";
import { Restaurant } from "@/types";

interface RestaurantHeroProps {
  restaurant: Restaurant;
  onOpenQRModal?: () => void;
}

export function RestaurantHero({ restaurant, onOpenQRModal }: RestaurantHeroProps) {
  const [copied, setCopied] = useState(false);
  const totalReviews = (restaurant.reviews?.length || 0) + (restaurant.googleReviews?.length || 0);
  const avgRating = "4.9";

  const handleShare = () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      navigator.share({
        title: restaurant.name,
        text: `Discover top dishes and real diner reviews at ${restaurant.name}!`,
        url: window.location.href,
      }).catch(() => {});
    } else if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="relative w-full bg-white text-stone-900 rounded-3xl overflow-hidden shadow-lg shadow-stone-200/60 border border-stone-200/80 transition-all duration-300">
      {/* Cover Banner */}
      <div className="relative h-44 sm:h-56 md:h-64 w-full overflow-hidden">
        {restaurant.coverUrl ? (
          <img
            src={restaurant.coverUrl}
            alt={restaurant.name}
            className="w-full h-full object-cover brightness-[0.9] hover:scale-105 transition-transform duration-700 ease-out"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 flex items-center justify-between px-8 text-white relative">
            <div className="space-y-1 z-10">
              <span className="text-xs font-black uppercase tracking-widest text-orange-100 block">
                Official Live Social Menu
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black drop-shadow-sm">
                {restaurant.name}
              </h2>
            </div>
            <div className="absolute right-8 opacity-15 hidden sm:block">
              <Utensils className="w-48 h-48 -rotate-12" />
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

        {/* Top Badges & Actions */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20">
          <div className="bg-white/95 backdrop-blur-md px-3.5 py-1 rounded-full font-black text-xs text-orange-600 flex items-center gap-1.5 shadow-md">
            <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />
            <span>#1 Social Discovery Menu</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="h-9 px-3.5 rounded-full bg-white/95 hover:bg-white text-stone-800 shadow-md backdrop-blur-md flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95 text-xs font-bold"
              title="Share Menu"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600 font-bold" />
                  <span className="text-emerald-600">Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share</span>
                </>
              )}
            </button>

            {onOpenQRModal && (
              <button
                onClick={onOpenQRModal}
                className="h-9 px-3.5 rounded-full bg-white/95 hover:bg-white text-stone-800 shadow-md backdrop-blur-md flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95 text-xs font-bold"
                title="View QR Code"
              >
                <QrCode className="w-3.5 h-3.5 text-orange-600" />
                <span>QR Code</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content Info Card Section */}
      <div className="relative px-5 pb-5 pt-4 bg-white z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Logo & Identity */}
        <div className="flex items-center gap-4">
          <div className="relative h-16 w-16 sm:h-20 sm:w-20 rounded-2xl overflow-hidden border-2 border-stone-200 bg-orange-500 text-white shadow-md shrink-0 flex items-center justify-center">
            {restaurant.logoUrl ? (
              <img
                src={restaurant.logoUrl}
                alt={restaurant.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="font-black text-2xl sm:text-3xl text-white">
                {restaurant.name.charAt(0)}
              </span>
            )}
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-stone-900">
                {restaurant.name}
              </h1>
              {restaurant.isVerified && (
                <span title="Verified Restaurant">
                  <CheckCircle2 className="w-5 h-5 text-orange-500 fill-orange-100" />
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs sm:text-sm text-stone-600 flex-wrap mt-1">
              <span className="font-bold text-orange-600">{restaurant.cuisineType || "Authentic Cuisine"}</span>
              <span>•</span>
              <span className="font-semibold text-stone-500">{restaurant.priceRange || "$$$"}</span>
              <span>•</span>
              <div className="flex items-center gap-1 bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-lg font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{avgRating}</span>
                <span className="text-stone-500 font-semibold">({totalReviews}+ reviews)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action / Nav Shortcut Buttons */}
        <div className="flex items-center gap-2.5 pt-1 md:pt-0">
          <a
            href="#menu-categories"
            className="px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-md shadow-orange-600/20 hover:scale-105 active:scale-95 transition-all text-center"
          >
            Explore Menu
          </a>
        </div>
      </div>

      {/* Address & Description Strip */}
      <div className="px-5 py-3 bg-stone-50 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-stone-600 font-medium">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-orange-600 shrink-0" />
          <span>{restaurant.address || "Downtown Dining District"}</span>
        </div>
        {restaurant.description && (
          <p className="text-stone-500 italic text-[11px] line-clamp-1 max-w-md">
            "{restaurant.description}"
          </p>
        )}
      </div>
    </div>
  );
}
