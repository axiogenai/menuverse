"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  UtensilsCrossed, 
  MessageSquareQuote, 
  QrCode, 
  Globe, 
  Bot, 
  Users, 
  Settings, 
  Smartphone, 
  ExternalLink,
  ChefHat
} from "lucide-react";
import { cn } from "@/lib/utils";
import { menuVerseStore } from "@/lib/seed-data";
import { Restaurant } from "@/types";

export function DashboardSidebar() {
  const pathname = usePathname();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(
    () => menuVerseStore.getRestaurantBySlug() || null
  );

  useEffect(() => {
    const update = () => {
      const rest = menuVerseStore.getRestaurantBySlug();
      if (rest) setRestaurant({ ...rest });
    };
    update();
    const unsub = menuVerseStore.subscribe(update);
    return () => unsub();
  }, []);

  const menuItems = [
    {
      name: "Overview Analytics",
      href: "/dashboard",
      icon: LayoutDashboard,
      active: pathname === "/dashboard",
    },
    {
      name: "Menu Studio & Dishes",
      href: "/dashboard/menu",
      icon: UtensilsCrossed,
      active: pathname === "/dashboard/menu",
    },
    {
      name: "Reviews & Replies",
      href: "/dashboard/reviews",
      icon: MessageSquareQuote,
      active: pathname === "/dashboard/reviews",
    },
    {
      name: "Branded QR Studio",
      href: "/dashboard/qr-code",
      icon: QrCode,
      active: pathname === "/dashboard/qr-code",
    },
    {
      name: "Google Reviews Sync",
      href: "/dashboard/google-reviews",
      icon: Globe,
      active: pathname === "/dashboard/google-reviews",
    },
    {
      name: "AI Sentiment Insights",
      href: "/dashboard/ai-insights",
      icon: Bot,
      active: pathname === "/dashboard/ai-insights",
    },
    {
      name: "Staff & Permissions",
      href: "/dashboard/staff",
      icon: Users,
      active: pathname === "/dashboard/staff",
    },
    {
      name: "Restaurant Settings",
      href: "/dashboard/settings",
      icon: Settings,
      active: pathname === "/dashboard/settings",
    },
  ];

  const venueSlug = restaurant?.slug || "my-restaurant";
  const venueName = restaurant?.name || "My Restaurant";

  return (
    <aside className="w-64 shrink-0 bg-white text-stone-800 border-r border-stone-200/90 flex flex-col justify-between p-4 hidden md:flex sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto shadow-xs">
      <div className="space-y-6">
        {/* Restaurant Header */}
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-orange-600 text-white font-bold shadow-md shadow-orange-600/25">
            {restaurant?.logoUrl ? (
              <img src={restaurant.logoUrl} alt="" className="w-full h-full object-cover rounded-2xl" />
            ) : (
              <ChefHat className="w-5 h-5" />
            )}
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="font-black text-sm text-stone-900 truncate">
              {venueName}
            </span>
            <span className="text-[10px] text-orange-600 font-bold uppercase tracking-wider">
              Owner Management
            </span>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all duration-200 group hover:scale-102 active:scale-98",
                  item.active
                    ? "bg-orange-600 text-white shadow-md shadow-orange-600/25 font-black"
                    : "text-stone-600 hover:text-stone-950 hover:bg-stone-100"
                )}
              >
                <Icon
                  className={cn(
                    "w-4 h-4",
                    item.active ? "text-white" : "text-stone-400 group-hover:text-orange-600"
                  )}
                />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Live QR Link Card */}
      <div className="p-4 rounded-3xl bg-orange-50/80 border border-orange-200/80 space-y-2.5 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-black uppercase tracking-wider text-orange-800 flex items-center gap-1.5">
            <Smartphone className="w-3.5 h-3.5 text-orange-600" />
            Live Diner View
          </span>
        </div>
        <p className="text-[11px] text-stone-600 font-medium">
          Preview how your guests view your social menu on mobile.
        </p>
        <Link
          href={`/r/${venueSlug}`}
          target="_blank"
          className="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-2xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-black shadow-md shadow-orange-600/20 hover:scale-105 active:scale-95 transition-all"
        >
          <span>Open Public Menu</span>
          <ExternalLink className="w-3 h-3" />
        </Link>
      </div>
    </aside>
  );
}
