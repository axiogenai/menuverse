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
  ArrowRight,
  Search,
  Crown,
  Medal
} from "lucide-react";
import { Restaurant, MenuItem, LeaderboardCategory, LeaderboardDish } from "@/types";
import { menuVerseStore } from "@/lib/seed-data";
import { generateLeaderboard } from "@/lib/algorithms/leaderboard";
import { formatPrice, cn } from "@/lib/utils";
import { DishDetailModal } from "@/components/public/DishDetailModal";
import { WriteReviewModal } from "@/components/public/WriteReviewModal";
import { Input } from "@/components/ui/input";

export default function RestaurantLeaderboardsPage() {
  const params = useParams();
  const slug = (params?.slug as string) || "hotel-gypsy";

  const [mounted, setMounted] = useState(false);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [activeTab, setActiveTab] = useState<LeaderboardCategory>("MOST_LOVED");
  const [selectedDish, setSelectedDish] = useState<MenuItem | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [reviewDish, setReviewDish] = useState<MenuItem | null>(null);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const update = () => {
      const rest = menuVerseStore.getRestaurantBySlug(slug) || menuVerseStore.getRestaurantBySlug("hotel-gypsy");
      if (rest) {
        setRestaurant({ ...rest });
        if (selectedDish) {
          const updatedDish = rest.menuItems?.find((d) => d.id === selectedDish.id);
          if (updatedDish) setSelectedDish({ ...updatedDish });
        }
      }
    };
    update();
    setMounted(true);
    const unsubscribe = menuVerseStore.subscribe(update);
    return () => unsubscribe();
  }, [slug, selectedDish?.id]);

  // Show loading on server (SSR) and before client hydration — prevents all mismatches
  if (!mounted || !restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[#faf8f5]">
        <p className="text-stone-500 font-medium">Loading leaderboards...</p>
      </div>
    );
  }


  const dishes = restaurant.menuItems || [];
  const rawLeaderboardItems: LeaderboardDish[] = generateLeaderboard(dishes, activeTab, 50);

  const filteredItems = rawLeaderboardItems.filter((item) => {
    if (!searchQuery.trim()) return true;
    return item.dish.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

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

  const currentCategory = categories.find((c) => c.id === activeTab);

  return (
    <div className="min-h-screen md:h-screen md:overflow-hidden bg-[#faf8f5] text-stone-900 flex flex-col">
      {/* Top Navigation Bar - Fixed Header */}
      <header className="shrink-0 bg-[#faf8f5]/95 backdrop-blur-xs border-b border-stone-200/80 z-20 py-3.5">
        <div className="container mx-auto max-w-5xl px-4 sm:px-6 flex items-center justify-between">
          <Link
            href={`/r/${slug}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-stone-950 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Menu</span>
          </Link>
          <span className="text-xs font-serif font-bold text-stone-800 tracking-wide">
            {restaurant.name}
          </span>
        </div>
      </header>

      {/* Main Split-Pane Workspace (Like Dashboard) */}
      <div className="flex-1 min-h-0 container mx-auto max-w-5xl px-4 sm:px-6 py-4 flex flex-col md:flex-row gap-6 overflow-hidden">
        {/* Left Sidebar: Fixed Non-Scrolling Column (Zero Scrollbars) */}
        <aside className="md:w-80 shrink-0 space-y-3.5 pr-0.5 md:overflow-visible overflow-hidden">
          {/* Header Card */}
          <div className="p-4 rounded-xl bg-white border border-stone-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-2">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10 text-amber-800 border border-amber-500/20 shrink-0">
                <Trophy className="w-5 h-5 text-amber-700" />
              </div>
              <div>
                <h1 className="text-sm font-bold tracking-tight text-stone-900">
                  Dish Leaderboards
                </h1>
                <p className="text-[11px] text-stone-500">
                  Rankings from verified diner reviews & taste ratings.
                </p>
              </div>
            </div>
          </div>

          {/* Search Input */}
          <div className="relative group">
            <Search className="w-3.5 h-3.5 text-stone-400 group-focus-within:text-amber-600 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-200" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search dish in rankings…"
              className="w-full pl-9 pr-4 h-10 text-[13px] font-medium text-stone-800 placeholder:text-stone-400 bg-white border border-stone-200 rounded-xl shadow-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all duration-200"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 transition-colors text-lg leading-none"
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>

          {/* Category Navigation */}
          <div className="flex md:flex-col gap-1.5 overflow-x-auto md:overflow-visible pb-2 md:pb-0 scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeTab === cat.id;

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(cat.id);
                    setSearchQuery("");
                  }}
                  className={cn(
                    "flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer border shrink-0 text-left",
                    isActive
                      ? "bg-amber-600 text-white border-amber-600 font-semibold shadow-xs"
                      : "bg-white text-stone-700 hover:bg-stone-50 border-stone-200/80"
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={cn("w-4 h-4 shrink-0", isActive ? "text-amber-100" : "text-stone-400")} />
                    <span className="whitespace-nowrap">{cat.label}</span>
                  </div>
                  {isActive && (
                    <ArrowRight className="w-3.5 h-3.5 text-amber-200 hidden md:block" />
                  )}
                </button>
              );
            })}
          </div>
        </aside>

        {/* Right Main Content: Independently Scrollable Ranked Dishes */}
        <main className="flex-1 min-h-0 md:h-full md:overflow-y-auto custom-scrollbar space-y-3 pr-2 pb-12 md:pb-6">
          {/* Active Category Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between bg-white px-4 py-3 rounded-xl border border-stone-200/90 shadow-2xs backdrop-blur-md">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-stone-900">
                {currentCategory?.label}
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 font-medium border border-stone-200">
                {filteredItems.length} {filteredItems.length === 1 ? "dish" : "dishes"}
              </span>
            </div>
          </div>

            {/* Ranked Dishes List */}
            <div className="space-y-3">
              {filteredItems.length === 0 ? (
                <div className="p-8 text-center rounded-xl bg-white border border-stone-200 text-xs text-stone-500">
                  No dishes found matching &quot;{searchQuery}&quot;.
                </div>
              ) : (
                filteredItems.map((item) => {
                  const dish = item.dish;
                  const photoUrl = dish.images && dish.images[0]?.url;

                  const rankStyle =
                    item.rank === 1
                      ? "bg-amber-100 text-amber-900 border-amber-300 ring-1 ring-amber-300/30"
                      : item.rank === 2
                      ? "bg-stone-100 text-stone-800 border-stone-300"
                      : item.rank === 3
                      ? "bg-amber-50 text-amber-800 border-amber-200"
                      : "bg-stone-50 text-stone-500 border-stone-200";

                  return (
                    <div
                      key={dish.id}
                      onClick={() => {
                        setSelectedDish(dish);
                        setIsDetailOpen(true);
                      }}
                      className={cn(
                        "group p-4 rounded-xl bg-white border transition-all cursor-pointer flex items-center justify-between gap-4 hover:border-amber-400 hover:shadow-xs",
                        item.rank === 1 ? "border-amber-300/90" : "border-stone-200/90"
                      )}
                    >
                      <div className="flex items-center gap-3.5 min-w-0 flex-1">
                        {/* Rank Badge */}
                        <div className={cn(
                          "flex h-9 w-9 items-center justify-center rounded-xl text-xs font-bold shrink-0 border",
                          rankStyle
                        )}>
                          #{item.rank}
                        </div>

                        {/* Luxury Food Photography Squircle Frame */}
                        <div className="h-20 w-20 sm:h-22 sm:w-22 rounded-2xl overflow-hidden bg-stone-100 shrink-0 border border-stone-200/90 shadow-2xs relative">
                          {photoUrl ? (
                            <img
                              src={photoUrl}
                              alt={dish.name}
                              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = "none";
                              }}
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-stone-100 text-stone-400">
                              <ChefHat className="w-6 h-6" />
                            </div>
                          )}
                          <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-black/5 pointer-events-none" />
                        </div>

                        {/* Dish Details */}
                        <div className="min-w-0 flex-1 space-y-1">
                          <div className="flex items-baseline gap-2 flex-wrap">
                            <h3 className="font-bold text-sm text-stone-900 group-hover:text-amber-900 transition-colors">
                              {dish.name}
                            </h3>
                            <span className="font-mono text-xs font-bold text-stone-900 shrink-0">
                              {formatPrice(dish.price, dish.currency)}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[10px] px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 font-medium border border-stone-200/70" suppressHydrationWarning>
                              {item.highlightBadge}
                            </span>

                            <div className="flex items-center gap-1 font-mono text-[11px] font-bold text-stone-900" suppressHydrationWarning>
                              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500 shrink-0" />
                              <span suppressHydrationWarning>{dish.statistics?.averageRating ? dish.statistics.averageRating.toFixed(1) : "5.0"}</span>
                              <span className="text-stone-400 font-normal font-sans text-[10px]" suppressHydrationWarning>
                                ({dish.statistics?.totalReviews || dish.reviews?.length || 1} {dish.statistics?.totalReviews === 1 ? "review" : "reviews"})
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right CTA */}
                      <div className="flex items-center gap-1 text-xs font-semibold text-stone-400 group-hover:text-amber-800 transition-colors shrink-0 pl-2">
                        <span className="hidden sm:inline">View Reviews</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
        </main>
      </div>

      {/* Dish Modal */}
      <DishDetailModal
        dish={selectedDish}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onOpenWriteReview={(dish) => {
          setReviewDish(dish);
          setIsReviewOpen(true);
        }}
      />

      {/* Write Review Modal */}
      <WriteReviewModal
        dish={reviewDish}
        isOpen={isReviewOpen}
        onClose={() => setIsReviewOpen(false)}
        onReviewSubmitted={(newRev) => {
          const rest = menuVerseStore.getRestaurantBySlug(slug) || menuVerseStore.getRestaurantBySlug("hotel-gypsy");
          if (rest) {
            setRestaurant({ ...rest });
            const updatedDish = rest.menuItems?.find((d) => d.id === newRev.menuItemId);
            if (updatedDish) setSelectedDish({ ...updatedDish });
          }
        }}
      />
    </div>
  );
}
