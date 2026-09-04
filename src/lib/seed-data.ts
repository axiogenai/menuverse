import { Restaurant, Category, MenuItem, Review, GoogleReview, AnalyticsSummary } from "@/types";
import { computeDishStatistics } from "./algorithms/reputation";
import { generateDishAISummary } from "./ai/sentiment";

export const INITIAL_RESTAURANTS: Restaurant[] = [
  {
    id: "rest-01",
    name: "Hotel Gypsy",
    slug: "hotel-gypsy",
    description: "5-Star Luxury Palace Hotel & Fine Dining in Peth Vadgaon, Kolhapur offering authentic Kolhapuri heritage specials, tambda pandhra rassa, royal kebabs, and handcrafted tandoori delicacies.",
    logoUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=85",
    coverUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
    address: "Peth Vadgaon, Kolhapur, Maharashtra 416112",
    phone: "075885 76706",
    website: "https://hotelgypsy.vercel.app",
    cuisineType: "5-Star Kolhapuri Heritage & Royal Fine Dining",
    priceRange: "₹₹₹",
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
    slug: "hotel-gypsy-palace",
    description: "5-Star Luxury Palace Hotel & Fine Dining in Peth Vadgaon, Kolhapur offering authentic Kolhapuri heritage specials, tambda pandhra rassa, royal kebabs, and handcrafted tandoori delicacies.",
    logoUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=85",
    coverUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
    address: "Peth Vadgaon, Kolhapur, Maharashtra 416112",
    phone: "075885 76706",
    website: "https://hotelgypsy.vercel.app",
    cuisineType: "5-Star Kolhapuri Heritage & Royal Fine Dining",
    priceRange: "₹₹₹",
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
      socialInstagram: "@hotelgypsy",
    },
  },
];

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: "cat-01",
    restaurantId: "rest-01",
    name: "Kolhapuri Heritage Specials",
    slug: "kolhapuri-specials",
    description: "Authentic Kolhapuri tambda pandhra rassa, traditional sukka thalis, and spicy heritage delicacies",
    icon: "Flame",
    displayOrder: 1,
    isVisible: true,
    isActive: true,
  },
  {
    id: "cat-02",
    restaurantId: "rest-01",
    name: "Tandoori & Royal Kebabs",
    slug: "tandoori-kebabs",
    description: "Clay-oven charred succulent kebabs, malai tikkas, and sizzling tandoori platters",
    icon: "Utensils",
    displayOrder: 2,
    isVisible: true,
    isActive: true,
  },
  {
    id: "cat-03",
    restaurantId: "rest-01",
    name: "Main Course Curries & Gravies",
    slug: "main-course",
    description: "Rich Mughlai gravies, authentic Kolhapuri masalas, and fragrant vegetarian curries",
    icon: "Soup",
    displayOrder: 3,
    isVisible: true,
    isActive: true,
  },
  {
    id: "cat-04",
    restaurantId: "rest-01",
    name: "Royal Biryani & Fragrant Rice",
    slug: "biryani-rice",
    description: "Slow-cooked dum biryanis, aromatic jeera rice, and chef special pulao",
    icon: "Crown",
    displayOrder: 4,
    isVisible: true,
    isActive: true,
  },
  {
    id: "cat-05",
    restaurantId: "rest-01",
    name: "Artisanal Breads & Rotis",
    slug: "breads-rotis",
    description: "Tandoori rotis, garlic butter naans, and traditional bhakris hot from the oven",
    icon: "Layers",
    displayOrder: 5,
    isVisible: true,
    isActive: true,
  },
  {
    id: "cat-06",
    restaurantId: "rest-01",
    name: "Desserts & Royal Beverages",
    slug: "desserts-beverages",
    description: "Authentic Solkadhi, Shahi Gulab Jamun with Rabdi, and refreshing beverages",
    icon: "IceCream",
    displayOrder: 6,
    isVisible: true,
    isActive: true,
  },
];

