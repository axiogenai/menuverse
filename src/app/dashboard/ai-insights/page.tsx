"use client";

import React, { useState, useEffect, useMemo } from "react";
import { 
  LineChart, 
  Star, 
  ChefHat, 
  Plus, 
  Search,
  Award
} from "lucide-react";
import Link from "next/link";
import { MenuItem, Restaurant } from "@/types";
import { menuVerseStore } from "@/lib/seed-data";
import { AISummaryCard } from "@/components/public/AISummaryCard";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export default function AIInsightsPage() {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(
    () => menuVerseStore.getRestaurantBySlug() || null
  );
  const [selectedDishId, setSelectedDishId] = useState<string>(() => {
    const r = menuVerseStore.getRestaurantBySlug();
    return r?.menuItems?.[0]?.id || "";
  });
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const update = () => {
      const rest = menuVerseStore.getRestaurantBySlug();
      if (rest) {
        setRestaurant({ ...rest });
        if (rest.menuItems && rest.menuItems.length > 0 && !selectedDishId) {
          setSelectedDishId(rest.menuItems[0].id);
        }
      }
    };
    update();
    const unsub = menuVerseStore.subscribe(update);
    return () => unsub();
  }, [selectedDishId]);

  const dishes = restaurant?.menuItems || [];

  const filteredDishes = useMemo(() => {
    if (!searchQuery.trim()) return dishes;
    const q = searchQuery.toLowerCase();
    return dishes.filter((d) => d.name.toLowerCase().includes(q));
  }, [dishes, searchQuery]);

  if (!restaurant) return null;

  const activeDish = dishes.find((d) => d.id === selectedDishId) || dishes[0];

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="p-5 rounded-xl bg-white border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-xs">
            <LineChart className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-slate-900">
              AI Taste & Sentiment Intelligence Engine
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Continuously synthesizes diner review language into culinary patterns, portion feedback, and flavor profiles.
            </p>
          </div>
        </div>
      </div>

      {/* Master-Detail Layout */}
      {dishes.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-8 space-y-4">
          <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-lg bg-slate-900 text-white shadow-xs">
            <LineChart className="w-6 h-6 text-white" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-slate-900">No Dishes Available for Analysis</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Add your dishes in Menu Studio to automatically generate AI sentiment scores, taste aspects, and flavor profiles.
            </p>
          </div>
          <Link
            href="/dashboard/menu"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Go to Menu Studio</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Searchable Dish Explorer (4 cols) */}
          <div className="lg:col-span-4 p-4 rounded-xl bg-white border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
                Select Dish
              </h3>
              <span className="text-[11px] font-medium text-slate-400">
                {dishes.length} Total
              </span>
            </div>

            {/* Quick Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search dish..."
                className="pl-8 h-8 text-xs bg-slate-50/80 border-slate-200"
              />
            </div>

            {/* Scrollable Dish List */}
            <div className="max-h-[520px] overflow-y-auto space-y-1 pr-1">
              {filteredDishes.length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-400">
                  No dishes match "{searchQuery}"
                </div>
              ) : (
                filteredDishes.map((dish) => {
                  const isActive = dish.id === selectedDishId;
                  const photoUrl = dish.images && dish.images[0]?.url;
                  const categoryName =
                    typeof dish.category === "object" && dish.category
                      ? (dish.category as any).name
                      : (dish.category || "Main");

                  return (
                    <button
                      key={dish.id}
                      type="button"
                      onClick={() => setSelectedDishId(dish.id)}
                      className={cn(
                        "w-full p-2 rounded-lg text-left transition-all cursor-pointer flex items-center gap-2.5 border",
                        isActive
                          ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                          : "bg-white hover:bg-slate-50 text-slate-800 border-slate-200/70"
                      )}
                    >
                      {/* Dish Thumbnail */}
                      <div className="h-8 w-8 rounded-md overflow-hidden bg-slate-100 shrink-0 border border-black/10 flex items-center justify-center text-slate-400">
                        {photoUrl ? (
                          <img
                            src={photoUrl}
                            alt={dish.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = "none";
                            }}
                          />
                        ) : (
                          <ChefHat className="w-4 h-4" />
                        )}
                      </div>

                      {/* Text */}
                      <div className="min-w-0 flex-1">
                        <h4 className={cn("text-xs font-semibold truncate", isActive ? "text-white" : "text-slate-900")}>
                          {dish.name}
                        </h4>
                        <p className={cn("text-[10px] truncate", isActive ? "text-slate-300" : "text-slate-400")}>
                          ${dish.price.toFixed(2)} • {categoryName}
                        </p>
                      </div>

                      {/* Rating */}
                      <div className={cn("flex items-center gap-0.5 text-[11px] font-mono font-semibold shrink-0", isActive ? "text-white" : "text-slate-900")}>
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span>{dish.statistics?.averageRating ? dish.statistics.averageRating.toFixed(1) : "5.0"}</span>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column: Active Dish Intelligence Report (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            {activeDish ? (
              <div className="p-5 rounded-xl bg-white border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-4">
                {/* Dish Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-11 w-11 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200 flex items-center justify-center text-slate-400">
                      {activeDish.images && activeDish.images[0]?.url ? (
                        <img
                          src={activeDish.images[0].url}
                          alt={activeDish.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <ChefHat className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-slate-900">
                        {activeDish.name}
                      </h2>
                      <p className="text-xs text-slate-500">
                        Analyzed across {activeDish.reviews?.length || 0} customer reviews • ${activeDish.price.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/80 flex items-center gap-1">
                      <Award className="w-3.5 h-3.5 text-emerald-600" />
                      {activeDish.statistics?.recommendationPercentage || 100}% Guest Recommendation
                    </span>
                  </div>
                </div>

                {/* AI Summary Card */}
                {activeDish.aiSummary ? (
                  <AISummaryCard summary={activeDish.aiSummary} dishName={activeDish.name} />
                ) : (
                  <div className="p-6 rounded-lg bg-slate-50 border border-slate-200 text-center text-xs text-slate-500 font-medium">
                    AI summary will be generated once diners leave reviews for this dish.
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
