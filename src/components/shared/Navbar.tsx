"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  QrCode, 
  UtensilsCrossed, 
  LayoutDashboard, 
  Trophy, 
  ExternalLink,
  Menu,
  X,
  MessageSquareQuote,
  Settings,
  Crown,
  Globe,
  Cpu,
  Users,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { menuVerseStore } from "@/lib/seed-data";
import { Restaurant } from "@/types";

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const isPublicMenu = pathname.startsWith("/r/");
  const isDashboard = pathname.startsWith("/dashboard");
  const venueSlug = restaurant?.slug || "hotel-gypsy";

  const managementNav = [
    { name: "Overview Analytics", href: "/dashboard", icon: LayoutDashboard },
    { name: "Menu Studio & Dishes", href: "/dashboard/menu", icon: UtensilsCrossed },
    { name: "Reviews & Replies", href: "/dashboard/reviews", icon: MessageSquareQuote },
    { name: "Branded QR Studio", href: "/dashboard/qr-code", icon: QrCode },
    { name: "Google Reviews Sync", href: "/dashboard/google-reviews", icon: Globe },
    { name: "AI Sentiment Insights", href: "/dashboard/ai-insights", icon: Cpu },
    { name: "Staff & Permissions", href: "/dashboard/staff", icon: Users },
    { name: "Restaurant Settings", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/90 bg-white/95 backdrop-blur-md">
      <div className="w-full max-w-7xl mx-auto flex h-16 items-center justify-between px-3.5 sm:px-6 lg:px-8">
        {/* Brand - Hotel Gypsy */}
        <Link href={`/r/${venueSlug}`} className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-stone-950 via-stone-900 to-black text-amber-300 border border-amber-500/40 shadow-xs group-hover:border-amber-400 transition-all">
            <Crown className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex flex-col text-left">
            <span className="font-serif text-sm sm:text-base font-bold tracking-tight text-slate-900 group-hover:text-amber-800 transition-colors">
              Hotel Gypsy
            </span>
            <span className="text-[9px] sm:text-[10px] font-semibold text-amber-700 tracking-wider uppercase -mt-0.5">
              5-Star Luxury Dining
            </span>
          </div>
        </Link>

        {/* Desktop Center Nav */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
          <Link
            href={`/r/${venueSlug}`}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
              isPublicMenu && !pathname.includes("/leaderboards")
                ? "bg-white text-slate-900 shadow-xs font-semibold"
                : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
            )}
          >
            <QrCode className="w-3.5 h-3.5 text-orange-600" />
            <span>Live QR Menu</span>
          </Link>
          <Link
            href={`/r/${venueSlug}/leaderboards`}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
              pathname.includes("/leaderboards")
                ? "bg-white text-slate-900 shadow-xs font-semibold"
                : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
            )}
          >
            <Trophy className="w-3.5 h-3.5 text-amber-500" />
            <span>Dish Leaderboards</span>
          </Link>
          <Link
            href="/dashboard"
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
              isDashboard
                ? "bg-white text-slate-900 shadow-xs font-semibold"
                : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
            )}
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-orange-600" />
            <span>Owner Dashboard</span>
          </Link>
        </nav>

        {/* Right Actions & Mobile Hamburger */}
        <div className="flex items-center gap-2">
          {!isDashboard && (
            <Link
              href="/dashboard"
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-all active:scale-95"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-amber-300" />
              <span>Owner Portal</span>
            </Link>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors border border-slate-200 shadow-2xs"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-slate-900" /> : <Menu className="w-5 h-5 text-slate-800" />}
          </button>
        </div>
      </div>

      {/* Unified Mobile Slide-Over Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden animate-in fade-in duration-200">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Content Panel */}
          <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-white shadow-2xl flex flex-col z-50 animate-in slide-in-from-right duration-250">
            {/* Drawer Header */}
            <div className="h-16 px-4 border-b border-slate-200 flex items-center justify-between shrink-0 bg-slate-50/70">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-stone-950 text-amber-400 border border-amber-500/30">
                  <Crown className="w-4 h-4" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="font-serif text-xs font-bold text-slate-900">Hotel Gypsy</span>
                  <span className="text-[9px] font-semibold text-amber-700 uppercase">Navigation</span>
                </div>
              </div>

              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-200/60"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Navigation List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-5">
              {/* Public Experience Links */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2">
                  Public Experience
                </span>
                <div className="space-y-1">
                  <Link
                    href={`/r/${venueSlug}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors",
                      isPublicMenu && !pathname.includes("/leaderboards")
                        ? "bg-orange-50 text-orange-950 border border-orange-200/70"
                        : "text-slate-700 hover:bg-slate-50"
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <QrCode className="w-4 h-4 text-orange-600" />
                      <span>Live Social Menu</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </Link>

                  <Link
                    href={`/r/${venueSlug}/leaderboards`}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors",
                      pathname.includes("/leaderboards")
                        ? "bg-amber-50 text-amber-950 border border-amber-200/70"
                        : "text-slate-700 hover:bg-slate-50"
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <Trophy className="w-4 h-4 text-amber-500" />
                      <span>Dish Leaderboards</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </Link>
                </div>
              </div>

              {/* Management Portal Links */}
              <div className="space-y-1.5 pt-3 border-t border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2">
                  Management Studio
                </span>
                <div className="space-y-1">
                  {managementNav.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                          "flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors",
                          isActive
                            ? "bg-slate-900 text-white font-semibold shadow-xs"
                            : "text-slate-700 hover:bg-slate-100/80"
                        )}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className={cn("w-4 h-4", isActive ? "text-orange-400" : "text-slate-500")} />
                          <span>{item.name}</span>
                        </div>
                        {isActive && <div className="w-1.5 h-1.5 rounded-full bg-orange-400" />}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Bottom Quick Switch Action */}
            <div className="p-4 border-t border-slate-200 bg-slate-50">
              <Link
                href={`/r/${venueSlug}`}
                target="_blank"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 px-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95"
              >
                <span>Preview Public Menu</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
