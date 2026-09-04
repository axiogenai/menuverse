"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  UtensilsCrossed, 
  MessageSquareQuote, 
  Globe, 
  Cpu, 
  Users, 
  Settings, 
  ExternalLink,
  Store,
  BadgeCheck
} from "lucide-react";
import { cn } from "@/lib/utils";
import { menuVerseStore } from "@/lib/seed-data";
import { Restaurant } from "@/types";

export function DashboardSidebar() {
  const pathname = usePathname();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);

  useEffect(() => {
    const update = () => {
      const rest = menuVerseStore.getRestaurantBySlug();
      if (rest) setRestaurant({ ...rest });
    };
    update();
    const unsub = menuVerseStore.subscribe(update);
    return () => unsub();
  }, []);

  const navSections = [
    {
      title: "Overview",
      items: [
        {
          name: "Dashboard",
          href: "/dashboard",
          icon: LayoutDashboard,
          active: pathname === "/dashboard",
        },
        {
          name: "Menu Management",
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
      ],
    },
    {
      title: "Integrations & AI",
      items: [
        {
          name: "Google Reviews",
          href: "/dashboard/google-reviews",
          icon: Globe,
          active: pathname === "/dashboard/google-reviews",
        },
        {
          name: "AI Insights",
          href: "/dashboard/ai-insights",
          icon: Cpu,
          active: pathname === "/dashboard/ai-insights",
        },
      ],
    },
    {
      title: "Settings",
      items: [
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
      ],
    },
  ];

  const venueSlug = restaurant?.slug || "my-restaurant";
  const venueName = restaurant?.name || "My Restaurant";

  return (
    <aside className="w-60 shrink-0 bg-white text-slate-800 border-r border-slate-200 flex flex-col justify-between hidden md:flex sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
      <div className="p-3 space-y-4">
        {/* Workspace Selector */}
        <div className="flex items-center justify-between p-2 rounded-lg border border-slate-200 bg-slate-50/70 hover:bg-slate-100 transition-colors cursor-pointer">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-orange-600 text-white font-bold text-xs shrink-0 shadow-xs">
              <Store className="w-4 h-4" />
            </div>
            <div className="flex flex-col min-w-0 text-left">
              <span className="font-semibold text-xs text-slate-900 truncate">
                {venueName}
              </span>
              <span className="text-[11px] text-slate-500 font-normal truncate">
                Owner Dashboard
              </span>
            </div>
          </div>
          <BadgeCheck className="w-4 h-4 text-emerald-600 shrink-0" />
        </div>

        {/* Navigation Section */}
        <div className="space-y-4 pt-1">
          {navSections.map((section, idx) => (
            <div key={idx} className="space-y-1">
              <div className="px-2.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                {section.title}
              </div>
              <nav className="space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors",
                        item.active
                          ? "bg-slate-100 text-slate-950 font-semibold"
                          : "text-slate-600 hover:text-slate-950 hover:bg-slate-50"
                      )}
                    >
                      <Icon
                        className={cn(
                          "w-4 h-4 shrink-0 transition-colors",
                          item.active ? "text-orange-600" : "text-slate-400"
                        )}
                      />
                      <span className="truncate">{item.name}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Action - View Public Menu */}
      <div className="p-3 border-t border-slate-200 bg-slate-50/50">
        <Link
          href={`/r/${venueSlug}`}
          prefetch={true}
          className="flex items-center justify-center gap-1.5 w-full py-2 px-3 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold shadow-xs transition-all active:scale-95 cursor-pointer"
        >
          <span>View Public Menu</span>
          <ExternalLink className="w-3.5 h-3.5 text-white/90" />
        </Link>
      </div>
    </aside>
  );
}
