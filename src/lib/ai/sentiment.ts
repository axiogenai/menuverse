import { SentimentType, Review, AISummary } from "@/types";

const POSITIVE_WORDS = [
  "delicious", "amazing", "crispy", "tender", "mouthwatering", "creamy",
  "flavorful", "succulent", "perfection", "fresh", "best", "loved", "unreal",
  "rich", "heavenly", "juicy", "must-try", "incredible", "favorite", "generous"
];

const NEGATIVE_WORDS = [
  "bland", "salty", "cold", "dry", "undercooked", "overcooked", "greasy",
  "oily", "tough", "rubbery", "small portion", "disappointing", "waste",
  "sour", "bitter", "terrible", "stale", "worst", "unpleasant", "slow"
];

const SPICE_WORDS = ["spicy", "fiery", "mild", "chili", "pepper", "kick", "heat", "hot"];
const PORTION_WORDS = ["portion", "filling", "huge", "small", "size", "generous", "tiny"];
const VALUE_WORDS = ["worth", "price", "expensive", "cheap", "value", "overpriced", "affordable"];

export interface SentimentAnalysisResult {
  sentiment: SentimentType;
  score: number; // -1.0 to +1.0
  aspects: {
    taste: "positive" | "negative" | "neutral";
    portion: "generous" | "average" | "small" | "unmentioned";
    spice: "mild" | "medium" | "hot" | "unmentioned";
    value: "great" | "fair" | "expensive" | "unmentioned";
  };
}

/**
 * Analyzes review text & rating to determine sentiment and aspect tags
 */
export function analyzeReviewSentiment(
  text: string,
  rating: number
): SentimentAnalysisResult {
  const lower = text.toLowerCase();
  const words = lower.split(/\W+/);

  let positiveScore = 0;
  let negativeScore = 0;

  words.forEach((w) => {
    if (POSITIVE_WORDS.includes(w)) positiveScore += 1;
    if (NEGATIVE_WORDS.includes(w)) negativeScore += 1;
  });

  // Base score from rating (1 to 5 maps to -1.0 to 1.0)
  const ratingNormalized = (rating - 3) / 2; // -1.0, -0.5, 0, 0.5, 1.0
  const textDiff = positiveScore - negativeScore;
  const textNormalized = textDiff === 0 ? 0 : Math.max(-1, Math.min(1, textDiff / 3));

  // Blend rating (70%) and text sentiment (30%)
  const finalScore = Number((ratingNormalized * 0.7 + textNormalized * 0.3).toFixed(2));

  let sentiment: SentimentType = "NEUTRAL";
  if (finalScore >= 0.25 || rating >= 4) sentiment = "POSITIVE";
  else if (finalScore <= -0.25 || rating <= 2) sentiment = "NEGATIVE";

  // Aspect classification
  const hasGenerous = ["generous", "huge", "big", "filling", "hefty"].some((k) => lower.includes(k));
  const hasSmall = ["small", "tiny", "little", "scant"].some((k) => lower.includes(k));
  const portion = hasGenerous ? "generous" : hasSmall ? "small" : lower.includes("portion") ? "average" : "unmentioned";

  const hasHot = ["fiery", "very spicy", "super hot", "burning"].some((k) => lower.includes(k));
  const hasMild = ["mild", "not spicy", "sweet"].some((k) => lower.includes(k));
  const spice = hasHot ? "hot" : hasMild ? "mild" : lower.includes("spicy") ? "medium" : "unmentioned";

  const hasGreatValue = ["great value", "worth it", "well priced", "cheap", "bargain"].some((k) => lower.includes(k));
  const hasExpensive = ["overpriced", "expensive", "costly", "not worth"].some((k) => lower.includes(k));
  const value = hasGreatValue ? "great" : hasExpensive ? "expensive" : lower.includes("price") ? "fair" : "unmentioned";

  return {
    sentiment,
    score: finalScore,
    aspects: {
      taste: rating >= 4 ? "positive" : rating <= 2 ? "negative" : "neutral",
      portion,
      spice,
      value,
    },
  };
}

/**
 * Generates an automated AI summary synthesized across all diner reviews
 */
