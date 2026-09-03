"use client";

import React, { useEffect, useState } from "react";
import QRCode from "qrcode";
import { X, Download, QrCode, Copy, Check } from "lucide-react";
import { Restaurant } from "@/types";
import { Button } from "@/components/ui/button";

interface QRModalProps {
  restaurant: Restaurant;
  isOpen: boolean;
  onClose: () => void;
}

export function QRModal({ restaurant, isOpen, onClose }: QRModalProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen && typeof window !== "undefined") {
      const url = `${window.location.origin}/r/${restaurant.slug}`;
      QRCode.toDataURL(url, {
        width: 360,
        margin: 1,
        errorCorrectionLevel: "H",
        color: {
          dark: "#09090b",
          light: "#ffffff",
        },
      })
        .then(setQrDataUrl)
        .catch(console.error);
    }
  }, [isOpen, restaurant]);

  if (!isOpen) return null;

  const handleDownload = () => {
    const link = document.createElement("a");
    link.download = `${restaurant.slug}-menuverse-qr.png`;
    link.href = qrDataUrl;
    link.click();
  };

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(`${window.location.origin}/r/${restaurant.slug}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm bg-[#faf8f5] rounded-3xl shadow-2xl border border-stone-200/90 p-5 sm:p-6 text-center space-y-4">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-1">
          <div className="flex h-9 w-9 mx-auto items-center justify-center rounded-xl bg-amber-500/10 text-amber-700 border border-amber-500/20">
            <QrCode className="w-4 h-4" />
          </div>
          <h3 className="text-base font-bold text-stone-900">
            {restaurant.name}
          </h3>
          <p className="text-[11px] text-stone-500">
            Scan to explore top-rated dishes & real diner photography
          </p>
        </div>

        {/* 5-Star Luxury Obsidian & Gold Table Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-b from-stone-900 via-stone-900 to-black text-white shadow-xl border border-amber-500/30 space-y-3 relative overflow-hidden">
          {/* Subtle Ambient Gold Glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="space-y-0.5">
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400/90 block">
              Official Social Menu
            </span>
            <span className="text-xs font-bold text-stone-200 block truncate">
              {restaurant.name}
            </span>
          </div>

          {/* Elevated Crisp White QR Plaque with Gold Rim */}
          <div className="bg-white p-3 rounded-xl mx-auto shadow-lg border-2 border-amber-400/40 flex items-center justify-center relative max-w-[220px]">
            {qrDataUrl ? (
              <img src={qrDataUrl} alt="MenuVerse QR Code" className="w-48 h-48 rounded-lg" />
            ) : (
              <div className="w-48 h-48 flex items-center justify-center text-xs text-stone-400 animate-pulse">
                Generating Vector QR...
              </div>
            )}
          </div>

          <div className="space-y-0.5">
            <span className="text-[10px] text-stone-300 font-medium block">
              Point your camera to scan & browse live
            </span>
            <span className="text-[9px] text-amber-400/80 font-semibold block">
              ★ Verified Diner Photos • Real-Time Reviews • Taste Ratings ★
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <Button
            onClick={handleCopyLink}
            variant="outline"
            className="h-10 bg-white hover:bg-stone-50 border-stone-200 text-stone-700 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-2xs"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600 font-bold" />
                <span className="text-emerald-600">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-stone-500" />
                <span>Copy Link</span>
              </>
            )}
          </Button>

          <Button
            onClick={handleDownload}
            className="h-10 bg-stone-900 hover:bg-black text-amber-300 border border-amber-500/40 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-md"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span>Download</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
