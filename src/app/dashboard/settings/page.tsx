"use client";

import React, { useState, useEffect } from "react";
import { Settings, Save, Check, Building2, Sliders, Upload, Image as ImageIcon, Trash2, RefreshCw } from "lucide-react";
import { Restaurant } from "@/types";
import { menuVerseStore } from "@/lib/seed-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function RestaurantSettingsPage() {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [cuisineType, setCuisineType] = useState("");
  const [description, setDescription] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const update = () => {
      const rest = menuVerseStore.getRestaurantBySlug();
      if (rest) {
        setRestaurant(rest);
        setName(rest.name || "");
        setAddress(rest.address || "");
        setPhone(rest.phone || "");
        setWebsite(rest.website || "");
        setCuisineType(rest.cuisineType || "");
        setDescription(rest.description || "");
        setCoverUrl(rest.coverUrl || "");
        setLogoUrl(rest.logoUrl || "");
      }
    };
    update();
    const unsub = menuVerseStore.subscribe(update);
    return () => unsub();
  }, []);

  if (!restaurant) return null;

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setCoverUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setLogoUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    menuVerseStore.updateRestaurant(restaurant.slug, {
      name: name.trim() || "My Restaurant",
      address: address.trim(),
      phone: phone.trim(),
      website: website.trim(),
      cuisineType: cuisineType.trim() || "Dining & Kitchen",
      description: description.trim(),
      coverUrl: coverUrl.trim() || null,
      logoUrl: logoUrl.trim() || null,
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleResetData = () => {
    if (confirm("Reset everything to a pure clean state with 0 categories, 0 dishes, and 0 reviews?")) {
      menuVerseStore.resetAllData();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Settings className="w-5 h-5 text-slate-700" />
            Restaurant Profile & Settings
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure your venue identity, public discovery information, and custom brand photography.
          </p>
        </div>

        <Button
          type="button"
          onClick={handleResetData}
          variant="outline"
          className="w-full sm:w-auto rounded-lg border-rose-200 text-rose-600 hover:bg-rose-50 font-semibold text-xs h-8.5 flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Reset All Data to Blank Slate</span>
        </Button>
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        {/* Brand Media Uploads */}
        <div className="p-5 rounded-xl bg-white border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-4">
          <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-slate-600" />
            Brand Visuals (Cover Banner & Logo)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Cover Banner */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700">Cover Banner</label>
              <div className="h-32 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 overflow-hidden flex flex-col items-center justify-center p-3 relative group">
                {coverUrl ? (
                  <>
                    <img src={coverUrl} alt="Cover Preview" className="w-full h-full object-cover rounded-lg" />
                    <button
                      type="button"
                      onClick={() => setCoverUrl("")}
                      className="absolute top-2 right-2 bg-rose-600 text-white p-1 rounded-md text-xs font-semibold shadow-xs hover:bg-rose-700 cursor-pointer"
                    >
                      Remove
                    </button>
                  </>
                ) : (
                  <div className="text-center space-y-1">
                    <Upload className="w-5 h-5 mx-auto text-slate-400" />
                    <span className="text-[11px] font-medium text-slate-500 block">Upload cover photo</span>
                    <label className="cursor-pointer text-[11px] font-semibold text-slate-900 hover:underline">
                      Choose file
                      <input type="file" accept="image/*" onChange={handleCoverUpload} className="hidden" />
                    </label>
                  </div>
                )}
              </div>
              <Input
                type="text"
                placeholder="Or paste banner image URL..."
                value={coverUrl}
                onChange={(e) => setCoverUrl(e.target.value)}
                className="bg-white border-slate-200 text-xs h-8.5"
              />
            </div>

            {/* Logo */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700">Restaurant Logo</label>
              <div className="h-32 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 overflow-hidden flex flex-col items-center justify-center p-3 relative group">
                {logoUrl ? (
                  <>
                    <img src={logoUrl} alt="Logo Preview" className="w-16 h-16 object-cover rounded-lg shadow-xs" />
                    <button
                      type="button"
                      onClick={() => setLogoUrl("")}
                      className="absolute top-2 right-2 bg-rose-600 text-white p-1 rounded-md text-xs font-semibold shadow-xs hover:bg-rose-700 cursor-pointer"
                    >
                      Remove
                    </button>
                  </>
                ) : (
                  <div className="text-center space-y-1">
                    <Upload className="w-5 h-5 mx-auto text-slate-400" />
                    <span className="text-[11px] font-medium text-slate-500 block">Upload logo image</span>
                    <label className="cursor-pointer text-[11px] font-semibold text-slate-900 hover:underline">
                      Choose file
                      <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                    </label>
                  </div>
                )}
              </div>
              <Input
                type="text"
                placeholder="Or paste logo image URL..."
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                className="bg-white border-slate-200 text-xs h-8.5"
              />
            </div>
          </div>
        </div>

        {/* Venue Information */}
        <div className="p-5 rounded-xl bg-white border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-4">
          <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Building2 className="w-4 h-4 text-slate-600" />
            Venue Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Restaurant Name *</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., The Rustic Kitchen"
                className="bg-white border-slate-200 text-xs h-8.5"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Cuisine Style</label>
              <Input
                value={cuisineType}
                onChange={(e) => setCuisineType(e.target.value)}
                placeholder="e.g., Contemporary Bistro, Cafe & Bakery"
                className="bg-white border-slate-200 text-xs h-8.5"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Physical Address</label>
              <Input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g., 123 Main Street, Suite 400"
                className="bg-white border-slate-200 text-xs h-8.5"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Phone Number</label>
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g., +1 (555) 019-2834"
                className="bg-white border-slate-200 text-xs h-8.5"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-semibold text-slate-700">Official Website</label>
              <Input
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://yourrestaurant.com"
                className="bg-white border-slate-200 text-xs h-8.5"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-semibold text-slate-700">About / Story Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tell guests about your culinary concept, farm-to-table philosophy, and specialties..."
                rows={3}
                className="w-full rounded-lg bg-white border border-slate-200 p-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900 font-normal"
              />
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="text-xs text-slate-500">
            {isSaved ? (
              <span className="text-emerald-700 font-semibold flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600" />
                Settings saved successfully!
              </span>
            ) : (
              "Click save to apply your changes across public menus and QR codes."
            )}
          </div>

          <Button
            type="submit"
            className="bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg h-9 px-4 text-xs shadow-xs flex items-center gap-2 cursor-pointer transition-colors"
          >
            <Save className="w-3.5 h-3.5 text-slate-300" />
            <span>Save Profile Settings</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
