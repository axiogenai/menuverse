"use client";

import React, { useState, useEffect } from "react";
import { 
  UtensilsCrossed, 
  Plus, 
  Search, 
  Edit3, 
  Trash2,
  CheckCircle2, 
  XCircle, 
  Star, 
  FolderPlus,
  X,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Filter
} from "lucide-react";
import { MenuItem, Restaurant, Category } from "@/types";
import { menuVerseStore } from "@/lib/seed-data";
import { formatPrice, slugify, cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { DishEditModal } from "@/components/dashboard/DishEditModal";

// Isolated micro-component for 0ms instantaneous 1-click responsiveness
function StatusToggle({
  dishId,
  initialAvailable,
}: {
  dishId: string;
  initialAvailable: boolean;
}) {
  const [available, setAvailable] = useState(initialAvailable);

  useEffect(() => {
    setAvailable(initialAvailable);
  }, [initialAvailable]);

  const toggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const next = !available;
    setAvailable(next);
    menuVerseStore.toggleDishAvailability(dishId);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className={cn(
        "w-[86px] h-6 rounded-md text-[11px] font-semibold cursor-pointer border inline-flex items-center justify-center gap-1.5 shadow-2xs active:scale-95 select-none whitespace-nowrap",
        available
          ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/30 hover:bg-emerald-500/20"
          : "bg-red-500/10 text-red-600 border-red-500/30 hover:bg-red-500/20"
      )}
      title={available ? "Click to mark Out of Stock" : "Click to mark In Stock"}
    >
      <span
        className={cn(
          "w-1.5 h-1.5 rounded-full shrink-0",
          available ? "bg-emerald-600" : "bg-red-500"
        )}
      />
      <span>{available ? "In Stock" : "Out of Stock"}</span>
    </button>
  );
}

