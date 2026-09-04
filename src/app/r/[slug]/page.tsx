"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { 
  Search, 
  Leaf, 
  Wheat, 
  Star, 
  X, 
  ChefHat, 
  SlidersHorizontal,
  ArrowUpDown,
  Plus,
  Flame,
  MessageSquare,
  ArrowDownRight,
  ArrowUpRight,
  ChevronDown,
  Check
} from "lucide-react";
import { MenuItem, Restaurant } from "@/types";
import { cn } from "@/lib/utils";
import { menuVerseStore } from "@/lib/seed-data";
import { RestaurantHero } from "@/components/public/RestaurantHero";
import { TrendingRibbon } from "@/components/public/TrendingRibbon";
import { CategoryNav } from "@/components/public/CategoryNav";
import { DishCard } from "@/components/public/DishCard";
import { DishDetailModal } from "@/components/public/DishDetailModal";
import { WriteReviewModal } from "@/components/public/WriteReviewModal";
import { QRModal } from "@/components/public/QRModal";
import { GoogleReviewsSection } from "@/components/public/GoogleReviewsSection";
import { WriteGoogleReviewModal } from "@/components/public/WriteGoogleReviewModal";
import { RestaurantFooter } from "@/components/public/RestaurantFooter";
import { Input } from "@/components/ui/input";

type SortOption = "POPULARITY" | "RATING" | "REVIEWS" | "PRICE_ASC" | "PRICE_DESC";

const SORT_OPTIONS: { id: SortOption; label: string; icon: React.ElementType }[] = [
  { id: "POPULARITY", label: "Most Popular", icon: Flame },
  { id: "RATING", label: "Highest Rated", icon: Star },
  { id: "REVIEWS", label: "Most Reviewed", icon: MessageSquare },
  { id: "PRICE_ASC", label: "Price: Low to High", icon: ArrowDownRight },
  { id: "PRICE_DESC", label: "Price: High to Low", icon: ArrowUpRight },
];

