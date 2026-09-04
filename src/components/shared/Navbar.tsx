"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
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
  ChevronRight,
  Star
} from "lucide-react";
import { cn } from "@/lib/utils";
import { menuVerseStore } from "@/lib/seed-data";
import { Restaurant } from "@/types";

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);

  const [isOwnerHost, setIsOwnerHost] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const h = window.location.hostname.toLowerCase();
      setIsOwnerHost(
        h === "owner-gypsy.vercel.app" ||
        h.startsWith("owner-") ||
        h.startsWith("owner.") ||
        h.startsWith("admin.") ||
        pathname.startsWith("/dashboard")
      );
    }
    const update = () => {
      const rest = menuVerseStore.getRestaurantBySlug();
      if (rest) setRestaurant({ ...rest });
    };
    update();
    const unsub = menuVerseStore.subscribe(update);
    return () => unsub();
  }, [pathname]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Automatically close mobile menu if screen resized to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Lock body scroll only when mobile menu is open on mobile screens
  useEffect(() => {
    if (mobileMenuOpen && window.innerWidth < 768) {
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

  // Owner dashboard navigation (ONLY shown when inside /dashboard)
  const managementNav = [
    { name: "Overview Analytics", href: "/dashboard", icon: LayoutDashboard },
    { name: "Menu Management", href: "/dashboard/menu", icon: UtensilsCrossed },
    { name: "Reviews & Replies", href: "/dashboard/reviews", icon: MessageSquareQuote },
    { name: "Google Reviews Sync", href: "/dashboard/google-reviews", icon: Globe },
    { name: "AI Insights", href: "/dashboard/ai-insights", icon: Cpu },
    { name: "Staff & Permissions", href: "/dashboard/staff", icon: Users },
    { name: "Restaurant Settings", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <>
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
              <UtensilsCrossed className="w-3.5 h-3.5 text-orange-600" />
              <span>Live Menu</span>
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
            {isOwnerHost && (
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
            )}
          </nav>

          {/* Right Actions & Mobile Hamburger */}
          <div className="flex items-center gap-2">
            {isOwnerHost && !isDashboard && (
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
              className="md:hidden p-2 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors border border-slate-200 shadow-2xs cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-slate-900" /> : <Menu className="w-5 h-5 text-slate-800" />}
            </button>
          </div>
        </div>
      </header>

      {/* STRICTLY MOBILE ONLY Slide Drawer (md:hidden) */}
      {mounted && mobileMenuOpen && createPortal(
        <div className="fixed inset-0 z-[99999] md:hidden">
          {/* Dimmed Backdrop */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Side Drawer Panel */}
          <div className="fixed inset-y-0 right-0 w-80 max-w-[85vw] h-full bg-white shadow-2xl flex flex-col z-50 animate-in slide-in-from-right duration-250">
            {/* Minimal Drawer Top Bar: Clean Close Button Only (No Duplicate Navbar, No Crown, No Restaurant Name) */}
            <div className="h-14 px-4 flex items-center justify-end shrink-0 bg-white border-b border-slate-100">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors border border-slate-200 cursor-pointer"
                aria-label="Close navigation"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Navigation Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-5 bg-slate-50/70">
              {/* CASE 1: USER IS ON PUBLIC LIVE MENU -> SHOW ONLY DINER/GUEST NAVIGATION */}
              {!isDashboard ? (
                <div className="space-y-3">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2">
                    Palace Dining
                  </div>
                  <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs divide-y divide-slate-100 overflow-hidden">
                    <Link
                      href={`/r/${venueSlug}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between p-3.5 hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                          <UtensilsCrossed className="w-4 h-4" />
                        </div>
                        <div className="text-left">
                          <div className="text-xs font-bold text-slate-900">Live Menu</div>
                          <div className="text-[10px] text-slate-500">Signature courses & dishes</div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                    </Link>

                    <Link
                      href={`/r/${venueSlug}/leaderboards`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between p-3.5 hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                          <Trophy className="w-4 h-4" />
                        </div>
                        <div className="text-left">
                          <div className="text-xs font-bold text-slate-900">Dish Leaderboards</div>
                          <div className="text-[10px] text-slate-500">Top-rated diner favorites</div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                    </Link>

                    <a
                      href="#google-reviews"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between p-3.5 hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                          <Star className="w-4 h-4 fill-blue-500" />
                        </div>
                        <div className="text-left">
                          <div className="text-xs font-bold text-slate-900">Google Customer Reviews</div>
                          <div className="text-[10px] text-slate-500">Verified diner feedback</div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                    </a>
                  </div>
                </div>
              ) : (
                /* CASE 2: USER IS INSIDE OWNER DASHBOARD -> SHOW MANAGEMENT NAVIGATION */
                <div className="space-y-3">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2">
                    Management Studio
                  </div>
                  <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs divide-y divide-slate-100 overflow-hidden">
                    {managementNav.map((item) => {
                      const Icon = item.icon;
                      const isActive = pathname === item.href;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={cn(
                            "flex items-center justify-between p-3 transition-colors",
                            isActive ? "bg-slate-900 text-white font-semibold" : "hover:bg-slate-50 text-slate-700"
                          )}
                        >
                          <div className="flex items-center gap-2.5">
                            <Icon className={cn("w-4 h-4 shrink-0", isActive ? "text-amber-400" : "text-slate-500")} />
                            <span className="text-xs font-semibold">{item.name}</span>
                          </div>
                          {isActive ? (
                            <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                          ) : (
                            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Context Action - Only for Dashboard Owner */}
            {isDashboard && (
              <div className="p-3.5 border-t border-slate-200 bg-white shrink-0">
                <Link
                  href={`/r/${venueSlug}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-95"
                >
                  <span>View Public Menu</span>
                  <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
                </Link>
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
