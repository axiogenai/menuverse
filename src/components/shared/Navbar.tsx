"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { QrCode, Utensils, LayoutDashboard, Trophy, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { menuVerseStore } from "@/lib/seed-data";
import { Restaurant } from "@/types";

export function Navbar() {
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

  const isPublicMenu = pathname.startsWith("/r/");
  const isDashboard = pathname.startsWith("/dashboard");
  const venueSlug = restaurant?.slug || "my-restaurant";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-stone-200/80 bg-white/95 backdrop-blur-md shadow-xs">
      <div className="w-full max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-orange-600 via-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/25 group-hover:scale-105 group-hover:rotate-3 transition-transform duration-300">
            <Utensils className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-black tracking-tight text-stone-900 group-hover:text-orange-600 transition-colors">
              MenuVerse
            </span>
            <span className="text-[10px] font-bold text-orange-600 tracking-wider uppercase -mt-1">
              Social Dish Ecosystem
            </span>
          </div>
        </Link>

        {/* Center Nav */}
        <nav className="hidden md:flex items-center gap-1.5 bg-stone-100/90 p-1.5 rounded-2xl border border-stone-200/80">
          <Link
            href={`/r/${venueSlug}`}
            className={cn(
              "flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200",
              isPublicMenu && !pathname.includes("/leaderboards")
                ? "bg-white text-orange-600 shadow-xs scale-102 font-black"
                : "text-stone-600 hover:text-stone-950 hover:bg-white/60"
            )}
          >
            <QrCode className="w-3.5 h-3.5 text-orange-500" />
            <span>Live QR Menu</span>
          </Link>
          <Link
            href={`/r/${venueSlug}/leaderboards`}
            className={cn(
              "flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200",
              pathname.includes("/leaderboards")
                ? "bg-white text-orange-600 shadow-xs scale-102 font-black"
                : "text-stone-600 hover:text-stone-950 hover:bg-white/60"
            )}
          >
            <Trophy className="w-3.5 h-3.5 text-amber-500" />
            <span>Dish Leaderboards</span>
          </Link>
          <Link
            href="/dashboard"
            className={cn(
              "flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200",
              isDashboard
                ? "bg-white text-orange-600 shadow-xs scale-102 font-black"
                : "text-stone-600 hover:text-stone-950 hover:bg-white/60"
            )}
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-orange-500" />
            <span>Owner Portal</span>
          </Link>
        </nav>

        {/* Right Dynamic Action Button */}
        <div className="flex items-center gap-2">
          {isDashboard ? (
            <Link
              href={`/r/${venueSlug}`}
              target="_blank"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-600 text-white text-xs font-black shadow-md shadow-orange-600/20 hover:bg-orange-500 hover:scale-105 active:scale-95 transition-all duration-200"
            >
              <span>View Live Menu</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          ) : (
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-600 text-white text-xs font-black shadow-md shadow-orange-600/20 hover:bg-orange-500 hover:scale-105 active:scale-95 transition-all duration-200"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Owner Portal</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
