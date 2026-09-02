import { NextResponse } from "next/server";
import { menuVerseStore } from "@/lib/seed-data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const dishId = searchParams.get("id");

  if (!dishId) {
    return NextResponse.json({ error: "dishId is required" }, { status: 400 });
  }

  const dish = menuVerseStore.getDishById(dishId);
  if (!dish) {
    return NextResponse.json({ error: "Dish not found" }, { status: 404 });
  }

  return NextResponse.json({ data: dish });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const dish = menuVerseStore.addDish(body);
    return NextResponse.json({ data: dish }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
  }
}
