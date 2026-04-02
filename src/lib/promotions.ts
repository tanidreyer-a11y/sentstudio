/** Active promotions configuration */

export interface Promotion {
  id: string;
  label: string;
  description: string;
  startDate: Date;
  endDate: Date;
}

/** Easter Weekend 2026: April 3–6 */
export const EASTER_PROMO: Promotion = {
  id: "easter-2026",
  label: "Easter Weekend Special 🐣",
  description: "3 × 30ml for R270 · 10% off when you buy 3+ items",
  startDate: new Date("2026-04-02T00:00:00+02:00"), // SAST
  endDate: new Date("2026-04-06T23:59:59+02:00"),
};

export const EASTER_BUNDLE_PRICE = 270; // 3 × 30ml bundle
export const BULK_DISCOUNT_PERCENT = 10; // 2+ items

export const isPromoActive = (promo: Promotion): boolean => {
  const now = new Date();
  return now >= promo.startDate && now <= promo.endDate;
};

export const isEasterActive = (): boolean => isPromoActive(EASTER_PROMO);

export interface CartDiscount {
  label: string;
  amount: number; // positive = savings
}

/**
 * Calculate Easter discounts for a cart.
 *
 * Rules (applied in order):
 * 1. Every group of 3 × 30ml items → R270 flat (instead of sum of individual prices).
 * 2. If total unique items (by perfumeId) ≥ 2 → 10% off the remaining (non-bundled) total.
 */
export const calculateEasterDiscounts = (
  items: { size: string; price: number; quantity: number; perfumeId: string }[]
): CartDiscount[] => {
  if (!isEasterActive()) return [];

  const discounts: CartDiscount[] = [];

  // --- 1. 3×30ml bundle ---
  const thirtyMlItems = items.filter((i) => i.size === "30ml");
  const total30mlQty = thirtyMlItems.reduce((s, i) => s + i.quantity, 0);
  const bundleCount = Math.floor(total30mlQty / 3);

  let bundleSavings = 0;
  if (bundleCount > 0) {
    // Sort 30ml items cheapest-first so bundles consume the cheapest units first
    // (this maximises customer savings – good vibes)
    const expandedPrices: number[] = [];
    thirtyMlItems.forEach((i) => {
      for (let q = 0; q < i.quantity; q++) expandedPrices.push(i.price);
    });
    expandedPrices.sort((a, b) => a - b);

    const bundledUnits = bundleCount * 3;
    const normalCost = expandedPrices
      .slice(0, bundledUnits)
      .reduce((s, p) => s + p, 0);
    const bundleCost = bundleCount * EASTER_BUNDLE_PRICE;
    bundleSavings = normalCost - bundleCost;

    if (bundleSavings > 0) {
      discounts.push({
        label: `${bundleCount}× Easter Bundle (3×30ml for R270)`,
        amount: bundleSavings,
      });
    }
  }

  // --- 2. 10% off for 2+ products ---
  const totalProducts = items.reduce((s, i) => s + i.quantity, 0);
  if (totalProducts >= 3) {
    const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
    const afterBundle = subtotal - bundleSavings;
    const bulkSaving = Math.round(afterBundle * (BULK_DISCOUNT_PERCENT / 100));
    if (bulkSaving > 0) {
      discounts.push({
        label: `10% off (3+ items)`,
        amount: bulkSaving,
      });
    }
  }

  return discounts;
};
