"use client";

import React, { useState, useEffect } from "react";
import QRCode from "qrcode";
import { QrCode, Download, Printer, Palette, Sparkles } from "lucide-react";
import { Restaurant } from "@/types";
import { menuVerseStore } from "@/lib/seed-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function QRStudioPage() {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(
    () => menuVerseStore.getRestaurantBySlug() || null
  );
  const [fgColor, setFgColor] = useState("#1c1917");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [frameText, setFrameText] = useState("SCAN FOR SOCIAL MENU");
  const [qrDataUrl, setQrDataUrl] = useState<string>("");

  useEffect(() => {
    const update = () => {
      const rest = menuVerseStore.getRestaurantBySlug();
      if (rest) {
        setRestaurant({ ...rest });
        if (rest.settings) {
          setFgColor(rest.settings.qrFgColor || "#1c1917");
          setBgColor(rest.settings.qrBgColor || "#ffffff");
          setFrameText(rest.settings.qrFrameText || "SCAN FOR SOCIAL MENU");
        }
      }
    };
    update();
    const unsub = menuVerseStore.subscribe(update);
    return () => unsub();
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && restaurant) {
      const publicUrl = `${window.location.origin}/r/${restaurant.slug}`;
      QRCode.toDataURL(publicUrl, {
        width: 400,
        margin: 2,
        color: {
          dark: fgColor,
          light: bgColor,
        },
      })
        .then(setQrDataUrl)
        .catch(console.error);
    }
  }, [restaurant, fgColor, bgColor]);

  if (!restaurant) return null;

  const handleDownload = (type: "stand" | "qr") => {
    if (type === "qr") {
      const link = document.createElement("a");
      link.download = `${restaurant.slug}-qr-code.png`;
      link.href = qrDataUrl;
      link.click();
      return;
    }

    // Generate Full Composite Acrylic Stand Card on Canvas
    const canvas = document.createElement("canvas");
    canvas.width = 800;
    canvas.height = 1100;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Draw Gradient Background
    const grad = ctx.createLinearGradient(0, 0, 0, 1100);
    grad.addColorStop(0, "#ea580c");
    grad.addColorStop(0.5, "#f97316");
    grad.addColorStop(1, "#f59e0b");
    ctx.fillStyle = grad;
    ctx.roundRect(40, 40, 720, 1020, 36);
    ctx.fill();

    // Border
    ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
    ctx.lineWidth = 4;
    ctx.roundRect(40, 40, 720, 1020, 36);
    ctx.stroke();

    // Top Frame Text
    ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
    ctx.font = "bold 24px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(frameText.toUpperCase(), 400, 110);

    // Restaurant Name
    ctx.fillStyle = "#ffffff";
    ctx.font = "900 42px sans-serif";
    ctx.fillText(restaurant.name, 400, 165);

    // White QR Container Card
    ctx.fillStyle = "#ffffff";
    ctx.roundRect(140, 210, 520, 520, 32);
    ctx.fill();

    // Draw QR Code inside
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = qrDataUrl;
    img.onload = () => {
      ctx.drawImage(img, 170, 240, 460, 460);

      // Subtext
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 26px sans-serif";
      ctx.fillText("Discover Standout Dishes & Real Diner Reviews", 400, 800);

      ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
      ctx.font = "500 20px sans-serif";
      ctx.fillText("Permanent Reviews • Verified Diner Photos • AI Taste Insights", 400, 845);

      // Footer
      ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
      ctx.font = "bold 18px sans-serif";
      ctx.fillText("POWERED BY MENUVERSE SOCIAL DINING", 400, 980);

      const link = document.createElement("a");
      link.download = `${restaurant.slug}-acrylic-table-stand.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-stone-900 flex items-center gap-2">
          <QrCode className="w-6 h-6 text-orange-600" />
          Single QR Studio & Merchandising
        </h1>
        <p className="text-xs text-stone-500 font-medium">
          A single QR code directs every diner to your interactive social menu without confusing table-specific URLs.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: QR Customizer Controls (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="p-6 rounded-3xl bg-white border border-stone-200/90 shadow-sm space-y-4">
            <h3 className="text-base font-black text-stone-900 flex items-center gap-2">
              <Palette className="w-4 h-4 text-orange-600" />
              QR Branding & Theme
            </h3>

            {/* Frame Text */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700">
                Call-to-Action Frame Header
              </label>
              <Input
                value={frameText}
                onChange={(e) => setFrameText(e.target.value)}
                placeholder="SCAN FOR SOCIAL MENU"
                className="bg-white border-stone-200 text-stone-900 shadow-xs"
              />
            </div>

            {/* Foreground Color Presets */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700">
                QR Matrix Color
              </label>
              <div className="flex gap-2">
                {[
                  { label: "Obsidian", hex: "#1c1917" },
                  { label: "Navy", hex: "#0f172a" },
                  { label: "Rustic Brown", hex: "#451a03" },
                  { label: "Dark Burgundy", hex: "#4c0519" },
                ].map((c) => (
                  <button
                    key={c.hex}
                    onClick={() => setFgColor(c.hex)}
                    className={`h-9 flex-1 rounded-xl text-[11px] font-bold border transition-all text-white ${
                      fgColor === c.hex
                        ? "border-orange-500 ring-2 ring-orange-500/30"
                        : "border-stone-300"
                    }`}
                    style={{ backgroundColor: c.hex }}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Background Color Presets */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700">
                Background Fill
              </label>
              <div className="flex gap-2">
                {[
                  { label: "Pure White", hex: "#ffffff" },
                  { label: "Soft Cream", hex: "#fefce8" },
                  { label: "Warm Stone", hex: "#f5f5f4" },
                ].map((c) => (
                  <button
                    key={c.hex}
                    onClick={() => setBgColor(c.hex)}
                    className={`h-9 flex-1 rounded-xl text-[11px] font-bold border transition-all text-stone-900 ${
                      bgColor === c.hex
                        ? "border-orange-500 ring-2 ring-orange-500/30"
                        : "border-stone-300 opacity-80"
                    }`}
                    style={{ backgroundColor: c.hex }}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Download Buttons */}
            <div className="pt-3 border-t border-stone-100 space-y-2">
              <Button
                onClick={() => handleDownload("stand")}
                className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-md shadow-orange-600/20 hover:scale-105 active:scale-95 transition-all"
              >
                <Printer className="w-4 h-4" />
                <span>Export Print-Ready Acrylic Stand (PNG)</span>
              </Button>

              <Button
                onClick={() => handleDownload("qr")}
                variant="outline"
                className="w-full font-bold rounded-2xl border-stone-200 bg-white text-stone-700 hover:bg-stone-50 shadow-xs"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Raw Vector QR (.PNG)
              </Button>
            </div>
          </div>
        </div>

        {/* Right Column: Live Stand & Table Card Preview (7 cols) */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center p-8 rounded-3xl bg-white border border-stone-200/90 shadow-sm">
          <span className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-4">
            Live Print Preview: Table Tent Card & Stand
          </span>

          {/* Acrylic Stand Card */}
          <div className="relative w-80 rounded-3xl bg-gradient-to-b from-orange-600 via-orange-500 to-amber-500 p-6 text-white text-center shadow-2xl space-y-4 border-2 border-white/20">
            <div className="space-y-1">
              <span className="text-xs font-black tracking-widest uppercase block opacity-95">
                {frameText}
              </span>
              <h2 className="text-xl font-black text-white">
                {restaurant.name}
              </h2>
            </div>

            <div className="p-4 bg-white rounded-2xl shadow-xl mx-auto flex items-center justify-center">
              {qrDataUrl ? (
                <img src={qrDataUrl} alt="QR Code" className="w-48 h-48 rounded-lg" />
              ) : (
                <div className="w-48 h-48 flex items-center justify-center text-xs text-stone-400">
                  Generating...
                </div>
              )}
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-center gap-1 text-[11px] font-bold">
                <span>Discover Standout Dishes Before Ordering</span>
              </div>
              <p className="text-[9px] opacity-90 font-medium">
                Real Diner Photos • Permanent Reviews • AI Taste Trajectory
              </p>
            </div>
          </div>

          {/* Stand Wooden Base */}
          <div className="w-88 h-5 bg-stone-300 rounded-b-xl border-t border-stone-400 shadow-md -mt-1" />
        </div>
      </div>
    </div>
  );
}
