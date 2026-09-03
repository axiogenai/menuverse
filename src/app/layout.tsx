import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Playfair_Display, Cormorant_Garamond } from "next/font/google";
import "@/styles/globals.css";
import { Navbar } from "@/components/shared/Navbar";
import { ScrollIndicator } from "@/components/shared/ScrollIndicator";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-serif",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-luxury",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Hotel Gypsy | 5-Star Luxury Palace Dining & Social Menu",
  description:
    "Explore the official 5-star live social menu of Hotel Gypsy. Discover chef signatures, real diner reviews, 4K customer photos, and trend rankings.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${plusJakarta.variable} ${playfair.variable} ${cormorant.variable}`} suppressHydrationWarning>
      <body className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased selection:bg-amber-500/20 selection:text-amber-700" suppressHydrationWarning>
        <div className="relative flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1">{children}</main>
          <ScrollIndicator />
        </div>
      </body>
    </html>
  );
}
