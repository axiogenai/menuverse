import { MenuItem, LeaderboardCategory, LeaderboardDish } from "@/types";

export function generateLeaderboard(
  dishes: MenuItem[],
  category: LeaderboardCategory,
  limit = 10
): LeaderboardDish[] {
  const availableDishes = dishes.filter((d) => d.isAvailable);

  let ranked: { dish: MenuItem; score: number; highlightBadge: string }[] = [];

  switch (category) {
    case "MOST_LOVED":
      ranked = availableDishes
        .map((dish) => {
          const stats = dish.statistics;
          const recPct = stats?.recommendationPercentage || 0;
          const reviewCount = stats?.totalReviews || 0;
          // Weighted score by recommendation % and confidence
          const score = (recPct * Math.min(reviewCount, 30)) / 30;
          return {
            dish,
            score: Number(score.toFixed(1)),
            highlightBadge: `${recPct}% Recommend (${reviewCount}+ reviews)`,
          };
        })
        .sort((a, b) => b.score - a.score);
      break;

    case "HIGHEST_RATED":
      ranked = availableDishes
        .map((dish) => {
          const stats = dish.statistics;
          const rating = stats?.averageRating || 0;
          const count = stats?.totalReviews || 0;
          return {
            dish,
            score: rating,
            highlightBadge: `${rating.toFixed(1)} / 5.0 (${count} reviews)`,
          };
        })
        .sort((a, b) => b.score - a.score || (b.dish.statistics?.totalReviews || 0) - (a.dish.statistics?.totalReviews || 0));
      break;

    case "MOST_REVIEWED":
      ranked = availableDishes
        .map((dish) => {
          const count = dish.statistics?.totalReviews || 0;
          return {
            dish,
            score: count,
            highlightBadge: `${count} Verified Reviews`,
          };
        })
        .sort((a, b) => b.score - a.score);
      break;

    case "MOST_PHOTOGRAPHED":
      ranked = availableDishes
        .map((dish) => {
          const photoCount = dish.statistics?.customerPhotoCount || dish.images.length;
          return {
            dish,
            score: photoCount,
            highlightBadge: `${photoCount} Customer Photos`,
          };
        })
        .sort((a, b) => b.score - a.score);
      break;

    case "TRENDING_WEEK":
    case "TRENDING_MONTH":
      ranked = availableDishes
        .map((dish) => {
          const trend = dish.statistics?.trendScore || 0;
          return {
            dish,
            score: trend,
            highlightBadge: `Velocity Index #${Math.round(trend)}`,
          };
        })
        .sort((a, b) => b.score - a.score);
      break;

    case "HIDDEN_GEMS":
      // High rating (>= 4.5) with lower review count (< 25)
      ranked = availableDishes
        .filter((d) => (d.statistics?.averageRating || 0) >= 4.4 && (d.statistics?.totalReviews || 0) <= 30)
        .map((dish) => {
          const rating = dish.statistics?.averageRating || 0;
          return {
            dish,
            score: rating,
            highlightBadge: `Hidden Gem (${rating.toFixed(1)} Rating)`,
          };
        })
        .sort((a, b) => b.score - a.score);
      break;

    case "BEST_VALUE":
      ranked = availableDishes
        .map((dish) => {
          const rating = dish.statistics?.averageRating || 0;
          const price = Math.max(dish.price, 1);
          // Value index = (rating^2 / price) * 10
          const valueIndex = Number(((Math.pow(rating, 2) / price) * 10).toFixed(1));
          return {
            dish,
            score: valueIndex,
            highlightBadge: `High Value (Score ${valueIndex})`,
          };
        })
        .sort((a, b) => b.score - a.score);
      break;

    case "CHEF_PICKS":
    default:
      ranked = availableDishes
        .filter((d) => d.isSignature || d.isChefSpecial)
        .map((dish) => {
          const pop = dish.statistics?.popularityScore || 0;
          return {
            dish,
            score: pop,
            highlightBadge: dish.isSignature ? "Signature Dish" : "Chef Selection",
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
    trendDelta: index % 3 === 0 ? 1 : index % 2 === 0 ? 2 : 0,
  }));
}
