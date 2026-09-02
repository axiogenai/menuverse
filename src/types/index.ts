export type Role =
  | "PLATFORM_ADMIN"
  | "RESTAURANT_OWNER"
  | "RESTAURANT_MANAGER"
  | "RESTAURANT_STAFF"
  | "DINER";

export type SentimentType = "POSITIVE" | "NEUTRAL" | "NEGATIVE";

export type ModerationStatus = "APPROVED" | "PENDING" | "FLAGGED" | "REJECTED";

export type SubscriptionPlan = "FREE" | "PRO" | "ENTERPRISE";

export interface Restaurant {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  logoUrl?: string | null;
  coverUrl?: string | null;
  address?: string | null;
  phone?: string | null;
  website?: string | null;
  cuisineType?: string | null;
  priceRange?: string | null;
  isVerified: boolean;
  googlePlaceId?: string | null;
  createdAt: string;
  updatedAt: string;
  settings?: RestaurantSettings;
  categories?: Category[];
  menuItems?: MenuItem[];
  reviews?: Review[];
  googleReviews?: GoogleReview[];
}

export interface RestaurantSettings {
  id: string;
  restaurantId: string;
  primaryColor: string;
  accentColor: string;
  qrLogoUrl?: string | null;
  qrFgColor: string;
  qrBgColor: string;
  qrFrameText: string;
  showPrices: boolean;
  enableReviews: boolean;
  enablePhotoUploads: boolean;
  enableAiSummaries: boolean;
  socialInstagram?: string | null;
  socialFacebook?: string | null;
}

export interface Category {
  id: string;
  restaurantId: string;
  name: string;
  slug: string;
  description?: string | null;
  icon?: string | null;
  displayOrder: number;
  isVisible: boolean;
  isActive: boolean;
  menuItems?: MenuItem[];
}

export interface MenuItemImage {
  id: string;
  menuItemId: string;
  url: string;
  altText?: string | null;
  isPrimary: boolean;
  displayOrder: number;
}

export interface DishStatistics {
  id?: string;
  menuItemId: string;
  totalRatings: number;
  averageRating: number;
  totalReviews: number;
  customerPhotoCount: number;
  recommendationPercentage: number;
  popularityScore: number;
  trendScore: number;
  fiveStarCount: number;
  fourStarCount: number;
  threeStarCount: number;
  twoStarCount: number;
  oneStarCount: number;
  lastCalculatedAt?: string;
}

export interface AISummary {
  id?: string;
  menuItemId: string;
  summaryText: string;
  positiveHighlights: string[];
  improvementSuggestions: string[];
  topKeywords: string[];
  tasteProfile?: {
    savory?: number;
    sweet?: number;
    spicy?: number;
    crispy?: number;
    rich?: number;
  };
  confidenceScore: number;
  generatedAt: string;
  lastReviewCount: number;
}

export interface MenuItem {
  id: string;
  restaurantId: string;
  categoryId: string;
  name: string;
  slug: string;
  description?: string | null;
  price: number;
  currency: string;
  ingredients: string[];
  allergens: string[];
  isVegetarian: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
  isHalal?: boolean;
  isNutFree?: boolean;
  spicyLevel: number; // 0, 1, 2, 3, 4
  isSignature: boolean;
  isChefSpecial: boolean;
  isAvailable: boolean;
  isSeasonal?: boolean;
  preparationTimeMinutes?: number | null;
  displayOrder: number;
  createdAt?: string;
  updatedAt?: string;
  images: MenuItemImage[];
  statistics?: DishStatistics;
  aiSummary?: AISummary | null;
  reviews?: Review[];
  category?: Category;
}

export interface ReviewImage {
  id: string;
  reviewId: string;
  menuItemId: string;
  url: string;
  thumbnailUrl?: string | null;
  caption?: string | null;
  helpfulVotes: number;
  isApproved: boolean;
  createdAt: string;
}

export interface Review {
  id: string;
  menuItemId: string;
  restaurantId: string;
  userId?: string | null;
  displayName: string;
  avatarUrl?: string | null;
  rating: number; // 1 to 5
  reviewText: string;
  aiSentiment: SentimentType;
  sentimentScore: number; // -1 to +1
  tasteRating?: number | null;
  portionRating?: number | null;
  valueRating?: number | null;
  helpfulVotes: number;
  reportCount: number;
  moderationStatus: ModerationStatus;
  moderationReason?: string | null;
  ownerReplyText?: string | null;
  ownerRepliedAt?: string | null;
  isGoogleReview: boolean;
  googleReviewId?: string | null;
  createdAt: string;
  updatedAt?: string;
  images: ReviewImage[];
  reactions?: ReviewReaction[];
  menuItem?: MenuItem;
}

export interface ReviewReaction {
  id: string;
  reviewId: string;
  userFingerprint: string;
  reactionType: "HELPFUL" | "YUMMY" | "ACCURATE";
  createdAt: string;
}

export interface ReviewReport {
  id: string;
  reviewId: string;
  reason: string;
  details?: string | null;
  reporterFingerprint?: string | null;
  status: "PENDING" | "RESOLVED" | "DISMISSED";
  createdAt: string;
  resolvedAt?: string | null;
  review?: Review;
}

export interface GoogleReview {
  id: string;
  restaurantId: string;
  authorName: string;
  authorPhotoUrl?: string | null;
  rating: number;
  text: string;
  relativeTime?: string | null;
  publishTime?: string | null;
  isImported: boolean;
  createdAt: string;
}

export type LeaderboardCategory =
  | "MOST_LOVED"
  | "HIGHEST_RATED"
  | "MOST_REVIEWED"
  | "MOST_PHOTOGRAPHED"
  | "TRENDING_WEEK"
  | "TRENDING_MONTH"
  | "HIDDEN_GEMS"
  | "BEST_VALUE"
  | "CHEF_PICKS";

export interface LeaderboardDish {
  rank: number;
  dish: MenuItem;
  score: number;
  highlightBadge: string;
  trendDelta?: number; // e.g. +3 positions
}

export interface AnalyticsSummary {
  totalScans: number;
  uniqueVisitors: number;
  totalDishViews: number;
  totalReviews: number;
  totalCustomerPhotos: number;
  avgRating: number;
  avgSessionDurationSeconds: number;
  sentimentDistribution: {
    positive: number;
    neutral: number;
    negative: number;
  };
  dailyViews: { date: string; views: number; scans: number; reviews: number }[];
  topPerformingDishes: { dish: MenuItem; viewCount: number; reviewCount: number; rating: number }[];
  underperformingDishes: { dish: MenuItem; viewCount: number; reviewCount: number; rating: number }[];
}

export interface AuditLogItem {
  id: string;
  restaurantId?: string | null;
  userId?: string | null;
  userName?: string | null;
  action: string;
  resourceType: string;
  resourceId: string;
  details?: Record<string, unknown> | null;
  createdAt: string;
}
