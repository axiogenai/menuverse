"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { 
  Trophy, 
  ArrowLeft, 
  Flame, 
  Star, 
  Camera, 
  MessageSquare, 
  Gem, 
  DollarSign, 
  ChefHat,
  ThumbsUp,
  ArrowRight
} from "lucide-react";
import { Restaurant, MenuItem, LeaderboardCategory, LeaderboardDish } from "@/types";
import { menuVerseStore } from "@/lib/seed-data";
import { generateLeaderboard } from "@/lib/algorithms/leaderboard";
import { formatPrice } from "@/lib/utils";
import { DishDetailModal } from "@/components/public/DishDetailModal";

export default function RestaurantLeaderboardsPage() {
  const params = useParams();
  const slug = (params?.slug as string) || "gusto-trattoria";

  const [restaurant, setRestaurant] = useState<Restaurant | null>(
    () => menuVerseStore.getRestaurantBySlug(slug) || menuVerseStore.getRestaurantBySlug("gusto-trattoria") || null
  );
  const [activeTab, setActiveTab] = useState<LeaderboardCategory>("MOST_LOVED");
  const [selectedDish, setSelectedDish] = useState<MenuItem | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  useEffect(() => {
    const rest = menuVerseStore.getRestaurantBySlug(slug) || menuVerseStore.getRestaurantBySlug("gusto-trattoria");
    if (rest) setRestaurant(rest);
  }, [slug]);

  if (!restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[#faf8f5]">
        <p className="text-stone-500 font-medium">Loading leaderboards...</p>
      </div>
    );
  }

  const dishes = restaurant.menuItems || [];
  const leaderboardItems: LeaderboardDish[] = generateLeaderboard(dishes, activeTab, 10);

  const categories: { id: LeaderboardCategory; label: string; icon: React.ElementType }[] = [
    { id: "MOST_LOVED", label: "Most Loved", icon: ThumbsUp },
    { id: "HIGHEST_RATED", label: "Highest Rated", icon: Star },
    { id: "TRENDING_WEEK", label: "Trending This Week", icon: Flame },
    { id: "MOST_PHOTOGRAPHED", label: "Most Photographed", icon: Camera },
    { id: "MOST_REVIEWED", label: "Most Reviewed", icon: MessageSquare },
    { id: "HIDDEN_GEMS", label: "Hidden Gems", icon: Gem },
    { id: "BEST_VALUE", label: "Best Value", icon: DollarSign },
    { id: "CHEF_PICKS", label: "Chef Signature Picks", icon: ChefHat },
  ];

  return (
    <div className="min-h-screen bg-[#faf8f5] text-stone-900 pb-20">
      <div className="container mx-auto max-w-4xl px-4 pt-6 space-y-6">
        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Link
            href={`/r/${slug}`}
            className="flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-stone-950 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Menu</span>
          </Link>
          <span className="text-xs text-orange-600 font-black">
            {restaurant.name}
          </span>
        </div>

        {/* Header */}
        <div className="p-6 rounded-3xl bg-white border border-stone-200/80 shadow-sm space-y-2">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500 text-stone-950 font-black shadow-md shadow-amber-500/20">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-stone-900">
                Dish Social Leaderboards
              </h1>
              <p className="text-xs text-stone-500 font-medium">
                Algorithmic rankings based on real diner reviews, photo uploads, and taste ratings
              </p>
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeTab === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-black shrink-0 transition-all duration-200 hover:scale-105 active:scale-95 ${
                  isActive
                    ? "bg-orange-600 text-white shadow-md shadow-orange-600/25 scale-102"
                    : "bg-white text-stone-700 hover:bg-stone-100 border border-stone-200 shadow-xs"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Ranked Items List */}
        <div className="space-y-3">
          {leaderboardItems.map((item) => {
            const dish = item.dish;
            const rankColors =
              item.rank === 1
                ? "bg-amber-400 text-stone-950 font-black shadow-md shadow-amber-400/30 ring-2 ring-amber-300"
                : item.rank === 2
                ? "bg-stone-200 text-stone-900 font-black border border-stone-300"
                : item.rank === 3
                ? "bg-amber-700 text-white font-black"
                : "bg-stone-100 text-stone-700 font-bold border border-stone-200";

            return (
              <div
                key={dish.id}
                onClick={() => {
                  setSelectedDish(dish);
                  setIsDetailOpen(true);
                }}
                className="group p-4 rounded-3xl bg-white border border-stone-200/80 hover:border-orange-400 hover:shadow-xl transition-all duration-300 cursor-pointer flex items-center justify-between gap-4 hover:-translate-y-1"
              >
                <div className="flex items-center gap-3.5">
                  {/* Rank Badge */}
                  <div className={`flex h-10 w-10 items-center justify-center rounded-2xl text-sm shrink-0 ${rankColors}`}>
                    #{item.rank}
                  </div>

                  {/* Thumbnail */}
                  <div className="h-16 w-16 rounded-2xl overflow-hidden bg-orange-50 shrink-0 border border-stone-200 flex items-center justify-center text-orange-600">
                    {dish.images && dish.images[0]?.url ? (
                      <img
                        src={dish.images[0].url}
                        alt={dish.name}
                        className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
                      />
                    ) : (
                      <Trophy className="w-6 h-6" />
                    )}
                  </div>

                  {/* Title & Badge */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-sm text-stone-900 group-hover:text-orange-600 transition-colors">
                        {dish.name}
                      </h3>
                      <span className="text-xs font-black text-orange-600">
                        {formatPrice(dish.price, dish.currency)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[11px] px-2.5 py-0.5 rounded-lg bg-orange-50 text-orange-700 font-bold border border-orange-200">
                        {item.highlightBadge}
                      </span>
                      <span className="text-[11px] font-bold text-stone-600 flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span className="text-amber-600">{dish.statistics?.averageRating ? dish.statistics.averageRating.toFixed(1) : "5.0"} Stars</span>
                        <span>• Reviewed by <strong className="text-stone-900">{dish.statistics?.totalReviews || dish.reviews?.length || 12}</strong> diners</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-stone-400 group-hover:text-orange-600 transition-colors">
                  <span className="text-xs font-bold hidden sm:inline">View Reviews</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dish Modal */}
      <DishDetailModal
        dish={selectedDish}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onOpenWriteReview={() => {}}
      />
    </div>
  );
}
