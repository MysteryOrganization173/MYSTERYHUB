// ============================================================
// Core Domain Types — Mystery Bundle Hub
// ============================================================

export type ID = string;
export type Timestamp = string; // ISO 8601

// --- User ---
export interface User {
  id: ID;
  email: string;
  name: string | null;
  avatar: string | null;
  role: UserRole;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type UserRole = "user" | "admin" | "moderator";

// --- Bundle ---
export interface Bundle {
  id: ID;
  slug: string;
  title: string;
  description: string;
  shortDescription: string;
  price: number;
  originalValue: number;
  discount: number;
  category: BundleCategory;
  tier: BundleTier;
  status: BundleStatus;
  imageUrl: string;
  images: string[];
  tags: string[];
  stock: number | null;
  totalSold: number;
  rating: number;
  reviewCount: number;
  isFeatured: boolean;
  isNew: boolean;
  isBestSeller: boolean;
  revealedAt: Timestamp | null;
  expiresAt: Timestamp | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type BundleCategory =
  | "tech"
  | "gaming"
  | "fashion"
  | "beauty"
  | "home"
  | "fitness"
  | "books"
  | "food"
  | "accessories"
  | "other";

export type BundleTier = "bronze" | "silver" | "gold" | "platinum" | "diamond";

export type BundleStatus = "active" | "sold_out" | "coming_soon" | "expired";

// --- Order ---
export interface Order {
  id: ID;
  userId: ID;
  bundleId: ID;
  bundle: Bundle;
  status: OrderStatus;
  amount: number;
  currency: string;
  paymentIntentId: string | null;
  shippingAddress: Address | null;
  trackingNumber: string | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type OrderStatus =
  | "pending"
  | "paid"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

// --- Address ---
export interface Address {
  name: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

// --- Review ---
export interface Review {
  id: ID;
  userId: ID;
  user: Pick<User, "id" | "name" | "avatar">;
  bundleId: ID;
  rating: number;
  content: string;
  images: string[];
  helpfulCount: number;
  createdAt: Timestamp;
}

// --- Referral ---
export interface Referral {
  id: ID;
  referrerId: ID;
  refereeId: ID;
  code: string;
  status: ReferralStatus;
  reward: number;
  paidAt: Timestamp | null;
  createdAt: Timestamp;
}

export type ReferralStatus = "pending" | "completed" | "paid" | "cancelled";

// --- API Response ---
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// --- Filter & Sort ---
export interface BundleFilters {
  category?: BundleCategory;
  tier?: BundleTier;
  minPrice?: number;
  maxPrice?: number;
  isFeatured?: boolean;
  isNew?: boolean;
  status?: BundleStatus;
  tags?: string[];
}

export type SortOption =
  | "newest"
  | "oldest"
  | "price_asc"
  | "price_desc"
  | "popular"
  | "rating";

// --- UI State ---
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}
