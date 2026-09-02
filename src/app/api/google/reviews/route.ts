import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const placeId = searchParams.get("placeId");
  const apiKey = searchParams.get("apiKey") || process.env.GOOGLE_PLACES_API_KEY;

  if (!placeId) {
    return NextResponse.json({ success: false, error: "Missing Google Place ID" }, { status: 400 });
  }

  if (!apiKey) {
    return NextResponse.json({
      success: false,
      error: "API_KEY_REQUIRED",
      message: "Google requires a Google Places API Key to fetch live customer reviews from Google Maps servers.",
    });
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(
      placeId
    )}&fields=name,rating,reviews,user_ratings_total&key=${encodeURIComponent(apiKey)}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== "OK" || !data.result) {
      return NextResponse.json({
        success: false,
        error: data.error_message || data.status || "Failed to fetch place details from Google",
      });
    }

    const reviews = (data.result.reviews || []).map((r: any) => ({
      authorName: r.author_name,
      authorPhotoUrl: r.profile_photo_url || null,
      rating: r.rating || 5,
      text: r.text || "",
      relativeTime: r.relative_time_description || "Recent",
      publishTime: new Date(r.time * 1000).toISOString(),
    }));

    return NextResponse.json({
      success: true,
      venueName: data.result.name,
      overallRating: data.result.rating || 5.0,
      totalRatings: data.result.user_ratings_total || reviews.length,
      reviews,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to connect to Google Maps API" },
      { status: 500 }
    );
  }
}
