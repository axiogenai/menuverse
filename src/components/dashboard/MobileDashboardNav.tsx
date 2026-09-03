"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  UtensilsCrossed, 
  MessageSquareQuote, 
  QrCode, 
  Globe, 
  Cpu, 
  Users, 
  Settings 
} from "lucide-react";
import { cn } from "@/lib/utils";

export function MobileDashboardNav() {
  const pathname = usePathname();

  const navItems = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Menu Items", href: "/dashboard/menu", icon: UtensilsCrossed },
    { name: "Reviews", href: "/dashboard/reviews", icon: MessageSquareQuote },
    { name: "QR Studio", href: "/dashboard/qr-code", icon: QrCode },
    { name: "Google Sync", href: "/dashboard/google-reviews", icon: Globe },
    { name: "AI Insights", href: "/dashboard/ai-insights", icon: Cpu },
    { name: "Staff", href: "/dashboard/staff", icon: Users },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <div className="md:hidden sticky top-16 z-30 bg-white/95 backdrop-blur-sm border-b border-slate-200 px-3 py-2 flex items-center gap-1.5 overflow-x-auto scrollbar-none select-none">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition-colors shrink-0",
              isActive
                ? "bg-slate-900 text-white font-semibold shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 font-medium"
            )}
          >
            <Icon className={cn("w-3.5 h-3.5", isActive ? "text-orange-400" : "text-slate-500")} />
            <span>{item.name}</span>
          </Link>
        );
      })}
    </div>
  );
}
