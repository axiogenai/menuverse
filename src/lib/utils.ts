import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: Number.isInteger(price) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(price);
}

export function formatRelativeTime(dateString: string | Date): string {
  const date = typeof dateString === "string" ? new Date(dateString) : dateString;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 604800)}w ago`;

  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function getSentimentColor(sentiment: "POSITIVE" | "NEUTRAL" | "NEGATIVE"): {
  bg: string;
  text: string;
  border: string;
  badge: string;
} {
  switch (sentiment) {
    case "POSITIVE":
      return {
        bg: "bg-emerald-500/10",
        text: "text-emerald-500",
        border: "border-emerald-500/20",
        badge: "bg-emerald-500 text-white",
      };
    case "NEGATIVE":
      return {
        bg: "bg-rose-500/10",
        text: "text-rose-500",
        border: "border-rose-500/20",
        badge: "bg-rose-500 text-white",
      };
    case "NEUTRAL":
    default:
      return {
        bg: "bg-amber-500/10",
        text: "text-amber-500",
        border: "border-amber-500/20",
        badge: "bg-amber-500 text-white",
      };
  }
}

export function getSpicyIcon(level: number): string {
  switch (level) {
    case 1:
      return "Mild";
    case 2:
      return "Medium Spice";
    case 3:
      return "Hot";
    case 4:
      return "Extra Fiery";
    default:
      return "";
  }
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
