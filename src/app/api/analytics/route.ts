import { NextResponse } from "next/server";
import { menuVerseStore } from "@/lib/seed-data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const restaurantId = searchParams.get("restaurantId") || "rest-gusto-01";

  const summary = menuVerseStore.getAnalyticsSummary(restaurantId);
  return NextResponse.json({ data: summary });
}
