import { NextResponse } from "next/server";
import { menuVerseStore } from "@/lib/seed-data";
import { analyzeReviewSentiment, screenReviewContent } from "@/lib/ai/sentiment";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { menuItemId, restaurantId, displayName, rating, reviewText, images, tasteRating, portionRating, valueRating } = body;

    if (!menuItemId || !restaurantId || !reviewText || !rating) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const moderation = screenReviewContent(reviewText);
    const sentiment = analyzeReviewSentiment(reviewText, rating);

    const review = menuVerseStore.addReview({
      menuItemId,
      restaurantId,
      displayName: displayName || "Anonymous Diner",
      avatarUrl: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(displayName || "Diner")}`,
      rating,
      reviewText,
      aiSentiment: sentiment.sentiment,
      sentimentScore: sentiment.score,
      tasteRating,
      portionRating,
      valueRating,
      moderationStatus: moderation.flagged ? "FLAGGED" : "APPROVED",
      moderationReason: moderation.reason,
      isGoogleReview: false,
      images: images || [],
    });

    return NextResponse.json({ data: review }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create review" }, { status: 500 });
  }
}
