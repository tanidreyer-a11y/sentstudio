// Remembers this browser's recent orders so a customer can find their tracking
// page again. Storage can be unavailable (private mode), so every access is guarded.
const KEY = "scent_studio_orders";

export interface RecentOrder {
  orderNumber: string;
  token: string;
  placedAt: string;
}

export const getRecentOrders = (): RecentOrder[] => {
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const rememberOrder = (orderNumber: string, token: string) => {
  try {
    const rest = getRecentOrders().filter((o) => o.orderNumber !== orderNumber);
    localStorage.setItem(KEY, JSON.stringify([{ orderNumber, token, placedAt: new Date().toISOString() }, ...rest].slice(0, 10)));
  } catch {
    /* tracking link in the success URL still works without storage */
  }
};

export const orderPath = (o: Pick<RecentOrder, "orderNumber" | "token">) => `/order/${o.orderNumber}?t=${o.token}`;
