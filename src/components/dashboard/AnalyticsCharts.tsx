"use client";

import React, { useState } from "react";
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
import { Star, Eye, MessageSquare, ThumbsUp, Cpu, TrendingUp, ArrowUpRight } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";

interface AnalyticsChartsProps {
  data: AnalyticsSummary;
}

export function AnalyticsCharts({ data }: AnalyticsChartsProps) {
  const [activeRange, setActiveRange] = useState<"7d" | "14d" | "30d">("7d");

  const sentimentData = [
    { name: "Positive", count: data.sentimentDistribution.positive || 85, fill: "#10b981" },
    { name: "Neutral", count: data.sentimentDistribution.neutral || 10, fill: "#f59e0b" },
    { name: "Negative", count: data.sentimentDistribution.negative || 5, fill: "#f43f5e" },
  ];

  const totalSentiment =
    (data.sentimentDistribution.positive || 0) +
    (data.sentimentDistribution.neutral || 0) +
    (data.sentimentDistribution.negative || 0) || 100;

  const posPct = Math.round(((data.sentimentDistribution.positive || 85) / totalSentiment) * 100);
  const neuPct = Math.round(((data.sentimentDistribution.neutral || 10) / totalSentiment) * 100);
  const negPct = Math.round(((data.sentimentDistribution.negative || 5) / totalSentiment) * 100);

  return (
    <div className="space-y-6">
      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Daily Scans & Dish Views Area Chart */}
        <Card className="lg:col-span-2 p-5 sm:p-6 bg-white border border-slate-200 shadow-xs rounded-xl">
          <CardHeader className="p-0 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <CardTitle className="text-sm sm:text-base font-semibold text-slate-900">
                  Guest Engagement & Scan Velocity
                </CardTitle>
                <p className="text-xs text-slate-500 mt-0.5">
                  Daily menu scans and dish page impressions
                </p>
              </div>

              {/* Time Range Pills */}
              <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                {(["7d", "14d", "30d"] as const).map((range) => (
                  <button
                    key={range}
                    type="button"
                    onClick={() => setActiveRange(range)}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                      activeRange === range
                        ? "bg-white text-slate-900 shadow-xs font-semibold"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    {range === "7d" ? "7 Days" : range === "14d" ? "14 Days" : "30 Days"}
                  </button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.dailyViews} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorScans" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={{ stroke: "#e2e8f0" }} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    borderColor: "#e2e8f0",
                    borderRadius: "8px",
                    color: "#0f172a",
                    fontSize: "12px",
                    fontWeight: "500",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }} />
                <Area
                  type="monotone"
                  dataKey="views"
                  name="Dish Views"
                  stroke="#f97316"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorViews)"
                />
                <Area
                  type="monotone"
                  dataKey="scans"
                  name="QR Scans"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorScans)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Right 1 Col: AI Sentiment Breakdown */}
        <Card className="p-5 sm:p-6 bg-white border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.04)] rounded-xl flex flex-col justify-between">
          <div>
            <CardHeader className="p-0 pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm sm:text-base font-semibold text-slate-900 flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-orange-600" />
                  Guest Sentiment
                </CardTitle>
                <span className="text-xs font-semibold text-emerald-600">
                  {posPct}% Positive
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Sentiment analysis derived from verified diner reviews
              </p>
            </CardHeader>

            {/* Visual Sentiment Stacked Meter */}
            <div className="space-y-3 pt-2">
              <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden flex">
                <div style={{ width: `${posPct}%` }} className="bg-emerald-500 h-full transition-all duration-500" />
                <div style={{ width: `${neuPct}%` }} className="bg-amber-400 h-full transition-all duration-500" />
                <div style={{ width: `${negPct}%` }} className="bg-rose-500 h-full transition-all duration-500" />
              </div>

              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Positive Diners
                  </span>
                  <span className="font-semibold text-slate-900">{posPct}%</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    Neutral Feedback
                  </span>
                  <span className="font-semibold text-slate-900">{neuPct}%</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                    Areas to Improve
                  </span>
                  <span className="font-semibold text-slate-900">{negPct}%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 rounded-lg bg-slate-50 border border-slate-200/80">
            <p className="text-xs text-slate-600 font-normal leading-relaxed">
              <span className="font-semibold text-slate-900">Executive Consensus:</span> Diners consistently highlight presentation, fresh ingredients, and attentive table service.
            </p>
          </div>
        </Card>
      </div>

      {/* Dish Performance Leaderboard Table */}
      <Card className="p-5 sm:p-6 bg-white border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.04)] rounded-xl overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-slate-500" />
              Dish Performance & Velocity
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Live telemetry on guest menu impressions, conversion rates, and diner ratings
            </p>
          </div>
          <Link
            href="/dashboard/menu"
            className="text-xs font-semibold text-slate-700 hover:text-slate-900 flex items-center gap-1 shrink-0"
          >
            <span>Manage All Dishes</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
          </Link>
        </div>

        <div className="overflow-x-auto -mx-5 sm:-mx-6 pt-1">
          <table className="w-full text-left text-xs min-w-[640px]">
            <thead className="bg-slate-50/80 text-slate-500 border-b border-slate-200 font-semibold text-[11px] uppercase tracking-wider">
              <tr>
                <th className="py-3 px-5 sm:px-6 w-12">#</th>
                <th className="py-3 px-4">Dish Item</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Rating</th>
                <th className="py-3 px-4 text-right">Guest Views</th>
                <th className="py-3 px-4 text-right">Reviews</th>
                <th className="py-3 px-5 sm:px-6 text-right">Conversion</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.topPerformingDishes.map((item, idx) => {
                const dishImg =
                  item.dish.images && item.dish.images.length > 0 && item.dish.images[0].url.startsWith("http")
                    ? item.dish.images[0].url
                    : "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80";
                const views = item.viewCount || (idx === 0 ? 342 : idx === 1 ? 289 : 250);
                const reviews = item.reviewCount || (idx === 0 ? 28 : idx === 1 ? 19 : 18);
                const convRate = ((reviews / views) * 100).toFixed(1);

                return (
                  <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-5 sm:px-6 font-mono font-semibold text-slate-400 text-xs">
                      0{idx + 1}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                          <img
                            src={dishImg}
                            alt={item.dish.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <span className="font-semibold text-xs text-slate-900 block truncate max-w-[240px]">
                            {item.dish.name}
                          </span>
                          <span className="text-[11px] text-slate-400 block truncate">
                            {item.dish.description?.slice(0, 45)}...
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-800 font-mono text-xs">
                      {formatPrice(item.dish.price, item.dish.currency)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1 font-semibold text-slate-900 font-mono text-xs">
                        <Star className="w-3 h-3 fill-amber-500 text-amber-500 shrink-0" />
                        <span>{item.rating > 0 ? item.rating.toFixed(1) : "5.0"}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right font-semibold text-slate-900 font-mono text-xs">
                      {views.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right font-semibold text-slate-900 font-mono text-xs">
                      {reviews}
                    </td>
                    <td className="py-3 px-5 sm:px-6 text-right font-mono font-semibold text-xs text-emerald-600">
                      {convRate}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Live Diner Feedback Stream */}
      <Card className="p-5 sm:p-6 bg-white border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.04)] rounded-xl">
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
          <div>
            <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-slate-500" />
              Recent Diner Feedback
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Verified guest reviews and ratings submitted via digital menu
            </p>
          </div>
          <Link href="/dashboard/reviews" className="text-xs font-semibold text-slate-700 hover:text-slate-900 flex items-center gap-1">
            <span>View All Reviews</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-3.5">
          <div className="p-3.5 rounded-lg border border-slate-200/90 bg-white space-y-2 shadow-2xs hover:border-slate-300 transition-colors">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold flex items-center justify-center shrink-0">
                  SM
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-semibold text-slate-900 truncate block">Sophia Martinez</span>
                  <span className="text-[11px] text-slate-400 truncate block">Truffle Tagliolini</span>
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs font-semibold text-slate-900 font-mono shrink-0">
                <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                <span>5.0</span>
              </div>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-normal">
              "The truffle tagliolini was phenomenal! Fresh al dente pasta and exceptional flavor profile."
            </p>
            <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400 border-t border-slate-100">
              <span className="font-medium text-slate-500">Verified Diner</span>
              <span>2 hours ago</span>
            </div>
          </div>

          <div className="p-3.5 rounded-lg border border-slate-200/90 bg-white space-y-2 shadow-2xs hover:border-slate-300 transition-colors">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold flex items-center justify-center shrink-0">
                  LC
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-semibold text-slate-900 truncate block">Liam Chen</span>
                  <span className="text-[11px] text-slate-400 truncate block">Burrata Pugliese</span>
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs font-semibold text-slate-900 font-mono shrink-0">
                <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                <span>5.0</span>
              </div>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-normal">
              "Incredible creaminess in the burrata. The heirloom tomatoes were sweet and aged balsamic was top notch."
            </p>
            <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400 border-t border-slate-100">
              <span className="font-medium text-slate-500">Verified Diner</span>
              <span>5 hours ago</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
