import { Restaurant, Category, MenuItem, Review, GoogleReview, AnalyticsSummary } from "@/types";
import { computeDishStatistics } from "./algorithms/reputation";
import { generateDishAISummary } from "./ai/sentiment";

export const INITIAL_RESTAURANTS: Restaurant[] = [
  {
    id: "rest-01",
    name: "My Restaurant",
    slug: "my-restaurant",
    description: "",
    logoUrl: null,
    coverUrl: null,
    address: "",
    phone: "",
    website: "",
    cuisineType: "Restaurant & Dining",
    priceRange: "$$",
    isVerified: true,
    googlePlaceId: "ChIJtVgY1N0FwTsRsYX6iv3bUsU",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    settings: {
      id: "set-01",
      restaurantId: "rest-01",
      primaryColor: "#ea580c",
      accentColor: "#c2410c",
      qrLogoUrl: null,
      qrFgColor: "#1c1917",
      qrBgColor: "#ffffff",
      qrFrameText: "SCAN FOR SOCIAL MENU",
      showPrices: true,
      enableReviews: true,
      enablePhotoUploads: true,
      enableAiSummaries: true,
      socialInstagram: "",
    },
  },
];

export const INITIAL_CATEGORIES: Category[] = [];
export const INITIAL_DISHES: MenuItem[] = [];
export const INITIAL_REVIEWS: Review[] = [];
export const INITIAL_GOOGLE_REVIEWS: GoogleReview[] = [];

/**
 * MenuVerse Pure Reactive Store
 */
class MenuVerseStore {
  private restaurants: Restaurant[] = INITIAL_RESTAURANTS;
  private categories: Category[] = INITIAL_CATEGORIES;
  private dishes: MenuItem[] = INITIAL_DISHES;
  private reviews: Review[] = INITIAL_REVIEWS;
  private googleReviews: GoogleReview[] = INITIAL_GOOGLE_REVIEWS;
  private listeners: Set<() => void> = new Set();

  constructor() {
    if (typeof window !== "undefined") {
      this.loadFromStorage();
    }
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.saveToStorage();
    this.listeners.forEach((listener) => {
      try {
        listener();
      } catch (e) {
        console.error("Store listener error", e);
      }
    });
  }

