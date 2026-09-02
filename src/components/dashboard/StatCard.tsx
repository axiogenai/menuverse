"use client";

import React from "react";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { Card } from "@/components/ui/card";
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
  color?: string;
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color = "text-orange-600 bg-orange-100",
}: StatCardProps) {
  return (
    <Card className="p-5 flex flex-col justify-between space-y-3 bg-white border-stone-200/90 shadow-sm hover:shadow-xl hover:border-orange-300 transition-all duration-300 rounded-3xl hover:-translate-y-1">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <span className="text-[11px] font-black text-stone-500 uppercase tracking-wider">
            {title}
          </span>
          <div className="text-3xl font-black text-stone-900">
            {value}
          </div>
        </div>

        <div className={cn("flex h-12 w-12 items-center justify-center rounded-2xl shrink-0 shadow-xs", color)}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="flex items-center justify-between text-xs pt-2 border-t border-stone-100">
        {subtitle && <span className="text-stone-500 font-medium text-[11px]">{subtitle}</span>}

        {trend && (
          <div
            className={cn(
              "flex items-center gap-1 font-extrabold text-[11px]",
              trend.isPositive
                ? "text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200"
                : "text-rose-700 bg-rose-50 px-2 py-0.5 rounded-lg border border-rose-200"
            )}
          >
            {trend.isPositive ? (
              <TrendingUp className="w-3 h-3 text-emerald-600" />
            ) : (
              <TrendingDown className="w-3 h-3 text-rose-600" />
            )}
            <span>{trend.value}</span>
          </div>
        )}
      </div>
    </Card>
  );
}
