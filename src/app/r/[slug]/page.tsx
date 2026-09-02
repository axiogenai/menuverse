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
  Plus
} from "lucide-react";
import { MenuItem, Restaurant } from "@/types";
import { menuVerseStore } from "@/lib/seed-data";
import { RestaurantHero } from "@/components/public/RestaurantHero";
import { TrendingRibbon } from "@/components/public/TrendingRibbon";
import { CategoryNav } from "@/components/public/CategoryNav";
import { DishCard } from "@/components/public/DishCard";
import { DishDetailModal } from "@/components/public/DishDetailModal";
import { WriteReviewModal } from "@/components/public/WriteReviewModal";
import { QRModal } from "@/components/public/QRModal";
import { Input } from "@/components/ui/input";

type SortOption = "POPULARITY" | "RATING" | "REVIEWS" | "PRICE_ASC" | "PRICE_DESC";

export default function RestaurantPublicMenuPage() {
  const params = useParams();
  const slug = (params?.slug as string) || "gusto-trattoria";

  // Instant hydration default state
  const [restaurant, setRestaurant] = useState<Restaurant | null>(
    () => menuVerseStore.getRestaurantBySlug(slug) || menuVerseStore.getRestaurantBySlug("gusto-trattoria") || null
  );
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedDiet, setSelectedDiet] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<SortOption>("POPULARITY");
  
  // Modals state
  const [selectedDish, setSelectedDish] = useState<MenuItem | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [reviewDish, setReviewDish] = useState<MenuItem | null>(null);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);

  useEffect(() => {
    const update = () => {
      const rest = menuVerseStore.getRestaurantBySlug(slug) || menuVerseStore.getRestaurantBySlug("gusto-trattoria");
      if (rest) setRestaurant({ ...rest });
    };
    update();
    const unsubscribe = menuVerseStore.subscribe(update);
    return () => unsubscribe();
  }, [slug]);

  if (!restaurant) {
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
    <div className="min-h-screen bg-[#faf8f5] text-stone-900 pb-24">
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
        <div className="bg-white rounded-3xl border border-stone-200/90 shadow-sm p-4 space-y-3" id="menu-categories">
          {/* Search Input & Sort Selector */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <Input
                type="text"
                placeholder="Search dishes, fresh ingredients, flavors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 pr-10 h-11 rounded-2xl bg-stone-50/80 border-stone-200 text-stone-900 placeholder:text-stone-400 focus-visible:ring-orange-500 text-xs sm:text-sm font-medium"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-200/60"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-stone-50 border border-stone-200 shrink-0 text-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-orange-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="bg-transparent font-bold text-stone-700 focus:outline-none cursor-pointer text-xs"
              >
                <option value="POPULARITY">Most Popular</option>
                <option value="RATING">Highest Rated (⭐)</option>
                <option value="REVIEWS">Most Reviewed</option>
                <option value="PRICE_ASC">Price: Low to High</option>
                <option value="PRICE_DESC">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Quick Dietary Filters */}
          <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar text-xs">
            <span className="text-[11px] font-bold text-stone-400 shrink-0 uppercase tracking-wider pl-1">
              Filter:
            </span>
            <button
              onClick={() => setSelectedDiet("ALL")}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition-all ${
                selectedDiet === "ALL"
                  ? "bg-stone-900 text-white shadow-xs"
                  : "bg-stone-100/80 text-stone-600 hover:bg-stone-200/70"
              }`}
            >
              All Types
            </button>
            <button
              onClick={() => setSelectedDiet(selectedDiet === "SIGNATURE" ? "ALL" : "SIGNATURE")}
              className={`flex items-center gap-1 px-3.5 py-1.5 rounded-xl font-bold transition-all ${
                selectedDiet === "SIGNATURE"
                  ? "bg-amber-500 text-stone-950 shadow-xs"
                  : "bg-stone-100/80 text-stone-600 hover:bg-stone-200/70"
              }`}
            >
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
              <span>Signatures</span>
            </button>
            <button
              onClick={() => setSelectedDiet(selectedDiet === "CHEF" ? "ALL" : "CHEF")}
              className={`flex items-center gap-1 px-3.5 py-1.5 rounded-xl font-bold transition-all ${
                selectedDiet === "CHEF"
                  ? "bg-rose-600 text-white shadow-xs"
                  : "bg-stone-100/80 text-stone-600 hover:bg-stone-200/70"
              }`}
            >
              <ChefHat className="w-3.5 h-3.5" />
              <span>Chef Picks</span>
            </button>
            <button
              onClick={() => setSelectedDiet(selectedDiet === "VEG" ? "ALL" : "VEG")}
              className={`flex items-center gap-1 px-3.5 py-1.5 rounded-xl font-bold transition-all ${
                selectedDiet === "VEG"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-stone-100/80 text-stone-600 hover:bg-stone-200/70"
              }`}
            >
              <Leaf className="w-3.5 h-3.5 text-emerald-500" />
              <span>Vegetarian</span>
            </button>
            <button
              onClick={() => setSelectedDiet(selectedDiet === "GF" ? "ALL" : "GF")}
              className={`flex items-center gap-1 px-3.5 py-1.5 rounded-xl font-bold transition-all ${
                selectedDiet === "GF"
                  ? "bg-amber-600 text-white shadow-xs"
                  : "bg-stone-100/80 text-stone-600 hover:bg-stone-200/70"
              }`}
            >
              <Wheat className="w-3.5 h-3.5 text-amber-500" />
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

      <QRModal
        restaurant={restaurant}
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
      />
    </div>
  );
}
