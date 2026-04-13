import type { Meal, BowlCustomization, CartItem } from './types';

/** Discount schedule based on how far in advance the order is placed. */
export function discountForLeadHours(leadHours: number): number {
  if (leadHours >= 72) return 30;
  if (leadHours >= 48) return 25;
  if (leadHours >= 24) return 20;
  if (leadHours >= 4) return 10;
  return 0;
}

export function hoursUntil(isoDate: string): number {
  const target = new Date(isoDate).getTime();
  const now = Date.now();
  return Math.max(0, (target - now) / (1000 * 60 * 60));
}

export function customizationUpchargeCents(c?: BowlCustomization): number {
  if (!c) return 0;
  let extra = 0;
  if (c.addGuac) extra += 250;
  if (c.doubleProtein) extra += 350;
  return extra;
}

export function effectivePriceCents(meal: Meal, c?: BowlCustomization, discountPct = 0): number {
  const base = meal.basePrice + customizationUpchargeCents(c);
  return Math.round(base * (1 - discountPct / 100));
}

export function cartSubtotalCents(items: CartItem[]): number {
  return items.reduce((sum, i) => sum + i.priceAtAdd * i.qty, 0);
}

export function cartDiscountCents(items: CartItem[], meals: Meal[]): number {
  let saved = 0;
  for (const item of items) {
    const meal = meals.find((m) => m.id === item.mealId);
    if (!meal) continue;
    const undiscounted = (meal.basePrice + customizationUpchargeCents(item.customization)) * item.qty;
    saved += undiscounted - item.priceAtAdd * item.qty;
  }
  return saved;
}

export function formatUSD(cents: number): string {
  return (cents / 100).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });
}

export function formatISOForDisplay(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}
