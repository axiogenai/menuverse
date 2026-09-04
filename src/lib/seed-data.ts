import { Restaurant, Category, MenuItem, Review, GoogleReview, AnalyticsSummary } from "@/types";
import { computeDishStatistics } from "./algorithms/reputation";
import { generateDishAISummary } from "./ai/sentiment";

export const INITIAL_RESTAURANTS: Restaurant[] = [
  {
    id: "rest-01",
    name: "Hotel Gypsy",
    slug: "gusto-trattoria",
    description: "5-star luxury palace hotel offering world-class fine dining, artisanal hand-crafted specialties, chef tastings, and bespoke culinary hospitality.",
    logoUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=85",
    coverUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=3840&q=95",
    address: "Peth Vadgaon, Kolhapur",
    phone: "+91 98765 43210",
    website: "https://hotelgypsy.com",
    cuisineType: "5-Star Luxury Palace & Fine Dining",
    priceRange: "₹₹₹₹",
    isVerified: true,
    googlePlaceId: "ChIJtVgY1N0FwTsRsYX6iv3bUsU",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
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
      socialInstagram: "@hotelgypsy",
    },
  },
  {
    id: "rest-02",
    name: "Hotel Gypsy",
    slug: "my-restaurant",
    description: "5-star luxury palace hotel offering world-class fine dining, artisanal hand-crafted specialties, chef tastings, and bespoke culinary hospitality.",
    logoUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=85",
    coverUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=3840&q=95",
    address: "Peth Vadgaon, Kolhapur",
    phone: "+91 98765 43210",
    website: "https://hotelgypsy.com",
    cuisineType: "5-Star Luxury Palace & Fine Dining",
    priceRange: "₹₹₹₹",
    isVerified: true,
    googlePlaceId: "ChIJtVgY1N0FwTsRsYX6iv3bUsU",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    settings: {
      id: "set-02",
      restaurantId: "rest-02",
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

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: "cat-01",
    restaurantId: "rest-01",
    name: "Antipasti & Starters",
    slug: "antipasti-starters",
    description: "Artisanal starters, imported cured meats, and fresh mozzarella",
    icon: "Utensils",
    displayOrder: 1,
    isVisible: true,
    isActive: true,
  },
  {
    id: "cat-02",
    restaurantId: "rest-01",
    name: "Handcrafted Pastas",
    slug: "handcrafted-pastas",
    description: "Daily extruded fresh bronze-cut pastas prepared with heritage Italian sauces",
    icon: "UtensilsCrossed",
    displayOrder: 2,
    isVisible: true,
    isActive: true,
  },
  {
    id: "cat-03",
    restaurantId: "rest-01",
    name: "Wood-Fired Pizzas",
    slug: "wood-fired-pizzas",
    description: "72-hour naturally fermented dough baked at 900°F in volcanic stone",
    icon: "Flame",
    displayOrder: 3,
    isVisible: true,
    isActive: true,
  },
  {
    id: "cat-04",
    restaurantId: "rest-01",
    name: "Secondi & Signature Mains",
    slug: "secondi-mains",
    description: "Prime dry-aged steaks, fresh Mediterranean seafood, and slow-braised meats",
    icon: "ChefHat",
    displayOrder: 4,
    isVisible: true,
    isActive: true,
  },
  {
    id: "cat-05",
    restaurantId: "rest-01",
    name: "Dolci & Desserts",
    slug: "dolci-desserts",
    description: "Handcrafted Italian desserts and artisanal gelato",
    icon: "IceCream",
    displayOrder: 5,
    isVisible: true,
    isActive: true,
  },
];

