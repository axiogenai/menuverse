import { NextResponse } from "next/server";
import { generateDishAISummary } from "@/lib/ai/sentiment";
import { generateGroqDishSummary } from "@/lib/ai/groq";
import { menuVerseStore } from "@/lib/seed-data";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { dishId } = body;

    const dish = menuVerseStore.getDishById(dishId);
    if (!dish) {
      return NextResponse.json({ error: "Dish not found" }, { status: 404 });
    }

    const reviews = dish.reviews || [];

    // 1. Try real LLM synthesis via Groq (Llama 3.3 70B)
    if (process.env.GROQ_API_KEY) {
      const groqSummary = await generateGroqDishSummary(
        dish.name,
        reviews.map((r) => ({ authorName: r.displayName, text: r.reviewText, rating: r.rating }))
      );

      if (groqSummary) {
        return NextResponse.json({
          source: "GROQ_LLAMA_3_3",
          data: {
            menuItemId: dish.id,
            summaryText: groqSummary.summaryText,
            positiveHighlights: groqSummary.positiveHighlights || [],
            improvementSuggestions: groqSummary.improvementSuggestions || [],
            flavorProfile: groqSummary.flavorProfile || [],
            confidenceScore: 0.98,
            lastSynthesizedAt: new Date().toISOString(),
          },
        });
      }
    }

    // 2. Fallback to local NLP sentiment analysis
    const summary = generateDishAISummary(dish.name, reviews);
    return NextResponse.json({ source: "LOCAL_NLP", data: summary });
  } catch (error) {
    console.error("AI Summarize error:", error);
    return NextResponse.json({ error: "Failed to generate summary" }, { status: 500 });
  }
}
