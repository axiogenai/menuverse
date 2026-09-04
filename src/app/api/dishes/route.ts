import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { menuVerseStore } from "@/lib/seed-data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const dishId = searchParams.get("id");

  if (!dishId) {
    return NextResponse.json({ error: "dishId is required" }, { status: 400 });
  }

  try {
    const dish = await prisma.menuItem.findUnique({
      where: { id: dishId },
      include: {
        images: { orderBy: { displayOrder: "asc" } },
        statistics: true,
        reviews: {
          where: { moderationStatus: "APPROVED" },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (dish) {
      return NextResponse.json({ source: "SUPABASE_POSTGRES", data: dish });
    }
  } catch (err) {
    console.warn("Prisma dish query failed, using local store:", err);
  }

  const fallback = menuVerseStore.getDishById(dishId);
  if (!fallback) {
    return NextResponse.json({ error: "Dish not found" }, { status: 404 });
  }

  return NextResponse.json({ source: "STORE_CACHE", data: fallback });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      description,
      price,
      currency = "INR",
      categoryId,
      restaurantId = "rest-01",
      isVegetarian = false,
      isVegan = false,
      isGlutenFree = false,
      spicyLevel = 0,
      isSignature = false,
      isChefSpecial = false,
      images = [],
    } = body;

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

    // 1. Save to Supabase PostgreSQL
    try {
      const created = await prisma.menuItem.create({
        data: {
          name,
          slug,
          description,
          price: Number(price),
          currency,
          categoryId,
          restaurantId,
          isVegetarian,
          isVegan,
          isGlutenFree,
          spicyLevel,
          isSignature,
          isChefSpecial,
          images: {
            create: images.map((img: any, idx: number) => ({
              url: typeof img === "string" ? img : img.url,
              isPrimary: idx === 0,
              displayOrder: idx + 1,
            })),
          },
          statistics: {
            create: {
              totalRatings: 0,
              averageRating: 5.0,
              totalReviews: 0,
            },
          },
        },
        include: {
          images: true,
          statistics: true,
        },
      });

      // Keep in-memory store in sync
      menuVerseStore.addDish({
        name: created.name,
        slug: created.slug,
        description: created.description || undefined,
        price: created.price,
        currency: created.currency,
        categoryId: created.categoryId,
        restaurantId: created.restaurantId,
        isVegetarian: created.isVegetarian,
        isVegan: created.isVegan,
        isGlutenFree: created.isGlutenFree,
        spicyLevel: created.spicyLevel,
        isSignature: created.isSignature,
        isChefSpecial: created.isChefSpecial,
        isAvailable: created.isAvailable,
        ingredients: [],
        allergens: [],
        displayOrder: created.displayOrder || 1,
        images: created.images.map((img) => ({ id: img.id, menuItemId: img.menuItemId, url: img.url, isPrimary: img.isPrimary, displayOrder: img.displayOrder })),
      });

      return NextResponse.json({ source: "SUPABASE_POSTGRES", data: created }, { status: 201 });
    } catch (dbErr) {
      console.warn("Prisma dish create failed, writing to in-memory store:", dbErr);
    }

    const dish = menuVerseStore.addDish(body);
    return NextResponse.json({ source: "STORE_CACHE", data: dish }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
  }
}
