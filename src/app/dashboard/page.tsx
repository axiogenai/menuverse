"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Users, 
  Eye, 
  MessageSquareQuote, 
  Star, 
  ArrowUpRight,
  UtensilsCrossed,
  Plus
} from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { AnalyticsCharts } from "@/components/dashboard/AnalyticsCharts";
import { menuVerseStore } from "@/lib/seed-data";
import { AnalyticsSummary } from "@/types";
import { Button } from "@/components/ui/button";

export default function DashboardOverviewPage() {
  const [restaurant, setRestaurant] = useState(() => menuVerseStore.getRestaurantBySlug() || null);
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);

  useEffect(() => {
    const update = () => {
      const rest = menuVerseStore.getRestaurantBySlug();
      if (rest) {
        setRestaurant({ ...rest });
        setAnalytics(menuVerseStore.getAnalyticsSummary(rest.id));
      }
    };
    update();
    const unsub = menuVerseStore.subscribe(update);
    return () => unsub();
  }, []);

  if (!analytics || !restaurant) return null;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Executive Command Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-200/80">
        <div className="space-y-1 min-w-0 flex-1">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Overview & Analytics
          </h1>
          <p className="text-xs text-slate-500 font-normal">
            Real-time performance metrics for <span className="font-semibold text-slate-700">{restaurant.name}</span> • Guest scans, dish engagement, and verified reviews.
          </p>
        </div>

        {/* Action Toolbar - Clean, mobile friendly */}
        <div className="flex items-center gap-2 shrink-0">
          <Link href={`/r/${restaurant.slug}`} target="_blank" className="shrink-0">
            <Button variant="outline" size="sm" className="h-9 px-3 text-xs font-semibold text-slate-700 bg-white border-slate-200/90 hover:bg-slate-50 hover:text-slate-900 shadow-2xs rounded-lg flex items-center gap-1.5 shrink-0 whitespace-nowrap">
              <span>View Public Menu</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
            </Button>
          </Link>

          <Link href="/dashboard/menu" className="shrink-0">
            <Button size="sm" className="h-9 px-3.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 shadow-xs rounded-lg flex items-center gap-1.5 transition-colors shrink-0 whitespace-nowrap">
              <Plus className="w-3.5 h-3.5 text-orange-400" />
              <span>Add Dish</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Menu Views"
          value={analytics.totalScans.toLocaleString()}
          subtitle={`${analytics.uniqueVisitors} unique diners visited`}
          icon={Users}
          trend={{ value: "+18.4%", isPositive: true }}
        />

        <StatCard
          title="Dish Impressions"
          value={analytics.totalDishViews.toLocaleString()}
          subtitle="4.1m average session time"
          icon={Eye}
          trend={{ value: "+24.2%", isPositive: true }}
        />

        <StatCard
          title="Verified Reviews"
          value={analytics.totalReviews}
          subtitle={`${analytics.totalCustomerPhotos} diner photos uploaded`}
          icon={MessageSquareQuote}
          trend={{ value: "+12 new", isPositive: true }}
        />

        <StatCard
          title="Average Rating"
          value={`${analytics.avgRating.toFixed(1)} ★`}
          subtitle="96% positive diner consensus"
          icon={Star}
          trend={{ value: "Top 1%", isPositive: true }}
        />
      </div>

      {/* Interactive Charts & Performance Tables */}
      <AnalyticsCharts data={analytics} />
    </div>
  );
}
