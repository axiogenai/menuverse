"use client";

import React, { useState, useEffect } from "react";
import QRCode from "qrcode";
import { QrCode, Download, Printer, Check, Layers, Camera, Scan } from "lucide-react";
import { Restaurant } from "@/types";
import { menuVerseStore } from "@/lib/seed-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type StandTheme = "obsidian" | "slate" | "linen";

const MATRIX_COLORS = [
  { label: "Onyx", hex: "#0f172a" },
  { label: "Charcoal", hex: "#1e293b" },
  { label: "Espresso", hex: "#3b1d11" },
  { label: "Wine", hex: "#4c0519" },
];

export default function QRStudioPage() {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [theme, setTheme] = useState<StandTheme>("obsidian");
  const [fgColor, setFgColor] = useState("#0f172a");
  const [frameText, setFrameText] = useState("SCAN FOR DIGITAL MENU");
  const [qrDataUrl, setQrDataUrl] = useState<string>("");

  useEffect(() => {
    const update = () => {
      const rest = menuVerseStore.getRestaurantBySlug();
      if (rest) setRestaurant({ ...rest });
    };
    update();
    const unsub = menuVerseStore.subscribe(update);
    return () => unsub();
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && restaurant) {
      const publicUrl = `${window.location.origin}/r/${restaurant.slug}`;
      QRCode.toDataURL(publicUrl, {
        width: 600,
        margin: 1,
        errorCorrectionLevel: "H",
        color: {
          dark: fgColor,
          light: "#ffffff",
        },
      })
        .then(setQrDataUrl)
        .catch(console.error);
    }
  }, [restaurant, fgColor]);

  if (!restaurant) return null;

  const handleDownload = (type: "stand" | "qr") => {
    if (type === "qr") {
      const link = document.createElement("a");
      link.download = `${restaurant.slug}-qr-code.png`;
      link.href = qrDataUrl;
      link.click();
      return;
    }

    // High-Res Print-Ready Stand Card on Canvas (1200x1700 300DPI)
    const canvas = document.createElement("canvas");
    canvas.width = 1200;
    canvas.height = 1700;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const isObsidian = theme === "obsidian";
    const isSlate = theme === "slate";
    const isLinen = theme === "linen";

    // Stand Background
    if (isObsidian) {
      const grad = ctx.createLinearGradient(0, 0, 0, 1700);
      grad.addColorStop(0, "#090d16");
      grad.addColorStop(1, "#020617");
      ctx.fillStyle = grad;
    } else if (isSlate) {
      const grad = ctx.createLinearGradient(0, 0, 0, 1700);
      grad.addColorStop(0, "#1e293b");
      grad.addColorStop(1, "#0f172a");
      ctx.fillStyle = grad;
    } else {
      ctx.fillStyle = "#fafaf9";
    }

    ctx.roundRect(60, 60, 1080, 1580, 48);
    ctx.fill();

    // Subtle Card Border
    ctx.strokeStyle = isLinen ? "rgba(0, 0, 0, 0.08)" : "rgba(255, 255, 255, 0.12)";
    ctx.lineWidth = 3;
    ctx.roundRect(60, 60, 1080, 1580, 48);
    ctx.stroke();

    // Frame CTA Subheader
    ctx.fillStyle = isLinen ? "#64748b" : "#94a3b8";
    ctx.font = "600 24px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(frameText.toUpperCase(), 600, 170);

    // Restaurant Title
    ctx.fillStyle = isLinen ? "#0f172a" : "#ffffff";
    ctx.font = "bold 56px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    ctx.fillText(restaurant.name, 600, 250);

    // White QR Backing Plaque
    ctx.fillStyle = "#ffffff";
    ctx.shadowColor = "rgba(0, 0, 0, 0.15)";
    ctx.shadowBlur = 30;
    ctx.shadowOffsetY = 15;
    ctx.roundRect(225, 330, 750, 750, 40);
    ctx.fill();
    ctx.shadowColor = "transparent";

    // Draw QR Code
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = qrDataUrl;
    img.onload = () => {
      ctx.drawImage(img, 275, 380, 650, 650);

      // Center Brand Monogram Badge on Canvas
      ctx.fillStyle = "#ffffff";
      ctx.shadowColor = "rgba(0, 0, 0, 0.2)";
      ctx.shadowBlur = 15;
      ctx.roundRect(540, 645, 120, 120, 24);
      ctx.fill();
      ctx.shadowColor = "transparent";

      ctx.fillStyle = "#020617";
      ctx.roundRect(550, 655, 100, 100, 20);
      ctx.fill();

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 48px serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(restaurant.name.charAt(0), 600, 705);
      ctx.textBaseline = "alphabetic";

      // Bottom Discovery Headline
      ctx.fillStyle = isLinen ? "#0f172a" : "#ffffff";
      ctx.font = "600 32px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
      ctx.fillText("Discover Standout Dishes & Guest Photography", 600, 1200);

      // Sub-bullet metadata
      ctx.fillStyle = isLinen ? "#64748b" : "#94a3b8";
      ctx.font = "400 24px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
      ctx.fillText("Instant Digital Menu  •  Verified Diner Reviews  •  Dietary Badges", 600, 1260);

      // Brand Footer
      ctx.fillStyle = isLinen ? "#94a3b8" : "#64748b";
      ctx.font = "500 20px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
      ctx.fillText("POWERED BY MENUVERSE SOCIAL DINING", 600, 1520);

      const link = document.createElement("a");
      link.download = `${restaurant.slug}-table-stand-${theme}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          <QrCode className="w-5 h-5 text-slate-700" />
          QR Studio & Table Merchandising
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Generate print-ready acrylic table tent stands and instant vector QR codes for your restaurant tables.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: QR Customizer Controls (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-xl bg-white border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-4">
            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-slate-600" />
              Table Stand Configuration
            </h3>

            {/* Stand Theme Segmented Track */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Stand Theme
              </label>
              <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 rounded-lg border border-slate-200/70">
                {[
                  { id: "obsidian", label: "Obsidian Noir" },
                  { id: "slate", label: "Slate" },
                  { id: "linen", label: "Pure Linen" },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTheme(t.id as StandTheme)}
                    className={cn(
                      "py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer text-center",
                      theme === t.id
                        ? "bg-white text-slate-900 font-semibold shadow-xs"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/40"
                    )}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Frame Text Header */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Top Frame Header
              </label>
              <Input
                value={frameText}
                onChange={(e) => setFrameText(e.target.value)}
                placeholder="SCAN FOR DIGITAL MENU"
                className="bg-white border-slate-200 text-slate-900 text-xs shadow-2xs h-8.5"
              />
            </div>

            {/* QR Matrix Color Presets - Matching Segmented Design */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                QR Matrix Color
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 p-1 bg-slate-100 rounded-lg border border-slate-200/70">
                {MATRIX_COLORS.map((c) => (
                  <button
                    key={c.hex}
                    type="button"
                    onClick={() => setFgColor(c.hex)}
                    className={cn(
                      "py-1.5 px-2 text-xs font-medium rounded-md transition-all cursor-pointer flex items-center justify-center gap-1.5",
                      fgColor === c.hex
                        ? "bg-white text-slate-900 font-semibold shadow-xs ring-1 ring-slate-200/80"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/40"
                    )}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0 border border-black/15 shadow-2xs"
                      style={{ backgroundColor: c.hex }}
                    />
                    <span className="text-[11px] whitespace-nowrap">{c.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Action Download Buttons */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <Button
                onClick={() => handleDownload("stand")}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg h-9 text-xs shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <Printer className="w-3.5 h-3.5 text-slate-300" />
                <span>Export Print-Ready Stand (PNG)</span>
              </Button>

              <Button
                onClick={() => handleDownload("qr")}
                variant="outline"
                className="w-full font-semibold rounded-lg h-9 text-xs border-slate-200 bg-white text-slate-700 hover:bg-slate-50 cursor-pointer shadow-2xs flex items-center justify-center gap-2"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
                <span>Download Raw Vector QR (.PNG)</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Right Column: Realistic Luxury Table Tent Stand Preview (7 cols) */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center p-4 sm:p-10 rounded-xl bg-slate-50/80 border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-6">
            Live Table Stand Preview
          </span>

          {/* Luxury Table Tent Card */}
          <div
            className={cn(
              "relative w-full max-w-[320px] rounded-2xl p-5 sm:p-6 text-center shadow-[0_20px_45px_-12px_rgba(0,0,0,0.18)] space-y-4 border transition-all duration-300",
              theme === "obsidian"
                ? "bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white border-slate-800"
                : theme === "slate"
                ? "bg-gradient-to-b from-slate-800 via-slate-800 to-slate-900 text-white border-slate-700"
                : "bg-stone-50 text-slate-900 border-stone-200/90"
            )}
          >
            {/* Header info */}
            <div className="space-y-1">
              <span
                className={cn(
                  "text-[10px] font-semibold tracking-[0.2em] uppercase block",
                  theme === "linen" ? "text-slate-400" : "text-slate-400"
                )}
              >
                {frameText}
              </span>
              <h2
                className={cn(
                  "text-lg font-bold tracking-tight",
                  theme === "linen" ? "text-slate-900" : "text-white"
                )}
              >
                {restaurant.name}
              </h2>
            </div>

            {/* Luxury Precision QR Plaque with Center Monogram & Scanner Reticles */}
            <div className="relative p-3.5 bg-white rounded-2xl shadow-[0_10px_25px_rgba(0,0,0,0.12)] mx-auto inline-block border border-slate-100">
              {/* Precision Corner Reticles */}
              <div className="absolute top-2 left-2 w-2.5 h-2.5 border-t-2 border-l-2 border-slate-900 rounded-tl-xs pointer-events-none" />
              <div className="absolute top-2 right-2 w-2.5 h-2.5 border-t-2 border-r-2 border-slate-900 rounded-tr-xs pointer-events-none" />
              <div className="absolute bottom-2 left-2 w-2.5 h-2.5 border-b-2 border-l-2 border-slate-900 rounded-bl-xs pointer-events-none" />
              <div className="absolute bottom-2 right-2 w-2.5 h-2.5 border-b-2 border-r-2 border-slate-900 rounded-br-xs pointer-events-none" />

              <div className="relative w-44 h-44 flex items-center justify-center p-1">
                {qrDataUrl ? (
                  <img src={qrDataUrl} alt="QR Code" className="w-full h-full object-contain rounded-md" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">
                    Generating QR Matrix...
                  </div>
                )}

                {/* Central Restaurant Monogram Brand Badge */}
                {qrDataUrl && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-8 h-8 rounded-lg bg-white shadow-md border border-slate-200/90 flex items-center justify-center p-0.5">
                      <div className="w-full h-full rounded-md bg-slate-950 flex items-center justify-center text-white font-serif font-black text-xs tracking-tight">
                        {restaurant.name.charAt(0)}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Subtext info */}
            <div className="space-y-1 pt-0.5">
              <p
                className={cn(
                  "text-xs font-semibold",
                  theme === "linen" ? "text-slate-800" : "text-slate-200"
                )}
              >
                Discover Standout Dishes & Reviews
              </p>
              <p
                className={cn(
                  "text-[10px]",
                  theme === "linen" ? "text-slate-500" : "text-slate-400"
                )}
              >
                Instant Digital Menu  •  Verified Photos
              </p>
            </div>
          </div>

          {/* Minimalist Matte Stand Base */}
          <div
            className={cn(
              "w-60 h-2.5 rounded-full shadow-md -mt-1 mx-auto border transition-colors",
              theme === "linen"
                ? "bg-stone-300 border-stone-400/60"
                : "bg-slate-800 border-slate-700"
            )}
          />
        </div>
      </div>
    </div>
  );
}
