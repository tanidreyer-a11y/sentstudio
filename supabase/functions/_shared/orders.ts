// Shared order rules for the checkout, webhook and admin functions.
// The browser is never trusted for money: totals are recomputed here.

export const SITE_URL = "https://www.scentstudiosa.co.za";

export type DeliveryOption = "pickup" | "uber" | "aramex" | "postnet";

export const DELIVERY: Record<DeliveryOption, { label: string; fee: number; eta: string; needsAddress: boolean }> = {
  pickup: { label: "Store Pickup (Flora Centre)", fee: 0, eta: "Ready in 2–4 hours (Mon–Sat)", needsAddress: false },
  uber: { label: "Uber / Bolt (customer arranges)", fee: 0, eta: "Same day — you arrange pickup", needsAddress: false },
  aramex: { label: "Aramex Courier", fee: 99, eta: "2–4 business days nationwide", needsAddress: true },
  postnet: { label: "PostNet Courier", fee: 109, eta: "2–3 business days nationwide", needsAddress: true },
};

export const STATUSES = [
  "pending",
  "paid",
  "processing",
  "ready_for_pickup",
  "dispatched",
  "delivered",
  "cancelled",
  "failed",
] as const;
export type OrderStatus = (typeof STATUSES)[number];

export const STATUS_LABEL: Record<OrderStatus, string> = {
  pending: "Awaiting payment",
  paid: "Payment received",
  processing: "Being prepared",
  ready_for_pickup: "Ready for collection",
  dispatched: "On its way",
  delivered: "Delivered",
  cancelled: "Cancelled",
  failed: "Payment failed",
};

// Lowest real price per size. A catalogue perfume can never be cheaper than
// its size's floor, and a custom blend is a fixed price per size. This stops a
// tampered cart (e.g. R1 perfumes) while letting Bashier raise prices freely.
// If a cheaper tier is ever introduced, lower the floor here.
const PERFUME_FLOOR: Record<string, number> = { "30ml": 120, "50ml": 170, "100ml": 290 };
const BLEND_FLOOR: Record<string, number> = { "30ml": 180, "50ml": 250, "100ml": 490 };
const PRICE_CEILING = 2000;
const MAX_DISCOUNT_RATE = 0.1;

export interface CartLine {
  perfumeId: string;
  name: string;
  size: string;
  price: number;
  quantity: number;
  gender?: string;
  customBlend?: { fragrances: string[]; oilConcentration: number };
}

export interface PricedOrder {
  items: CartLine[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
}

const clean = (v: unknown, max = 200) => (typeof v === "string" ? v.trim().slice(0, max) : "");

/** Validates cart lines and recomputes the total. Throws a customer-safe message on bad input. */
export function priceOrder(rawItems: unknown, rawDiscount: unknown, option: DeliveryOption): PricedOrder {
  if (!Array.isArray(rawItems) || rawItems.length === 0 || rawItems.length > 30) {
    throw new Error("Your cart is empty or too large.");
  }

  const items: CartLine[] = rawItems.map((raw: any) => {
    const size = clean(raw?.size, 10);
    const perfumeId = clean(raw?.perfumeId, 80);
    const price = Number(raw?.price);
    const quantity = Number(raw?.quantity);
    const isBlend = perfumeId.startsWith("custom-blend") || !!raw?.customBlend;
    const floor = (isBlend ? BLEND_FLOOR : PERFUME_FLOOR)[size];

    if (!perfumeId || !floor) throw new Error("A cart item has an unknown size.");
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 20) throw new Error("A cart item has an invalid quantity.");
    if (!Number.isFinite(price) || price < floor || price > PRICE_CEILING) {
      throw new Error("A price in your cart is out of date. Please refresh the page and try again.");
    }

    const line: CartLine = { perfumeId, name: clean(raw?.name, 120) || "Perfume", size, price, quantity, gender: clean(raw?.gender, 10) };
    if (isBlend && raw?.customBlend) {
      line.customBlend = {
        fragrances: Array.isArray(raw.customBlend.fragrances) ? raw.customBlend.fragrances.slice(0, 3).map((f: unknown) => clean(f, 120)) : [],
        oilConcentration: Math.min(40, Math.max(0, Number(raw.customBlend.oilConcentration) || 0)),
      };
    }
    return line;
  });

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const requested = Math.max(0, Math.round(Number(rawDiscount) || 0));
  const discount = Math.min(requested, Math.floor(subtotal * MAX_DISCOUNT_RATE));
  const deliveryFee = DELIVERY[option].fee;
  return { items, subtotal, discount, deliveryFee, total: subtotal - discount + deliveryFee };
}

export function generateOrderNumber() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = crypto.getRandomValues(new Uint8Array(6));
  return "SS-" + Array.from(bytes, (b) => chars[b % chars.length]).join("");
}

export function trackingUrl(orderNumber: string, token: string, base = SITE_URL) {
  return `${base}/order/${orderNumber}?t=${token}`;
}

export function itemLines(items: CartLine[]) {
  return items
    .map((i) => {
      const base = `• ${i.name} (${i.size}) ×${i.quantity} — R${i.price * i.quantity}`;
      return i.customBlend
        ? `${base}\n   Blend: ${i.customBlend.fragrances.join(" + ")} | Oil: ${i.customBlend.oilConcentration}%`
        : base;
    })
    .join("\n");
}

/** Only redirect Yoco back to our own sites, never to an address a caller supplied. */
export function safeOrigin(origin: unknown) {
  if (typeof origin !== "string") return SITE_URL;
  try {
    const u = new URL(origin);
    const host = u.hostname;
    const ok =
      host === "scentstudiosa.co.za" ||
      host === "www.scentstudiosa.co.za" ||
      host === "localhost" ||
      host.endsWith(".vercel.app") ||
      host.endsWith(".lovable.app");
    return ok ? u.origin : SITE_URL;
  } catch {
    return SITE_URL;
  }
}

export const json = (body: unknown, status = 200, headers: Record<string, string> = {}) =>
  new Response(JSON.stringify(body), { status, headers: { ...headers, "Content-Type": "application/json" } });
