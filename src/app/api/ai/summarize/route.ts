import { NextResponse } from "next/server";
import { generateDishAISummary } from "@/lib/ai/sentiment";
import { menuVerseStore } from "@/lib/seed-data";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { dishId } = body;

    const dish = menuVerseStore.getDishById(dishId);
    if (!dish) {
      return NextResponse.json({ error: "Dish not found" }, { status: 404 });
    }

    const summary = generateDishAISummary(dish.name, dish.reviews || []);
    return NextResponse.json({ data: summary });
  } catch (error) {
    return NextResponse.json({ error: "Failed to generate summary" }, { status: 500 });
  }
}
