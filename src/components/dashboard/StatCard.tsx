"use client";

import React from "react";
import { LucideIcon, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
}: StatCardProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-4 sm:p-5 flex flex-col justify-between transition-all duration-150 hover:shadow-md hover:border-slate-300">
      {/* Top row: Label & subtle icon */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold text-slate-500 tracking-tight">
          {title}
        </span>
        <Icon className="w-4 h-4 text-slate-400 shrink-0" />
      </div>

      {/* Main Metric Value & Trend Inline */}
      <div className="my-2.5">
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            {value}
          </span>
          {trend && (
            <span
              className={cn(
                "inline-flex items-center text-xs font-semibold",
                trend.isPositive ? "text-emerald-600" : "text-rose-600"
              )}
            >
              {trend.isPositive ? (
                <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
              ) : (
                <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
              )}
              {trend.value}
            </span>
          )}
        </div>
      </div>

      {/* Bottom Subtitle / Context */}
      {subtitle && (
        <div className="text-[11px] text-slate-500 font-normal truncate">
          {subtitle}
        </div>
      )}
    </div>
  );
}
