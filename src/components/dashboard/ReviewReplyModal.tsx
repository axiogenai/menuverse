"use client";

import React, { useState } from "react";
import { X, ChefHat, Check, Star, Bot } from "lucide-react";
import { Review } from "@/types";
import { Button } from "@/components/ui/button";

interface ReviewReplyModalProps {
  review: Review | null;
  isOpen: boolean;
  onClose: () => void;
  onSendReply: (reviewId: string, replyText: string) => void;
}

export function ReviewReplyModal({
  review,
  isOpen,
  onClose,
  onSendReply,
}: ReviewReplyModalProps) {
  const [replyText, setReplyText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen || !review) return null;

  const handleGenerateTemplate = (type: "thank" | "apologize" | "invite") => {
    if (type === "thank") {
      setReplyText(`Thank you so much ${review.displayName}! We are thrilled you enjoyed the dish. Our culinary team at Hotel Gypsy looks forward to hosting you again soon!`);
    } else if (type === "apologize") {
      setReplyText(`Thank you for your candid feedback, ${review.displayName}. We hold our culinary standards high and our executive chef has taken note of your comments to ensure consistent perfection on your next visit.`);
    } else {
      setReplyText(`Thank you for dining with us, ${review.displayName}! We would love for you to try our royal heritage specials next time. Warm regards from Hotel Gypsy.`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    onSendReply(review.id, replyText);
    setReplyText("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-white text-stone-900 rounded-3xl border border-stone-200 shadow-2xl p-6 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
              <ChefHat className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-stone-900">
                Official Restaurant Reply
              </h2>
              <p className="text-xs text-stone-500 font-medium">
                Respond publicly as the Executive Chef / General Manager
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Customer Review Quote */}
        <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 text-xs space-y-1">
          <div className="flex items-center justify-between text-stone-600 font-bold">
            <span className="flex items-center gap-1">
              {review.displayName}
              <span className="inline-flex items-center gap-0.5 text-amber-500">
                (<Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                {review.rating}.0)
              </span>
            </span>
            <span className="text-[10px] uppercase font-bold text-orange-600">{review.aiSentiment}</span>
          </div>
          <p className="text-stone-700 italic font-medium">
            "{review.reviewText}"
          </p>
        </div>

        {/* AI Quick Response Templates */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-black text-stone-600 uppercase tracking-wider flex items-center gap-1">
            <Bot className="w-3.5 h-3.5 text-orange-500" />
            Quick AI Response Presets
          </span>
          <div className="flex gap-2 flex-wrap text-xs font-bold">
            <button
              type="button"
              onClick={() => handleGenerateTemplate("thank")}
              className="px-3 py-1 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors"
            >
              Gratitude Template
            </button>
            <button
              type="button"
              onClick={() => handleGenerateTemplate("apologize")}
              className="px-3 py-1 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 transition-colors"
            >
              Constructive Follow-up
            </button>
            <button
              type="button"
              onClick={() => handleGenerateTemplate("invite")}
              className="px-3 py-1 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition-colors"
            >
              Dinner Invitation
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-700">
              Your Public Response (Visible to all diners)
            </label>
            <textarea
              rows={4}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write your gracious response here..."
              className="w-full rounded-2xl border border-stone-200 bg-white p-3 text-xs text-stone-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
              required
            />
          </div>

          <div className="flex items-center justify-end gap-2">
            <Button type="button" variant="ghost" onClick={onClose} className="text-stone-600 font-semibold">
              Cancel
            </Button>
            <Button type="submit" className="bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl shadow-md shadow-orange-600/20 hover:scale-105 active:scale-95 transition-all">
              <Check className="w-4 h-4 mr-1.5" />
              Publish Response
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
