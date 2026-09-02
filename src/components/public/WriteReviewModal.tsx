"use client";

import React, { useState } from "react";
import { X, Camera, Check, Star, Upload, Image as ImageIcon } from "lucide-react";
import confetti from "canvas-confetti";
import { MenuItem, Review } from "@/types";
import { StarRating } from "@/components/shared/StarRating";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { analyzeReviewSentiment, screenReviewContent } from "@/lib/ai/sentiment";
import { menuVerseStore } from "@/lib/seed-data";

interface WriteReviewModalProps {
  dish: MenuItem;
  isOpen: boolean;
  onClose: () => void;
  onReviewSubmitted: (newReview: Review) => void;
}

export function WriteReviewModal({
  dish,
  isOpen,
  onClose,
  onReviewSubmitted,
}: WriteReviewModalProps) {
  const [rating, setRating] = useState<number>(5);
  const [displayName, setDisplayName] = useState<string>("");
  const [reviewText, setReviewText] = useState<string>("");
  const [tasteRating, setTasteRating] = useState<number>(5);
  const [portionRating, setPortionRating] = useState<number>(5);
  const [valueRating, setValueRating] = useState<number>(5);
  const [photoUrl, setPhotoUrl] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  // Real-time sentiment preview
  const sentimentPreview = reviewText.length > 5 ? analyzeReviewSentiment(reviewText, rating) : null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMsg("Image size exceeds 5MB limit.");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setPhotoUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim()) {
      setErrorMsg("Please enter your diner name or nickname.");
      return;
    }
    if (reviewText.trim().length < 10) {
      setErrorMsg("Please write at least 10 characters describing your experience.");
      return;
    }

    // Run AI content moderation screen
    const moderation = screenReviewContent(reviewText);
    const modStatus = moderation.flagged ? "FLAGGED" : "APPROVED";

    setIsSubmitting(true);
    setErrorMsg(null);

    const sentiment = sentimentPreview || analyzeReviewSentiment(reviewText, rating);

    const images = photoUrl.trim()
      ? [
          {
            id: `rev-img-${Date.now()}`,
            reviewId: "",
            menuItemId: dish.id,
            url: photoUrl.trim(),
            thumbnailUrl: photoUrl.trim(),
            caption: `Diner photo for ${dish.name}`,
            helpfulVotes: 0,
            isApproved: true,
            createdAt: new Date().toISOString(),
          },
        ]
      : [];

    const newRev = menuVerseStore.addReview({
      menuItemId: dish.id,
      restaurantId: dish.restaurantId,
      displayName: displayName.trim(),
      avatarUrl: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(displayName)}`,
      rating,
      reviewText: reviewText.trim(),
      aiSentiment: sentiment.sentiment,
      sentimentScore: sentiment.score,
      tasteRating,
      portionRating,
      valueRating,
      moderationStatus: modStatus,
      moderationReason: moderation.reason,
      isGoogleReview: false,
      images,
    });

    // Fire celebration confetti!
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });

    setTimeout(() => {
      setIsSubmitting(false);
      onReviewSubmitted(newRev);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white text-stone-900 rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-8">
        {/* Header */}
        <div className="relative px-6 pt-6 pb-4 border-b border-stone-100 bg-stone-50">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-xs font-black text-orange-600 uppercase tracking-wider flex items-center gap-1">
                Post Verified Diner Review
              </span>
              <h3 className="text-lg font-black text-stone-900">
                {dish.name}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-left bg-white">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
              {errorMsg}
            </div>
          )}

          {/* Primary Star Rating */}
          <div className="space-y-2 text-center p-4 rounded-2xl bg-stone-50 border border-stone-100">
            <label className="text-xs font-bold text-stone-600 block uppercase tracking-wider">
              Overall Dish Rating
            </label>
            <div className="flex justify-center">
              <StarRating
                rating={rating}
                size="lg"
                interactive
                onRatingChange={setRating}
              />
            </div>
            <span className="text-xs font-extrabold text-orange-600 block">
              {rating === 5
                ? "5.0 - Unforgettable Culinary Perfection"
                : rating === 4
                ? "4.0 - Very Good & Highly Recommended"
                : rating === 3
                ? "3.0 - Satisfactory / Standard"
                : rating === 2
                ? "2.0 - Room for Improvement"
                : "1.0 - Disappointing"}
            </span>
          </div>

          {/* Aspect Ratings (Taste, Portion, Value) */}
          <div className="grid grid-cols-3 gap-2">
            <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-center space-y-1">
              <span className="text-[11px] font-bold text-stone-600">Taste</span>
              <div className="flex justify-center">
                <StarRating rating={tasteRating} size="sm" interactive onRatingChange={setTasteRating} />
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-center space-y-1">
              <span className="text-[11px] font-bold text-stone-600">Portion</span>
              <div className="flex justify-center">
                <StarRating rating={portionRating} size="sm" interactive onRatingChange={setPortionRating} />
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-center space-y-1">
              <span className="text-[11px] font-bold text-stone-600">Value</span>
              <div className="flex justify-center">
                <StarRating rating={valueRating} size="sm" interactive onRatingChange={setValueRating} />
              </div>
            </div>
          </div>

          {/* Display Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-800">
              Your Name / Handle
            </label>
            <Input
              type="text"
              placeholder="e.g. Maya Lin or FoodieExplorer"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="bg-white border-stone-200 text-stone-900"
              required
            />
          </div>

          {/* Review Text */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-800 flex items-center justify-between">
              <span>Your Review & Flavor Notes</span>
              {sentimentPreview && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  AI Sentiment: {sentimentPreview.sentiment}
                </span>
              )}
            </label>
            <textarea
              rows={3}
              placeholder="Describe the flavors, texture, spice level, and whether you'd order it again..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              className="w-full rounded-xl border border-stone-200 bg-white p-3 text-xs text-stone-900 placeholder:text-stone-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 transition-all"
              required
            />
          </div>

          {/* Real Photo Attachment with File Upload or URL */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-stone-800 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-orange-500" />
                Attach Food Photo
              </span>
              {photoUrl && (
                <button
                  type="button"
                  onClick={() => setPhotoUrl("")}
                  className="text-[10px] text-rose-600 hover:underline font-bold"
                >
                  Remove photo
                </button>
              )}
            </label>

            <div className="flex items-center gap-2">
              <label className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-stone-700 hover:bg-stone-100 cursor-pointer text-xs font-bold transition-colors">
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
                  placeholder="Or paste photo URL..."
                  value={photoUrl.startsWith("data:") ? "(Photo Uploaded)" : photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  disabled={photoUrl.startsWith("data:")}
                  className="bg-white border-stone-200 text-stone-900 text-xs"
                />
              </div>
            </div>

            {photoUrl && (
              <div className="relative h-24 w-24 rounded-xl overflow-hidden border border-stone-200 shadow-xs">
                <img
                  src={photoUrl}
                  alt="Review upload preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>

          {/* Submit Action */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <Button type="button" variant="ghost" onClick={onClose} className="text-stone-600 hover:text-stone-900 font-semibold">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl shadow-md shadow-orange-600/20 hover:scale-105 active:scale-95 transition-all"
            >
              <Check className="w-4 h-4 mr-1.5" />
              {isSubmitting ? "Publishing..." : "Submit Verified Review"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
