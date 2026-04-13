import { useSyncExternalStore } from 'react';
import type {
  CartItem,
  Order,
  WalletState,
  UserPreferences,
  BotMessage,
  Fulfillment,
  BowlCustomization,
  Meal,
} from './types';
import { MEALS, getMealById } from './meals';
import {
  customizationUpchargeCents,
  discountForLeadHours,
  hoursUntil,
  cartSubtotalCents,
  cartDiscountCents,
} from './pricing';

/**
 * Cross-platform in-memory store with optional localStorage persistence on web.
 * The React Native side just stays in memory (survives navigation, resets on reload).
 * Swap later for Supabase-backed stores without changing call sites.
 */

interface AppState {
  cart: CartItem[];
  orders: Order[];
  wallet: WalletState;
  prefs: UserPreferences;
  bot: BotMessage[];
  fulfillment: Fulfillment;
  address: string;
  pickupSpot: string;
}

const STORAGE_KEY = 'savr:store:v1';

const isBrowser =
  typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

function loadInitial(): AppState {
  if (isBrowser) {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw) as AppState;
    } catch {
      // fall through to defaults
    }
  }
  return {
    cart: [],
    orders: [],
    wallet: { balanceCents: 0, topUps: [] },
    prefs: {
      displayName: 'Friend',
      proteinFavorite: null,
      allergies: [],
      goal: null,
      notifyDeals: true,
    },
    bot: [welcomeMessage()],
    fulfillment: 'pickup',
    address: '',
    pickupSpot: 'Savr Kitchen — 123 Main St',
  };
}

function welcomeMessage(): BotMessage {
  return {
    id: `bot-${Date.now()}`,
    role: 'bot',
    at: new Date().toISOString(),
    text:
      "Hey! I'm SavrBot — your personal food planner. Tell me what you like, when you eat, and your budget. I'll lock in deals and plan your week.",
    suggestions: [
      { label: 'Plan my week', action: 'plan-week' },
      { label: 'Show today\'s deals', action: 'deals' },
      { label: 'High-protein meals', action: 'filter-protein' },
    ],
  };
}

let state: AppState = loadInitial();
const listeners = new Set<() => void>();

function persist() {
  if (isBrowser) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* quota / private mode — ignore */
    }
  }
}

function setState(updater: (prev: AppState) => AppState) {
  state = updater(state);
  persist();
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

// ——— Selectors ———
const getState = () => state;
const selectCart = () => state.cart;
const selectOrders = () => state.orders;
const selectWallet = () => state.wallet;
const selectPrefs = () => state.prefs;
const selectBot = () => state.bot;
const selectFulfillment = () => ({
  fulfillment: state.fulfillment,
  address: state.address,
  pickupSpot: state.pickupSpot,
});

function useSlice<T>(selector: () => T): T {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    selector,
    selector
  );
}

// ——— Cart actions ———

