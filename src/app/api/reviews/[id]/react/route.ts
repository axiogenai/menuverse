import { NextResponse } from "next/server";
import { menuVerseStore } from "@/lib/seed-data";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const count = menuVerseStore.upvoteReview(id);
    return NextResponse.json({ helpfulVotes: count });
  } catch (error) {
    return NextResponse.json({ error: "Failed to record reaction" }, { status: 500 });
  }
}