export const INITIAL_DISHES: MenuItem[] = [
  {
    id: "dish-01",
    restaurantId: "rest-01",
    categoryId: "cat-02",
    name: "Truffle Tagliolini al Burro",
    slug: "truffle-tagliolini-al-burro",
    description: "Hand-rolled egg pasta tossed in 36-month aged Parmigiano Reggiano butter emulsion and shaved black Norcia truffles.",
    price: 850,
    currency: "INR",
    ingredients: ["Fresh egg pasta", "Norcia black truffle", "Parmigiano Reggiano", "Normandy butter"],
    allergens: ["Dairy", "Gluten", "Eggs"],
    isVegetarian: true,
    isVegan: false,
    isGlutenFree: false,
    spicyLevel: 0,
    isSignature: true,
    isChefSpecial: true,
    isAvailable: true,
    preparationTimeMinutes: 14,
    displayOrder: 1,
    images: [
      {
        id: "img-01",
        menuItemId: "dish-01",
        url: "https://images.unsplash.com/photo-1612874742237-6526221588e3?auto=format&fit=crop&w=2560&q=90",
        isPrimary: true,
        displayOrder: 1,
      },
      {
        id: "img-01-b",
        menuItemId: "dish-01",
        url: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=2560&q=90",
        isPrimary: false,
        displayOrder: 2,
      },
    ],
  },
  {
    id: "dish-02",
    restaurantId: "rest-01",
    categoryId: "cat-01",
    name: "Burrata Pugliese & Heirloom Tomatoes",
    slug: "burrata-pugliese-heirloom-tomatoes",
    description: "Imported fresh Pugliese burrata, marinated heirloom tomatoes, 25-year aged Modena balsamic, and fragrant basil oil.",
    price: 620,
    currency: "INR",
    ingredients: ["Pugliese burrata", "Heirloom tomatoes", "Modena balsamic", "Cold-pressed olive oil", "Basil"],
    allergens: ["Dairy"],
    isVegetarian: true,
    isVegan: false,
    isGlutenFree: true,
    spicyLevel: 0,
    isSignature: true,
    isChefSpecial: false,
    isAvailable: true,
    preparationTimeMinutes: 10,
    displayOrder: 2,
    images: [
      {
        id: "img-02",
        menuItemId: "dish-02",
        url: "https://images.unsplash.com/photo-1608897013039-887f21d8c804?auto=format&fit=crop&w=2560&q=90",
        isPrimary: true,
        displayOrder: 1,
      },
      {
        id: "img-02-b",
        menuItemId: "dish-02",
        url: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=2560&q=90",
        isPrimary: false,
        displayOrder: 2,
      },
    ],
  },
  {
    id: "dish-03",
    restaurantId: "rest-01",
    categoryId: "cat-03",
    name: "Margherita D.O.P. Wood-Fired Pizza",
    slug: "margherita-dop-pizza",
    description: "San Marzano D.O.P. tomato sauce, creamy fior di latte mozzarella, fresh organic basil, and extra virgin olive oil.",
    price: 690,
    currency: "INR",
    ingredients: ["San Marzano tomatoes", "Fior di latte mozzarella", "Fresh basil", "Extra virgin olive oil"],
    allergens: ["Gluten", "Dairy"],
    isVegetarian: true,
    isVegan: false,
    isGlutenFree: false,
    spicyLevel: 0,
    isSignature: false,
    isChefSpecial: false,
    isAvailable: true,
    preparationTimeMinutes: 12,
    displayOrder: 3,
    images: [
      {
        id: "img-03",
        menuItemId: "dish-03",
        url: "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=2560&q=90",
        isPrimary: true,
        displayOrder: 1,
      },
      {
        id: "img-03-b",
        menuItemId: "dish-03",
        url: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=2560&q=90",
        isPrimary: false,
        displayOrder: 2,
      },
    ],
  },
  {
    id: "dish-04",
    restaurantId: "rest-01",
    categoryId: "cat-04",
    name: "28-Day Dry-Aged Bistecca Fiorentina",
    slug: "bistecca-fiorentina",
    description: "Charcoal-grilled prime Porterhouse steak with rosemary infused sea salt, roasted garlic bulb, and lemon agrumato.",
    price: 1650,
    currency: "INR",
    ingredients: ["Prime beef", "Fresh rosemary", "Maldon sea salt", "Garlic bulb", "Lemon oil"],
    allergens: [],
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: true,
    spicyLevel: 0,
    isSignature: true,
    isChefSpecial: true,
    isAvailable: true,
    preparationTimeMinutes: 24,
    displayOrder: 4,
    images: [
      {
        id: "img-04",
        menuItemId: "dish-04",
        url: "https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=2560&q=90",
        isPrimary: true,
        displayOrder: 1,
      },
      {
        id: "img-04-b",
        menuItemId: "dish-04",
        url: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=2560&q=90",
        isPrimary: false,
        displayOrder: 2,
      },
    ],
  },
  {
    id: "dish-05",
    restaurantId: "rest-01",
    categoryId: "cat-05",
    name: "Classic Tiramisu Tradizionale",
    slug: "classic-tiramisu-tradizionale",
    description: "Espresso-soaked Savoiardi ladyfingers layered with whipped mascarpone cream and dusted with Valrhona cocoa.",
    price: 420,
    currency: "INR",
    ingredients: ["Mascarpone", "Savoiardi", "Illy espresso", "Marsala wine", "Valrhona cocoa"],
    allergens: ["Dairy", "Eggs", "Gluten"],
    isVegetarian: true,
    isVegan: false,
    isGlutenFree: false,
    spicyLevel: 0,
    isSignature: true,
    isChefSpecial: false,
    isAvailable: true,
    preparationTimeMinutes: 5,
    displayOrder: 5,
    images: [
      {
        id: "img-05",
        menuItemId: "dish-05",
        url: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=2560&q=90",
        isPrimary: true,
        displayOrder: 1,
      },
      {
        id: "img-05-b",
        menuItemId: "dish-05",
        url: "https://images.unsplash.com/photo-1586040140378-b5634cb4c8fc?auto=format&fit=crop&w=2560&q=90",
        isPrimary: false,
        displayOrder: 2,
      },
    ],
  },
  {
    id: "dish-06",
    restaurantId: "rest-01",
    categoryId: "cat-01",
    name: "Prime Beef Carpaccio al Tartufo",
    slug: "prime-beef-carpaccio-al-tartufo",
    description: "Ultra-thin sliced prime beef tenderloin with wild baby arugula, shaved 24-month Parmigiano Reggiano, caper berries, and white truffle oil.",
    price: 750,
    currency: "INR",
    ingredients: ["Prime beef tenderloin", "Wild arugula", "Parmigiano Reggiano", "Caper berries", "White truffle oil"],
    allergens: ["Dairy"],
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: true,
    spicyLevel: 0,
    isSignature: true,
    isChefSpecial: false,
    isAvailable: true,
    preparationTimeMinutes: 8,
    displayOrder: 6,
    images: [
      {
        id: "img-06",
        menuItemId: "dish-06",
        url: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=2560&q=90",
        isPrimary: true,
        displayOrder: 1,
      },
      {
        id: "img-06-b",
        menuItemId: "dish-06",
        url: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=2560&q=90",
        isPrimary: false,
        displayOrder: 2,
      },
    ],
  },
  {
    id: "dish-07",
    restaurantId: "rest-01",
    categoryId: "cat-02",
    name: "Handmade Lobster & Crab Ravioli",
    slug: "handmade-lobster-crab-ravioli",
    description: "Handcrafted pillow ravioli stuffed with Maine lobster and lump crab, finished in a velvety saffron bisque reduction with chives.",
    price: 1150,
    currency: "INR",
    ingredients: ["Maine lobster", "Lump crab", "Fresh egg pasta", "Saffron bisque", "Cream", "Fresh chives"],
    allergens: ["Shellfish", "Dairy", "Gluten", "Eggs"],
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: false,
    spicyLevel: 0,
    isSignature: true,
    isChefSpecial: true,
    isAvailable: true,
    preparationTimeMinutes: 16,
    displayOrder: 7,
    images: [
      {
        id: "img-07",
        menuItemId: "dish-07",
        url: "https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=2560&q=90",
        isPrimary: true,
        displayOrder: 1,
      },
      {
        id: "img-07-b",
        menuItemId: "dish-07",
        url: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=2560&q=90",
        isPrimary: false,
        displayOrder: 2,
      },
    ],
  },
  {
    id: "dish-08",
    restaurantId: "rest-01",
    categoryId: "cat-03",
    name: "Diavola Calabrese Sourdough Pizza",
    slug: "diavola-calabrese-pizza",
    description: "Spicy artisanal Soppressata, fermented Calabrian chili oil, fior di latte mozzarella, San Marzano sauce, and wild clover hot honey.",
    price: 780,
    currency: "INR",
    ingredients: ["Calabrian soppressata", "Fior di latte", "San Marzano tomatoes", "Hot honey", "Calabrian chili"],
    allergens: ["Gluten", "Dairy"],
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: false,
    spicyLevel: 2,
    isSignature: false,
    isChefSpecial: true,
    isAvailable: true,
    preparationTimeMinutes: 12,
    displayOrder: 8,
    images: [
      {
        id: "img-08",
        menuItemId: "dish-08",
        url: "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=2560&q=90",
        isPrimary: true,
        displayOrder: 1,
      },
      {
        id: "img-08-b",
        menuItemId: "dish-08",
        url: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=2560&q=90",
        isPrimary: false,
        displayOrder: 2,
      },
    ],
  },
  {
    id: "dish-09",
    restaurantId: "rest-01",
    categoryId: "cat-04",
    name: "Pan-Seared Chilean Sea Bass",
    slug: "pan-seared-chilean-sea-bass",
    description: "Crispy skin Chilean sea bass served over roasted artichoke hearts, confit cherry tomatoes, and fragrant citrus thyme emulsion.",
    price: 1450,
    currency: "INR",
    ingredients: ["Chilean sea bass", "Artichoke hearts", "Heirloom cherry tomatoes", "Citrus thyme emulsion"],
    allergens: ["Fish"],
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: true,
    spicyLevel: 0,
    isSignature: true,
    isChefSpecial: true,
    isAvailable: true,
    preparationTimeMinutes: 20,
    displayOrder: 9,
    images: [
      {
        id: "img-09",
        menuItemId: "dish-09",
        url: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=2560&q=90",
        isPrimary: true,
        displayOrder: 1,
      },
      {
        id: "img-09-b",
        menuItemId: "dish-09",
        url: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=2560&q=90",
        isPrimary: false,
        displayOrder: 2,
      },
    ],
  },
  {
    id: "dish-10",
    restaurantId: "rest-01",
    categoryId: "cat-05",
    name: "Sicilian Pistachio & White Chocolate Panna Cotta",
    slug: "sicilian-pistachio-panna-cotta",
    description: "Silky Madagascar vanilla bean panna cotta infused with roasted Bronte pistachio praline and Belgian white chocolate curls.",
    price: 450,
    currency: "INR",
    ingredients: ["Heavy cream", "Bronte pistachio paste", "Vanilla bean", "White chocolate"],
    allergens: ["Dairy", "Tree Nuts"],
    isVegetarian: true,
    isVegan: false,
    isGlutenFree: true,
    spicyLevel: 0,
    isSignature: true,
    isChefSpecial: false,
    isAvailable: true,
    preparationTimeMinutes: 5,
    displayOrder: 10,
    images: [
      {
        id: "img-10",
        menuItemId: "dish-10",
        url: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=2560&q=90",
        isPrimary: true,
        displayOrder: 1,
      },
      {
        id: "img-10-b",
        menuItemId: "dish-10",
        url: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=2560&q=90",
        isPrimary: false,
        displayOrder: 2,
      },
    ],
  },
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: "rev-hg-01",
    menuItemId: "dish-01",
    restaurantId: "rest-01",
    displayName: "Vinayak Vanjari",
    avatarUrl: "https://lh3.googleusercontent.com/a-/ALV-UjWy57QUoNJ7_gjNHamHiQ2hVLXv-NRrnOktc41fP8j1q-lgkgvG=w36-h36-p-rp-mo-ba12-br100",
    rating: 1,
    reviewText: "Food quality very dull . BUTTER KHICHDI CHARGES 260 RS . pan tyat kahi butter nahi ekdum tasteless , Main course veg dish also tasteless . Very expensive also not quality given there my suggestion pls don't waist of money",
    aiSentiment: "NEGATIVE",
    sentimentScore: 0.12,
    tasteRating: 1,
    portionRating: 2,
    valueRating: 1,
    helpfulVotes: 4,
    reportCount: 0,
    moderationStatus: "APPROVED",
    isGoogleReview: true,
    createdAt: "2026-08-30T15:57:52.542Z",
    images: [],
  },
  {
    id: "rev-hg-02",
    menuItemId: "dish-02",
    restaurantId: "rest-01",
    displayName: "Sadhika Rane",
    avatarUrl: "https://lh3.googleusercontent.com/a-/ALV-UjXShWgPrc8FAVHIY9Db7xeqkNwZpfAhkfAsDUPaxJLC8niaaloDOQ=w36-h36-p-rp-mo-br100",
    rating: 5,
    reviewText: "Overall Good experience. Tambda pandhra rassa was delicious and authentic Kolhapuri flavor!",
    aiSentiment: "POSITIVE",
    sentimentScore: 0.94,
    tasteRating: 5,
    portionRating: 5,
    valueRating: 5,
    helpfulVotes: 8,
    reportCount: 0,
    moderationStatus: "APPROVED",
    ownerReplyText: "Thank you Sadhika ji! We take great pride in our authentic Kolhapuri recipes and spices.",
    ownerRepliedAt: "2026-08-20T10:30:00.000Z",
    isGoogleReview: true,
    createdAt: "2026-08-19T15:57:52.612Z",
    images: [],
  },
  {
    id: "rev-hg-03",
    menuItemId: "dish-03",
    restaurantId: "rest-01",
    displayName: "Hanmant Patil",
    avatarUrl: "https://lh3.googleusercontent.com/a/ACg8ocKj4dVbp5Zx7LXV2UGvjOYZS7TaWS5UCHmyDihwwvmZd4c-JQ=w36-h36-p-rp-mo-br100",
    rating: 5,
    reviewText: "Very nice.. 👍 Special chicken thali and ambiance was really good.",
    aiSentiment: "POSITIVE",
    sentimentScore: 0.96,
    tasteRating: 5,
    portionRating: 5,
    valueRating: 5,
    helpfulVotes: 11,
    reportCount: 0,
    moderationStatus: "APPROVED",
    isGoogleReview: true,
    createdAt: "2026-08-19T15:57:52.587Z",
    images: [],
  },
  {
    id: "rev-hg-04",
    menuItemId: "dish-04",
    restaurantId: "rest-01",
    displayName: "Paritosh Chougule",
    avatarUrl: "https://lh3.googleusercontent.com/a-/ALV-UjVanO5RTQPqMtNUp2YvCOvmt9oPFl1KszYGmDvMshXFsp1up3tn=w36-h36-p-rp-mo-ba12-br100",
    rating: 4,
    reviewText: "Nice Restaurant with great Ambiance. Service is quite slow if one has large group.",
    aiSentiment: "POSITIVE",
    sentimentScore: 0.78,
    tasteRating: 4,
    portionRating: 4,
    valueRating: 4,
    helpfulVotes: 5,
    reportCount: 0,
    moderationStatus: "APPROVED",
    isGoogleReview: true,
    createdAt: "2026-07-04T15:57:52.911Z",
    images: [],
  },
  {
    id: "rev-hg-05",
    menuItemId: "dish-05",
    restaurantId: "rest-01",
    displayName: "Ravi Shewale",
    avatarUrl: "https://lh3.googleusercontent.com/a-/ALV-UjWNT_eZjvoNmMRYZvW233iLcxt3f7-NMx0lPCnG-RszySwWFtLd=w36-h36-p-rp-mo-ba12-br100",
    rating: 5,
    reviewText: "Authentic Kolhapuri taste and spacious garden seating. Excellent mutton fry and solkadhi.",
    aiSentiment: "POSITIVE",
    sentimentScore: 0.97,
    tasteRating: 5,
    portionRating: 5,
    valueRating: 5,
    helpfulVotes: 14,
    reportCount: 0,
    moderationStatus: "APPROVED",
    isGoogleReview: true,
    createdAt: "2026-06-04T15:57:53.099Z",
    images: [],
  },
];

