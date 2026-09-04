import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { menuVerseStore } from "@/lib/seed-data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug") || "hotel-gypsy";

  try {
    const restaurant = await prisma.restaurant.findUnique({
      where: { slug },
      include: {
        settings: true,
        categories: {
          orderBy: { displayOrder: "asc" },
        },
        menuItems: {
          include: {
            images: { orderBy: { displayOrder: "asc" } },
            statistics: true,
            reviews: {
              where: { moderationStatus: "APPROVED" },
              orderBy: { createdAt: "desc" },
            },
          },
          orderBy: { displayOrder: "asc" },
        },
        reviews: {
          where: { moderationStatus: "APPROVED" },
          orderBy: { createdAt: "desc" },
        },
        googleReviews: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (restaurant) {
      return NextResponse.json({ source: "SUPABASE_POSTGRES", data: restaurant });
    }
  } catch (dbError) {
    console.warn("Prisma restaurant query failed, using local fallback:", dbError);
  }

  // Fallback to in-memory store if offline
  const fallback = menuVerseStore.getRestaurantBySlug(slug);
  if (!fallback) {
    return NextResponse.json({ error: "Restaurant not found" }, { status: 404 });
  }
  return NextResponse.json({ source: "STORE_CACHE", data: fallback });
}
