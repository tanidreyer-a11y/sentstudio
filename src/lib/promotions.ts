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

/**
 * Calculate discounts for a cart.
 * Currently no active promotions.
 */
export const calculateEasterDiscounts = (
  _items: { size: string; price: number; quantity: number; perfumeId: string }[]
): CartDiscount[] => {
  return [];
};
