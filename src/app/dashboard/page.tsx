"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  QrCode, 
  Eye, 
  MessageSquareQuote, 
  Star, 
  ExternalLink,
  Flame
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
    <div className="space-y-6">
      {/* Top Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-stone-200/90 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-black text-orange-600 uppercase tracking-wider">
            <Flame className="w-3.5 h-3.5" />
            Live Restaurant Performance Engine
          </div>
          <h1 className="text-2xl font-black text-stone-900 mt-1">
            {restaurant.name}
          </h1>
          <p className="text-xs text-stone-500 font-medium">
            Real-time dish social discovery, diner engagement, and reputation metrics
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link href="/dashboard/qr-code">
            <Button variant="outline" size="sm" className="rounded-xl border-stone-200 bg-white text-stone-700 hover:bg-stone-50 font-bold flex items-center gap-1.5 shadow-xs hover:scale-105 active:scale-95 transition-all">
              <QrCode className="w-3.5 h-3.5 text-orange-500" />
              <span>QR Studio</span>
            </Button>
          </Link>

          <Link href={`/r/${restaurant.slug}`} target="_blank">
            <Button size="sm" className="bg-orange-600 hover:bg-orange-500 text-white rounded-xl font-bold flex items-center gap-1.5 shadow-md shadow-orange-500/20 hover:scale-105 active:scale-95 transition-all">
              <span>View Public Menu</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total QR Scans"
          value={analytics.totalScans.toLocaleString()}
          subtitle={`${analytics.uniqueVisitors} Unique Diners`}
          icon={QrCode}
          trend={{ value: "+18.4% this week", isPositive: true }}
          color="text-blue-600 bg-blue-50"
        />

        <StatCard
          title="Dish Social Views"
          value={analytics.totalDishViews.toLocaleString()}
          subtitle="4.1m avg session time"
          icon={Eye}
          trend={{ value: "+24.2% engagement", isPositive: true }}
          color="text-orange-600 bg-orange-50"
        />

        <StatCard
          title="Permanent Reviews"
          value={analytics.totalReviews}
          subtitle={`${analytics.totalCustomerPhotos} customer photos uploaded`}
          icon={MessageSquareQuote}
          trend={{ value: "+12 new reviews", isPositive: true }}
          color="text-emerald-600 bg-emerald-50"
        />

        <StatCard
          title="Average Rating"
          value={`${analytics.avgRating.toFixed(1)}`}
          subtitle="96% positive consensus"
          icon={Star}
          trend={{ value: "Top 1% Italian in NYC", isPositive: true }}
          color="text-amber-600 bg-amber-50"
        />
      </div>

      {/* Interactive Charts & Performance Tables */}
      <AnalyticsCharts data={analytics} />
    </div>
  );
}