export function addToCart(args: {
  meal: Meal;
  qty?: number;
  customization?: BowlCustomization;
  scheduledFor?: string;  // ISO
  notes?: string;
}) {
  const scheduledFor = args.scheduledFor ?? defaultScheduleFor();
  const discountPct = discountForLeadHours(hoursUntil(scheduledFor));
  const priceAtAdd = Math.round(
    (args.meal.basePrice + customizationUpchargeCents(args.customization)) *
      (1 - discountPct / 100)
  );

  const item: CartItem = {
    id: `ci-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    mealId: args.meal.id,
    qty: args.qty ?? 1,
    customization: args.customization,
    notes: args.notes,
    priceAtAdd,
    discountPct,
    scheduledFor,
  };

  setState((prev) => ({ ...prev, cart: [...prev.cart, item] }));
}

export function updateCartQty(itemId: string, qty: number) {
  if (qty <= 0) return removeCartItem(itemId);
  setState((prev) => ({
    ...prev,
    cart: prev.cart.map((i) => (i.id === itemId ? { ...i, qty } : i)),
  }));
}

export function removeCartItem(itemId: string) {
  setState((prev) => ({
    ...prev,
    cart: prev.cart.filter((i) => i.id !== itemId),
  }));
}

export function clearCart() {
  setState((prev) => ({ ...prev, cart: [] }));
}

function defaultScheduleFor(): string {
  const d = new Date();
  d.setHours(d.getHours() + 26);
  d.setMinutes(0, 0, 0);
  return d.toISOString();
}

// ——— Orders / checkout ———

export function placeOrder(): Order | null {
  if (state.cart.length === 0) return null;
  const subtotal = cartSubtotalCents(state.cart);
  const discount = cartDiscountCents(state.cart, MEALS);
  const order: Order = {
    id: `ord-${Date.now()}`,
    createdAt: new Date().toISOString(),
    scheduledFor: state.cart[0].scheduledFor,
    items: state.cart,
    subtotalCents: subtotal + discount,
    discountCents: discount,
    totalCents: subtotal,
    fulfillment: state.fulfillment,
    status: 'scheduled',
    address: state.fulfillment === 'delivery' ? state.address : undefined,
    pickupSpot: state.fulfillment === 'pickup' ? state.pickupSpot : undefined,
  };

  setState((prev) => ({
    ...prev,
    cart: [],
    orders: [order, ...prev.orders],
  }));

  return order;
}

export function cancelOrder(orderId: string) {
  setState((prev) => ({
    ...prev,
    orders: prev.orders.map((o) => (o.id === orderId ? { ...o, status: 'cancelled' } : o)),
  }));
}

// ——— Wallet ———

export function applyWalletTopUp(payCents: number, creditCents: number, bonusPct: number) {
  setState((prev) => ({
    ...prev,
    wallet: {
      balanceCents: prev.wallet.balanceCents + creditCents,
      topUps: [
        {
          id: `tu-${Date.now()}`,
          at: new Date().toISOString(),
          paidCents: payCents,
          creditedCents: creditCents,
          bonusPct,
        },
        ...prev.wallet.topUps,
      ],
    },
  }));
}

// ——— Preferences ———

export function updatePrefs(patch: Partial<UserPreferences>) {
  setState((prev) => ({ ...prev, prefs: { ...prev.prefs, ...patch } }));
}

// ——— Fulfillment ———

export function setFulfillment(
  fulfillment: Fulfillment,
  opts?: { address?: string; pickupSpot?: string }
) {
  setState((prev) => ({
    ...prev,
    fulfillment,
    address: opts?.address ?? prev.address,
    pickupSpot: opts?.pickupSpot ?? prev.pickupSpot,
  }));
}

// ——— SavrBot (mock) ———

const BOT_REPLIES: Record<string, (msg: string) => BotMessage> = {
  'plan-week': () => ({
    id: `bot-${Date.now()}`,
    role: 'bot',
    at: new Date().toISOString(),
    text:
      "Locked in your week — 5 high-protein bowls + a Family Tray for Sunday. You'd save $27.40 with the 30% pre-order discount. Want me to drop them in your cart?",
    suggestions: [
      { label: 'Yes, add to cart', action: 'add-week' },
      { label: 'Swap one', action: 'swap' },
      { label: 'Show me cheaper', action: 'cheaper' },
    ],
  }),
  deals: () => ({
    id: `bot-${Date.now()}`,
    role: 'bot',
    at: new Date().toISOString(),
    text:
      "Today's heaters: Chicken Bowl is 25% off if you pre-order by 2PM. Salmon Plate is 20% off for tomorrow. Family Tray is 30% off if you order 72 hours out.",
    suggestions: [
      { label: 'Add Chicken Bowl', action: 'add-chicken' },
      { label: 'See full menu', action: 'menu' },
    ],
  }),
  'filter-protein': () => ({
    id: `bot-${Date.now()}`,
    role: 'bot',
    at: new Date().toISOString(),
    text: "High-protein picks: Steak Bowl (48g), Salmon (40g), Carnitas (44g), Chicken Bowl (42g).",
    suggestions: [{ label: 'Add Steak Bowl', action: 'add-steak' }],
  }),
  'add-week': () => {
    const mealIds = ['chicken-bowl', 'steak-bowl', 'salmon-plate', 'veggie-bowl', 'carnitas-bowl', 'family-tray'];
    const now = new Date();
    mealIds.forEach((id, idx) => {
      const meal = getMealById(id);
      if (!meal) return;
      const sched = new Date(now);
      sched.setDate(sched.getDate() + idx + 2);
      sched.setHours(12, 0, 0, 0);
      addToCart({ meal, scheduledFor: sched.toISOString() });
    });
    return {
      id: `bot-${Date.now()}`,
      role: 'bot',
      at: new Date().toISOString(),
      text: "Done. Your week is in the cart — 6 meals, pre-order discount applied. Head to Cart to confirm.",
      suggestions: [{ label: 'Open cart', action: 'goto-cart' }],
    };
  },
  'add-chicken': () => {
    const m = getMealById('chicken-bowl');
    if (m) addToCart({ meal: m });
    return {
      id: `bot-${Date.now()}`,
      role: 'bot',
      at: new Date().toISOString(),
      text: 'Added a Chipotle Chicken Bowl to your cart. Anything else?',
    };
  },
  'add-steak': () => {
    const m = getMealById('steak-bowl');
    if (m) addToCart({ meal: m });
    return {
      id: `bot-${Date.now()}`,
      role: 'bot',
      at: new Date().toISOString(),
      text: 'Steak Bowl added. You cook the rest, chef. 😉',
    };
  },
  cheaper: () => ({
    id: `bot-${Date.now()}`,
    role: 'bot',
    at: new Date().toISOString(),
    text:
      "Budget mode: Garden Power Bowl ($11.99), Kids Bowl ($7.99), Chicken Pasta ($11.99). Bundle 5 of them and you're at $45.",
  }),
  menu: () => ({
    id: `bot-${Date.now()}`,
    role: 'bot',
    at: new Date().toISOString(),
    text: "Opening the full menu for you now.",
    suggestions: [{ label: 'Go to menu', action: 'goto-menu' }],
  }),
};

export function sendBotMessage(text: string) {
  const userMsg: BotMessage = {
    id: `usr-${Date.now()}`,
    role: 'user',
    text,
    at: new Date().toISOString(),
  };
  setState((prev) => ({ ...prev, bot: [...prev.bot, userMsg] }));

  // Trivial keyword-based mock reply
  const lower = text.toLowerCase();
  let reply: BotMessage;
  if (/deal|discount|off|save/.test(lower)) reply = BOT_REPLIES.deals('');
  else if (/plan|week|meal plan/.test(lower)) reply = BOT_REPLIES['plan-week']('');
  else if (/protein|strong|fit/.test(lower)) reply = BOT_REPLIES['filter-protein']('');
  else if (/cheap|budget/.test(lower)) reply = BOT_REPLIES.cheaper('');
  else if (/menu|show/.test(lower)) reply = BOT_REPLIES.menu('');
  else {
    reply = {
      id: `bot-${Date.now()}`,
      role: 'bot',
      at: new Date().toISOString(),
      text:
        "Got it. Want me to build a weekly plan, show today's deals, or filter by high-protein?",
      suggestions: [
        { label: 'Plan my week', action: 'plan-week' },
        { label: "Today's deals", action: 'deals' },
        { label: 'High protein', action: 'filter-protein' },
      ],
    };
  }

  setTimeout(() => setState((prev) => ({ ...prev, bot: [...prev.bot, reply] })), 450);
}

export function runBotAction(action: string) {
  const handler = BOT_REPLIES[action];
  if (!handler) return action; // caller can use return value for nav intents
  const reply = handler('');
  setState((prev) => ({ ...prev, bot: [...prev.bot, reply] }));
  return action;
}

// ——— Hooks ———
export const useCart = () => useSlice(selectCart);
export const useOrders = () => useSlice(selectOrders);
export const useWallet = () => useSlice(selectWallet);
export const usePrefs = () => useSlice(selectPrefs);
export const useBot = () => useSlice(selectBot);
export const useFulfillment = () => useSlice(selectFulfillment);
export const useAppState = () => useSlice(getState);
