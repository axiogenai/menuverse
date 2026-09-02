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
  Check
} from "lucide-react";
import { MenuItem, Restaurant, Category } from "@/types";
import { menuVerseStore } from "@/lib/seed-data";
import { formatPrice, slugify } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { DishEditModal } from "@/components/dashboard/DishEditModal";

export default function MenuStudioPage() {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(
    () => menuVerseStore.getRestaurantBySlug("gusto-trattoria") || null
  );
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  
  // Edit / Create modal state
  const [editingDish, setEditingDish] = useState<MenuItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Add Category modal state
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [newCatDesc, setNewCatDesc] = useState("");

  useEffect(() => {
    const update = () => {
      const rest = menuVerseStore.getRestaurantBySlug();
      if (rest) setRestaurant({ ...rest });
    };
    update();
    const unsubscribe = menuVerseStore.subscribe(update);
    return () => unsubscribe();
  }, []);

  const handleToggleAvailability = (dishId: string) => {
    menuVerseStore.toggleDishAvailability(dishId);
    const updated = menuVerseStore.getRestaurantBySlug();
    if (updated) setRestaurant({ ...updated });
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-stone-900 flex items-center gap-2">
            <UtensilsCrossed className="w-6 h-6 text-orange-600" />
            Menu Studio & Social Dishes
          </h1>
          <p className="text-xs text-stone-500 font-medium">
            Manage your dishes, upload photos, set pricing, and toggle instant availability (86-ing)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => setIsCategoryModalOpen(true)}
            variant="outline"
            className="rounded-xl font-bold border-stone-200 bg-white text-stone-700 hover:bg-stone-50 flex items-center gap-1.5 shadow-xs"
          >
            <FolderPlus className="w-4 h-4 text-orange-600" />
            <span>Add Category</span>
          </Button>

          <Button
            onClick={() => {
              setEditingDish(null);
              setIsModalOpen(true);
            }}
            className="bg-orange-600 hover:bg-orange-500 text-white rounded-xl font-bold flex items-center gap-1.5 shadow-md shadow-orange-600/20 hover:scale-105 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Dish</span>
          </Button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <Input
            placeholder="Search menu items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 rounded-2xl bg-white border-stone-200 text-stone-900 shadow-xs"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 hide-scrollbar">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
              selectedCategory === "all"
                ? "bg-orange-600 text-white shadow-xs"
                : "bg-white text-stone-600 border border-stone-200 hover:bg-stone-50"
            }`}
          >
            All ({dishes.length})
          </button>
          {categories.map((c) => {
            const count = dishes.filter((d) => d.categoryId === c.id).length;
            return (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  selectedCategory === c.id
                    ? "bg-orange-600 text-white shadow-xs"
                    : "bg-white text-stone-600 border border-stone-200 hover:bg-stone-50"
                }`}
              >
                {c.name} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Menu Table */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-stone-200 shadow-sm p-6 space-y-3">
          <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-2xl bg-orange-50 text-orange-600">
            <UtensilsCrossed className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-stone-900">No dishes in this category</h3>
          <p className="text-xs text-stone-500 font-medium max-w-sm mx-auto">
            Get started by adding your first dish with description, price, and photography.
          </p>
          <Button
            onClick={() => {
              setEditingDish(null);
              setIsModalOpen(true);
            }}
            className="bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl shadow-xs"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Add New Dish
          </Button>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-stone-200/90 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-500 border-b border-stone-200 uppercase font-black text-[10px] tracking-wider">
                <tr>
                  <th className="p-4">Dish</th>
                  <th className="p-4">Course</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Reviews & Rating</th>
                  <th className="p-4">Availability</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filtered.map((dish) => {
                  const stats = dish.statistics;
                  const cat = categories.find((c) => c.id === dish.categoryId);
                  const img = dish.images && dish.images.length > 0 ? dish.images[0].url : null;

                  return (
                    <tr key={dish.id} className="hover:bg-stone-50/80 transition-colors">
                      {/* Dish Column */}
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 rounded-xl bg-orange-50 overflow-hidden shrink-0 border border-stone-200 flex items-center justify-center text-orange-600">
                            {img ? (
                              <img
                                src={img}
                                alt={dish.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <UtensilsCrossed className="w-5 h-5" />
                            )}
                          </div>
                          <div className="max-w-xs">
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-stone-900 line-clamp-1">{dish.name}</span>
                              {dish.isSignature && (
                                <Badge variant="warning" className="text-[9px] px-1.5 py-0">
                                  Signature
                                </Badge>
                              )}
                            </div>
                            <span className="text-stone-500 text-[11px] line-clamp-1">
                              {dish.description || "No description provided"}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="p-4 text-stone-700 font-bold">
                        {cat?.name || "General"}
                      </td>

                      {/* Price */}
                      <td className="p-4 font-black text-orange-600 text-sm">
                        {formatPrice(dish.price, dish.currency)}
                      </td>

                      {/* Stats */}
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className="flex items-center gap-0.5 text-amber-600 font-black bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            {stats?.averageRating ? stats.averageRating.toFixed(1) : "5.0"}
                          </span>
                          <span className="text-stone-500 font-semibold">
                            ({stats?.totalReviews || (dish.reviews ? dish.reviews.length : 0)} reviews)
                          </span>
                        </div>
                      </td>

                      {/* Availability Toggle */}
                      <td className="p-4">
                        <button
                          onClick={() => handleToggleAvailability(dish.id)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-black transition-all hover:scale-105 active:scale-95 ${
                            dish.isAvailable
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-rose-50 text-rose-700 border border-rose-200"
                          }`}
                        >
                          {dish.isAvailable ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>In Stock</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3.5 h-3.5" />
                              <span>86'd / Sold Out</span>
                            </>
                          )}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-right space-x-1">
                        <Button
                          onClick={() => {
                            setEditingDish(dish);
                            setIsModalOpen(true);
                          }}
                          variant="ghost"
                          size="sm"
                          className="rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-100 font-bold"
                        >
                          <Edit3 className="w-4 h-4 mr-1" />
                          Edit
                        </Button>

                        <Button
                          onClick={() => handleDeleteDish(dish.id, dish.name)}
                          variant="ghost"
                          size="sm"
                          className="rounded-xl text-rose-600 hover:text-rose-700 hover:bg-rose-50 font-bold"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </Button>
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
