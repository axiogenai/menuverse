import type { Metadata } from "next";
import "@/styles/globals.css";
import { Navbar } from "@/components/shared/Navbar";

export const metadata: Metadata = {
  title: "MenuVerse | Restaurant Social Discovery & Dish Reputation Ecosystem",
  description:
    "Transform static QR menus into a vibrant restaurant social discovery ecosystem. Discover the best dishes before ordering through real diner reviews, customer photos, AI taste summaries, and trend leaderboards.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#faf8f5] text-stone-900 font-sans antialiased selection:bg-orange-500/20 selection:text-orange-600">
        <div className="relative flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}
