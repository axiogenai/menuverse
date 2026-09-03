"use client";

import React from "react";
import { Check, AlertCircle, Tag, LineChart } from "lucide-react";
import { AISummary } from "@/types";

interface AISummaryCardProps {
  summary?: AISummary | null;
  dishName: string;
}

export function AISummaryCard({ summary, dishName }: AISummaryCardProps) {
  if (!summary) return null;

  const taste = summary.tasteProfile || { savory: 85, rich: 80, crispy: 60, spicy: 25, sweet: 15 };

  return (
    <div className="rounded-xl bg-stone-50/80 border border-stone-200/90 p-3.5 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-stone-900 text-white shrink-0">
            <LineChart className="w-3.5 h-3.5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="text-xs font-bold text-stone-900 leading-none">
                AI Taste & Sentiment Summary
              </h4>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 font-semibold">
                {Math.round(summary.confidenceScore * 100)}% Confidence
              </span>
            </div>
            <p className="text-[10px] text-stone-500 pt-0.5">Synthesized from authentic guest reviews</p>
          </div>
        </div>
      </div>

      {/* Main Narrative Summary */}
      <div className="bg-white p-3 rounded-lg border border-stone-200/80 shadow-2xs">
        <p className="text-xs text-stone-700 leading-relaxed font-normal italic">
          &quot;{summary.summaryText}&quot;
        </p>
      </div>

      {/* Highlights & Considerations */}
      <div className="space-y-2">
        {/* Positive Highlights */}
        {summary.positiveHighlights?.length > 0 && (
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1">
              <Check className="w-3 h-3 text-emerald-600" /> What Diners Love
            </span>
            <div className="space-y-1">
              {summary.positiveHighlights.map((h, i) => (
                <div
                  key={i}
                  className="flex items-start gap-1.5 text-xs text-stone-700 bg-white p-2 rounded-lg border border-emerald-200/60"
                >
                  <span className="text-emerald-600 font-bold">•</span>
                  <span className="leading-snug">{h}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Improvement Suggestions */}
        {summary.improvementSuggestions?.length > 0 && (
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 flex items-center gap-1">
              <AlertCircle className="w-3 h-3 text-amber-600" /> Diner Considerations
            </span>
            <div className="space-y-1">
              {summary.improvementSuggestions.map((s, i) => (
                <div
                  key={i}
                  className="flex items-start gap-1.5 text-xs text-stone-700 bg-white p-2 rounded-lg border border-amber-200/60"
                >
                  <span className="text-amber-600 font-bold">•</span>
                  <span className="leading-snug">{s}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Taste Profile Bars - Proportional 2-3 Column Grid */}
      <div className="space-y-1.5 pt-1.5 border-t border-stone-200/80">
        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
          Flavor & Texture Profile
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
          {Object.entries(taste).map(([key, val]) => (
            <div key={key} className="bg-white p-2 rounded-lg border border-stone-200/80 space-y-1 shadow-2xs">
              <div className="flex items-center justify-between text-[11px] font-medium capitalize text-stone-700">
                <span>{key}</span>
                <span className="text-stone-900 font-mono font-semibold text-[10px]">{val}%</span>
              </div>
              <div className="h-1.5 w-full bg-stone-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-stone-800 rounded-full transition-all duration-500"
                  style={{ width: `${val}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Keywords */}
      {summary.topKeywords?.length > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
          <Tag className="w-3 h-3 text-stone-400" />
          <span className="text-[10px] text-stone-400 font-medium">Keywords:</span>
          {summary.topKeywords.map((kw, i) => (
            <span
              key={i}
              className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white text-stone-700 border border-stone-200 shadow-2xs"
            >
              #{kw}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
