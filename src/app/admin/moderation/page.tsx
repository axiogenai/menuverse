"use client";

import React, { useState, useEffect } from "react";
import { 
  ShieldAlert, 
  ShieldCheck, 
  Check, 
  X, 
  AlertTriangle, 
  Clock, 
  Bot, 
  FileText 
} from "lucide-react";
import { Review, Restaurant } from "@/types";
import { menuVerseStore } from "@/lib/seed-data";
import { StarRating } from "@/components/shared/StarRating";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function AdminModerationPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filter, setFilter] = useState<"ALL" | "FLAGGED" | "APPROVED">("ALL");

  useEffect(() => {
    const rest = menuVerseStore.getRestaurantBySlug("gusto-trattoria");
    if (rest && rest.reviews) {
      setReviews(rest.reviews);
    }
  }, []);

  const handleModerate = (reviewId: string, status: "APPROVED" | "FLAGGED" | "REJECTED") => {
    menuVerseStore.updateReviewModeration(reviewId, status);
    const rest = menuVerseStore.getRestaurantBySlug("gusto-trattoria");
    if (rest && rest.reviews) setReviews(rest.reviews);
  };

  const flaggedReviews = reviews.filter((r) => r.moderationStatus === "FLAGGED");
  const filtered = reviews.filter((r) => {
    if (filter === "FLAGGED") return r.moderationStatus === "FLAGGED";
    if (filter === "APPROVED") return r.moderationStatus === "APPROVED";
    return true;
  });

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8 space-y-6">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-950/50 via-stone-900 to-stone-900 border border-stone-800 space-y-2">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-500/20 text-purple-400">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">
              SuperAdmin Content Moderation & Compliance Console
            </h1>
            <p className="text-xs text-stone-400">
              Platform-level AI spam filters, reported content audits, and permanent review governance
            </p>
          </div>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800 space-y-1">
          <span className="text-xs font-bold text-stone-500 uppercase">Pending Flagged Reviews</span>
          <div className="text-2xl font-black text-rose-400">{flaggedReviews.length}</div>
        </div>
        <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800 space-y-1">
          <span className="text-xs font-bold text-stone-500 uppercase">AI Screen Pass Rate</span>
          <div className="text-2xl font-black text-emerald-400">99.4%</div>
        </div>
        <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800 space-y-1">
          <span className="text-xs font-bold text-stone-500 uppercase">Audit Trail Status</span>
          <div className="text-2xl font-black text-blue-400">Immutable</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 text-xs">
        <button
          onClick={() => setFilter("ALL")}
          className={`px-3.5 py-2 rounded-xl font-bold transition-colors ${
            filter === "ALL"
              ? "bg-purple-600 text-white"
              : "bg-stone-900 text-stone-400 border border-stone-800"
          }`}
        >
          All Reviews ({reviews.length})
        </button>
        <button
          onClick={() => setFilter("FLAGGED")}
          className={`px-3.5 py-2 rounded-xl font-bold transition-colors ${
            filter === "FLAGGED"
              ? "bg-rose-600 text-white"
              : "bg-stone-900 text-stone-400 border border-stone-800"
          }`}
        >
          Flagged / Needs Review ({flaggedReviews.length})
        </button>
        <button
          onClick={() => setFilter("APPROVED")}
          className={`px-3.5 py-2 rounded-xl font-bold transition-colors ${
            filter === "APPROVED"
              ? "bg-emerald-600 text-white"
              : "bg-stone-900 text-stone-400 border border-stone-800"
          }`}
        >
          Approved Clean ({reviews.filter((r) => r.moderationStatus === "APPROVED").length})
        </button>
      </div>

      {/* Review List */}
      <div className="space-y-4">
        {filtered.map((rev) => (
          <div
            key={rev.id}
            className="p-5 rounded-3xl bg-stone-900 border border-stone-800 space-y-3"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-white">{rev.displayName}</span>
                  <Badge
                    variant={
                      rev.moderationStatus === "APPROVED"
                        ? "success"
                        : rev.moderationStatus === "FLAGGED"
                        ? "hot"
                        : "destructive"
                    }
                    className="text-[10px]"
                  >
                    {rev.moderationStatus}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-xs text-stone-400 pt-1">
                  <StarRating rating={rev.rating} size="sm" />
                  <span>•</span>
                  <span>AI Score: {rev.sentimentScore}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => handleModerate(rev.id, "APPROVED")}
                  size="sm"
                  variant="outline"
                  className="rounded-xl border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 text-xs font-bold"
                >
                  <Check className="w-3.5 h-3.5 mr-1" /> Approve
                </Button>
                <Button
                  onClick={() => handleModerate(rev.id, "FLAGGED")}
                  size="sm"
                  variant="outline"
                  className="rounded-xl border-amber-500/30 text-amber-400 hover:bg-amber-500/20 text-xs font-bold"
                >
                  <AlertTriangle className="w-3.5 h-3.5 mr-1" /> Flag
                </Button>
                <Button
                  onClick={() => handleModerate(rev.id, "REJECTED")}
                  size="sm"
                  variant="outline"
                  className="rounded-xl border-rose-500/30 text-rose-400 hover:bg-rose-500/20 text-xs font-bold"
                >
                  <X className="w-3.5 h-3.5 mr-1" /> Hide / Reject
                </Button>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-stone-300 bg-stone-950/60 p-3 rounded-xl border border-stone-800">
              "{rev.reviewText}"
            </p>

            {rev.moderationReason && (
              <div className="text-[11px] text-amber-400 font-medium">
                Reason: {rev.moderationReason}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
