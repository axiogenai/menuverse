"use client";

import React, { useState, useEffect } from "react";
import { X, Check, Utensils, Star, ChefHat, Flame, Upload } from "lucide-react";
import { MenuItem, Category } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { slugify } from "@/lib/utils";

interface DishEditModalProps {
  dish?: MenuItem | null;
  categories: Category[];
  restaurantId: string;
  isOpen: boolean;
  onClose: () => void;
  onSave: (dishData: Partial<MenuItem>) => void;
}

export function DishEditModal({
  dish,
  categories,
  restaurantId,
  isOpen,
  onClose,
  onSave,
}: DishEditModalProps) {
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [prepTime, setPrepTime] = useState("");
  const [spicyLevel, setSpicyLevel] = useState(0);
  const [isVegetarian, setIsVegetarian] = useState(false);
  const [isVegan, setIsVegan] = useState(false);
  const [isGlutenFree, setIsGlutenFree] = useState(false);
  const [isSignature, setIsSignature] = useState(false);
  const [isChefSpecial, setIsChefSpecial] = useState(false);
  const [ingredientsStr, setIngredientsStr] = useState("");
  const [allergensStr, setAllergensStr] = useState("");

  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", "dishes");

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        if (data.success && data.url) {
          setImageUrl(data.url);
        } else {
          const reader = new FileReader();
          reader.onload = () => {
            if (typeof reader.result === "string") setImageUrl(reader.result);
          };
          reader.readAsDataURL(file);
        }
      } catch (err) {
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === "string") setImageUrl(reader.result);
        };
        reader.readAsDataURL(file);
      } finally {
        setIsUploading(false);
      }
    }
  };

  useEffect(() => {
    if (dish) {
      setName(dish.name);
      setCategoryId(dish.categoryId);
      setPrice(dish.price.toString());
      setDescription(dish.description || "");
      setImageUrl(dish.images[0]?.url || "");
      setPrepTime(dish.preparationTimeMinutes ? dish.preparationTimeMinutes.toString() : "");
      setSpicyLevel(dish.spicyLevel);
      setIsVegetarian(dish.isVegetarian);
      setIsVegan(dish.isVegan);
      setIsGlutenFree(dish.isGlutenFree);
      setIsSignature(dish.isSignature);
      setIsChefSpecial(dish.isChefSpecial);
      setIngredientsStr(dish.ingredients?.join(", ") || "");
      setAllergensStr(dish.allergens?.join(", ") || "");
    } else {
      setName("");
      setCategoryId(categories[0]?.id || "");
      setPrice("18.00");
      setDescription("");
      setImageUrl("https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=800&q=80");
      setPrepTime("15");
      setSpicyLevel(0);
      setIsVegetarian(false);
      setIsVegan(false);
      setIsGlutenFree(false);
      setIsSignature(false);
      setIsChefSpecial(false);
      setIngredientsStr("");
      setAllergensStr("");
    }
  }, [dish, categories, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ingredients = ingredientsStr
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const allergens = allergensStr
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const dishPayload: Partial<MenuItem> = {
      restaurantId,
      name,
      slug: slugify(name),
      categoryId,
      price: parseFloat(price) || 0,
      currency: "INR",
      description,
      preparationTimeMinutes: prepTime ? parseInt(prepTime) : null,
      spicyLevel,
      isVegetarian,
      isVegan,
      isGlutenFree,
      isSignature,
      isChefSpecial,
      isAvailable: dish ? dish.isAvailable : true,
      ingredients,
      allergens,
      images: [
        {
          id: dish?.images[0]?.id || `img-${Date.now()}`,
          menuItemId: dish?.id || "",
          url: imageUrl,
          isPrimary: true,
          displayOrder: 1,
        },
      ],
    };

    onSave(dishPayload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white text-stone-900 rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-6">
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 bg-stone-50">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
              <Utensils className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-black text-stone-900">
                {dish ? "Edit Dish & Social Media Object" : "Create New Menu Dish"}
              </h3>
              <p className="text-xs text-stone-500 font-medium">Configures dish pricing, metadata, and social profile</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto hide-scrollbar text-left bg-white">
          {/* Dish Name & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700">
                Dish Name
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Truffle Pappardelle"
                className="bg-white border-stone-200 text-stone-900"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700">
                Menu Category
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="flex h-11 w-full rounded-xl border border-stone-200 bg-white px-3.5 py-2 text-xs font-bold text-stone-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                required
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Price & Prep Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700">
                Price (INR ₹)
              </label>
              <Input
                type="number"
                step="1"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="500"
                className="bg-white border-stone-200 text-stone-900"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700">
                Prep Time (Mins)
              </label>
              <Input
                type="number"
                value={prepTime}
                onChange={(e) => setPrepTime(e.target.value)}
                placeholder="15"
                className="bg-white border-stone-200 text-stone-900"
              />
            </div>
          </div>

          {/* Image Upload & URL */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-stone-700">
              Dish Photo (Upload or Paste URL)
            </label>
            <div className="flex items-center gap-2">
              <label className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-700 hover:bg-stone-100 cursor-pointer text-xs font-bold transition-colors">
                <Upload className="w-4 h-4 text-orange-500" />
                <span>Upload from Device</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              <div className="flex-1">
                <Input
                  type="url"
                  value={imageUrl.startsWith("data:") ? "(Photo Uploaded from Device)" : imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Or paste photo URL..."
                  disabled={imageUrl.startsWith("data:")}
                  className="bg-white border-stone-200 text-stone-900 text-xs"
                />
              </div>
            </div>

            {imageUrl && (
              <div className="relative h-20 w-20 rounded-xl overflow-hidden border border-stone-200 shadow-xs">
                <img
                  src={imageUrl}
                  alt="Dish preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700">
                Culinary Description
              </label>
              <span className="text-[10px] text-slate-400">Concise (1–2 lines)</span>
            </div>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe key ingredients, culinary technique, or flavor profile..."
              className="w-full rounded-lg border border-slate-200 bg-white p-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus-visible:outline-none focus-visible:border-slate-800 focus-visible:ring-1 focus-visible:ring-slate-800 transition-colors resize-none shadow-2xs"
            />
          </div>

          {/* Ingredients & Allergens */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700">
                Ingredients (comma separated)
              </label>
              <Input
                value={ingredientsStr}
                onChange={(e) => setIngredientsStr(e.target.value)}
                placeholder="Fresh pasta, Truffle, Butter"
                className="bg-white border-stone-200 text-stone-900"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700">
                Allergens (comma separated)
              </label>
              <Input
                value={allergensStr}
                onChange={(e) => setAllergensStr(e.target.value)}
                placeholder="Gluten, Dairy, Eggs"
                className="bg-white border-stone-200 text-stone-900"
              />
            </div>
          </div>

          {/* Dietary Checkboxes & Spicy Level */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
            <span className="text-xs font-black text-stone-800 block">
              Dietary & Culinary Badges
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-bold">
              <label className="flex items-center gap-2 cursor-pointer text-stone-700">
                <input
                  type="checkbox"
                  checked={isVegetarian}
                  onChange={(e) => setIsVegetarian(e.target.checked)}
                  className="rounded text-orange-600 focus:ring-orange-500"
                />
                <span>Vegetarian</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-stone-700">
                <input
                  type="checkbox"
                  checked={isVegan}
                  onChange={(e) => setIsVegan(e.target.checked)}
                  className="rounded text-orange-600 focus:ring-orange-500"
                />
                <span>Vegan</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-stone-700">
                <input
                  type="checkbox"
                  checked={isGlutenFree}
                  onChange={(e) => setIsGlutenFree(e.target.checked)}
                  className="rounded text-orange-600 focus:ring-orange-500"
                />
                <span>Gluten-Free</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isSignature}
                  onChange={(e) => setIsSignature(e.target.checked)}
                  className="rounded text-amber-600 focus:ring-amber-500"
                />
                <span className="font-black text-amber-600 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  <span>Signature Dish</span>
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isChefSpecial}
                  onChange={(e) => setIsChefSpecial(e.target.checked)}
                  className="rounded text-rose-600 focus:ring-rose-500"
                />
                <span className="font-black text-rose-600 flex items-center gap-1">
                  <ChefHat className="w-3.5 h-3.5" />
                  <span>Chef Special</span>
                </span>
              </label>
            </div>

            <div className="pt-2 border-t border-stone-200 flex items-center justify-between">
              <span className="text-xs font-bold text-stone-600">
                Spicy Heat Level:
              </span>
              <div className="flex gap-1">
                {[0, 1, 2, 3, 4].map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setSpicyLevel(lvl)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all flex items-center gap-1 ${
                      spicyLevel === lvl
                        ? "bg-rose-600 text-white shadow-xs"
                        : "bg-stone-200 text-stone-700 hover:bg-stone-300"
                    }`}
                  >
                    {lvl === 0 ? "None" : (
                      <>
                        <Flame className="w-3 h-3 fill-current" />
                        <span>{lvl}</span>
                      </>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <Button type="button" variant="ghost" onClick={onClose} className="text-stone-600 font-semibold">
              Cancel
            </Button>
            <Button type="submit" className="bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl shadow-md shadow-orange-600/20 hover:scale-105 active:scale-95 transition-all">
              <Check className="w-4 h-4 mr-1.5" />
              Save Dish
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