export function generateDishAISummary(
  dishName: string,
  reviews: Review[]
): AISummary {
  const approvedReviews = reviews.filter((r) => r.moderationStatus === "APPROVED");
  const count = approvedReviews.length;

  if (count === 0) {
    return {
      menuItemId: "",
      summaryText: `Our culinary team has crafted the ${dishName} to perfection. Be the first diner to review and share your taste impressions!`,
      positiveHighlights: ["Freshly prepared with artisanal ingredients", "Chef's signature recipe"],
      improvementSuggestions: [],
      topKeywords: ["Fresh", "Artisanal", "Chef Special"],
      confidenceScore: 0.85,
      tasteProfile: { savory: 80, sweet: 20, spicy: 30, crispy: 50, rich: 75 },
      generatedAt: new Date().toISOString(),
      lastReviewCount: 0,
    };
  }

  const positiveReviews = approvedReviews.filter((r) => r.rating >= 4 || r.aiSentiment === "POSITIVE");
  const negativeReviews = approvedReviews.filter((r) => r.rating <= 2 || r.aiSentiment === "NEGATIVE");

  const highlights: string[] = [];
  const suggestions: string[] = [];
  const keywordMap = new Map<string, number>();

  approvedReviews.forEach((r) => {
    const text = r.reviewText.toLowerCase();
    POSITIVE_WORDS.concat(["sauce", "texture", "portion", "truffle", "cheese", "crust", "blend", "aroma"]).forEach((word) => {
      if (text.includes(word)) {
        keywordMap.set(word, (keywordMap.get(word) || 0) + 1);
      }
    });
  });

  const sortedKeywords = Array.from(keywordMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([w]) => w.charAt(0).toUpperCase() + w.slice(1));

  if (positiveReviews.length > 0) {
    const topPosReview = positiveReviews[0].reviewText;
    if (topPosReview.length > 20) {
      highlights.push(`Diners frequently praise the exceptional texture and balanced seasonings.`);
      highlights.push(`Celebrated for memorable flavor depth and presentation.`);
    }
  }

  if (negativeReviews.length > 0) {
    suggestions.push(`A few diners suggested moderating seasoning levels or offering dipping sauces on the side.`);
  }

  const posPct = Math.round((positiveReviews.length / count) * 100);
  let summaryText = "";

  if (posPct >= 80) {
    summaryText = `An overwhelming ${posPct}% of diners love the ${dishName}. Customer feedback highlights its melt-in-the-mouth texture, vibrant flavor profile, and generous plating. Widely recognized as one of the standout dishes on the menu.`;
  } else if (posPct >= 50) {
    summaryText = `Diners enjoy the ${dishName} with ${posPct}% positive recommendations. Guests appreciate the rich seasoning and overall presentation, making it a reliable crowd-pleaser.`;
  } else {
    summaryText = `Diners have mixed feedback regarding ${dishName}. While some appreciate the distinct flavor elements, others note varied preferences regarding portion size and seasoning.`;
  }

  return {
    menuItemId: "",
    summaryText,
    positiveHighlights: highlights.length > 0 ? highlights : ["Rich aroma", "Artisanal preparation"],
    improvementSuggestions: suggestions,
    topKeywords: sortedKeywords.length > 0 ? sortedKeywords : ["Delicious", "Flavorful", "Fresh"],
    tasteProfile: {
      savory: Math.min(95, 60 + posPct * 0.3),
      sweet: Math.max(15, 40 - posPct * 0.2),
      spicy: 35,
      crispy: 65,
      rich: Math.min(95, 55 + posPct * 0.35),
    },
    confidenceScore: Number(Math.min(0.98, 0.75 + count * 0.03).toFixed(2)),
    generatedAt: new Date().toISOString(),
    lastReviewCount: count,
  };
}

/**
 * AI-assisted moderation rules
 */
export function screenReviewContent(text: string): {
  flagged: boolean;
  reason?: string;
} {
  const lower = text.toLowerCase();
  const bannedPatterns = [
    /viagra|casino|cryptocurrency|whatsapp me|telegram me|free money/i,
    /fuck|bitch|asshole|cunt|bastard/i,
  ];

  for (const pattern of bannedPatterns) {
    if (pattern.test(lower)) {
      return {
        flagged: true,
        reason: "Detected abusive language or unsolicited promotional spam.",
      };
    }
  }

  if (text.length > 10 && /(.)\1{7,}/.test(text)) {
    return {
      flagged: true,
      reason: "Detected repetitive character spam.",
    };
  }

  return { flagged: false };
}