export const INITIAL_GOOGLE_REVIEWS: GoogleReview[] = [
  {
    id: "g-rev-hg-01",
    restaurantId: "rest-01",
    authorName: "Vinayak Vanjari",
    authorPhotoUrl: "https://lh3.googleusercontent.com/a-/ALV-UjWy57QUoNJ7_gjNHamHiQ2hVLXv-NRrnOktc41fP8j1q-lgkgvG=w36-h36-p-rp-mo-ba12-br100",
    rating: 1,
    text: "Food quality very dull . BUTTER KHICHDI CHARGES 260 RS . pan tyat kahi butter nahi ekdum tasteless , Main course veg dish also tasteless . Very expensive also not quality given there my suggestion pls don't waist of money",
    relativeTime: "3 days ago",
    publishTime: "2026-08-30T15:57:52.542Z",
    isImported: true,
    createdAt: "2026-08-30T15:57:52.542Z",
  },
  {
    id: "g-rev-hg-02",
    restaurantId: "rest-01",
    authorName: "Athrav Mane",
    authorPhotoUrl: "https://lh3.googleusercontent.com/a-/ALV-UjVmS0BkEhK3kNxmxHA2yf1vE5AQ4TU7kgJHQC5JxYC_Ld6nLH6R=w36-h36-p-rp-mo-br100",
    rating: 2,
    text: "Service was slow on weekend. Need to improve dining speed.",
    relativeTime: "a week ago",
    publishTime: "2026-08-26T15:57:52.564Z",
    isImported: true,
    createdAt: "2026-08-26T15:57:52.564Z",
  },
  {
    id: "g-rev-hg-03",
    restaurantId: "rest-01",
    authorName: "Sadhika Rane",
    authorPhotoUrl: "https://lh3.googleusercontent.com/a-/ALV-UjXShWgPrc8FAVHIY9Db7xeqkNwZpfAhkfAsDUPaxJLC8niaaloDOQ=w36-h36-p-rp-mo-br100",
    rating: 5,
    text: "Overall Good experience. Tambda pandhra rassa was delicious and authentic Kolhapuri flavor!",
    relativeTime: "2 weeks ago",
    publishTime: "2026-08-19T15:57:52.612Z",
    isImported: true,
    createdAt: "2026-08-19T15:57:52.612Z",
  },
  {
    id: "g-rev-hg-04",
    restaurantId: "rest-01",
    authorName: "Hanmant Patil",
    authorPhotoUrl: "https://lh3.googleusercontent.com/a/ACg8ocKj4dVbp5Zx7LXV2UGvjOYZS7TaWS5UCHmyDihwwvmZd4c-JQ=w36-h36-p-rp-mo-br100",
    rating: 5,
    text: "Very nice.. 👍 Special chicken thali and ambiance was really good.",
    relativeTime: "2 weeks ago",
    publishTime: "2026-08-19T15:57:52.587Z",
    isImported: true,
    createdAt: "2026-08-19T15:57:52.587Z",
  },
  {
    id: "g-rev-hg-05",
    restaurantId: "rest-01",
    authorName: "Siddharth Rane",
    authorPhotoUrl: "https://lh3.googleusercontent.com/a/ACg8ocLN8SEzQok2YfV2bvqSNsOfDVHOXN0hwycAVUvKLkP9E4tsvA=w36-h36-p-rp-mo-br100",
    rating: 5,
    text: "Great atmosphere and palace garden dining setup. Loved the food quality.",
    relativeTime: "2 weeks ago",
    publishTime: "2026-08-19T15:57:52.634Z",
    isImported: true,
    createdAt: "2026-08-19T15:57:52.634Z",
  },
  {
    id: "g-rev-hg-06",
    restaurantId: "rest-01",
    authorName: "Dhanashree Bavache",
    authorPhotoUrl: "https://lh3.googleusercontent.com/a-/ALV-UjWqYIVskv8VTg0amfJWiDStSGQdMWx8go6L_KB99exOxVrojLXD=w36-h36-p-rp-mo-br100",
    rating: 5,
    text: "Wonderful family dining palace in Peth Vadgaon. Delicious dishes.",
    relativeTime: "2 weeks ago",
    publishTime: "2026-08-19T15:57:52.656Z",
    isImported: true,
    createdAt: "2026-08-19T15:57:52.656Z",
  },
  {
    id: "g-rev-hg-07",
    restaurantId: "rest-01",
    authorName: "Shubham Hawale",
    authorPhotoUrl: "https://lh3.googleusercontent.com/a/ACg8ocLJPJJ8jJXzKuQqbpYv9gQBhpBydOJrU4ZpUirPtX44utjStQ=w36-h36-p-rp-mo-br100",
    rating: 1,
    text: "Food quality is not good. Owner is rude. Not recommended",
    relativeTime: "3 weeks ago",
    publishTime: "2026-08-12T15:57:52.679Z",
    isImported: true,
    createdAt: "2026-08-12T15:57:52.679Z",
  },
  {
    id: "g-rev-hg-08",
    restaurantId: "rest-01",
    authorName: "Paritosh Chougule",
    authorPhotoUrl: "https://lh3.googleusercontent.com/a-/ALV-UjVanO5RTQPqMtNUp2YvCOvmt9oPFl1KszYGmDvMshXFsp1up3tn=w36-h36-p-rp-mo-ba12-br100",
    rating: 4,
    text: "Nice Restaurant with great Ambiance. Service is quite slow if one has large group.",
    relativeTime: "2 months ago",
    publishTime: "2026-07-04T15:57:52.911Z",
    isImported: true,
    createdAt: "2026-07-04T15:57:52.911Z",
  },
  {
    id: "g-rev-hg-09",
    restaurantId: "rest-01",
    authorName: "Saiprasad Patil",
    authorPhotoUrl: "https://lh3.googleusercontent.com/a/ACg8ocIoEBDCUIYDLE_GZ7v-U-7_fZ7-7QyK-wh5JRid91vH3wFBPE7U=w36-h36-p-rp-mo-br100",
    rating: 4,
    text: "Everything's Neat and Perfect.",
    relativeTime: "2 months ago",
    publishTime: "2026-07-04T15:57:52.864Z",
    isImported: true,
    createdAt: "2026-07-04T15:57:52.864Z",
  },
  {
    id: "g-rev-hg-10",
    restaurantId: "rest-01",
    authorName: "Ravi Shewale",
    authorPhotoUrl: "https://lh3.googleusercontent.com/a-/ALV-UjWNT_eZjvoNmMRYZvW233iLcxt3f7-NMx0lPCnG-RszySwWFtLd=w36-h36-p-rp-mo-ba12-br100",
    rating: 5,
    text: "Authentic Kolhapuri taste and spacious garden seating. Excellent mutton fry and solkadhi.",
    relativeTime: "3 months ago",
    publishTime: "2026-06-04T15:57:53.099Z",
    isImported: true,
    createdAt: "2026-06-04T15:57:53.099Z",
  },
  {
    id: "g-rev-hg-11",
    restaurantId: "rest-01",
    authorName: "Alka Kamble",
    authorPhotoUrl: "https://lh3.googleusercontent.com/a-/ALV-UjUr06LFVQJh3VXUpLAhrXyG5zaiqSPK1vi7Us8tMaxgmTn4hxo=w36-h36-p-rp-mo-br100",
    rating: 5,
    text: "Very nice family restaurant. Fast service and courteous staff.",
    relativeTime: "3 months ago",
    publishTime: "2026-06-04T15:57:53.074Z",
    isImported: true,
    createdAt: "2026-06-04T15:57:53.074Z",
  },
  {
    id: "g-rev-hg-12",
    restaurantId: "rest-01",
    authorName: "Virinchi Reddy",
    authorPhotoUrl: "https://lh3.googleusercontent.com/a-/ALV-UjUDhBG04Zv9wdNIEDFeOwSN---Mfxo_a6P7IfkJiMjSgYnJCLoCPg=w36-h36-p-rp-mo-ba12-br100",
    rating: 4,
    text: "Good food stop on highway road. Try their signature specials.",
    relativeTime: "3 months ago",
    publishTime: "2026-06-04T15:57:53.052Z",
    isImported: true,
    createdAt: "2026-06-04T15:57:53.052Z",
  },
];

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

      if (rest) {
        const parsed = JSON.parse(rest);
        if (Array.isArray(parsed) && parsed.length > 0) {
          this.restaurants = parsed.map((r: Restaurant) => {
            r.name = "Hotel Gypsy";
            r.address = "Peth Vadgaon, Kolhapur";
            r.cuisineType = "5-Star Luxury Palace & Fine Dining";
            r.coverUrl = "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=3840&q=95";
            r.logoUrl = "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=85";
            return r;
          });
        }
      }
      if (cats) {
        const parsed = JSON.parse(cats);
        if (Array.isArray(parsed) && parsed.length > 0) this.categories = parsed;
      }
      if (dishes) {
        const parsed = JSON.parse(dishes);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const initMap = new Map(INITIAL_DISHES.map((d) => [d.id, d]));
          const fallbackImgs = [
            "https://images.unsplash.com/photo-1612874742237-6526221588e3?auto=format&fit=crop&w=2560&q=90",
            "https://images.unsplash.com/photo-1608897013039-887f21d8c804?auto=format&fit=crop&w=2560&q=90",
            "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=2560&q=90",
            "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=2560&q=90",
            "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=2560&q=90",
            "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=2560&q=90",
            "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=2560&q=90",
          ];
          this.dishes = parsed.map((d: MenuItem, idx: number) => {
            const seed = initMap.get(d.id);
            // Auto-repair any known stale/broken URLs
            const cleanImages = (seed?.images && seed.images.length > 0)
              ? seed.images
              : (d.images || [])
                  .filter((img) => img && typeof img.url === "string" && img.url.trim().startsWith("http"))
                  .map((img) => {
                    if (img.url.includes("photo-1592417817098-8f3d6910985b")) {
                      return { ...img, url: "https://images.unsplash.com/photo-1608897013039-887f21d8c804?auto=format&fit=crop&w=2560&q=90" };
                    }
                    if (img.url.includes("photo-1621996346565-e3d5d6281292")) {
                      return { ...img, url: "https://images.unsplash.com/photo-1612874742237-6526221588e3?auto=format&fit=crop&w=2560&q=90" };
                    }
                    return img;
                  });
            const resolvedImages =
              cleanImages.length > 0
                ? cleanImages
                : [
                    {
                      id: `img-${d.id}-01`,
                      menuItemId: d.id,
                      url: fallbackImgs[idx % fallbackImgs.length],
                      isPrimary: true,
                      displayOrder: 1,
                    },
                  ];

            return {
              ...d,
              price:
                !d.currency || d.currency === "USD" || d.price < 100
                  ? seed
                    ? seed.price
                    : Math.max(d.price * 80, 450)
                  : d.price,
              currency: "INR",
              images: resolvedImages,
            };
          });
          const existingIds = new Set(this.dishes.map((d) => d.id));
          const missing = INITIAL_DISHES.filter((d) => !existingIds.has(d.id));
          this.dishes.push(...missing);
        }
      }
      if (reviews) {
        const parsed = JSON.parse(reviews);
        if (Array.isArray(parsed) && parsed.length > 0) this.reviews = parsed;
      }
      if (gReviews) {
        const parsed = JSON.parse(gReviews);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const seen = new Set<string>();
          const unique: GoogleReview[] = [];
          for (const r of parsed) {
            const key = `${(r.authorName || "").trim().toLowerCase()}_${(r.text || "").trim().toLowerCase()}`;
            if (!seen.has(key)) {
              seen.add(key);
              unique.push(r);
            }
          }
          this.googleReviews = unique;
        }
      }
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

    const rawGoogleReviews = this.googleReviews.filter(
      (g) => g.restaurantId === restaurant.id || !g.restaurantId || g.restaurantId === "rest-01" || restaurant.id === "rest-02"
    );
    const seenG = new Set<string>();
    const restGoogleReviews: GoogleReview[] = [];
    for (const g of rawGoogleReviews) {
      const key = `${(g.authorName || "").trim().toLowerCase()}_${(g.text || "").trim().toLowerCase()}`;
      if (!seenG.has(key)) {
        seenG.add(key);
        restGoogleReviews.push(g);
      }
    }
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

    const totalReviews = restReviews.length > 0 ? restReviews.length : 24;
    const totalScans = Math.max(1248, totalReviews * 42);
    const uniqueVisitors = Math.round(totalScans * 0.74);
    const totalDishViews = Math.round(totalScans * 3.4);

    const avgRating = restReviews.length > 0
      ? Number((restReviews.reduce((acc, r) => acc + r.rating, 0) / restReviews.length).toFixed(1))
      : 4.9;

    const posCount = restReviews.filter((r) => r.rating >= 4 || r.aiSentiment === "POSITIVE").length || 22;
    const neuCount = restReviews.filter((r) => r.rating === 3 || r.aiSentiment === "NEUTRAL").length || 2;
    const negCount = restReviews.filter((r) => r.rating <= 2 || r.aiSentiment === "NEGATIVE").length || 0;

    const dishesWithStats = restDishes.map((d, index) => {
      const dRevs = restReviews.filter((r) => r.menuItemId === d.id);
      const dAvg = dRevs.length > 0 ? dRevs.reduce((a, r) => a + r.rating, 0) / dRevs.length : (5.0 - index * 0.1);
      const mockViews = [342, 289, 250, 210, 180, 160, 140][index] || 120;
      const mockReviews = [28, 19, 18, 15, 11, 9, 7][index] || dRevs.length || 5;
      return {
        dish: d,
        viewCount: mockViews,
        reviewCount: mockReviews,
        rating: Number(dAvg.toFixed(1)),
      };
    });

    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const dailyViews = days.map((day, i) => ({
      date: day,
      scans: [142, 168, 155, 189, 245, 312, 280][i] || 150,
      views: [390, 480, 420, 560, 780, 940, 860][i] || 400,
      reviews: [3, 4, 3, 5, 8, 12, 9][i] || 4,
    }));

    return {
      totalScans,
      uniqueVisitors,
      totalDishViews,
      totalReviews,
      totalCustomerPhotos: Math.max(18, restReviews.reduce((acc, r) => acc + (r.images?.length || 0), 0)),
      avgRating,
      avgSessionDurationSeconds: 246,
      sentimentDistribution: {
        positive: totalReviews > 0 ? Math.round((posCount / totalReviews) * 100) : 92,
        neutral: totalReviews > 0 ? Math.round((neuCount / totalReviews) * 100) : 6,
        negative: totalReviews > 0 ? Math.round((negCount / totalReviews) * 100) : 2,
      },
      dailyViews,
      topPerformingDishes: dishesWithStats.slice(0, 3),
      underperformingDishes: dishesWithStats.slice(-2),
    };
  }
}

export const menuVerseStore = new MenuVerseStore();
