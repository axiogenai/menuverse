import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

async function main() {
  console.log("🚀 Starting database seeding to Supabase...");

  // 1. Create or Update Restaurant
  const restaurant = await prisma.restaurant.upsert({
    where: { slug: "hotel-gypsy" },
    update: {
      name: "Hotel Gypsy",
      cuisineType: "5-Star Luxury Palace & Fine Dining",
      address: "Peth Vadgaon, Kolhapur, Maharashtra 416112",
      phone: "075885 76706",
      website: "https://menuverse.axiogen.in/r/hotel-gypsy",
      priceRange: "₹₹",
      isVerified: true,
      logoUrl: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=85",
      coverUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=3840&q=95",
      description: "Experience the royal heritage of Kolhapur with world-class palace dining, authentic tambda pandhra rassa, hand-crafted tandoori delicacies, and luxury garden ambiance.",
    },
    create: {
      id: "rest-01",
      name: "Hotel Gypsy",
      slug: "hotel-gypsy",
      cuisineType: "5-Star Luxury Palace & Fine Dining",
      address: "Peth Vadgaon, Kolhapur, Maharashtra 416112",
      phone: "075885 76706",
      website: "https://menuverse.axiogen.in/r/hotel-gypsy",
      priceRange: "₹₹",
      isVerified: true,
      logoUrl: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=85",
      coverUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=3840&q=95",
      description: "Experience the royal heritage of Kolhapur with world-class palace dining, authentic tambda pandhra rassa, hand-crafted tandoori delicacies, and luxury garden ambiance.",
    },
  });

  console.log(`✅ Restaurant configured: ${restaurant.name} (${restaurant.id})`);

  // 2. Settings
  await prisma.restaurantSettings.upsert({
    where: { restaurantId: restaurant.id },
    update: {
      primaryColor: "#f59e0b",
      accentColor: "#d97706",
      showPrices: true,
      enableReviews: true,
      enablePhotoUploads: true,
      enableAiSummaries: true,
    },
    create: {
      restaurantId: restaurant.id,
      primaryColor: "#f59e0b",
      accentColor: "#d97706",
      showPrices: true,
      enableReviews: true,
      enablePhotoUploads: true,
      enableAiSummaries: true,
    },
  });

  // 3. Categories
  const categoriesData = [
    {
      id: "cat-01",
      name: "Kolhapuri Heritage Specials",
      slug: "kolhapuri-specials",
      description: "Signature traditional preparations made with secret roasted spice masalas",
      icon: "Flame",
      displayOrder: 1,
    },
    {
      id: "cat-02",
      name: "Tandoori & Royal Kebabs",
      slug: "tandoori-kebabs",
      description: "Clay-oven roasted meats and artisanal cottage cheese skewers",
      icon: "Utensils",
      displayOrder: 2,
    },
    {
      id: "cat-03",
      name: "Main Course Delicacies",
      slug: "main-course",
      description: "Rich curries, slow-cooked gravies, and vegetarian specialties",
      icon: "Soup",
      displayOrder: 3,
    },
    {
      id: "cat-04",
      name: "Biryani & Fragrant Rice",
      slug: "biryani-rice",
      description: "Dum-cooked basmati rice with fragrant saffron, ghee, and whole spices",
      icon: "Crown",
      displayOrder: 4,
    },
    {
      id: "cat-05",
      name: "Artisanal Breads & Rotis",
      slug: "breads-rotis",
      description: "Freshly baked tandoori rotis, naans, and authentic bhakri",
      icon: "Layers",
      displayOrder: 5,
    },
  ];

  for (const cat of categoriesData) {
    await prisma.category.upsert({
      where: {
        restaurantId_slug: {
          restaurantId: restaurant.id,
          slug: cat.slug,
        },
      },
      update: {
        name: cat.name,
        description: cat.description,
        icon: cat.icon,
        displayOrder: cat.displayOrder,
      },
      create: {
        id: cat.id,
        restaurantId: restaurant.id,
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        icon: cat.icon,
        displayOrder: cat.displayOrder,
      },
    });
  }
  console.log("✅ Categories synced to Supabase");

  // 4. Menu Items
  const dishesData = [
    {
      id: "dish-01",
      categoryId: "cat-01",
      name: "Special Kolhapuri Chicken Thali",
      slug: "special-kolhapuri-chicken-thali",
      description: "Iconic royal thali featuring Sukka Chicken, unlimited piping hot Tambda Rassa, Pandhra Rassa, fresh Bhakri, and aromatic Indrayani Rice.",
      price: 380,
      currency: "INR",
      spicyLevel: 3,
      isSignature: true,
      isChefSpecial: true,
      imageUrl: "https://images.unsplash.com/photo-1612874742237-6526221588e3?auto=format&fit=crop&w=2560&q=90",
    },
    {
      id: "dish-02",
      categoryId: "cat-01",
      name: "Authentic Mutton Sukka & Rassa",
      slug: "authentic-mutton-sukka-rassa",
      description: "Tender goat meat braised with dark roasted coconut and whole spices, served alongside traditional tambda and creamy pandhra rassa.",
      price: 490,
      currency: "INR",
      spicyLevel: 3,
      isSignature: true,
      isChefSpecial: true,
      imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=2560&q=90",
    },
    {
      id: "dish-03",
      categoryId: "cat-02",
      name: "Murgh Malai Tikka",
      slug: "murgh-malai-tikka",
      description: "Succulent chicken chunks steeped in fresh cream, processed cheese, green cardamom, and mild green chillies before slow roasting.",
      price: 360,
      currency: "INR",
      spicyLevel: 1,
      isSignature: false,
      isChefSpecial: false,
      imageUrl: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=2560&q=90",
    },
    {
      id: "dish-04",
      categoryId: "cat-02",
      name: "Paneer Angara Tikka",
      slug: "paneer-angara-tikka",
      description: "Fresh cottage cheese marinated in fiery crushed spices, hung curd, and mustard oil, finished with live charcoal smoke infusion.",
      price: 310,
      currency: "INR",
      isVegetarian: true,
      spicyLevel: 2,
      isSignature: false,
      isChefSpecial: false,
      imageUrl: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=2560&q=90",
    },
    {
      id: "dish-05",
      categoryId: "cat-04",
      name: "Dum Pukht Chicken Biryani",
      slug: "dum-pukht-chicken-biryani",
      description: "Aged long-grain basmati rice layered with spiced chicken, caramelized onions, fresh mint, and pure ghee, sealed with dough and slow-steamed.",
      price: 390,
      currency: "INR",
      spicyLevel: 2,
      isSignature: true,
      isChefSpecial: false,
      imageUrl: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=2560&q=90",
    },
    {
      id: "dish-06",
      categoryId: "cat-03",
      name: "Paneer Butter Masala",
      slug: "paneer-butter-masala",
      description: "Velvety butter gravy slow-simmered with ripe tomatoes, cashew puree, dried fenugreek, and soft malai paneer cubes.",
      price: 290,
      currency: "INR",
      isVegetarian: true,
      spicyLevel: 1,
      isSignature: false,
      isChefSpecial: false,
      imageUrl: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=2560&q=90",
    },
    {
      id: "dish-07",
      categoryId: "cat-03",
      name: "Dal Tadka Gypsy Special",
      slug: "dal-tadka-gypsy-special",
      description: "Yellow lentils tempered with ghee, roasted cumin, minced garlic, dried red chillies, and fresh coriander.",
      price: 220,
      currency: "INR",
      isVegetarian: true,
      spicyLevel: 1,
      isSignature: false,
      isChefSpecial: false,
      imageUrl: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=2560&q=90",
    },
    {
      id: "dish-08",
      categoryId: "cat-05",
      name: "Butter Garlic Naan",
      slug: "butter-garlic-naan",
      description: "Tandoor baked refined flour bread infused with roasted garlic flakes and brushed generously with dairy butter.",
      price: 75,
      currency: "INR",
      isVegetarian: true,
      spicyLevel: 0,
      isSignature: false,
      isChefSpecial: false,
      imageUrl: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=2560&q=90",
    },
  ];

  for (const item of dishesData) {
    const dish = await prisma.menuItem.upsert({
      where: {
        restaurantId_slug: {
          restaurantId: restaurant.id,
          slug: item.slug,
        },
      },
      update: {
        name: item.name,
        description: item.description,
        price: item.price,
        currency: item.currency,
        spicyLevel: item.spicyLevel,
        isSignature: item.isSignature,
        isChefSpecial: item.isChefSpecial,
        isVegetarian: item.isVegetarian || false,
      },
      create: {
        id: item.id,
        restaurantId: restaurant.id,
        categoryId: item.categoryId,
        name: item.name,
        slug: item.slug,
        description: item.description,
        price: item.price,
        currency: item.currency,
        spicyLevel: item.spicyLevel,
        isSignature: item.isSignature,
        isChefSpecial: item.isChefSpecial,
        isVegetarian: item.isVegetarian || false,
      },
    });

    // Image
    await prisma.menuItemImage.upsert({
      where: { id: `img-${dish.id}-01` },
      update: { url: item.imageUrl },
      create: {
        id: `img-${dish.id}-01`,
        menuItemId: dish.id,
        url: item.imageUrl,
        isPrimary: true,
        displayOrder: 1,
      },
    });

    // Statistics
    await prisma.dishStatistics.upsert({
      where: { menuItemId: dish.id },
      update: {
        totalRatings: 28,
        averageRating: 4.8,
        totalReviews: 24,
        recommendationPercentage: 96.0,
        popularityScore: 92.5,
        trendScore: 88.0,
        fiveStarCount: 22,
        fourStarCount: 5,
        threeStarCount: 1,
      },
      create: {
        menuItemId: dish.id,
        totalRatings: 28,
        averageRating: 4.8,
        totalReviews: 24,
        recommendationPercentage: 96.0,
        popularityScore: 92.5,
        trendScore: 88.0,
        fiveStarCount: 22,
        fourStarCount: 5,
        threeStarCount: 1,
      },
    });
  }
  console.log("✅ Dishes, images & telemetry synced to Supabase");

  // 5. Seed Real Google Reviews from Hotel Gypsy
  let realReviews = [];
  try {
    const raw = fs.readFileSync(path.join(process.cwd(), "real_reviews.json"), "utf8").replace(/^\uFEFF/, "");
    const parsed = JSON.parse(raw);
    realReviews = parsed.reviews || [];
  } catch (err) {
    console.warn("Could not read real_reviews.json", err);
  }

  console.log(`📦 Inserting ${realReviews.length} real Google Reviews to Supabase...`);
  for (let i = 0; i < realReviews.length; i++) {
    const r = realReviews[i];
    await prisma.googleReview.upsert({
      where: { id: `g-rev-${restaurant.id}-${r.id || i}` },
      update: {
        authorName: r.author || "Google Diner",
        authorPhotoUrl: r.avatar || null,
        rating: r.rating || 5,
        text: r.review_text || "",
        relativeTime: r.relative_date || "Recent",
        publishTime: r.review_date ? new Date(r.review_date) : new Date(),
        isImported: true,
      },
      create: {
        id: `g-rev-${restaurant.id}-${r.id || i}` ,
        restaurantId: restaurant.id,
        authorName: r.author || "Google Diner",
        authorPhotoUrl: r.avatar || null,
        rating: r.rating || 5,
        text: r.review_text || "",
        relativeTime: r.relative_date || "Recent",
        publishTime: r.review_date ? new Date(r.review_date) : new Date(),
        isImported: true,
      },
    });
  }

  console.log("🎉 Database seeding to Supabase completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
