# MenuVerse 🍽️✨

> **Next-Generation Multi-Tenant Restaurant Social Discovery & Dish Reputation Ecosystem**

MenuVerse replaces static, boring QR code menus with a vibrant, community-driven social discovery engine. Instead of table-specific URLs or digital PDF menus, MenuVerse provides a **single branded QR code per restaurant** that unlocks an interactive social menu where every dish is an independent social object.

---

## Key Pillars & Architecture

### 1. Multi-Tenant Architecture & Data Isolation
- **Tenant Isolation:** Every restaurant operates with completely isolated data, custom branding, domain rules, and role-based permissions.
- **Single QR Code per Restaurant:** Unique vector QR with live customizable branding (acrylic table tent, decal, or standalone vector). Every guest enters through the same unified discovery portal.
- **Role-Based Access Control (RBAC):**
  - `PLATFORM_ADMIN`: Global oversight, compliance, and platform moderation.
  - `RESTAURANT_OWNER`: Full menu authority, pricing, verified replies, QR merchandising, staff permissions, analytics.
  - `RESTAURANT_MANAGER`: Menu editing, category arrangement, review reply drafting.
  - `RESTAURANT_STAFF`: Real-time item 86-ing (marking sold out / in-stock).
  - `DINER`: Discover dishes, read permanent reviews, view community photos, submit ratings, and upvote helpful feedback.

### 2. Independent Social Dish Objects
Every dish maintains:
- Dedicated social page with high-res galleries and community photo feeds.
- Bayesian weighted average rating ($W = \frac{v}{v+m} \cdot R + \frac{m}{v+m} \cdot C$).
- Recommendation percentage ($\frac{\text{positive reviews}}{\text{total reviews}} \times 100$).
- Real-time Trend Velocity Score ($e^{-\lambda t}$ time-decayed review velocity).
- Aspect ratings (Taste, Portion Size, Value for Money).

### 3. Dynamic Algorithmic Leaderboards
Rank dishes across 8 specialized categories:
1. 🏆 **Most Loved Dishes** (High recommendation % and sentiment)
2. ⭐ **Highest Rated Dishes** (Bayesian weighted score)
3. 💬 **Most Reviewed Dishes** (Total foodie discussion volume)
4. 📸 **Most Photographed Dishes** (Customer visual UGC count)
5. 🔥 **Trending This Week** (Velocity of recent visits and upvotes)
6. 💎 **Hidden Gems** (High rating $\ge 4.4$ with growing popularity)
7. 💰 **Best Value for Money** (Value index relative to price tier)
8. 👨‍🍳 **Chef Signature Picks** (Executive recommendations)

### 4. AI Taste Intelligence & Sentiment Summaries
- **Review Sentiment Classifier:** Classifies feedback into Positive, Neutral, Negative with sub-aspect scores.
- **Auto-Generated Dish AI Summary:** Generates concise customer consensus (e.g., *"Diners rave about the rich creamy truffle emulsion and generous portion, but note the spice level is milder than expected"*).
- **Automated Content Moderation:** Screens for spam, abusive language, and solicitations before publication.

### 5. Enterprise Restaurant Dashboard
- **Overview Analytics:** QR scan velocity, unique visitors, dish view heatmaps, and sentiment distributions powered by Recharts.
- **Menu Studio:** Unlimited categories, dietary badges (Veg, GF, Halal, Spicy meter), price updates, and instant 86-ing toggles.
- **Review & Reply Hub:** Filter by sentiment, unreplied reviews, and respond with verified owner badges.
- **Branded QR Studio:** Live matrix color customizer, frame header editor, and print-ready acrylic stand previews.
- **Google Reviews Sync:** Seamlessly import Google Business Profile reviews while maintaining clean domain separation from dish-level reviews.

---

## Tech Stack

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript 5+
- **Styling:** Tailwind CSS + Radix/Shadcn primitives + Glassmorphism
- **Database & ORM:** PostgreSQL + Prisma ORM
- **Charts & Visualization:** Recharts
- **Icons & Animations:** Lucide React + Canvas Confetti
- **QR Generation:** Vector QRCode Engine

---

## Running the Application

```bash
# Install dependencies
npm install

# Run the development server
npm run dev

# Build for production
npm run build
npm start
```

Visit [http://localhost:3000](http://localhost:3000) to launch the MenuVerse platform.
