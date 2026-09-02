"use client";

import React, { useState, useEffect } from "react";
import { 
  Bot, 
  Star, 
  ChefHat,
  Plus
} from "lucide-react";
import Link from "next/link";
import { MenuItem, Restaurant } from "@/types";
import { menuVerseStore } from "@/lib/seed-data";
import { AISummaryCard } from "@/components/public/AISummaryCard";
import { Badge } from "@/components/ui/badge";

export default function AIInsightsPage() {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(
    () => menuVerseStore.getRestaurantBySlug() || null
  );
  const [selectedDishId, setSelectedDishId] = useState<string>("");

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

  if (!restaurant) return null;

  const dishes = restaurant.menuItems || [];
  const activeDish = dishes.find((d) => d.id === selectedDishId) || dishes[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-white border border-stone-200/90 shadow-sm space-y-2">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 text-purple-600 border border-purple-200 shadow-xs">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-stone-900">
              AI Taste & Sentiment Intelligence Engine
            </h1>
            <p className="text-xs text-stone-500 font-medium">
              Continuously synthesizes diner review language into culinary patterns, portion feedback, and recipe recommendations
            </p>
          </div>
        </div>
      </div>

      {/* Dish Selector Tabs or Empty State */}
      {dishes.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-stone-200/90 shadow-sm p-8 space-y-4">
          <div className="flex h-14 w-14 mx-auto items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
            <Bot className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-black text-stone-900">No Dishes Available for Analysis</h3>
            <p className="text-xs text-stone-500 font-medium max-w-sm mx-auto">
              Add your dishes in Menu Studio and receive diner reviews to automatically generate AI sentiment scores, key taste aspects, and flavor profiles.
            </p>
          </div>
          <Link
            href="/dashboard/menu"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-md shadow-orange-600/20 hover:scale-105 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Go to Menu Studio to Add Dishes</span>
          </Link>
        </div>
      ) : (
        <>
          <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
            {dishes.map((dish) => {
              const isActive = dish.id === selectedDishId;
              return (
                <button
                  key={dish.id}
                  onClick={() => setSelectedDishId(dish.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black shrink-0 transition-all duration-200 hover:scale-105 active:scale-95 ${
                    isActive
                      ? "bg-orange-600 text-white shadow-md shadow-orange-600/25 scale-102"
                      : "bg-white text-stone-700 hover:bg-stone-100 border border-stone-200 shadow-xs"
                  }`}
                >
                  <span>{dish.name}</span>
                  <span className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-bold ${isActive ? "bg-white/25 text-white" : "bg-stone-100 text-stone-600"}`}>
                    <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                    {dish.statistics?.averageRating ? dish.statistics.averageRating.toFixed(1) : "5.0"}
                  </span>
                </button>
              );
            })}
          </div>

          {activeDish && (
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-white border border-stone-200/90 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-14 w-14 rounded-2xl overflow-hidden bg-orange-50 shrink-0 border border-stone-200 flex items-center justify-center text-orange-600">
                      {activeDish.images && activeDish.images[0]?.url ? (
                        <img
                          src={activeDish.images[0].url}
                          alt={activeDish.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <ChefHat className="w-6 h-6" />
                      )}
                    </div>
                    <div>
                      <h2 className="text-lg font-black text-stone-900">
                        {activeDish.name}
                      </h2>
                      <p className="text-xs text-stone-500 font-medium">
                        Analyzed across {activeDish.reviews?.length || 0} customer reviews
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant="success" className="font-bold">
                      {activeDish.statistics?.recommendationPercentage || 100}% Recommend
                    </Badge>
                  </div>
                </div>

                {activeDish.aiSummary ? (
                  <AISummaryCard summary={activeDish.aiSummary} dishName={activeDish.name} />
                ) : (
                  <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-center text-xs text-stone-500 font-medium">
                    AI summary will be generated once diners leave reviews for this dish.
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