export const INITIAL_DISHES: MenuItem[] = [
  {
    id: "dish-01",
    restaurantId: "rest-01",
    categoryId: "cat-01",
    name: "Special Kolhapuri Chicken Thali",
    slug: "special-kolhapuri-chicken-thali",
    description: "Grand authentic royal thali featuring Kolhapuri Chicken Sukka, Unlimited Tambda Rassa, Pandhra Rassa, 2 Hot Bhakris / Chapatis, and fragrant Indrayani Rice.",
    price: 380,
    currency: "INR",
    ingredients: ["Kolhapuri Desi Spices", "Tender Farm Chicken", "Coconut Base", "Poppy Seeds", "Sesame", "Pure Ghee"],
    allergens: [],
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: true,
    spicyLevel: 3,
    isSignature: true,
    isChefSpecial: true,
    isAvailable: true,
    preparationTimeMinutes: 15,
    displayOrder: 1,
    images: [
      {
        id: "img-01",
        menuItemId: "dish-01",
        url: "https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=800&q=80",
        isPrimary: true,
        displayOrder: 1,
      },
      {
        id: "img-01-b",
        menuItemId: "dish-01",
        url: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80",
        isPrimary: false,
        displayOrder: 2,
      },
    ],
  },
  {
    id: "dish-02",
    restaurantId: "rest-01",
    categoryId: "cat-01",
    name: "Authentic Mutton Sukka & Tambda Rassa",
    slug: "authentic-mutton-sukka-tambda-rassa",
    description: "Slow-braised tender goat mutton tossed in caramelized onion and roasted Kolhapuri masala, served alongside hot spicy red chili broth.",
    price: 490,
    currency: "INR",
    ingredients: ["Tender Goat Mutton", "Lavangi Mirchi Masala", "Caramelized Onion", "Ginger-Garlic Paste", "Cold-pressed Oil"],
    allergens: [],
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: true,
    spicyLevel: 3,
    isSignature: true,
    isChefSpecial: true,
    isAvailable: true,
    preparationTimeMinutes: 20,
    displayOrder: 2,
    images: [
      {
        id: "img-02",
        menuItemId: "dish-02",
        url: "https://images.unsplash.com/photo-1574653853027-5382a3d23a15?auto=format&fit=crop&w=800&q=80",
        isPrimary: true,
        displayOrder: 1,
      },
      {
        id: "img-02-b",
        menuItemId: "dish-02",
        url: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80",
        isPrimary: false,
        displayOrder: 2,
      },
    ],
  },
  {
    id: "dish-03",
    restaurantId: "rest-01",
    categoryId: "cat-02",
    name: "Murgh Malai Tikka",
    slug: "murgh-malai-tikka",
    description: "Melt-in-your-mouth boneless chicken chunks marinated in rich clotted cream, hung curd, green cardamom, and toasted cashews, chargrilled in tandoor.",
    price: 360,
    currency: "INR",
    ingredients: ["Chicken Supreme", "Amul Malai", "Hung Curd", "Cashew Paste", "Green Cardamom", "White Pepper"],
    allergens: ["Dairy", "Tree Nuts"],
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: true,
    spicyLevel: 1,
    isSignature: true,
    isChefSpecial: false,
    isAvailable: true,
    preparationTimeMinutes: 16,
    displayOrder: 3,
    images: [
      {
        id: "img-03",
        menuItemId: "dish-03",
        url: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=800&q=80",
        isPrimary: true,
        displayOrder: 1,
      },
      {
        id: "img-03-b",
        menuItemId: "dish-03",
        url: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=80",
        isPrimary: false,
        displayOrder: 2,
      },
    ],
  },
  {
    id: "dish-04",
    restaurantId: "rest-01",
    categoryId: "cat-02",
    name: "Paneer Angara Tikka",
    slug: "paneer-angara-tikka",
    description: "Cubes of fresh malai cottage cheese spiced with crushed mustard seeds, Mathania red chili, and smoked over live charcoal embers.",
    price: 310,
    currency: "INR",
    ingredients: ["Fresh Cottage Cheese", "Mathania Chili Paste", "Mustard Oil", "Ajwain", "Kasuri Methi"],
    allergens: ["Dairy"],
    isVegetarian: true,
    isVegan: false,
    isGlutenFree: true,
    spicyLevel: 2,
    isSignature: false,
    isChefSpecial: true,
    isAvailable: true,
    preparationTimeMinutes: 14,
    displayOrder: 4,
    images: [
      {
        id: "img-04",
        menuItemId: "dish-04",
        url: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=800&q=80",
        isPrimary: true,
        displayOrder: 1,
      },
      {
        id: "img-04-b",
        menuItemId: "dish-04",
        url: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80",
        isPrimary: false,
        displayOrder: 2,
      },
    ],
  },
  {
    id: "dish-05",
    restaurantId: "rest-01",
    categoryId: "cat-04",
    name: "Dum Pukht Chicken Biryani",
    slug: "dum-pukht-chicken-biryani",
    description: "Aged long-grain Basmati rice and spiced chicken slow-cooked in a sealed handi with pure cow ghee, saffron, fried onions, and fresh mint.",
    price: 390,
    currency: "INR",
    ingredients: ["Long-grain Basmati Rice", "Tender Chicken", "Kashmiri Saffron", "Desi Ghee", "Crispy Birista", "Mint Leaves"],
    allergens: ["Dairy"],
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: true,
    spicyLevel: 2,
    isSignature: true,
    isChefSpecial: true,
    isAvailable: true,
    preparationTimeMinutes: 18,
    displayOrder: 5,
    images: [
      {
        id: "img-05",
        menuItemId: "dish-05",
        url: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80",
        isPrimary: true,
        displayOrder: 1,
      },
      {
        id: "img-05-b",
        menuItemId: "dish-05",
        url: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=80",
        isPrimary: false,
        displayOrder: 2,
      },
    ],
  },
  {
    id: "dish-06",
    restaurantId: "rest-01",
    categoryId: "cat-03",
    name: "Paneer Butter Masala",
    slug: "paneer-butter-masala",
    description: "Silky smooth tomato-cashew makhani gravy with tender cubes of malai paneer, finished with aromatic fenugreek and cultured butter.",
    price: 290,
    currency: "INR",
    ingredients: ["Malai Paneer", "Plum Tomatoes", "Cashew Cream", "Kasuri Methi", "Pure Butter", "Garam Masala"],
    allergens: ["Dairy", "Tree Nuts"],
    isVegetarian: true,
    isVegan: false,
    isGlutenFree: true,
    spicyLevel: 1,
    isSignature: false,
    isChefSpecial: false,
    isAvailable: true,
    preparationTimeMinutes: 12,
    displayOrder: 6,
    images: [
      {
        id: "img-06",
        menuItemId: "dish-06",
        url: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80",
        isPrimary: true,
        displayOrder: 1,
      },
      {
        id: "img-06-b",
        menuItemId: "dish-06",
        url: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=80",
        isPrimary: false,
        displayOrder: 2,
      },
    ],
  },
  {
    id: "dish-07",
    restaurantId: "rest-01",
    categoryId: "cat-03",
    name: "Dal Tadka Gypsy Special",
    slug: "dal-tadka-gypsy-special",
    description: "Yellow lentils tempered with ghee, cumin seeds, garlic, curry leaves, and dry red chilies for a smoky, comforting finish.",
    price: 220,
    currency: "INR",
    ingredients: ["Toor Dal", "Pure Ghee", "Whole Cumin", "Golden Fried Garlic", "Curry Leaves", "Hing"],
    allergens: ["Dairy"],
    isVegetarian: true,
    isVegan: false,
    isGlutenFree: true,
    spicyLevel: 1,
    isSignature: false,
    isChefSpecial: false,
    isAvailable: true,
    preparationTimeMinutes: 10,
    displayOrder: 7,
    images: [
      {
        id: "img-07",
        menuItemId: "dish-07",
        url: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80",
        isPrimary: true,
        displayOrder: 1,
      },
      {
        id: "img-07-b",
        menuItemId: "dish-07",
        url: "https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=800&q=80",
        isPrimary: false,
        displayOrder: 2,
      },
    ],
  },
  {
    id: "dish-08",
    restaurantId: "rest-01",
    categoryId: "cat-05",
    name: "Butter Garlic Naan",
    slug: "butter-garlic-naan",
    description: "Fluffy leavened refined flour bread baked in a clay tandoor, topped with minced garlic, coriander, and lashings of melted butter.",
    price: 75,
    currency: "INR",
    ingredients: ["Refined Flour", "Minced Garlic", "Butter", "Fresh Coriander", "Milk"],
    allergens: ["Gluten", "Dairy"],
    isVegetarian: true,
    isVegan: false,
    isGlutenFree: false,
    spicyLevel: 0,
    isSignature: false,
    isChefSpecial: false,
    isAvailable: true,
    preparationTimeMinutes: 5,
    displayOrder: 8,
    images: [
      {
        id: "img-08",
        menuItemId: "dish-08",
        url: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80",
        isPrimary: true,
        displayOrder: 1,
      },
      {
        id: "img-08-b",
        menuItemId: "dish-08",
        url: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=800&q=80",
        isPrimary: false,
        displayOrder: 2,
      },
    ],
  },
  {
    id: "dish-09",
    restaurantId: "rest-01",
    categoryId: "cat-06",
    name: "Gulab Jamun with Shahi Rabdi",
    slug: "gulab-jamun-shahi-rabdi",
    description: "Warm, melt-in-the-mouth khoya dumplings soaked in rose-cardamom syrup, served over chilled slow-reduced saffron rabdi and pistachios.",
    price: 160,
    currency: "INR",
    ingredients: ["Mawa / Khoya", "Rose Syrup", "Saffron Rabdi", "Pistachio Slivers", "Cardamom"],
    allergens: ["Dairy", "Gluten", "Tree Nuts"],
    isVegetarian: true,
    isVegan: false,
    isGlutenFree: false,
    spicyLevel: 0,
    isSignature: true,
    isChefSpecial: true,
    isAvailable: true,
    preparationTimeMinutes: 5,
    displayOrder: 9,
    images: [
      {
        id: "img-09",
        menuItemId: "dish-09",
        url: "https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=800&q=80",
        isPrimary: true,
        displayOrder: 1,
      },
      {
        id: "img-09-b",
        menuItemId: "dish-09",
        url: "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=800&q=80",
        isPrimary: false,
        displayOrder: 2,
      },
    ],
  },
  {
    id: "dish-10",
    restaurantId: "rest-01",
    categoryId: "cat-06",
    name: "Authentic Kolhapuri Solkadhi",
    slug: "authentic-kolhapuri-solkadhi",
    description: "Refreshing and digestive traditional drink made from freshly squeezed thick coconut milk, wild kokum extract, garlic, and fresh green chili.",
    price: 90,
    currency: "INR",
    ingredients: ["Fresh Coconut Milk", "Wild Kokum Agal", "Garlic", "Coriander", "Cumin", "Himalayan Pink Salt"],
    allergens: [],
    isVegetarian: true,
    isVegan: true,
    isGlutenFree: true,
    spicyLevel: 1,
    isSignature: true,
    isChefSpecial: false,
    isAvailable: true,
    preparationTimeMinutes: 3,
    displayOrder: 10,
    images: [
      {
        id: "img-10",
        menuItemId: "dish-10",
        url: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80",
        isPrimary: true,
        displayOrder: 1,
      },
      {
        id: "img-10-b",
        menuItemId: "dish-10",
        url: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=800&q=80",
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
      const dataVersion = localStorage.getItem("menuverse_data_version");
      if (dataVersion !== "v7-authentic-indian-dishes") {
        this.resetAllData();
        localStorage.setItem("menuverse_data_version", "v7-authentic-indian-dishes");
        return;
      }

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
            "https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1574653853027-5382a3d23a15?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80",
          ];
          this.dishes = parsed.map((d: MenuItem, idx: number) => {
            const seed = initMap.get(d.id);
            // Always prioritize authentic seed food photography for initial seed dishes
            const cleanImages = (seed?.images && seed.images.length > 0)
              ? seed.images
              : (d.images || [])
                  .filter((img) => img && typeof img.url === "string" && img.url.trim().startsWith("http") && !img.url.includes("photo-1541781774459") && !img.url.includes("photo-1599488615731"))
                  .map((img) => {
                    if (img.url.includes("photo-1592417817098-8f3d6910985b") || img.url.includes("photo-1621996346565-e3d5d6281292")) {
                      return { ...img, url: fallbackImgs[idx % fallbackImgs.length] };
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
    let restaurant = slug ? this.restaurants.find((r) => r.slug === slug || (slug === "gusto-trattoria" && r.slug === "hotel-gypsy")) : null;
    if (!restaurant) {
      restaurant = this.restaurants.find((r) => r.slug === "hotel-gypsy") || this.restaurants[0];
    }
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
