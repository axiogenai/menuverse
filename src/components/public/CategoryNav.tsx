"use client";

import React, { useState, useRef, useEffect } from "react";
import { Category } from "@/types";
import { cn } from "@/lib/utils";
import { 
  UtensilsCrossed, 
  Flame, 
  Beef, 
  CakeSlice, 
  Utensils,
  Pizza,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  X,
  Check
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
  const [isGridOpen, setIsGridOpen] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Check scroll bounds to conditionally show arrow controls
  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [categories]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsGridOpen(false);
      }
    };
    if (isGridOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isGridOpen]);

  const handleClick = (id: string, e?: React.MouseEvent) => {
    onSelectCategory(id);
    setIsGridOpen(false);
    if (e?.currentTarget) {
      (e.currentTarget as HTMLElement).scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
    const elem = document.getElementById("menu-categories");
    if (elem) {
      const top = elem.getBoundingClientRect().top + window.pageYOffset - 80;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const amount = direction === "left" ? -260 : 260;
      scrollContainerRef.current.scrollBy({ left: amount, behavior: "smooth" });
      setTimeout(checkScroll, 300);
    }
  };

  const totalDishes = categories.reduce((sum, c) => sum + (c.menuItems?.length || 0), 0);

  return (
    <div className="sticky top-16 z-30 -mx-3 sm:-mx-4 px-3 sm:px-4 py-2 bg-[#faf8f5]/95 backdrop-blur-md border-b border-stone-200/80 shadow-2xs">
      <div className="flex items-center justify-between gap-2 max-w-5xl mx-auto">
        {/* Left: Scrollable Category Pills with Inline Direction Arrows */}
        <div className="relative flex-1 min-w-0 flex items-center">
          {canScrollLeft && (
            <button
              type="button"
              onClick={() => scroll("left")}
              aria-label="Scroll left"
              className="hidden sm:flex shrink-0 mr-1.5 w-7 h-7 rounded-full bg-white text-stone-700 shadow-sm border border-stone-200 items-center justify-center hover:bg-stone-50 transition-all active:scale-90 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}

          {/* Scrollable Ribbon Track */}
          <div
            ref={scrollContainerRef}
            onScroll={checkScroll}
            className="flex items-center gap-2 overflow-x-auto py-1 scroll-smooth hide-scrollbar scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden w-full select-none"
          >
            {/* All Dishes Master Pill */}
            <button
              type="button"
              onClick={(e) => handleClick("all", e)}
              className={cn(
                "flex items-center gap-1.5 h-9 sm:h-10 px-3.5 sm:px-4 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap shrink-0 transition-all active:scale-95 cursor-pointer",
                activeCategoryId === "all"
                  ? "bg-stone-900 text-white shadow-sm border border-stone-900"
                  : "bg-white text-stone-700 border border-stone-200/90 hover:border-amber-400/60 hover:bg-stone-50"
              )}
            >
              <Utensils className={cn("w-3.5 h-3.5 shrink-0", activeCategoryId === "all" ? "text-amber-400" : "text-stone-500")} />
              <span>All Menu</span>
              {totalDishes > 0 && (
                <span
                  className={cn(
                    "text-[10px] sm:text-[11px] px-1.5 py-0.5 rounded-full font-bold leading-none",
                    activeCategoryId === "all"
                      ? "bg-white/25 text-white"
                      : "bg-stone-100 text-stone-600 border border-stone-200/60"
                  )}
                >
                  {totalDishes}
                </span>
              )}
            </button>

            {/* Dynamic Categories List */}
            {categories.map((category) => {
              const Icon = ICON_MAP[category.icon || "Utensils"] || Utensils;
              const isActive = activeCategoryId === category.id;
              const count = category.menuItems?.length;

              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={(e) => handleClick(category.id, e)}
                  className={cn(
                    "flex items-center gap-1.5 h-9 sm:h-10 px-3.5 sm:px-4 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap shrink-0 transition-all active:scale-95 cursor-pointer",
                    isActive
                      ? "bg-stone-900 text-white shadow-sm border border-stone-900"
                      : "bg-white text-stone-700 border border-stone-200/90 hover:border-amber-400/60 hover:bg-stone-50"
                  )}
                >
                  <Icon className={cn("w-3.5 h-3.5 shrink-0", isActive ? "text-amber-400" : "text-stone-500")} />
                  <span>{category.name}</span>
                  {count !== undefined && count > 0 && (
                    <span
                      className={cn(
                        "text-[10px] sm:text-[11px] px-1.5 py-0.5 rounded-full font-bold leading-none",
                        isActive
                          ? "bg-white/25 text-white"
                          : "bg-stone-100 text-stone-600 border border-stone-200/60"
                      )}
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {canScrollRight && (
            <button
              type="button"
              onClick={() => scroll("right")}
              aria-label="Scroll right"
              className="hidden sm:flex shrink-0 ml-1.5 w-7 h-7 rounded-full bg-white text-stone-700 shadow-sm border border-stone-200 items-center justify-center hover:bg-stone-50 transition-all active:scale-90 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Right: Quick Menu Index Drawer Button */}
        <div className="relative shrink-0 ml-1" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsGridOpen(!isGridOpen)}
            className={cn(
              "flex items-center gap-1.5 h-9 sm:h-10 px-3 rounded-full border text-xs font-bold transition-all shadow-2xs active:scale-95 cursor-pointer shrink-0 select-none",
              isGridOpen
                ? "bg-amber-800 text-white border-amber-800 shadow-xs"
                : "bg-white text-stone-700 border-stone-200/90 hover:bg-stone-50 hover:border-amber-400/60"
            )}
            title="Browse All Categories Directory"
          >
            <LayoutGrid className={cn("w-3.5 h-3.5 shrink-0", isGridOpen ? "text-white" : "text-amber-700")} />
            <span className="hidden sm:inline">Index</span>
          </button>

          {/* Luxury Dropdown Menu Directory Panel */}
          {isGridOpen && (
            <div className="absolute right-0 top-10 w-72 sm:w-80 bg-white rounded-2xl border border-stone-200/90 shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-stone-100">
                <div className="flex items-center gap-1.5">
                  <LayoutGrid className="w-3.5 h-3.5 text-amber-700" />
                  <span className="text-xs font-bold text-stone-900">Menu Categories</span>
                </div>
                <button
                  onClick={() => setIsGridOpen(false)}
                  className="p-1 text-stone-400 hover:text-stone-700 rounded-md"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Grid of Categories */}
              <div className="grid grid-cols-1 gap-1 max-h-80 overflow-y-auto scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden pr-0.5">
                <button
                  onClick={() => handleClick("all")}
                  className={cn(
                    "w-full flex items-center justify-between p-2 rounded-xl text-left transition-colors text-xs font-bold cursor-pointer",
                    activeCategoryId === "all"
                      ? "bg-amber-50 text-amber-900 border border-amber-200/70"
                      : "hover:bg-stone-50 text-stone-800"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <Utensils className="w-4 h-4 text-amber-700" />
                    <span>All Dishes</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-stone-400 font-normal">({totalDishes})</span>
                    {activeCategoryId === "all" && <Check className="w-3.5 h-3.5 text-amber-700" />}
                  </div>
                </button>

                {categories.map((cat) => {
                  const Icon = ICON_MAP[cat.icon || "Utensils"] || Utensils;
                  const isActive = activeCategoryId === cat.id;

                  return (
                    <button
                      key={cat.id}
                      onClick={() => handleClick(cat.id)}
                      className={cn(
                        "w-full flex items-center justify-between p-2 rounded-xl text-left transition-colors text-xs font-bold cursor-pointer",
                        isActive
                          ? "bg-amber-50 text-amber-900 border border-amber-200/70"
                          : "hover:bg-stone-50 text-stone-800"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-amber-700" />
                        <span className="truncate">{cat.name}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] text-stone-400 font-normal">
                          ({cat.menuItems?.length || 0})
                        </span>
                        {isActive && <Check className="w-3.5 h-3.5 text-amber-700" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
