import { NextResponse } from "next/server";
import { menuVerseStore } from "@/lib/seed-data";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { replyText } = body;

    if (!replyText) {
      return NextResponse.json({ error: "replyText is required" }, { status: 400 });
    }

    const review = menuVerseStore.replyToReview(id, replyText);
    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    return NextResponse.json({ data: review });
  } catch (error) {
    return NextResponse.json({ error: "Failed to post reply" }, { status: 500 });
  }
}
