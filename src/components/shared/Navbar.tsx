"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  QrCode, 
  Utensils, 
  LayoutDashboard, 
  Trophy, 
  ExternalLink,
  Menu,
  X,
  Store,
  Sparkles,
  MessageSquare,
  Settings,
  Crown
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

  const isPublicMenu = pathname.startsWith("/r/");
  const isDashboard = pathname.startsWith("/dashboard");
  const venueSlug = restaurant?.slug || "gusto-trattoria";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur-sm">
      <div className="w-full max-w-7xl mx-auto flex h-16 items-center justify-between px-3 sm:px-6 lg:px-8">
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
        <nav className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
          <Link
            href={`/r/${venueSlug}`}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-colors",
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
              "flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-colors",
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
              "flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-colors",
              isDashboard
                ? "bg-white text-slate-900 shadow-xs font-semibold"
                : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
            )}
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-orange-600" />
            <span>Dashboard</span>
          </Link>
        </nav>

        {/* Right Actions & Mobile Hamburger */}
        <div className="flex items-center gap-2">
          {!isDashboard && (
            <Link
              href="/dashboard"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Owner Portal</span>
            </Link>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors border border-slate-200"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-3 shadow-lg animate-in slide-in-from-top-2 duration-150">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2">
              Public Experience
            </span>
            <Link
              href={`/r/${venueSlug}`}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors",
                isPublicMenu && !pathname.includes("/leaderboards")
                  ? "bg-slate-100 text-slate-950 font-semibold"
                  : "text-slate-600 hover:bg-slate-50"
              )}
            >
              <QrCode className="w-4 h-4 text-orange-600" />
              <span>Live Social Menu</span>
            </Link>
            <Link
              href={`/r/${venueSlug}/leaderboards`}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors",
                pathname.includes("/leaderboards")
                  ? "bg-slate-100 text-slate-950 font-semibold"
                  : "text-slate-600 hover:bg-slate-50"
              )}
            >
              <Trophy className="w-4 h-4 text-amber-500" />
              <span>Dish Leaderboards</span>
            </Link>
          </div>

          <div className="space-y-1 pt-2 border-t border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2">
              Management Portal
            </span>
            <Link
              href="/dashboard"
              className={cn(
                "flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors",
                pathname === "/dashboard"
                  ? "bg-slate-100 text-slate-950 font-semibold"
                  : "text-slate-600 hover:bg-slate-50"
              )}
            >
              <LayoutDashboard className="w-4 h-4 text-orange-600" />
              <span>Overview Analytics</span>
            </Link>
            <Link
              href="/dashboard/menu"
              className={cn(
                "flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors",
                pathname === "/dashboard/menu"
                  ? "bg-slate-100 text-slate-950 font-semibold"
                  : "text-slate-600 hover:bg-slate-50"
              )}
            >
              <Utensils className="w-4 h-4 text-slate-500" />
              <span>Menu Management</span>
            </Link>
            <Link
              href="/dashboard/reviews"
              className={cn(
                "flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors",
                pathname === "/dashboard/reviews"
                  ? "bg-slate-100 text-slate-950 font-semibold"
                  : "text-slate-600 hover:bg-slate-50"
              )}
            >
              <MessageSquare className="w-4 h-4 text-slate-500" />
              <span>Reviews & Replies</span>
            </Link>
            <Link
              href="/dashboard/qr-code"
              className={cn(
                "flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors",
                pathname === "/dashboard/qr-code"
                  ? "bg-slate-100 text-slate-950 font-semibold"
                  : "text-slate-600 hover:bg-slate-50"
              )}
            >
              <QrCode className="w-4 h-4 text-slate-500" />
              <span>QR Studio</span>
            </Link>
            <Link
              href="/dashboard/settings"
              className={cn(
                "flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors",
                pathname === "/dashboard/settings"
                  ? "bg-slate-100 text-slate-950 font-semibold"
                  : "text-slate-600 hover:bg-slate-50"
              )}
            >
              <Settings className="w-4 h-4 text-slate-500" />
              <span>Restaurant Settings</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
