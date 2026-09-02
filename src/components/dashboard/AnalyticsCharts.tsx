"use client";

import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import { AnalyticsSummary } from "@/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Star, Eye, MessageSquare, ThumbsUp } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface AnalyticsChartsProps {
  data: AnalyticsSummary;
}

export function AnalyticsCharts({ data }: AnalyticsChartsProps) {
  const sentimentData = [
    { name: "Positive", count: data.sentimentDistribution.positive, fill: "#10b981" },
    { name: "Neutral", count: data.sentimentDistribution.neutral, fill: "#f59e0b" },
    { name: "Negative", count: data.sentimentDistribution.negative, fill: "#f43f5e" },
  ];

  return (
    <div className="space-y-6">
      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Daily Scans & Dish Views Area Chart */}
        <Card className="lg:col-span-2 p-5 bg-white border-stone-200/80 shadow-sm rounded-3xl">
          <CardHeader className="p-0 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-black text-stone-900">
                  Diner Engagement & QR Velocity
                </CardTitle>
                <p className="text-xs text-stone-500 font-medium">
                  Daily menu scans, dish views, and review submissions
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.dailyViews} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorScans" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" opacity={0.8} />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#64748b" }} />
                <YAxis tick={{ fontSize: 11, fill: "#64748b" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    borderColor: "#e2e8f0",
                    borderRadius: "16px",
                    color: "#0f172a",
                    fontSize: "12px",
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
                <Area
                  type="monotone"
                  dataKey="views"
                  name="Dish Views"
                  stroke="#f97316"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorViews)"
                />
                <Area
                  type="monotone"
                  dataKey="scans"
                  name="QR Scans"
                  stroke="#3b82f6"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorScans)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Right 1 Col: Sentiment Distribution */}
        <Card className="p-5 bg-white border-stone-200/80 shadow-sm rounded-3xl">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="text-base font-black text-stone-900">
              AI Sentiment Classification
            </CardTitle>
            <p className="text-xs text-stone-500 font-medium">
              Real-time sentiment breakdown across all diner reviews
            </p>
          </CardHeader>
          <CardContent className="p-0 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sentimentData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" opacity={0.8} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#64748b" }} />
                <YAxis tick={{ fontSize: 11, fill: "#64748b" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    borderColor: "#e2e8f0",
                    borderRadius: "16px",
                    color: "#0f172a",
                    fontSize: "12px",
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Bar dataKey="count" name="Review Count" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top vs Underperforming Dishes Table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performing */}
        <Card className="p-5 bg-white border-stone-200/80 shadow-sm rounded-3xl">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div>
              <h4 className="text-sm font-black text-stone-900 flex items-center gap-1.5">
                <ThumbsUp className="w-4 h-4 text-emerald-500" />
                Top Performing Social Dishes
              </h4>
              <p className="text-xs text-stone-500 font-medium">Highest engagement, view-to-review velocity</p>
            </div>
          </div>
          <div className="divide-y divide-stone-100 pt-2">
            {data.topPerformingDishes.map((item, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-2xl overflow-hidden bg-stone-100 shrink-0 border border-stone-200">
                    <img
                      src={item.dish.images[0]?.url || ""}
                      alt={item.dish.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <span className="font-bold text-xs text-stone-900 line-clamp-1">
                      {item.dish.name}
                    </span>
                    <div className="flex items-center gap-2 text-[11px] text-stone-500">
                      <span className="font-semibold text-stone-700">{formatPrice(item.dish.price, item.dish.currency)}</span>
                      <span>•</span>
                      <span className="flex items-center gap-0.5 text-amber-600 font-bold">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {item.rating.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-right">
                  <div className="text-xs">
                    <span className="font-black text-stone-900 block">
                      {item.viewCount}
                    </span>
                    <span className="text-[10px] text-stone-500 font-medium">views</span>
                  </div>
                  <div className="text-xs">
                    <span className="font-black text-orange-600 block">
                      {item.reviewCount}
                    </span>
                    <span className="text-[10px] text-stone-500 font-medium">reviews</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Low Performing / Opportunity Dishes */}
        <Card className="p-5 bg-white border-stone-200/80 shadow-sm rounded-3xl">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div>
              <h4 className="text-sm font-black text-stone-900 flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-amber-500" />
                Growth Opportunity Dishes
              </h4>
              <p className="text-xs text-stone-500 font-medium">Dishes needing more diner photos & promotional attention</p>
            </div>
          </div>
          <div className="divide-y divide-stone-100 pt-2">
            {data.underperformingDishes.map((item, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-2xl overflow-hidden bg-stone-100 shrink-0 border border-stone-200">
                    <img
                      src={item.dish.images[0]?.url || ""}
                      alt={item.dish.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <span className="font-bold text-xs text-stone-900 line-clamp-1">
                      {item.dish.name}
                    </span>
                    <span className="text-[11px] text-stone-500 font-medium">
                      {formatPrice(item.dish.price, item.dish.currency)}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 font-bold border border-amber-200">
                    Needs Promotion
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
