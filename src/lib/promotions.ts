/** Active promotions configuration */

export interface Promotion {
  id: string;
  label: string;
  description: string;
  startDate: Date;
  endDate: Date;
}

export interface CartDiscount {
  label: string;
  amount: number; // positive = savings
}

export interface PromoItem {
  size: string;
  price: number;
  quantity: number;
  perfumeId: string;
  gender?: "men" | "women";
}

/** Mother's Day 2026 promo window: Friday 8 May – Sunday 10 May (Africa/Johannesburg) */
const MOTHERS_DAY_START = new Date("2026-05-08T00:00:00+02:00");
const MOTHERS_DAY_END = new Date("2026-05-10T23:59:59+02:00");

export const MOTHERS_DAY_CODE = "#MUM";

export const isMothersDayActive = (now: Date = new Date()) =>
  now >= MOTHERS_DAY_START && now <= MOTHERS_DAY_END;

/**
 * Mother's Day promo: 10% off when cart has 2+ perfumes
 * AND at least one is a women's perfume. Requires code #MUM.
 */
export const calculateMothersDayDiscount = (
  items: PromoItem[],
  code: string,
  now: Date = new Date()
): CartDiscount[] => {
  if (!code || code.trim().toUpperCase() !== MOTHERS_DAY_CODE) return [];
  if (!isMothersDayActive(now)) return [];

  const totalQty = items.reduce((s, i) => s + i.quantity, 0);
  const hasWomens = items.some((i) => i.gender === "women" && i.quantity > 0);
  if (totalQty < 2 || !hasWomens) return [];

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const amount = Math.round(subtotal * 0.1);
  if (amount <= 0) return [];

  return [{ label: "Mother's Day 10% off (#MUM)", amount }];
};

/**
 * Calculate discounts for a cart.
 */
export const calculateEasterDiscounts = (
  _items: PromoItem[]
): CartDiscount[] => {
  return [];
};