  private saveToStorage() {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem("menuverse_restaurants", JSON.stringify(this.restaurants));
      localStorage.setItem("menuverse_categories", JSON.stringify(this.categories));
      localStorage.setItem("menuverse_dishes", JSON.stringify(this.dishes));
      localStorage.setItem("menuverse_reviews", JSON.stringify(this.reviews));
      localStorage.setItem("menuverse_googlereviews", JSON.stringify(this.googleReviews));
    } catch (e) {
      console.warn("LocalStorage save error", e);
    }
  }

  private loadFromStorage() {
    if (typeof window === "undefined") return;
    try {
      const rest = localStorage.getItem("menuverse_restaurants");
      const cats = localStorage.getItem("menuverse_categories");
      const dishes = localStorage.getItem("menuverse_dishes");
      const reviews = localStorage.getItem("menuverse_reviews");
      const gReviews = localStorage.getItem("menuverse_googlereviews");

      if (rest) this.restaurants = JSON.parse(rest);
      if (cats) this.categories = JSON.parse(cats);
      if (dishes) this.dishes = JSON.parse(dishes);
      if (reviews) this.reviews = JSON.parse(reviews);
      if (gReviews) this.googleReviews = JSON.parse(gReviews);
    } catch (e) {
      console.warn("LocalStorage load error", e);
    }
  }

  public resetAllData(): void {
    this.restaurants = INITIAL_RESTAURANTS;
    this.categories = INITIAL_CATEGORIES;
    this.dishes = INITIAL_DISHES;
    this.reviews = INITIAL_REVIEWS;
    this.googleReviews = INITIAL_GOOGLE_REVIEWS;
    if (typeof window !== "undefined") {
      localStorage.removeItem("menuverse_restaurants");
      localStorage.removeItem("menuverse_categories");
      localStorage.removeItem("menuverse_dishes");
      localStorage.removeItem("menuverse_reviews");
      localStorage.removeItem("menuverse_googlereviews");
      localStorage.removeItem("menuverse_staff");
    }
    this.notify();
  }

  public getRestaurants(): Restaurant[] {
    return this.restaurants;
  }

  public getRestaurantBySlug(slug?: string): Restaurant | undefined {
    const restaurant = (slug ? this.restaurants.find((r) => r.slug === slug) : null) || this.restaurants[0];
    if (!restaurant) return undefined;

    const restCategories = this.categories
      .filter((c) => c.restaurantId === restaurant.id || !c.restaurantId || c.restaurantId === "rest-01")
      .sort((a, b) => a.displayOrder - b.displayOrder);

    const restDishes = this.dishes
      .filter((d) => d.restaurantId === restaurant.id || !d.restaurantId || d.restaurantId === "rest-01")
      .map((dish) => {
        const dishReviews = this.reviews.filter((r) => r.menuItemId === dish.id);
        const stats = computeDishStatistics(dish, dishReviews);
        const aiSummary = generateDishAISummary(dish.name, dishReviews);
        return {
          ...dish,
          statistics: stats,
          aiSummary,
          reviews: dishReviews,
        };
      });

    const restGoogleReviews = this.googleReviews.filter((g) => g.restaurantId === restaurant.id);
    const restReviews = this.reviews.filter((r) => r.restaurantId === restaurant.id);

    return {
      ...restaurant,
      categories: restCategories,
      menuItems: restDishes,
      reviews: restReviews,
      googleReviews: restGoogleReviews,
    };
  }

  public updateRestaurant(slug: string, updates: Partial<Restaurant>): Restaurant | undefined {
    let restIdx = this.restaurants.findIndex((r) => r.slug === slug);
    if (restIdx === -1 && this.restaurants.length > 0) restIdx = 0;
    if (restIdx === -1) return undefined;

    this.restaurants[restIdx] = {
      ...this.restaurants[restIdx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.notify();
    return this.restaurants[restIdx];
  }

  public getDishById(id: string): MenuItem | undefined {
    const dish = this.dishes.find((d) => d.id === id);
    if (!dish) return undefined;

    const dishReviews = this.reviews.filter((r) => r.menuItemId === dish.id);
    const stats = computeDishStatistics(dish, dishReviews);
    const aiSummary = generateDishAISummary(dish.name, dishReviews);

    return {
      ...dish,
      statistics: stats,
      aiSummary,
      reviews: dishReviews,
    };
  }

  public addDish(newDish: Omit<MenuItem, "id" | "createdAt" | "updatedAt">): MenuItem {
    const dish: MenuItem = {
      ...newDish,
      id: `dish-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      images: newDish.images || [],
      ingredients: newDish.ingredients || [],
      allergens: newDish.allergens || [],
    };
    this.dishes.push(dish);
    this.notify();
    return dish;
  }

  public updateDish(id: string, updates: Partial<MenuItem>): MenuItem | undefined {
    const idx = this.dishes.findIndex((d) => d.id === id);
    if (idx === -1) return undefined;

    this.dishes[idx] = {
      ...this.dishes[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.notify();
    return this.dishes[idx];
  }

  public deleteDish(dishId: string): boolean {
    const prevLen = this.dishes.length;
    this.dishes = this.dishes.filter((d) => d.id !== dishId);
    this.reviews = this.reviews.filter((r) => r.menuItemId !== dishId);
    if (this.dishes.length !== prevLen) {
      this.notify();
      return true;
    }
    return false;
  }

  public toggleDishAvailability(id: string): MenuItem | undefined {
    const dish = this.dishes.find((d) => d.id === id);
    if (dish) {
      dish.isAvailable = !dish.isAvailable;
      dish.updatedAt = new Date().toISOString();
      this.notify();
      return dish;
    }
    return undefined;
  }

  public addCategory(cat: Omit<Category, "id">): Category {
    const newCat: Category = {
      ...cat,
      id: `cat-${Date.now()}`,
    };
    this.categories.push(newCat);
    this.notify();
    return newCat;
  }

  public updateCategory(id: string, updates: Partial<Category>): Category | undefined {
    const idx = this.categories.findIndex((c) => c.id === id);
    if (idx === -1) return undefined;
    this.categories[idx] = { ...this.categories[idx], ...updates };
    this.notify();
    return this.categories[idx];
  }

  public deleteCategory(categoryId: string): boolean {
    const prevLen = this.categories.length;
    this.categories = this.categories.filter((c) => c.id !== categoryId);
    this.dishes = this.dishes.filter((d) => d.categoryId !== categoryId);
    if (this.categories.length !== prevLen) {
      this.notify();
      return true;
    }
    return false;
  }

  public addReview(newReview: Omit<Review, "id" | "createdAt" | "helpfulVotes" | "reportCount">): Review {
    const review: Review = {
      ...newReview,
      id: `rev-${Date.now()}`,
      createdAt: new Date().toISOString(),
      helpfulVotes: 0,
      reportCount: 0,
    };
    this.reviews.unshift(review);
    this.notify();
    return review;
  }

  public upvoteReview(reviewId: string): number {
    const rev = this.reviews.find((r) => r.id === reviewId);
    if (rev) {
      rev.helpfulVotes += 1;
      this.notify();
      return rev.helpfulVotes;
    }
    return 0;
  }

  public replyToReview(reviewId: string, replyText: string): Review | undefined {
    const rev = this.reviews.find((r) => r.id === reviewId);
    if (rev) {
      rev.ownerReplyText = replyText;
      rev.ownerRepliedAt = new Date().toISOString();
      this.notify();
      return rev;
    }
    return undefined;
  }

  public updateReviewModeration(
    reviewId: string,
    status: "APPROVED" | "PENDING" | "FLAGGED" | "REJECTED",
    reason?: string
  ): Review | undefined {
    const rev = this.reviews.find((r) => r.id === reviewId);
    if (rev) {
      rev.moderationStatus = status;
      if (reason) rev.moderationReason = reason;
      this.notify();
      return rev;
    }
    return undefined;
  }

  public addGoogleReview(review: Omit<GoogleReview, "id" | "createdAt">): GoogleReview {
    const newGReview: GoogleReview = {
      ...review,
      id: `g-rev-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.googleReviews.unshift(newGReview);
    this.notify();
    return newGReview;
  }

  public deleteGoogleReview(id: string): boolean {
    const prev = this.googleReviews.length;
    this.googleReviews = this.googleReviews.filter((r) => r.id !== id);
    if (this.googleReviews.length !== prev) {
      this.notify();
      return true;
    }
    return false;
  }

  public clearAllGoogleReviews(restaurantId?: string): void {
    if (restaurantId) {
      this.googleReviews = this.googleReviews.filter((r) => r.restaurantId !== restaurantId);
    } else {
      this.googleReviews = [];
    }
    this.notify();
  }

  public getAnalyticsSummary(restaurantId: string): AnalyticsSummary {
    const restDishes = this.dishes.filter((d) => d.restaurantId === restaurantId || d.restaurantId === "rest-01");
    const restReviews = this.reviews.filter((r) => r.restaurantId === restaurantId || r.restaurantId === "rest-01");

    const totalDishViews = restDishes.length * 10;
    const totalReviews = restReviews.length;
    const totalScans = Math.max(0, totalReviews * 2);
    const uniqueVisitors = Math.max(0, totalReviews);

    const avgRating = restReviews.length > 0
      ? Number((restReviews.reduce((acc, r) => acc + r.rating, 0) / restReviews.length).toFixed(1))
      : 0;

    const posCount = restReviews.filter((r) => r.rating >= 4 || r.aiSentiment === "POSITIVE").length;
    const neuCount = restReviews.filter((r) => r.rating === 3 || r.aiSentiment === "NEUTRAL").length;
    const negCount = restReviews.filter((r) => r.rating <= 2 || r.aiSentiment === "NEGATIVE").length;

    const dishesWithStats = restDishes.map((d) => {
      const dRevs = restReviews.filter((r) => r.menuItemId === d.id);
      const dAvg = dRevs.length > 0 ? dRevs.reduce((a, r) => a + r.rating, 0) / dRevs.length : 0;
      return {
        dish: d,
        viewCount: 0,
        reviewCount: dRevs.length,
        rating: Number(dAvg.toFixed(1)),
      };
    });

    return {
      totalScans,
      uniqueVisitors,
      totalDishViews,
      totalReviews,
      totalCustomerPhotos: restReviews.reduce((acc, r) => acc + (r.images?.length || 0), 0),
      avgRating,
      avgSessionDurationSeconds: 0,
      sentimentDistribution: {
        positive: totalReviews > 0 ? Math.round((posCount / totalReviews) * 100) : 0,
        neutral: totalReviews > 0 ? Math.round((neuCount / totalReviews) * 100) : 0,
        negative: totalReviews > 0 ? Math.round((negCount / totalReviews) * 100) : 0,
      },
      dailyViews: [
        { date: "Day 1", views: 0, scans: 0, reviews: 0 },
        { date: "Day 2", views: 0, scans: 0, reviews: 0 },
        { date: "Day 3", views: 0, scans: 0, reviews: 0 },
        { date: "Day 4", views: 0, scans: 0, reviews: 0 },
      ],
      topPerformingDishes: dishesWithStats.slice(0, 3),
      underperformingDishes: dishesWithStats.slice(-2),
    };
  }
}

export const menuVerseStore = new MenuVerseStore();
