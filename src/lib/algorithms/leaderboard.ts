import { MenuItem, LeaderboardCategory, LeaderboardDish } from "@/types";

export function generateLeaderboard(
  dishes: MenuItem[],
  category: LeaderboardCategory,
  limit = 50
): LeaderboardDish[] {
  const availableDishes = dishes.filter((d) => d.isAvailable !== false);

  let ranked: { dish: MenuItem; score: number; highlightBadge: string }[] = [];

  switch (category) {
    case "MOST_LOVED":
      ranked = availableDishes
        .map((dish) => {
          const stats = dish.statistics;
          const reviewsCount = dish.reviews?.length || stats?.totalReviews || 0;
          const recPct = stats?.recommendationPercentage ?? (reviewsCount > 0 ? 100 : 95);
          const rating = stats?.averageRating || 5.0;
          // Real-time compound score based on recommendation rate & review volume
          const score = recPct * 10 + reviewsCount * 5 + rating * 2;
          return {
            dish,
            score,
            highlightBadge: `${recPct}% Loved • ${reviewsCount} ${reviewsCount === 1 ? "review" : "reviews"}`,
          };
        })
        .sort((a, b) => b.score - a.score);
      break;

    case "HIGHEST_RATED":
      ranked = availableDishes
        .map((dish) => {
          const stats = dish.statistics;
          const rating = stats?.averageRating || (dish.isSignature ? 5.0 : 4.8);
          const count = dish.reviews?.length || stats?.totalReviews || 0;
          const score = rating * 100 + count;
          return {
            dish,
            score,
            highlightBadge: `★ ${rating.toFixed(1)} (${count} ${count === 1 ? "review" : "reviews"})`,
          };
        })
        .sort((a, b) => b.score - a.score);
      break;

    case "MOST_REVIEWED":
      ranked = availableDishes
        .map((dish) => {
          const count = dish.reviews?.length || dish.statistics?.totalReviews || 0;
          const rating = dish.statistics?.averageRating || 5.0;
          return {
            dish,
            score: count * 10 + rating,
            highlightBadge: `${count} Verified ${count === 1 ? "Review" : "Reviews"}`,
          };
        })
        .sort((a, b) => b.score - a.score);
      break;

    case "MOST_PHOTOGRAPHED":
      ranked = availableDishes
        .map((dish) => {
          const reviewPhotos = dish.reviews?.flatMap((r) => r.images || []).length || 0;
          const totalPhotos = (dish.images?.length || 0) + reviewPhotos;
          return {
            dish,
            score: totalPhotos * 10 + (dish.statistics?.averageRating || 0),
            highlightBadge: `${totalPhotos} Food ${totalPhotos === 1 ? "Photo" : "Photos"}`,
          };
        })
        .sort((a, b) => b.score - a.score);
      break;

    case "TRENDING_WEEK":
    case "TRENDING_MONTH":
      ranked = availableDishes
        .map((dish) => {
          const reviews = dish.reviews || [];
          const stats = dish.statistics;
          // Calculate dynamic review velocity from actual review timestamps
          const recentReviews = reviews.filter((r) => {
            const ageDays = (Date.now() - new Date(r.createdAt).getTime()) / (1000 * 60 * 60 * 24);
            return ageDays <= 7;
          }).length;
          const trendScore = (stats?.trendScore || 80) + recentReviews * 15;
          return {
            dish,
            score: trendScore,
            highlightBadge: `Trending Velocity #${Math.round(trendScore)}`,
          };
        })
        .sort((a, b) => b.score - a.score);
      break;

    case "HIDDEN_GEMS":
      ranked = availableDishes
        .map((dish) => {
          const rating = dish.statistics?.averageRating || 5.0;
          const reviewsCount = dish.reviews?.length || dish.statistics?.totalReviews || 0;
          // Higher score for exceptionally rated dishes that are undiscovered (lower review count)
          const gemScore = (rating * 20) - (reviewsCount * 0.5);
          return {
            dish,
            score: gemScore,
            highlightBadge: `★ ${rating.toFixed(1)} Undiscovered Gem`,
          };
        })
        .sort((a, b) => b.score - a.score);
      break;

    case "BEST_VALUE":
      ranked = availableDishes
        .map((dish) => {
          const rating = dish.statistics?.averageRating || 5.0;
          const price = Math.max(dish.price, 1);
          // Value index: Quality / Price ratio
          const valueIndex = Number(((Math.pow(rating, 2) / price) * 10).toFixed(1));
          return {
            dish,
            score: valueIndex,
            highlightBadge: `$${dish.price.toFixed(2)} • Value Score ${valueIndex}`,
          };
        })
        .sort((a, b) => b.score - a.score);
      break;

    case "CHEF_PICKS":
    default:
      ranked = availableDishes
        .map((dish) => {
          const signatureBonus = dish.isSignature ? 50 : dish.isChefSpecial ? 40 : 10;
          const rating = dish.statistics?.averageRating || 5.0;
          const score = signatureBonus + rating * 5;
          return {
            dish,
            score,
            highlightBadge: dish.isSignature ? "Chef Signature Item" : dish.isChefSpecial ? "Daily Special" : "Kitchen Recommendation",
          };
        })
        .sort((a, b) => b.score - a.score);
      break;
  }

  return ranked.slice(0, limit).map((item, index) => ({
    rank: index + 1,
    dish: item.dish,
    score: item.score,
    highlightBadge: item.highlightBadge,
    trendDelta: 0,
  }));
}