export default function RestaurantPublicMenuPage() {
  const params = useParams();
  const slug = (params?.slug as string) || "gusto-trattoria";

  // Instant hydration default state
  const [restaurant, setRestaurant] = useState<Restaurant | null>(
    () => menuVerseStore.getRestaurantBySlug(slug) || menuVerseStore.getRestaurantBySlug("gusto-trattoria") || null
  );
  const [mounted, setMounted] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedDiet, setSelectedDiet] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<SortOption>("POPULARITY");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close sort dropdown when clicking outside
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setIsSortOpen(false);
      }
    };
    if (isSortOpen) {
      document.addEventListener("mousedown", handleOutside);
    }
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [isSortOpen]);
  
  // Modals state
  const [selectedDish, setSelectedDish] = useState<MenuItem | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [reviewDish, setReviewDish] = useState<MenuItem | null>(null);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [isWriteGoogleReviewOpen, setIsWriteGoogleReviewOpen] = useState(false);

  useEffect(() => {
    const update = () => {
      const rest = menuVerseStore.getRestaurantBySlug(slug) || menuVerseStore.getRestaurantBySlug("gusto-trattoria");
      if (rest) setRestaurant({ ...rest });
    };
    update();
    const unsubscribe = menuVerseStore.subscribe(update);
    return () => unsubscribe();
  }, [slug]);

  if (!mounted || !restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[#faf8f5]">
        <div className="text-center space-y-3">
          <div className="h-10 w-10 mx-auto border-3 border-orange-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-bold text-stone-500">Loading social menu...</p>
        </div>
      </div>
    );
  }

  const allDishes = restaurant.menuItems || [];

  // Filter dishes
  const filteredDishes = allDishes
    .filter((dish) => {
      const matchesCategory =
        activeCategory === "all" || dish.categoryId === activeCategory;
      const matchesSearch =
        dish.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (dish.description && dish.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        dish.ingredients.some((ing) => ing.toLowerCase().includes(searchQuery.toLowerCase()));
      
      let matchesDiet = true;
      if (selectedDiet === "VEG") matchesDiet = dish.isVegetarian;
      if (selectedDiet === "GF") matchesDiet = dish.isGlutenFree;
      if (selectedDiet === "SIGNATURE") matchesDiet = dish.isSignature;
      if (selectedDiet === "CHEF") matchesDiet = dish.isChefSpecial;

      return matchesCategory && matchesSearch && matchesDiet;
    })
    .sort((a, b) => {
      if (sortBy === "RATING") {
        return (b.statistics?.averageRating || 0) - (a.statistics?.averageRating || 0);
      }
      if (sortBy === "REVIEWS") {
        return (b.statistics?.totalReviews || b.reviews?.length || 0) - (a.statistics?.totalReviews || a.reviews?.length || 0);
      }
      if (sortBy === "PRICE_ASC") {
        return a.price - b.price;
      }
      if (sortBy === "PRICE_DESC") {
        return b.price - a.price;
      }
      // POPULARITY (Bayesian weighted score)
      return (b.statistics?.popularityScore || 0) - (a.statistics?.popularityScore || 0);
    });

  const handleOpenDish = (dish: MenuItem) => {
    setSelectedDish(dish);
    setIsDetailOpen(true);
  };

  const handleOpenReview = (dish: MenuItem) => {
    setReviewDish(dish);
    setIsReviewOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-stone-900 pb-6">
      <div className="container mx-auto max-w-5xl px-3 sm:px-4 pt-4 space-y-6">
        {/* Restaurant Header Hero */}
        <RestaurantHero
          restaurant={restaurant}
          onOpenQRModal={() => setIsQRModalOpen(true)}
        />

        {/* Trending Horizontal Ribbon Marquee */}
        <TrendingRibbon
          dishes={allDishes}
          onSelectDish={handleOpenDish}
        />

        {/* Search & Dietary Filters Container */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-stone-200/90 shadow-sm p-3 sm:p-4 space-y-2.5 sm:space-y-3" id="menu-categories">
          {/* Search Input & Sort Selector (Side-by-side on all screens) */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
              <Input
                type="text"
                placeholder="Search dishes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-9 h-11 rounded-xl sm:rounded-2xl bg-stone-50/80 border-stone-200 text-stone-900 placeholder:text-stone-400 focus-visible:ring-amber-500 text-sm font-medium w-full"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-200/60 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Luxury Sort Selector Popover */}
            <div className="relative shrink-0" ref={sortRef}>
              <button
                type="button"
                onClick={() => setIsSortOpen(!isSortOpen)}
                className={cn(
                  "flex items-center gap-1.5 sm:gap-2 h-11 px-3 sm:px-3.5 rounded-xl sm:rounded-2xl border text-xs font-bold transition-all shadow-2xs cursor-pointer active:scale-95 shrink-0 select-none",
                  isSortOpen
                    ? "bg-stone-900 text-white border-stone-900 shadow-xs"
                    : "bg-stone-50/90 text-stone-800 border-stone-200 hover:bg-white hover:border-amber-400/60"
                )}
                title="Sort Menu"
              >
                {(() => {
                  const curr = SORT_OPTIONS.find((s) => s.id === sortBy) || SORT_OPTIONS[0];
                  const Icon = curr.icon;
                  return (
                    <>
                      <Icon className={cn("w-4 h-4 shrink-0", isSortOpen ? "text-amber-400" : "text-amber-600")} />
                      <span className="hidden sm:inline whitespace-nowrap">{curr.label}</span>
                    </>
                  );
                })()}
                <ChevronDown className={cn("w-3.5 h-3.5 shrink-0 transition-transform duration-200", isSortOpen ? "rotate-180 text-white" : "text-stone-400")} />
              </button>

              {/* Luxury Popover Panel */}
              {isSortOpen && (
                <div className="absolute right-0 top-12 w-52 sm:w-56 bg-white rounded-2xl border border-stone-200/90 shadow-2xl p-1.5 z-40 animate-in fade-in zoom-in-95 duration-150">
                  <div className="text-[10px] uppercase font-bold text-stone-400 px-2.5 py-1.5 tracking-wider border-b border-stone-100 mb-1">
                    Sort Dishes By
                  </div>
                  <div className="space-y-0.5">
                    {SORT_OPTIONS.map((opt) => {
                      const Icon = opt.icon;
                      const isActive = sortBy === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => {
                            setSortBy(opt.id);
                            setIsSortOpen(false);
                          }}
                          className={cn(
                            "w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer text-left",
                            isActive
                              ? "bg-amber-50 text-amber-900 border border-amber-200/60"
                              : "hover:bg-stone-50 text-stone-700 hover:text-stone-900"
                          )}
                        >
                          <div className="flex items-center gap-2">
                            <Icon className={cn("w-3.5 h-3.5", isActive ? "text-amber-700" : "text-stone-400")} />
                            <span>{opt.label}</span>
                          </div>
                          {isActive && <Check className="w-3.5 h-3.5 text-amber-700" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Dietary Filter Chips (Smooth horizontal swipe) */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto hide-scrollbar scroll-smooth -mx-1 px-1 py-0.5 select-none">
            <button
              type="button"
              onClick={() => setSelectedDiet("ALL")}
              className={cn(
                "h-8 sm:h-9 px-3.5 rounded-full text-xs font-bold whitespace-nowrap shrink-0 transition-all cursor-pointer active:scale-95",
                selectedDiet === "ALL"
                  ? "bg-stone-900 text-white shadow-xs"
                  : "bg-stone-100/90 text-stone-600 hover:bg-stone-200/70 border border-stone-200/50"
              )}
            >
              All Dishes
            </button>
            <button
              type="button"
              onClick={() => setSelectedDiet(selectedDiet === "SIGNATURE" ? "ALL" : "SIGNATURE")}
              className={cn(
                "h-8 sm:h-9 px-3 sm:px-3.5 rounded-full text-xs font-bold whitespace-nowrap shrink-0 flex items-center gap-1.5 transition-all cursor-pointer active:scale-95",
                selectedDiet === "SIGNATURE"
                  ? "bg-amber-500 text-stone-950 shadow-xs"
                  : "bg-stone-100/90 text-stone-600 hover:bg-stone-200/70 border border-stone-200/50"
              )}
            >
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500 shrink-0" />
              <span>Signatures</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedDiet(selectedDiet === "CHEF" ? "ALL" : "CHEF")}
              className={cn(
                "h-8 sm:h-9 px-3 sm:px-3.5 rounded-full text-xs font-bold whitespace-nowrap shrink-0 flex items-center gap-1.5 transition-all cursor-pointer active:scale-95",
                selectedDiet === "CHEF"
                  ? "bg-rose-600 text-white shadow-xs"
                  : "bg-stone-100/90 text-stone-600 hover:bg-stone-200/70 border border-stone-200/50"
              )}
            >
              <ChefHat className="w-3.5 h-3.5 shrink-0" />
              <span>Chef Picks</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedDiet(selectedDiet === "VEG" ? "ALL" : "VEG")}
              className={cn(
                "h-8 sm:h-9 px-3 sm:px-3.5 rounded-full text-xs font-bold whitespace-nowrap shrink-0 flex items-center gap-1.5 transition-all cursor-pointer active:scale-95",
                selectedDiet === "VEG"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-stone-100/90 text-stone-600 hover:bg-stone-200/70 border border-stone-200/50"
              )}
            >
              <Leaf className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>Pure Veg</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedDiet(selectedDiet === "GF" ? "ALL" : "GF")}
              className={cn(
                "h-8 sm:h-9 px-3 sm:px-3.5 rounded-full text-xs font-bold whitespace-nowrap shrink-0 flex items-center gap-1.5 transition-all cursor-pointer active:scale-95",
                selectedDiet === "GF"
                  ? "bg-amber-600 text-white shadow-xs"
                  : "bg-stone-100/90 text-stone-600 hover:bg-stone-200/70 border border-stone-200/50"
              )}
            >
              <Wheat className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>Gluten-Free</span>
            </button>
          </div>
        </div>

        {/* Sticky Category Course Navigation */}
        <CategoryNav
          categories={restaurant.categories || []}
          activeCategoryId={activeCategory}
          onSelectCategory={setActiveCategory}
        />

        {/* Dishes Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-base sm:text-lg font-black text-stone-900 flex items-center gap-2">
              <span>Menu Dishes</span>
              <span className="bg-orange-100 text-orange-700 px-2.5 py-0.5 rounded-full text-xs font-black border border-orange-200">
                {filteredDishes.length} Available
              </span>
            </h2>
          </div>

          {allDishes.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-stone-200/90 shadow-sm space-y-4 p-8">
              <div className="flex h-14 w-14 mx-auto items-center justify-center rounded-2xl bg-orange-50 text-orange-600">
                <ChefHat className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-black text-stone-900">Menu Currently Being Curated</h3>
                <p className="text-xs text-stone-500 font-medium max-w-sm mx-auto">
                  The culinary team is setting up signature courses and items. Open the Owner Portal to add dishes and upload photography.
                </p>
              </div>
              <a
                href="/dashboard/menu"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-md shadow-orange-600/20 hover:scale-105 active:scale-95 transition-all"
              >
                <span>Add Dishes in Owner Studio</span>
                <Plus className="w-4 h-4" />
              </a>
            </div>
          ) : filteredDishes.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-stone-200 shadow-xs space-y-3 p-6">
              <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-2xl bg-orange-50 text-orange-600">
                <SlidersHorizontal className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-stone-800">No dishes match your search</h3>
              <p className="text-xs text-stone-500 font-medium max-w-sm mx-auto">
                Try adjusting your search keyword, changing the sort order, or clearing the dietary filters.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedDiet("ALL");
                  setActiveCategory("all");
                  setSortBy("POPULARITY");
                }}
                className="px-4 py-2 rounded-xl bg-orange-50 text-orange-600 font-bold text-xs hover:bg-orange-100 transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDishes.map((dish) => (
                <DishCard
                  key={dish.id}
                  dish={dish}
                  onSelect={handleOpenDish}
                  onOpenReviewModal={handleOpenReview}
                />
              ))}
            </div>
          )}
        </div>

        {/* Google Customer Reviews Showcase Section */}
        <GoogleReviewsSection
          reviews={restaurant.googleReviews || []}
          restaurantName={restaurant.name}
          googlePlaceId={restaurant.googlePlaceId}
          onOpenWriteGoogleReview={() => setIsWriteGoogleReviewOpen(true)}
        />

        {/* Slim Auto-adjusting Footer with team.axiogen.in */}
        <RestaurantFooter />
      </div>

      {/* Modals */}
      <DishDetailModal
        dish={selectedDish}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onOpenWriteReview={(dish) => {
          setIsDetailOpen(false);
          handleOpenReview(dish);
        }}
      />

      {reviewDish && (
        <WriteReviewModal
          dish={reviewDish}
          isOpen={isReviewOpen}
          onClose={() => setIsReviewOpen(false)}
          onReviewSubmitted={() => {
            const updated = menuVerseStore.getRestaurantBySlug(slug);
            if (updated) setRestaurant({ ...updated });
          }}
        />
      )}

      <WriteGoogleReviewModal
        restaurantId={restaurant.id}
        restaurantName={restaurant.name}
        isOpen={isWriteGoogleReviewOpen}
        onClose={() => setIsWriteGoogleReviewOpen(false)}
        onReviewSubmitted={() => {
          const updated = menuVerseStore.getRestaurantBySlug(slug);
          if (updated) setRestaurant({ ...updated });
        }}
      />

      <QRModal
        restaurant={restaurant}
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
      />
    </div>
  );
}
