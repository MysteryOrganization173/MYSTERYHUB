import type { BundleCategory, BundleTier } from "@/types";

export const BUNDLE_CATEGORIES: {
  value: BundleCategory;
  label: string;
  emoji: string;
  description: string;
}[] = [
  {
    value: "tech",
    label: "Tech",
    emoji: "💻",
    description: "Gadgets, accessories, and electronics",
  },
  {
    value: "gaming",
    label: "Gaming",
    emoji: "🎮",
    description: "Games, gear, and collectibles",
  },
  {
    value: "fashion",
    label: "Fashion",
    emoji: "👗",
    description: "Clothing, shoes, and accessories",
  },
  {
    value: "beauty",
    label: "Beauty",
    emoji: "💄",
    description: "Skincare, makeup, and grooming",
  },
  {
    value: "home",
    label: "Home",
    emoji: "🏠",
    description: "Decor, kitchen, and living",
  },
  {
    value: "fitness",
    label: "Fitness",
    emoji: "💪",
    description: "Equipment, gear, and nutrition",
  },
  {
    value: "books",
    label: "Books",
    emoji: "📚",
    description: "Fiction, non-fiction, and learning",
  },
  {
    value: "food",
    label: "Food",
    emoji: "🍕",
    description: "Snacks, gourmet, and specialty",
  },
  {
    value: "accessories",
    label: "Accessories",
    emoji: "⌚",
    description: "Watches, bags, and more",
  },
  {
    value: "other",
    label: "Other",
    emoji: "🎁",
    description: "Surprise categories",
  },
];

export const BUNDLE_TIERS: {
  value: BundleTier;
  label: string;
  color: string;
  minValue: number;
  maxValue: number;
  description: string;
}[] = [
  {
    value: "bronze",
    label: "Bronze",
    color: "#CD7F32",
    minValue: 10,
    maxValue: 29,
    description: "Great starter bundles",
  },
  {
    value: "silver",
    label: "Silver",
    color: "#C0C0C0",
    minValue: 30,
    maxValue: 74,
    description: "Premium value bundles",
  },
  {
    value: "gold",
    label: "Gold",
    color: "#FFD700",
    minValue: 75,
    maxValue: 149,
    description: "High-end curated selections",
  },
  {
    value: "platinum",
    label: "Platinum",
    color: "#E5E4E2",
    minValue: 150,
    maxValue: 299,
    description: "Exclusive luxury bundles",
  },
  {
    value: "diamond",
    label: "Diamond",
    color: "#B9F2FF",
    minValue: 300,
    maxValue: 999,
    description: "Ultra-premium experiences",
  },
];
