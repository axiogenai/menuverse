"use client";

import React from "react";
import { Category } from "@/types";
import { cn } from "@/lib/utils";
import { 
  UtensilsCrossed, 
  Flame, 
  Beef, 
  CakeSlice, 
  Utensils,
  Pizza
} from "lucide-react";

interface CategoryNavProps {
  categories: Category[];
  activeCategoryId: string;
  onSelectCategory: (categoryId: string) => void;
}

const ICON_MAP: Record<string, React.ElementType> = {
  UtensilsCrossed,
  Flame,
  Beef,
  CakeSlice,
  Utensils,
  Pizza,
};

export function CategoryNav({
  categories,
  activeCategoryId,
  onSelectCategory,
}: CategoryNavProps) {
  const handleClick = (id: string) => {
    onSelectCategory(id);
    const elem = document.getElementById("menu-categories");
    if (elem) {
      const top = elem.getBoundingClientRect().top + window.pageYOffset - 80;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <div className="sticky top-16 z-30 -mx-4 px-4 py-2.5 bg-[#faf8f5]/95 backdrop-blur-md border-b border-stone-200/80 shadow-xs">
      <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar">
        <button
          onClick={() => handleClick("all")}
          className={cn(
            "flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-black shrink-0 transition-all duration-200 hover:scale-105 active:scale-95",
            activeCategoryId === "all"
              ? "bg-orange-600 text-white shadow-md shadow-orange-600/25 scale-102"
              : "bg-white text-stone-700 border border-stone-200/90 hover:bg-stone-100/80 shadow-xs"
          )}
        >
          <Utensils className="w-3.5 h-3.5" />
          <span>All Dishes</span>
        </button>

        {categories.map((category) => {
          const Icon = ICON_MAP[category.icon || "Utensils"] || Utensils;
          const isActive = activeCategoryId === category.id;

          return (
            <button
              key={category.id}
              onClick={() => handleClick(category.id)}
              className={cn(
                "flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-black shrink-0 transition-all duration-200 hover:scale-105 active:scale-95",
                isActive
                  ? "bg-orange-600 text-white shadow-md shadow-orange-600/25 scale-102"
                  : "bg-white text-stone-700 border border-stone-200/90 hover:bg-stone-100/80 shadow-xs"
              )}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{category.name}</span>
              {category.menuItems && (
                <span
                  className={cn(
                    "text-[10px] px-2 py-0.5 rounded-full font-bold",
                    isActive
                      ? "bg-white/25 text-white"
                      : "bg-stone-100 text-stone-600 border border-stone-200"
                  )}
                >
                  {category.menuItems.length}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
