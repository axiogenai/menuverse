"use client";

import React, { useState, useEffect } from "react";
import { 
  Globe, 
  CheckCircle2, 
  Star, 
  Link as LinkIcon,
  ExternalLink,
  Key,
  Trash2,
  RefreshCw,
  AlertCircle
} from "lucide-react";
import { Restaurant, GoogleReview } from "@/types";
import { menuVerseStore } from "@/lib/seed-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export default function GoogleReviewsSyncPage() {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(
    () => menuVerseStore.getRestaurantBySlug() || null
  );
  const [placeIdInput, setPlaceIdInput] = useState<string>(() => {
    const r = menuVerseStore.getRestaurantBySlug();
    return r?.googlePlaceId || "ChIJtVgY1N0FwTsRsYX6iv3bUsU";
  });
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [limitInput, setLimitInput] = useState("30");
  const [sortInput, setSortInput] = useState("newest");
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

  const handleSyncRealGoogleReviews = async () => {
    if (!placeIdInput.trim()) {
      setErrorMessage("Please enter a Google Place ID or Maps Query.");
      return;
    }

    setIsSyncing(true);
    setErrorMessage(null);
    setSyncMessage(null);

    try {
      const targetPlaceId = placeIdInput.trim();
      const params = new URLSearchParams({ 
        placeId: targetPlaceId,
        limit: limitInput,
        sort: sortInput
      });
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

        // Save Google Place ID in restaurant profile
        menuVerseStore.updateRestaurant(restaurant.id, {
          googlePlaceId: targetPlaceId,
        });

        setSyncMessage(`Successfully synced ${data.reviews.length} reviews from Google Maps via Axiogen Review Syncer API.`);
        setTimeout(() => setSyncMessage(null), 5000);
      } else {
        setErrorMessage(data.error || "Could not retrieve reviews from Google Places API.");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Network error while syncing Google Reviews.");
    } finally {
      setIsSyncing(false);
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
      {/* Header - Clean Single-Line Alignment on desktop, responsive stack on mobile */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Globe className="w-5 h-5 text-blue-600 shrink-0" />
            <span>Google Reviews Syncer API</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Powered by Axiogen Universal Reviews Engine — Zero Google Cloud API Key required.
          </p>
        </div>

        {/* Action Buttons - Stacked on mobile, side-by-side on desktop */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="h-9 px-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 shadow-2xs transition-colors"
          >
            <span>View Google Maps</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </a>

          <Button
            onClick={handleSyncRealGoogleReviews}
            disabled={isSyncing}
            className="h-9 px-3.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <RefreshCw className={cn("w-3.5 h-3.5 text-blue-100", isSyncing && "animate-spin")} />
            <span>{isSyncing ? "Syncing..." : "Sync Live Reviews"}</span>
          </Button>
        </div>
      </div>

      {syncMessage && (
        <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2 shadow-2xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{syncMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-3.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs font-medium flex items-start gap-2.5 shadow-2xs">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <strong className="block font-semibold">Review Syncer Notice:</strong>
            <span>{errorMessage}</span>
          </div>
        </div>
      )}

      {/* Place ID & Axiogen Review Syncer Box */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start sm:items-center gap-3 min-w-0">
            <div className="h-10 w-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 font-bold shrink-0 mt-0.5 sm:mt-0">
              <Globe className="w-5 h-5" />
            </div>
            <div className="space-y-1 min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-sm text-slate-900">
                  Google Maps Business Syncer
                </h3>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                    Axiogen Syncer
                  </span>
                  {hasPlaceId && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Connected
                    </span>
                  )}
                </div>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Enter your Google Place ID to scrape and sync live Google reviews in real time
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs font-semibold text-slate-900 shrink-0 bg-slate-50 sm:bg-transparent p-2 sm:p-0 rounded-lg self-start sm:self-auto">
            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span>{avgGoogleRating} ★</span>
            <span className="text-slate-400 font-sans font-normal text-xs">({googleReviews.length} reviews)</span>
          </div>
        </div>

        {/* Credentials Form */}
        <div className="pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="space-y-1 sm:col-span-1">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <LinkIcon className="w-3.5 h-3.5 text-slate-400" />
              <span>Google Place ID *</span>
            </label>
            <Input
              value={placeIdInput}
              onChange={(e) => setPlaceIdInput(e.target.value)}
              placeholder="e.g., ChIJtVgY1N0FwTsRsYX6iv3bUsU"
              className="bg-white border-slate-200 text-slate-900 text-xs font-mono shadow-2xs h-8.5"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">
              Max Reviews to Fetch
            </label>
            <select
              value={limitInput}
              onChange={(e) => setLimitInput(e.target.value)}
              className="w-full h-8.5 bg-white border border-slate-200 rounded-lg px-2.5 text-xs text-slate-900 font-medium shadow-2xs focus:outline-none focus:border-slate-800"
            >
              <option value="10">10 Reviews</option>
              <option value="20">20 Reviews</option>
              <option value="30">30 Reviews</option>
              <option value="50">50 Reviews</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">
              Review Sort Order
            </label>
            <select
              value={sortInput}
              onChange={(e) => setSortInput(e.target.value)}
              className="w-full h-8.5 bg-white border border-slate-200 rounded-lg px-2.5 text-xs text-slate-900 font-medium shadow-2xs focus:outline-none focus:border-slate-800"
            >
              <option value="newest">Newest First</option>
              <option value="highest">Highest Rating</option>
              <option value="lowest">Lowest Rating</option>
              <option value="relevant">Most Relevant</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          <span className="text-[11px] text-slate-500 break-all">
            Powered by <code className="text-blue-600 font-mono">api.axiogen.in/v1/reviews/scrape</code>
          </span>

          <Button
            onClick={handleSyncRealGoogleReviews}
            disabled={isSyncing}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-xs h-9 px-4 shadow-xs cursor-pointer transition-colors"
          >
            <RefreshCw className={cn("w-3.5 h-3.5 mr-1.5", isSyncing && "animate-spin")} />
            <span>{isSyncing ? "Syncing..." : "Connect & Sync Live Reviews"}</span>
          </Button>
        </div>
      </div>

      {/* Imported Reviews Feed */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Genuine Google Reviews ({googleReviews.length})
          </h3>
          {googleReviews.length > 0 && (
            <button
              onClick={handleClearAll}
              className="text-xs font-medium text-rose-600 hover:text-rose-700 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All</span>
            </button>
          )}
        </div>

        {googleReviews.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6 space-y-3">
            <div className="flex h-10 w-10 mx-auto items-center justify-center rounded-lg bg-slate-100 text-slate-600">
              <Globe className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-semibold text-slate-900">No Google Reviews Synced Yet</h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Enter your Google Place ID and API Key above, then click "Connect & Sync Live Reviews" to pull genuine, verified customer reviews straight from Google Maps.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {googleReviews.map((rev) => (
              <div
                key={rev.id}
                className="p-4 rounded-xl bg-white border border-slate-200/90 space-y-2 shadow-[0_1px_3px_rgba(0,0,0,0.04)] relative group hover:border-slate-300 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="h-8 w-8 rounded-full overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-700 shrink-0">
                      {rev.authorPhotoUrl ? (
                        <img src={rev.authorPhotoUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <span>{rev.authorName.charAt(0)}</span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-semibold text-xs text-slate-900 truncate">
                          {rev.authorName}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-medium">
                          Google Verified
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400">
                        via Google Maps • {rev.relativeTime}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0">
                    <div className="flex items-center gap-1 text-slate-900 text-xs font-mono font-semibold">
                      <Star className="w-3 h-3 fill-amber-500 text-amber-500 shrink-0" />
                      <span>{rev.rating}.0</span>
                    </div>

                    <button
                      onClick={() => handleDeleteReview(rev.id)}
                      className="text-slate-400 hover:text-rose-600 transition-colors p-1 rounded-md hover:bg-rose-50 cursor-pointer"
                      title="Delete review"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed font-normal">
                  {rev.text}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
