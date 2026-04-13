export type MealCategory = 'bowl' | 'plate' | 'pasta' | 'veggie' | 'family' | 'kids';

export type Tag =
  | 'high-protein'
  | 'kid-friendly'
  | 'low-carb'
  | 'vegetarian'
  | 'spicy'
  | 'chef-pick'
  | 'new'
  | 'family-size';

export interface Meal {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: MealCategory;
  basePrice: number;      // cents
  calories: number;
  protein: number;        // grams
  tags: Tag[];
  ingredients: string[];
  spicyLevel: 0 | 1 | 2 | 3;
  imageEmoji: string;     // stand-in for a real photo in mock mode
  accentColor: string;    // hex — used for card header
}

export type ProteinOption =
  | 'chicken'
  | 'steak'
  | 'carnitas'
  | 'salmon'
  | 'veggie'
  | 'tofu';

export type BaseOption = 'rice-white' | 'rice-brown' | 'cilantro-lime' | 'greens' | 'pasta';

export type SaucesOption = 'salsa-roja' | 'salsa-verde' | 'chipotle-crema' | 'guacamole' | 'none';

export interface BowlCustomization {
  protein: ProteinOption;
  base: BaseOption;
  extras: string[];  // e.g., "black-beans", "corn", "cheese"
  sauce: SaucesOption;
  addGuac: boolean;   // +$2.50
  doubleProtein: boolean; // +$3.50
}

export interface CartItem {
  id: string;
  mealId: string;
  qty: number;
  customization?: BowlCustomization;
  notes?: string;
  priceAtAdd: number;  // cents — captured with discount applied
  discountPct: number; // 0..100
  scheduledFor: string; // ISO date — when the user wants it
}

export interface Plan {
  id: string;
  name: string;
  tagline: string;
  priceCents: number;
  meals: number;
  cadence: 'one-time' | 'weekly' | 'monthly';
  savingsPct: number;
  perks: string[];
  badge?: 'best-value' | 'popular' | 'family' | 'office';
}

export interface Order {
  id: string;
  createdAt: string;    // ISO
  scheduledFor: string; // ISO
  items: CartItem[];
  subtotalCents: number;
  discountCents: number;
  totalCents: number;
  fulfillment: 'pickup' | 'delivery';
  status: 'scheduled' | 'cooking' | 'ready' | 'completed' | 'cancelled';
  address?: string;
  pickupSpot?: string;
}

export interface WalletState {
  balanceCents: number;
  topUps: { id: string; at: string; paidCents: number; creditedCents: number; bonusPct: number }[];
}

export interface UserPreferences {
  displayName: string;
  proteinFavorite: ProteinOption | null;
  allergies: string[];
  goal: 'convenience' | 'family' | 'fitness' | 'budget' | null;
  notifyDeals: boolean;
}

export interface BotMessage {
  id: string;
  role: 'bot' | 'user';
  text: string;
  at: string;
  suggestions?: { label: string; action: string }[];
}

export type Fulfillment = Order['fulfillment'];
