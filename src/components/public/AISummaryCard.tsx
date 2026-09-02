"use client";

import React from "react";
import { Check, AlertCircle, Tag, Bot } from "lucide-react";
import { AISummary } from "@/types";

interface AISummaryCardProps {
  summary?: AISummary | null;
  dishName: string;
}

export function AISummaryCard({ summary, dishName }: AISummaryCardProps) {
  if (!summary) return null;

  const taste = summary.tasteProfile || { savory: 85, rich: 80, crispy: 60, spicy: 25, sweet: 15 };

  return (
    <div className="rounded-3xl bg-orange-50/70 border border-orange-200/80 p-4 sm:p-5 space-y-4 shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-500 text-white shadow-md shadow-orange-500/25">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-black text-stone-900 flex items-center gap-1.5">
              AI Taste & Sentiment Summary
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 font-bold border border-orange-200">
                {Math.round(summary.confidenceScore * 100)}% Confidence
              </span>
            </h4>
            <p className="text-xs text-stone-500 font-medium">Synthesized from authentic customer reviews</p>
          </div>
        </div>
      </div>

      {/* Main Narrative Summary */}
      <p className="text-xs sm:text-sm text-stone-800 leading-relaxed bg-white p-3.5 rounded-2xl border border-stone-200/80 italic font-medium shadow-xs">
        "{summary.summaryText}"
      </p>

      {/* Highlights & Suggestions Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Positive Highlights */}
        {summary.positiveHighlights?.length > 0 && (
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> What Diners Love
            </span>
            <div className="space-y-1">
              {summary.positiveHighlights.map((h, i) => (
                <div
                  key={i}
                  className="flex items-start gap-1.5 text-xs text-stone-800 bg-emerald-50/80 p-2.5 rounded-xl border border-emerald-200/70 font-medium"
                >
                  <span className="text-emerald-600 font-bold">•</span>
                  <span>{h}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Improvement Suggestions */}
        {summary.improvementSuggestions?.length > 0 && (
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" /> Diner Considerations
            </span>
            <div className="space-y-1">
              {summary.improvementSuggestions.map((s, i) => (
                <div
                  key={i}
                  className="flex items-start gap-1.5 text-xs text-stone-800 bg-amber-50/80 p-2.5 rounded-xl border border-amber-200/70 font-medium"
                >
                  <span className="text-amber-600 font-bold">•</span>
                  <span>{s}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Taste Profile Bars */}
      <div className="space-y-2 pt-2 border-t border-orange-200/60">
        <span className="text-[11px] font-bold uppercase tracking-wider text-stone-600">
          Flavor & Texture Profile
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {Object.entries(taste).map(([key, val]) => (
            <div key={key} className="bg-white p-2.5 rounded-2xl border border-stone-200/80 space-y-1 shadow-xs">
              <div className="flex items-center justify-between text-[11px] font-bold capitalize text-stone-700">
                <span>{key}</span>
                <span className="text-orange-600">{val}%</span>
              </div>
              <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full transition-all duration-700"
                  style={{ width: `${val}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Keywords */}
      {summary.topKeywords?.length > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap pt-1">
          <Tag className="w-3.5 h-3.5 text-stone-400" />
          <span className="text-[11px] text-stone-500 font-medium">Keywords:</span>
          {summary.topKeywords.map((kw, i) => (
            <span
              key={i}
              className="text-[10px] font-bold px-2.5 py-0.5 rounded-lg bg-white text-orange-600 border border-orange-200 shadow-xs"
            >
              #{kw}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
