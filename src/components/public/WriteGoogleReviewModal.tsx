"use client";

import React, { useState, useEffect } from "react";
import { 
  Star, 
  X, 
  CheckCircle2, 
  Globe
} from "lucide-react";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { menuVerseStore } from "@/lib/seed-data";

interface WriteGoogleReviewModalProps {
  restaurantId: string;
  restaurantName?: string;
  isOpen: boolean;
  onClose: () => void;
  onReviewSubmitted?: () => void;
}

const PRESET_AVATARS = [
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80",
  "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=120&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80",
];

export function WriteGoogleReviewModal({
  restaurantId,
  restaurantName = "Hotel Gypsy",
  isOpen,
  onClose,
  onReviewSubmitted,
}: WriteGoogleReviewModalProps) {
  const [rating, setRating] = useState(5);
  const [authorName, setAuthorName] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState(PRESET_AVATARS[0]);
  const [text, setText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setRating(5);
      setAuthorName("");
      setText("");
      setIsSuccess(false);
      setIsSubmitting(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !text.trim()) return;

    setIsSubmitting(true);

    try {
      menuVerseStore.addGoogleReview({
        restaurantId,
        authorName: authorName.trim(),
        authorPhotoUrl: selectedAvatar,
        rating,
        text: text.trim(),
        relativeTime: "Just now",
        publishTime: new Date().toISOString(),
        isImported: false,
      });

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });

      setIsSuccess(true);
      if (onReviewSubmitted) onReviewSubmitted();

      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 1400);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white text-stone-900 rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-4">
        {isSuccess ? (
          <div className="py-12 px-6 text-center space-y-3 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 mx-auto bg-emerald-50 rounded-full flex items-center justify-center border-2 border-emerald-200 shadow-sm">
              <CheckCircle2 className="w-9 h-9 text-emerald-600" />
            </div>
            <h3 className="text-lg font-bold text-stone-900 font-serif">
              Thank You for Your Google Review!
            </h3>
            <p className="text-xs text-stone-500 max-w-xs mx-auto">
              Your review is now live on {restaurantName}&apos;s menu and Google Reviews section.
            </p>
          </div>
        ) : (
          <>
            {/* Modal Header with Google G Logo */}
            <div className="px-5 pt-5 pb-3.5 border-b border-stone-100 bg-stone-50/80">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-white border border-stone-200 shadow-2xs flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-sm sm:text-base font-bold text-stone-900">
                        Write a Google Review
                      </h3>
                      <span className="text-[10px] bg-blue-50 text-blue-700 px-1.5 py-0.2 rounded font-bold border border-blue-200/60">
                        Verified
                      </span>
                    </div>
                    <p className="text-xs text-stone-500">
                      Share your authentic experience at {restaurantName}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Form Body */}
            <form onSubmit={handleSubmit} className="p-5 space-y-4 text-left bg-white">
              {/* Star Rating Selection */}
              <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200/80 text-center space-y-1">
                <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
                  Overall Rating
                </span>
                <div className="flex items-center justify-center gap-1.5 py-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 hover:scale-125 active:scale-95 transition-transform cursor-pointer"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          star <= rating
                            ? "fill-[#FBBC04] text-[#FBBC04] drop-shadow-xs"
                            : "text-stone-300 fill-transparent"
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <span className="text-xs font-bold text-amber-700 block">
                  {rating === 5 ? "Exceptional • 5.0 Stars" : `${rating}.0 Stars`}
                </span>
              </div>

              {/* Author Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700">
                  Your Full Name
                </label>
                <Input
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="e.g. Rohan Mehra"
                  className="bg-stone-50/80 border-stone-200 text-stone-900 text-xs rounded-xl h-10 placeholder:text-stone-400 focus:bg-white"
                  required
                />
              </div>

              {/* Avatar Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">
                  Choose Diner Avatar
                </label>
                <div className="flex items-center gap-2">
                  {PRESET_AVATARS.map((url, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedAvatar(url)}
                      className={`w-9 h-9 rounded-full overflow-hidden border-2 transition-all cursor-pointer ${
                        selectedAvatar === url
                          ? "border-blue-600 ring-2 ring-blue-500/30 scale-105"
                          : "border-transparent opacity-60 hover:opacity-100"
                      }`}
                    >
                      <img src={url} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Review Text */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700">
                  Your Google Review
                </label>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Tell others about the food quality, service, ambiance, and your favorite dishes at Hotel Gypsy..."
                  className="w-full bg-stone-50/80 border border-stone-200 text-stone-900 text-xs rounded-xl p-3 h-24 resize-none placeholder:text-stone-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                  required
                />
              </div>

              {/* Submit Button */}
              <div className="flex items-center gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="w-1/3 rounded-xl text-xs h-10 border-stone-200 text-stone-700 cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || !authorName.trim() || !text.trim()}
                  className="w-2/3 rounded-xl text-xs h-10 bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-98 cursor-pointer"
                >
                  <Globe className="w-4 h-4" />
                  <span>{isSubmitting ? "Publishing..." : "Post to Google Reviews"}</span>
                </Button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
