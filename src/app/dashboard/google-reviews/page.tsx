"use client";

import React, { useState, useEffect } from "react";
import { 
  Globe, 
  CheckCircle2, 
  Star, 
  Layers,
  Link as LinkIcon,
  ExternalLink,
  Key,
  Trash2,
  X,
  Zap,
  AlertCircle
} from "lucide-react";
import { Restaurant, GoogleReview } from "@/types";
import { menuVerseStore } from "@/lib/seed-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

export default function GoogleReviewsSyncPage() {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(
    () => menuVerseStore.getRestaurantBySlug() || null
  );
  const [placeIdInput, setPlaceIdInput] = useState("");
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const update = () => {
      const rest = menuVerseStore.getRestaurantBySlug();
      if (rest) {
        setRestaurant({ ...rest });
        setPlaceIdInput(rest.googlePlaceId || "ChIJtVgY1N0FwTsRsYX6iv3bUsU");
      }
    };
    update();
    const unsub = menuVerseStore.subscribe(update);
    return () => unsub();
  }, []);

  if (!restaurant) return null;

  const googleReviews = restaurant.googleReviews || [];
  const hasPlaceId = Boolean(restaurant.googlePlaceId && restaurant.googlePlaceId.trim().length > 0);

  const avgGoogleRating = googleReviews.length > 0 
    ? (googleReviews.reduce((sum, r) => sum + r.rating, 0) / googleReviews.length).toFixed(1)
    : "0.0";

  const handleSavePlaceId = (e: React.FormEvent) => {
    e.preventDefault();
    menuVerseStore.updateRestaurant(restaurant.slug, {
      googlePlaceId: placeIdInput.trim(),
    });
    setSyncMessage("Google Place ID saved successfully.");
    setTimeout(() => setSyncMessage(null), 3500);
  };

  const handleSyncRealGoogleReviews = async () => {
    if (!placeIdInput.trim()) {
      setErrorMessage("Please enter a Google Place ID.");
      return;
    }

    setIsSyncing(true);
    setErrorMessage(null);
    setSyncMessage(null);

    try {
      const targetPlaceId = placeIdInput.trim();
      const params = new URLSearchParams({ placeId: targetPlaceId });
      if (apiKeyInput.trim()) {
        params.append("apiKey", apiKeyInput.trim());
      }

      const res = await fetch(`/api/google/reviews?${params.toString()}`);
      const data = await res.json();

      if (data.success && data.reviews && data.reviews.length > 0) {
        menuVerseStore.clearAllGoogleReviews(restaurant.id);

        data.reviews.forEach((r: any) => {
          menuVerseStore.addGoogleReview({
            restaurantId: restaurant.id,
            authorName: r.authorName,
            authorPhotoUrl: r.authorPhotoUrl || null,
            rating: r.rating,
            text: r.text,
            relativeTime: r.relativeTime || "Recent",
            publishTime: r.publishTime || new Date().toISOString(),
            isImported: true,
          });
        });

        setSyncMessage(`⚡ Success! Downloaded ${data.reviews.length} genuine Google customer reviews from Google Maps!`);
      } else {
        if (data.error === "API_KEY_REQUIRED") {
          setErrorMessage(
            "To pull live, real reviews directly from Google Maps servers, Google requires an official Google Places API Key. Please paste your Google API Key below to sync automatically."
          );
        } else {
          setErrorMessage(`Google Maps response: ${data.error || "No reviews found for this Place ID."}`);
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to connect to Google API.");
    } finally {
      setIsSyncing(false);
      setTimeout(() => setSyncMessage(null), 5000);
    }
  };

  const handleDeleteReview = (id: string) => {
    menuVerseStore.deleteGoogleReview(id);
  };

  const handleClearAll = () => {
    menuVerseStore.clearAllGoogleReviews(restaurant.id);
  };

  const googleMapsUrl = restaurant.googlePlaceId
    ? `https://www.google.com/maps/place/?q=place_id:${encodeURIComponent(restaurant.googlePlaceId)}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(restaurant.name || "Restaurant")}`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-stone-900 flex items-center gap-2">
            <Globe className="w-6 h-6 text-blue-600" />
            Official Google Reviews Integration
          </h1>
          <p className="text-xs text-stone-500 font-medium">
            Sync genuine, verified customer reviews directly from your official Google Maps business listing
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-2xl font-bold border border-stone-200 bg-white text-stone-700 hover:bg-stone-50 px-3.5 py-2.5 text-xs flex items-center gap-1.5 shadow-xs transition-all hover:scale-105"
          >
            <span>Open Google Maps</span>
            <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
          </a>

          <Button
            onClick={handleSyncRealGoogleReviews}
            disabled={isSyncing}
            className="rounded-2xl font-black bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-2 shadow-lg shadow-blue-600/25 hover:scale-105 active:scale-95 transition-all text-xs px-5 py-2.5"
          >
            <Zap className={`w-4 h-4 text-amber-300 ${isSyncing ? "animate-spin" : ""}`} />
            <span>{isSyncing ? "Connecting to Google Servers..." : "⚡ Sync Live Google Reviews"}</span>
          </Button>
        </div>
      </div>

      {syncMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-fade-in shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{syncMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-medium flex items-start gap-2.5 shadow-xs">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <strong className="block font-bold">Google API Authentication:</strong>
            <span>{errorMessage}</span>
          </div>
        </div>
      )}

      {/* Place ID & Google API Key Credentials Box */}
      <div className="p-6 rounded-3xl bg-white border border-stone-200/90 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 font-bold shadow-xs">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-sm text-stone-900">
                  Google Business Listing
                </h3>
                {hasPlaceId && (
                  <Badge variant="success" className="text-[10px]">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Place ID Configured
                  </Badge>
                )}
              </div>
              <p className="text-xs text-stone-500 font-medium">
                Enter your Google Place ID and Google Places API Key to pull live customer reviews
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-lg font-black text-amber-600 flex items-center justify-end gap-1">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{avgGoogleRating}</span>
              </div>
              <span className="text-[11px] text-stone-500 font-medium">Genuine Google Reviews ({googleReviews.length})</span>
            </div>
          </div>
        </div>

        {/* Credentials Form */}
        <div className="pt-2 border-t border-stone-100 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
              <LinkIcon className="w-3.5 h-3.5 text-stone-400" />
              <span>Google Place ID *</span>
            </label>
            <Input
              value={placeIdInput}
              onChange={(e) => setPlaceIdInput(e.target.value)}
              placeholder="e.g., ChIJtVgY1N0FwTsRsYX6iv3bUsU"
              className="rounded-2xl bg-stone-50 border-stone-200 text-stone-900 text-xs font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-stone-400" />
              <span>Google Places API Key (from Google Cloud)</span>
            </label>
            <Input
              type="password"
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              placeholder="AIzaSy..."
              className="rounded-2xl bg-stone-50 border-stone-200 text-stone-900 text-xs font-mono"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <a
            href="https://console.cloud.google.com/google/maps-apis/credentials"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] text-blue-600 hover:underline font-bold flex items-center gap-1"
          >
            <span>Get a free Google Places API Key on Google Cloud</span>
            <ExternalLink className="w-3 h-3" />
          </a>

          <Button
            onClick={handleSyncRealGoogleReviews}
            disabled={isSyncing}
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl text-xs px-6 shadow-xs"
          >
            {isSyncing ? "Syncing..." : "Connect & Sync Live Reviews"}
          </Button>
        </div>
      </div>

      {/* Explanation Banner */}
      <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200/80 text-xs text-blue-800 flex items-start gap-2.5 shadow-xs font-medium">
        <Layers className="w-4 h-4 shrink-0 mt-0.5 text-blue-600" />
        <div>
          <span className="font-black">Direct Google Maps Integration:</span> MenuVerse connects directly to Google Places API to fetch official reviews. We never synthesize fake reviews — every review here is 100% verified from your actual Google Maps listing.
        </div>
      </div>

      {/* Imported Reviews Feed */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-stone-900">
            Genuine Google Reviews ({googleReviews.length})
          </h3>
          {googleReviews.length > 0 && (
            <button
              onClick={handleClearAll}
              className="text-xs font-bold text-rose-600 hover:underline flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All</span>
            </button>
          )}
        </div>

        {googleReviews.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-stone-200/90 shadow-sm p-6 space-y-3">
            <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <Globe className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-stone-900">No Google Reviews Synced Yet</h4>
            <p className="text-xs text-stone-500 font-medium max-w-md mx-auto">
              Enter your Google Place ID and API Key above, then click "Connect & Sync Live Reviews" to pull genuine, verified customer reviews straight from Google Maps.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {googleReviews.map((rev) => (
              <div
                key={rev.id}
                className="p-5 rounded-3xl bg-white border border-stone-200/90 space-y-2 shadow-sm relative group hover:border-blue-300 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-2xl overflow-hidden bg-blue-50 border border-blue-200 flex items-center justify-center text-xs font-black text-blue-700 shadow-xs">
                      {rev.authorPhotoUrl ? (
                        <img src={rev.authorPhotoUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <span>{rev.authorName.charAt(0)}</span>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-xs text-stone-900 block">
                          {rev.authorName}
                        </span>
                        <span className="text-[10px] px-2 py-0.2 rounded-full bg-blue-50 text-blue-700 font-bold border border-blue-200">
                          Google Verified
                        </span>
                      </div>
                      <span className="text-[10px] text-stone-500 font-medium">
                        via Google Maps • {rev.relativeTime}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-amber-600 text-xs font-black bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{rev.rating}.0</span>
                    </div>

                    <button
                      onClick={() => handleDeleteReview(rev.id)}
                      className="text-stone-300 hover:text-rose-600 transition-colors p-1.5 rounded-xl hover:bg-rose-50"
                      title="Delete review"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-stone-700 leading-relaxed font-medium pl-1">
                  "{rev.text}"
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