export default function MenuStudioPage() {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(
    () => menuVerseStore.getRestaurantBySlug("gusto-trattoria") || null
  );
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  
  // News-style category carousel scroll controls
  const categoryScrollRef = React.useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Edit / Create modal state
  const [editingDish, setEditingDish] = useState<MenuItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Add Category modal state
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [newCatDesc, setNewCatDesc] = useState("");

  const checkScrollButtons = () => {
    if (categoryScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = categoryScrollRef.current;
      setCanScrollLeft(scrollLeft > 5);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
    }
  };

  useEffect(() => {
    checkScrollButtons();
    const el = categoryScrollRef.current;
    if (el) {
      el.addEventListener("scroll", checkScrollButtons);
      window.addEventListener("resize", checkScrollButtons);
      return () => {
        el.removeEventListener("scroll", checkScrollButtons);
        window.removeEventListener("resize", checkScrollButtons);
      };
    }
  }, [restaurant?.categories]);

  const scrollCategoryTrack = (direction: "left" | "right") => {
    if (categoryScrollRef.current) {
      const offset = direction === "left" ? -240 : 240;
      categoryScrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  const handleSaveDish = (dishData: Partial<MenuItem>) => {
    if (editingDish) {
      menuVerseStore.updateDish(editingDish.id, dishData);
    } else {
      menuVerseStore.addDish(dishData as any);
    }
    const updated = menuVerseStore.getRestaurantBySlug();
    if (updated) setRestaurant({ ...updated });
  };

  const handleDeleteDish = (dishId: string, dishName: string) => {
    if (typeof window !== "undefined" && window.confirm(`Are you sure you want to remove "${dishName}" from the menu?`)) {
      menuVerseStore.deleteDish(dishId);
      const updated = menuVerseStore.getRestaurantBySlug();
      if (updated) setRestaurant({ ...updated });
    }
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim() || !restaurant) return;

    menuVerseStore.addCategory({
      restaurantId: restaurant.id,
      name: newCatName.trim(),
      slug: slugify(newCatName),
      description: newCatDesc.trim() || null,
      icon: "Utensils",
      displayOrder: (restaurant.categories?.length || 0) + 1,
      isVisible: true,
      isActive: true,
    });

    setNewCatName("");
    setNewCatDesc("");
    setIsCategoryModalOpen(false);
    const updated = menuVerseStore.getRestaurantBySlug();
    if (updated) setRestaurant({ ...updated });
  };

  if (!restaurant) return null;

  const categories = restaurant.categories || [];
  const dishes = restaurant.menuItems || [];

  const filtered = dishes.filter((dish) => {
    const matchesCat = selectedCategory === "all" || dish.categoryId === selectedCategory;
    const matchesSearch =
      dish.name.toLowerCase().includes(search.toLowerCase()) ||
      (dish.description && dish.description.toLowerCase().includes(search.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-200/80">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Menu Management
            </h1>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
              {dishes.length} Items Total
            </span>
          </div>
          <p className="text-xs text-slate-500 font-normal">
            Manage your dishes, upload photos, configure pricing, and toggle instant 86-availability.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            onClick={() => setIsCategoryModalOpen(true)}
            variant="outline"
            className="h-9 px-3 text-xs font-semibold text-slate-700 bg-white border-slate-200/90 hover:bg-slate-50 hover:text-slate-900 shadow-2xs rounded-lg flex items-center gap-1.5"
          >
            <FolderPlus className="w-3.5 h-3.5 text-slate-500" />
            <span>Add Category</span>
          </Button>

          <Button
            onClick={() => {
              setEditingDish(null);
              setIsModalOpen(true);
            }}
            className="h-9 px-3.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 shadow-xs rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-orange-400" />
            <span>Add New Dish</span>
          </Button>
        </div>
      </div>

      {/* News-Style Modern Category Scroll Track & Search Command */}
      <div className="space-y-3">
        {/* Category Carousel Track */}
        <div className="relative flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200/80 shadow-2xs">
          {/* Scroll Left Button */}
          {canScrollLeft && (
            <button
              type="button"
              onClick={() => scrollCategoryTrack("left")}
              className="h-7 w-7 rounded-lg bg-white border border-slate-200/90 shadow-xs flex items-center justify-center text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-all shrink-0 z-10 cursor-pointer"
              title="Scroll left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}

          {/* Smooth Scrollable Category Track */}
          <div
            ref={categoryScrollRef}
            className="flex items-center gap-1 overflow-x-auto scrollbar-none no-scrollbar scroll-smooth flex-1 py-0.5"
          >
            <button
              type="button"
              onClick={() => setSelectedCategory("all")}
              className={cn(
                "px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 flex items-center gap-1.5 cursor-pointer whitespace-nowrap",
                selectedCategory === "all"
                  ? "bg-white text-slate-900 font-semibold shadow-xs border border-slate-200/70"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/40"
              )}
            >
              <span>All Dishes</span>
              <span
                className={cn(
                  "text-[10px] px-1.5 py-0.2 rounded-full font-mono font-medium",
                  selectedCategory === "all"
                    ? "bg-slate-100 text-slate-800"
                    : "bg-slate-200/60 text-slate-500"
                )}
              >
                {dishes.length}
              </span>
            </button>

            {categories.map((c) => {
              const count = dishes.filter((d) => d.categoryId === c.id).length;
              const isSelected = selectedCategory === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelectedCategory(c.id)}
                  className={cn(
                    "px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 flex items-center gap-1.5 cursor-pointer whitespace-nowrap",
                    isSelected
                      ? "bg-white text-slate-900 font-semibold shadow-xs border border-slate-200/70"
                      : "text-slate-600 hover:text-slate-900 hover:bg-white/40"
                  )}
                >
                  <span>{c.name}</span>
                  <span
                    className={cn(
                      "text-[10px] px-1.5 py-0.2 rounded-full font-mono font-medium",
                      isSelected
                        ? "bg-slate-100 text-slate-800"
                        : "bg-slate-200/60 text-slate-500"
                    )}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Scroll Right Button */}
          {canScrollRight && (
            <button
              type="button"
              onClick={() => scrollCategoryTrack("right")}
              className="h-7 w-7 rounded-lg bg-white border border-slate-200/90 shadow-xs flex items-center justify-center text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-all shrink-0 z-10 cursor-pointer"
              title="Scroll right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}

          {/* Quick Add Category Action */}
          <button
            type="button"
            onClick={() => setIsCategoryModalOpen(true)}
            className="h-7 px-2.5 rounded-lg bg-white border border-slate-200/90 shadow-xs flex items-center gap-1 text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-all shrink-0 z-10 cursor-pointer text-xs font-medium"
            title="Create new category"
          >
            <Plus className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Category</span>
          </button>
        </div>

        {/* Search Input Bar */}
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <Input
            placeholder="Search menu items by dish name, description, or ingredients..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 w-full bg-white shadow-2xs"
          />
        </div>
      </div>

      {/* Menu Table */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-3">
          <div className="flex h-10 w-10 mx-auto items-center justify-center rounded-lg bg-slate-100 text-slate-600">
            <UtensilsCrossed className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-semibold text-slate-900">No dishes in this category</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Get started by adding your first dish with description, price, and photography.
          </p>
          <Button
            onClick={() => {
              setEditingDish(null);
              setIsModalOpen(true);
            }}
            className="h-9 px-3.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs"
          >
            <Plus className="w-3.5 h-3.5 mr-1 text-orange-400" />
            Add New Dish
          </Button>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200/90 overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs table-auto">
              <thead className="bg-slate-50/80 text-slate-500 border-b border-slate-200 font-semibold text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="py-2.5 pl-3.5 pr-2 w-full min-w-[150px]">Dish</th>
                  <th className="py-2.5 px-3 whitespace-nowrap">Category</th>
                  <th className="py-2.5 px-3 whitespace-nowrap">Price</th>
                  <th className="py-2.5 px-3 whitespace-nowrap">Rating</th>
                  <th className="py-2.5 px-3 w-[92px] text-center whitespace-nowrap">Status</th>
                  <th className="py-2.5 pl-3 pr-3.5 text-left whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((dish) => {
                  const stats = dish.statistics;
                  const cat = categories.find((c) => c.id === dish.categoryId);
                  const rawImg = dish.images && dish.images.length > 0 ? dish.images[0].url : "";
                  const img =
                    rawImg && rawImg.startsWith("http") && !rawImg.includes("Burrata Pugliese")
                      ? rawImg
                      : dish.name.toLowerCase().includes("burrata")
                      ? "https://images.unsplash.com/photo-1592417817098-8f3d6910985b?auto=format&fit=crop&w=400&q=80"
                      : "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80";

                  return (
                    <tr key={dish.id} className="hover:bg-slate-50/60 transition-colors">
                      {/* Dish Column - Compact with Small Description */}
                      <td className="py-2 pl-3.5 pr-2 max-w-[200px] sm:max-w-[240px]">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="h-7 w-7 rounded-md bg-slate-100 overflow-hidden shrink-0 border border-slate-200/90">
                            <img
                              src={img}
                              alt={dish.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80";
                              }}
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5 min-w-0">
                              <span className="font-semibold text-xs text-slate-900 truncate block">{dish.name}</span>
                              {dish.isSignature && (
                                <span className="text-[9px] font-semibold px-1 py-0.2 rounded bg-amber-50 text-amber-800 border border-amber-200/80 shrink-0">
                                  Signature
                                </span>
                              )}
                            </div>
                            <span className="text-slate-400 text-[10px] truncate block leading-tight">
                              {dish.description || "No description provided"}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-2 px-3 text-slate-600 font-medium whitespace-nowrap text-xs">
                        {cat?.name || "General"}
                      </td>

                      {/* Price */}
                      <td className="py-2 px-3 font-semibold text-slate-900 font-mono text-xs whitespace-nowrap">
                        {formatPrice(dish.price, dish.currency)}
                      </td>

                      {/* Stats */}
                      <td className="py-2 px-3 whitespace-nowrap">
                        <div className="flex items-center gap-1 font-semibold text-slate-900 font-mono text-xs whitespace-nowrap">
                          <Star className="w-3 h-3 fill-amber-500 text-amber-500 shrink-0" />
                          <span>{stats?.averageRating ? stats.averageRating.toFixed(1) : "5.0"}</span>
                          <span className="text-slate-400 font-sans font-normal text-[10px]">
                            ({stats?.totalReviews || (dish.reviews ? dish.reviews.length : 0)})
                          </span>
                        </div>
                      </td>

                      {/* Availability Status - Instant 0ms 1-Click Toggle */}
                      <td className="py-2 px-3 w-[92px] text-center whitespace-nowrap">
                        <StatusToggle dishId={dish.id} initialAvailable={dish.isAvailable} />
                      </td>

                      {/* Actions - Placed immediately next to Status without gap */}
                      <td className="py-2 pl-3 pr-3.5 text-left whitespace-nowrap">
                        <div className="flex items-center justify-start gap-1 whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingDish(dish);
                              setIsModalOpen(true);
                            }}
                            className="h-6.5 px-2 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-md inline-flex items-center gap-1 transition-colors cursor-pointer"
                            title="Edit Dish"
                          >
                            <Edit3 className="w-3 h-3 text-slate-500" />
                            <span>Edit</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteDish(dish.id, dish.name)}
                            className="h-6.5 w-6.5 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-md inline-flex items-center justify-center transition-colors cursor-pointer"
                            title="Delete Dish"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Dish Edit / Create Modal */}
      <DishEditModal
        dish={editingDish}
        categories={categories}
        restaurantId={restaurant.id}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveDish}
      />

      {/* Add Category Modal */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md bg-white text-stone-900 rounded-3xl border border-stone-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                  <FolderPlus className="w-5 h-5" />
                </div>
                <h3 className="font-black text-base text-stone-900">Add Menu Course / Category</h3>
              </div>
              <button
                onClick={() => setIsCategoryModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCategory} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700">Category Name</label>
                <Input
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="e.g. Seafood & Crudo"
                  required
                  className="bg-white border-stone-200"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700">Description (Optional)</label>
                <Input
                  value={newCatDesc}
                  onChange={(e) => setNewCatDesc(e.target.value)}
                  placeholder="e.g. Fresh catch prepared with Mediterranean herbs"
                  className="bg-white border-stone-200"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button type="button" variant="ghost" onClick={() => setIsCategoryModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl shadow-md shadow-orange-600/20">
                  <Check className="w-4 h-4 mr-1.5" />
                  Save Category
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
