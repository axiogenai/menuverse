import { MenuItem, Review, DishStatistics } from "@/types";

export interface ReputationParams {
  dish: MenuItem;
  reviews: Review[];
  recentViews7d?: number;
  helpfulVotes?: number;
  globalMeanRating?: number;
  minReviewThreshold?: number;
}

/**
 * Calculates Bayesian Weighted Rating
 * W = (v / (v + m)) * R + (m / (v + m)) * C
 * where:
 * - v = number of reviews for the dish
 * - m = minimum reviews required to be listed in top charts (e.g., 5)
 * - R = average rating of the dish
 * - C = mean rating across all dishes (e.g., 4.2)
 */
export function calculateBayesianRating(
  dishAvgRating: number,
  reviewCount: number,
  globalMean: number = 4.2,
  minThreshold: number = 4
): number {
  if (reviewCount === 0) return globalMean;
  const weighted =
    (reviewCount / (reviewCount + minThreshold)) * dishAvgRating +
    (minThreshold / (reviewCount + minThreshold)) * globalMean;
  return Number(weighted.toFixed(2));
}

/**
 * Calculates Trend Score based on review velocity, recent views, and engagement
 */
export function calculateTrendScore(
  reviews: Review[],
  recentViews7d: number = 0,
  photoCount: number = 0,
  helpfulVotes: number = 0
): number {
  const now = new Date().getTime();
  const dayMs = 1000 * 60 * 60 * 24;

  let velocityScore = 0;
  reviews.forEach((rev) => {
    const revTime = new Date(rev.createdAt).getTime();
    const ageInDays = Math.max(0.1, (now - revTime) / dayMs);
    // Exponential decay: e^(-0.1 * days)
    const decay = Math.exp(-0.1 * ageInDays);
    const weight = rev.rating >= 4 ? 1.5 : rev.rating === 3 ? 0.8 : 0.3;
    velocityScore += weight * decay;
  });

  // Base components
  const viewFactor = Math.log10(recentViews7d + 1) * 3.5;
  const photoFactor = photoCount * 2.0;
  const helpfulFactor = helpfulVotes * 1.2;

  const totalScore = velocityScore * 10 + viewFactor + photoFactor + helpfulFactor;
  return Number(totalScore.toFixed(1));
}

/**
 * Calculates full Dish Statistics for a given dish and review set
 */
export function computeDishStatistics(
  dish: MenuItem,
  reviews: Review[],
  recentViews7d = 25
): DishStatistics {
  const validReviews = reviews.filter(
    (r) => r.moderationStatus === "APPROVED" || r.moderationStatus === "PENDING"
  );
  const totalReviews = validReviews.length;

  if (totalReviews === 0) {
    return {
      menuItemId: dish.id,
      totalRatings: 0,
      averageRating: 0,
      totalReviews: 0,
      customerPhotoCount: 0,
      recommendationPercentage: 0,
      popularityScore: 0,
      trendScore: 0,
      fiveStarCount: 0,
      fourStarCount: 0,
      threeStarCount: 0,
      twoStarCount: 0,
      oneStarCount: 0,
    };
  }

  let ratingSum = 0;
  let fiveStar = 0;
  let fourStar = 0;
  let threeStar = 0;
  let twoStar = 0;
  let oneStar = 0;
  let positiveCount = 0;
  let totalPhotos = 0;
  let totalHelpful = 0;

  validReviews.forEach((r) => {
    ratingSum += r.rating;
    if (r.rating === 5) fiveStar++;
    else if (r.rating === 4) fourStar++;
    else if (r.rating === 3) threeStar++;
    else if (r.rating === 2) twoStar++;
    else if (r.rating === 1) oneStar++;

    if (r.rating >= 4 || r.aiSentiment === "POSITIVE") positiveCount++;
    totalPhotos += r.images?.length || 0;
    totalHelpful += r.helpfulVotes || 0;
  });

  const avgRating = Number((ratingSum / totalReviews).toFixed(1));
  const recommendationPercentage = Math.round((positiveCount / totalReviews) * 100);
  const bayesianRating = calculateBayesianRating(avgRating, totalReviews);
  const trendScore = calculateTrendScore(validReviews, recentViews7d, totalPhotos, totalHelpful);

  // Popularity combines volume, sentiment, and photos
  const popularityScore = Number(
    (bayesianRating * 15 + totalReviews * 2 + totalPhotos * 3 + totalHelpful * 0.5).toFixed(1)
  );

  return {
    menuItemId: dish.id,
    totalRatings: totalReviews,
    averageRating: avgRating,
    totalReviews,
    customerPhotoCount: totalPhotos,
    recommendationPercentage,
    popularityScore,
    trendScore,
    fiveStarCount: fiveStar,
    fourStarCount: fourStar,
    threeStarCount: threeStar,
    twoStarCount: twoStar,
    oneStarCount: oneStar,
    lastCalculatedAt: new Date().toISOString(),
  };
}
