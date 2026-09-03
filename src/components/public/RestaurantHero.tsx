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
  Utensils,
  Crown
} from "lucide-react";
import { Restaurant } from "@/types";

interface RestaurantHeroProps {
  restaurant: Restaurant;
  onOpenQRModal?: () => void;
}

const DEFAULT_4K_HOTEL_COVER = "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=3840&q=95";
const DEFAULT_LOGO = "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=85";

export function RestaurantHero({ restaurant, onOpenQRModal }: RestaurantHeroProps) {
  const [copied, setCopied] = useState(false);
  const totalReviews = (restaurant.reviews?.length || 0) + (restaurant.googleReviews?.length || 0);
  const avgRating = "4.9";

  const coverImage = restaurant.coverUrl || DEFAULT_4K_HOTEL_COVER;
  const logoImage = restaurant.logoUrl || DEFAULT_LOGO;

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
      {/* 4K Cover Banner with Multi-Device Responsive Framing */}
      <div className="relative h-44 sm:h-60 md:h-72 w-full overflow-hidden bg-stone-950">
        {/* Ambient Blur Layer for seamless edge fill */}
        <img
          src={coverImage}
          alt=""
          className="absolute inset-0 w-full h-full object-cover blur-xl scale-125 opacity-40 pointer-events-none"
          aria-hidden="true"
        />
        {/* Main Centered 4K Hotel Image */}
        <img
          src={coverImage}
          alt={restaurant.name}
          className="relative z-10 w-full h-full object-cover object-[center_40%] sm:object-center brightness-[0.88] hover:scale-105 transition-transform duration-1000 ease-out"
        />
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/85 via-black/30 to-black/25 pointer-events-none" />

        {/* Top Badges & Actions - Responsive for Mobile & Desktop */}
        <div className="absolute top-3 sm:top-4 left-3 sm:left-4 right-3 sm:right-4 flex items-center justify-between z-20 gap-2">
          <div className="bg-white/95 backdrop-blur-md px-2.5 sm:px-3.5 py-1 rounded-full font-bold text-[11px] sm:text-xs text-amber-800 border border-amber-200/60 flex items-center gap-1 shadow-md shrink-0">
            <Flame className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-amber-600 fill-amber-500 shrink-0" />
            <span className="truncate max-w-[140px] sm:max-w-none">#1 Social Menu</span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          </div>
        </div>

        {/* Floating Ambient Restaurant Identity in Cover Banner */}
        <div className="absolute bottom-3 sm:bottom-4 left-3.5 sm:left-5 right-3.5 sm:right-5 z-20 pointer-events-none">
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-amber-300 block mb-0.5 drop-shadow">
            {restaurant.cuisineType || "Authentic Italian & Fine Dining"} • Verified Social Menu
          </span>
        </div>
      </div>

      {/* Content Info Card Section */}
      <div className="relative px-3.5 sm:px-5 pb-4 sm:pb-5 pt-3.5 sm:pt-4 bg-white z-10 flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
        {/* Logo & Identity */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="relative h-14 w-14 sm:h-18 sm:w-18 md:h-20 md:w-20 rounded-2xl overflow-hidden border border-stone-200/90 bg-stone-100 shadow-md shrink-0">
            <img
              src={logoImage}
              alt={restaurant.name}
              className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-500"
            />
          </div>

          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <h1 className="text-lg sm:text-2xl md:text-3xl font-serif font-bold tracking-tight text-stone-900 truncate">
                {restaurant.name}
              </h1>
              {restaurant.isVerified && (
                <span title="Verified 5-Star Hotel & Fine Dining">
                  <CheckCircle2 className="w-4 sm:w-5 h-4 sm:h-5 text-amber-600 fill-amber-100 shrink-0" />
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs md:text-sm text-stone-600 flex-wrap mt-0.5 sm:mt-1">
              <span className="font-bold text-amber-700">{restaurant.cuisineType || "5-Star Luxury Palace"}</span>
              <span>•</span>
              <a 
                href="#google-reviews"
                className="flex items-center gap-1 bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200/80 px-2 py-0.5 rounded-md font-bold text-[10px] sm:text-xs transition-colors"
                title="View Google Reviews"
              >
                <svg className="w-3 h-3 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>4.9 Google Reviews</span>
              </a>
            </div>
          </div>
        </div>

        {/* Action / Nav Shortcut Buttons */}
        <div className="flex items-center gap-2 pt-1 md:pt-0 shrink-0">
          <a
            href="#google-reviews"
            className="px-3.5 py-2.5 rounded-xl bg-white border border-stone-200 hover:bg-stone-50 text-stone-800 font-bold text-xs shadow-xs hover:scale-105 active:scale-95 transition-all text-center flex items-center gap-1.5"
          >
            <Star className="w-3.5 h-3.5 fill-[#FBBC04] text-[#FBBC04]" />
            <span>Google Reviews</span>
          </a>
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
