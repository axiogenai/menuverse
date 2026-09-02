import { NextResponse } from "next/server";
import { menuVerseStore } from "@/lib/seed-data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");

  if (slug) {
    const restaurant = menuVerseStore.getRestaurantBySlug(slug);
    if (!restaurant) {
      return NextResponse.json({ error: "Restaurant not found" }, { status: 404 });
    }
    return NextResponse.json({ data: restaurant });
  }

  const restaurants = menuVerseStore.getRestaurants();
  return NextResponse.json({ data: restaurants });
}
