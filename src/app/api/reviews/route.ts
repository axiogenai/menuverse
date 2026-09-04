import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { menuVerseStore } from "@/lib/seed-data";
import { analyzeReviewSentiment, screenReviewContent } from "@/lib/ai/sentiment";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { menuItemId, restaurantId = "rest-01", displayName, rating, reviewText, images, tasteRating, portionRating, valueRating } = body;

    if (!menuItemId || !restaurantId || !reviewText || !rating) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const moderation = screenReviewContent(reviewText);
    const sentiment = analyzeReviewSentiment(reviewText, rating);
    const avatarUrl = `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(displayName || "Diner")}`;

    // 1. Save to Supabase PostgreSQL
    try {
      const createdReview = await prisma.review.create({
        data: {
          menuItemId,
          restaurantId,
          displayName: displayName || "Anonymous Diner",
          avatarUrl,
          rating: Number(rating),
          reviewText,
          aiSentiment: sentiment.sentiment,
          sentimentScore: sentiment.score,
          tasteRating: tasteRating ? Number(tasteRating) : null,
          portionRating: portionRating ? Number(portionRating) : null,
          valueRating: valueRating ? Number(valueRating) : null,
          moderationStatus: moderation.flagged ? "FLAGGED" : "APPROVED",
          moderationReason: moderation.reason || null,
          isGoogleReview: false,
          images: {
            create: (images || []).map((img: any) => ({
              menuItemId,
              url: typeof img === "string" ? img : img.url,
              isApproved: true,
            })),
          },
        },
        include: {
          images: true,
        },
      });

      // Keep in-memory store in sync
      menuVerseStore.addReview({
        menuItemId: createdReview.menuItemId,
        restaurantId: createdReview.restaurantId,
        displayName: createdReview.displayName,
        avatarUrl: createdReview.avatarUrl,
        rating: createdReview.rating,
        reviewText: createdReview.reviewText,
        aiSentiment: sentiment.sentiment,
        sentimentScore: sentiment.score,
        tasteRating: createdReview.tasteRating || undefined,
        portionRating: createdReview.portionRating || undefined,
        valueRating: createdReview.valueRating || undefined,
        moderationStatus: moderation.flagged ? "FLAGGED" : "APPROVED",
        moderationReason: createdReview.moderationReason || undefined,
        isGoogleReview: false,
        images: createdReview.images.map((img) => ({ id: img.id, reviewId: img.reviewId, menuItemId: createdReview.menuItemId, url: img.url, helpfulVotes: img.helpfulVotes, isApproved: true, createdAt: img.createdAt.toISOString() })),
      });

      return NextResponse.json({ source: "SUPABASE_POSTGRES", data: createdReview }, { status: 201 });
    } catch (dbErr) {
      console.warn("Prisma review create failed, saving to local store:", dbErr);
    }

    // Fallback to local store
    const review = menuVerseStore.addReview({
      menuItemId,
      restaurantId,
      displayName: displayName || "Anonymous Diner",
      avatarUrl,
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

    return NextResponse.json({ source: "STORE_CACHE", data: review }, { status: 201 });
  } catch (error) {
    console.error("Review creation failed:", error);
    return NextResponse.json({ error: "Failed to create review" }, { status: 500 });
  }
}
