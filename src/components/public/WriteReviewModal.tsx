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
  dish: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
  onReviewSubmitted?: (newReview: Review) => void;
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

  // Automatically reset form whenever modal opens or active dish changes
  React.useEffect(() => {
    if (isOpen) {
      setRating(5);
      setDisplayName("");
      setReviewText("");
      setTasteRating(5);
      setPortionRating(5);
      setValueRating(5);
      setPhotoUrl("");
      setErrorMsg(null);
      setIsSubmitting(false);
    }
  }, [isOpen, dish?.id]);

  if (!isOpen || !dish) return null;

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
      if (onReviewSubmitted) onReviewSubmitted(newRev);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-md bg-white text-stone-900 rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-4">
        {/* Header */}
        <div className="relative px-5 pt-5 pb-3 border-b border-stone-100 bg-stone-50/80">
          <div className="flex items-start justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] font-semibold text-amber-700 uppercase tracking-wider block">
                Post Diner Feedback
              </span>
              <h3 className="text-sm sm:text-base font-bold text-stone-900">
                {dish.name}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 space-y-3.5 text-left bg-white">
          {errorMsg && (
            <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
              {errorMsg}
            </div>
          )}

          {/* Primary Star Rating */}
          <div className="space-y-2 text-center p-3.5 rounded-xl bg-stone-50 border border-stone-100">
            <label className="text-[11px] font-semibold text-stone-500 block uppercase tracking-wider">
              Overall Dish Rating
            </label>
            <div className="flex justify-center py-1">
              <StarRating
                rating={rating}
                size="xl"
                interactive
                onRatingChange={setRating}
              />
            </div>
            <span className="text-xs font-semibold text-amber-800 block transition-all duration-200">
              {rating === 5
                ? "5.0 - Culinary Perfection"
                : rating === 4
                ? "4.0 - Highly Recommended"
                : rating === 3
                ? "3.0 - Standard & Good"
                : rating === 2
                ? "2.0 - Room for Improvement"
                : "1.0 - Disappointing"}
            </span>
          </div>

          {/* Aspect Ratings (Taste, Portion, Value) */}
          <div className="grid grid-cols-3 gap-2">
            <div className="p-2 rounded-lg bg-stone-50 border border-stone-200 text-center space-y-0.5">
              <span className="text-[10px] font-medium text-stone-500">Taste</span>
              <div className="flex justify-center">
                <StarRating rating={tasteRating} size="sm" interactive onRatingChange={setTasteRating} />
              </div>
            </div>
            <div className="p-2 rounded-lg bg-stone-50 border border-stone-200 text-center space-y-0.5">
              <span className="text-[10px] font-medium text-stone-500">Portion</span>
              <div className="flex justify-center">
                <StarRating rating={portionRating} size="sm" interactive onRatingChange={setPortionRating} />
              </div>
            </div>
            <div className="p-2 rounded-lg bg-stone-50 border border-stone-200 text-center space-y-0.5">
              <span className="text-[10px] font-medium text-stone-500">Value</span>
              <div className="flex justify-center">
                <StarRating rating={valueRating} size="sm" interactive onRatingChange={setValueRating} />
              </div>
            </div>
          </div>

          {/* Display Name */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-stone-700">
              Your Name / Handle
            </label>
            <Input
              type="text"
              placeholder="e.g. Maya Lin"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="bg-white border-stone-200 text-xs h-8.5"
              required
            />
          </div>

          {/* Review Text */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-stone-700 flex items-center justify-between">
              <span>Your Review & Flavor Notes</span>
              {sentimentPreview && (
                <span className="text-[10px] font-semibold px-2 py-0.2 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                  AI: {sentimentPreview.sentiment}
                </span>
              )}
            </label>
            <textarea
              rows={2.5}
              placeholder="Describe the flavors, texture, and whether you'd order it again..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              className="w-full rounded-lg border border-stone-200 bg-white p-2.5 text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-stone-900 font-normal"
              required
            />
          </div>

          {/* Photo Upload */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-stone-700 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-stone-600" />
                Attach Food Photo
              </span>
              {photoUrl && (
                <button
                  type="button"
                  onClick={() => setPhotoUrl("")}
                  className="text-[10px] text-rose-600 hover:underline font-semibold cursor-pointer"
                >
                  Remove photo
                </button>
              )}
            </label>

            <div className="flex items-center gap-2">
              <label className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-50 border border-stone-200 text-stone-700 hover:bg-stone-100 cursor-pointer text-xs font-semibold transition-colors">
                <Upload className="w-3.5 h-3.5 text-stone-500" />
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
                  className="bg-white border-stone-200 text-xs h-8.5"
                />
              </div>
            </div>

            {photoUrl && (
              <div className="relative h-18 w-18 rounded-lg overflow-hidden border border-stone-200 shadow-2xs">
                <img
                  src={photoUrl}
                  alt="Review upload preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>

          {/* Submit Action */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-stone-100">
            <Button type="button" variant="ghost" onClick={onClose} className="text-stone-600 hover:text-stone-900 text-xs h-8.5 rounded-lg">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-stone-900 hover:bg-stone-800 text-white font-semibold rounded-lg text-xs h-8.5 px-3.5 shadow-xs cursor-pointer"
            >
              <Check className="w-3.5 h-3.5 mr-1" />
              {isSubmitting ? "Publishing..." : "Submit Review"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
