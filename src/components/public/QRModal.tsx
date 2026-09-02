"use client";

import React, { useEffect, useState } from "react";
import QRCode from "qrcode";
import { X, Download, QrCode } from "lucide-react";
import { Restaurant } from "@/types";
import { Button } from "@/components/ui/button";

interface QRModalProps {
  restaurant: Restaurant;
  isOpen: boolean;
  onClose: () => void;
}

export function QRModal({ restaurant, isOpen, onClose }: QRModalProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string>("");

  useEffect(() => {
    if (isOpen && typeof window !== "undefined") {
      const url = `${window.location.origin}/r/${restaurant.slug}`;
      QRCode.toDataURL(url, {
        width: 320,
        margin: 2,
        color: {
          dark: restaurant.settings?.qrFgColor || "#1c1917",
          light: restaurant.settings?.qrBgColor || "#ffffff",
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-stone-200 p-6 text-center space-y-5">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1">
          <div className="flex h-10 w-10 mx-auto items-center justify-center rounded-2xl bg-orange-50 text-orange-600 border border-orange-200">
            <QrCode className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-black text-stone-900">
            {restaurant.name}
          </h3>
          <p className="text-xs text-stone-500 font-medium">
            Scan with phone camera to open social menu
          </p>
        </div>

        {/* QR Frame Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-b from-orange-500 to-amber-500 text-white shadow-xl space-y-3">
          <span className="text-[11px] font-black uppercase tracking-widest block">
            {restaurant.settings?.qrFrameText || "SCAN FOR SOCIAL MENU"}
          </span>

          <div className="bg-white p-3 rounded-xl mx-auto shadow-inner flex items-center justify-center">
            {qrDataUrl ? (
              <img src={qrDataUrl} alt="MenuVerse QR Code" className="w-56 h-56 rounded-lg" />
            ) : (
              <div className="w-56 h-56 flex items-center justify-center text-xs text-stone-400 animate-pulse">
                Generating Vector QR...
              </div>
            )}
          </div>

          <span className="text-[10px] opacity-95 block font-bold">
            Discover Top Dishes • Real Diner Reviews • AI Summaries
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button
            onClick={handleDownload}
            className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-md hover:scale-105 active:scale-95 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Download QR</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
