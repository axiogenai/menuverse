"use client";

import React from "react";
import { Restaurant } from "@/types";

interface RestaurantFooterProps {
  restaurant?: Restaurant | null;
  onOpenQRModal?: () => void;
}

export function RestaurantFooter(_props?: RestaurantFooterProps) {
  return (
    <footer className="w-full pt-3 pb-1 flex items-center justify-center">
      <a
        href="https://team.axiogen.in"
        target="_blank"
        rel="noopener noreferrer"
        className="text-[11px] sm:text-xs font-bold tracking-wide text-amber-700 hover:text-amber-800 transition-colors cursor-pointer"
      >
        team.axiogen.in
      </a>
    </footer>
  );
}
