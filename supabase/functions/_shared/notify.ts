// Order notifications. Email is sent through Resend when RESEND_API_KEY is set;
// without it these calls log and return, so payments never fail because of alerts.
//
// Secrets (Lovable Cloud → Secrets):
//   RESEND_API_KEY      – Resend API key
//   ORDER_ALERT_EMAIL   – where the shop's new-order alerts go (comma-separated allowed)
//   EMAIL_FROM          – e.g. "Scent Studio <orders@scentstudiosa.co.za>" once the domain is
//                         verified in Resend. Until then Resend's test sender only delivers
//                         to the Resend account owner's own address.

import { DELIVERY, STATUS_LABEL, itemLines, trackingUrl, type CartLine, type DeliveryOption, type OrderStatus } from "./orders.ts";

export interface OrderRow {
  order_number: string;
  tracking_token: string;
  customer_name: string;
  customer_phone: string | null;
  customer_email: string | null;
  items: CartLine[];
  total_amount: number;
  delivery_fee: number;
  delivery_method: DeliveryOption | null;
  delivery_address: Record<string, string> | null;
  estimated_delivery: string | null;
  courier_tracking: string | null;
  status: OrderStatus;
  amount_paid: number | null;
  payment_mode: string | null;
}

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);
const toHtml = (text: string) =>
  `<div style="font-family:Georgia,serif;font-size:15px;line-height:1.6;color:#1a1a1a;white-space:pre-wrap">${esc(text).replace(
    /(https:\/\/[^\s]+)/g,
    '<a href="$1" style="color:#a0802b">$1</a>',
  )}</div>`;

async function sendEmail(to: string[], subject: string, text: string) {
  const key = Deno.env.get("RESEND_API_KEY");
  const recipients = to.map((t) => t.trim()).filter(Boolean);
  if (!key || recipients.length === 0) {
    console.log(`[notify] email skipped (${!key ? "no RESEND_API_KEY" : "no recipient"}): ${subject}`);
    return false;
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: Deno.env.get("EMAIL_FROM") || "Scent Studio <onboarding@resend.dev>",
      to: recipients,
      subject,
      text,
      html: toHtml(text),
    }),
  });
  if (!res.ok) {
    console.error("[notify] email failed", res.status, await res.text());
    return false;
  }
  return true;
}

const deliveryBlock = (o: OrderRow) => {
  const d = o.delivery_method ? DELIVERY[o.delivery_method] : null;
  const a = o.delivery_address ?? {};
  const address = d?.needsAddress ? `\nAddress: ${[a.streetAddress, a.cityArea, a.postalCode].filter(Boolean).join(", ")}` : "";
  const notes = a.instructions ? `\nInstructions: ${a.instructions}` : "";
  return `Delivery: ${d?.label ?? "—"}${address}${notes}`;
};

/** New paid order → the shop. */
export async function notifyShopPaid(o: OrderRow, amountMismatch: boolean) {
  const phone = o.customer_phone ?? "";
  const waLink = phone ? `https://wa.me/27${phone.replace(/\D/g, "").replace(/^(27|0)/, "")}` : "";
  const warn = amountMismatch
    ? `\n⚠️ CHECK THIS ORDER: Yoco reported R${o.amount_paid} paid but the order total is R${o.total_amount}. Do not dispatch until checked.\n`
    : "";
  const test = o.payment_mode === "test" ? "\n(TEST payment — no real money was taken.)\n" : "";
  const text = `New PAID order ${o.order_number}${warn}${test}

Customer: ${o.customer_name}
Phone: ${phone}${waLink ? ` (WhatsApp: ${waLink})` : ""}${o.customer_email ? `\nEmail: ${o.customer_email}` : ""}

Items:
${itemLines(o.items)}

${deliveryBlock(o)}${o.delivery_fee ? `\nDelivery fee: R${o.delivery_fee}` : ""}
Total paid: R${o.amount_paid ?? o.total_amount}

Manage this order: https://www.scentstudiosa.co.za/admin/orders`;
  const to = (Deno.env.get("ORDER_ALERT_EMAIL") ?? "").split(",");
  return sendEmail(to, `${amountMismatch ? "⚠️ " : ""}New order ${o.order_number} — R${o.amount_paid ?? o.total_amount}`, text);
}

const customerIntro: Partial<Record<OrderStatus, string>> = {
  paid: "Thank you — your payment was received and your order is confirmed.",
  processing: "Your order is being prepared.",
  ready_for_pickup: "Your order is ready for collection at Scent Studio, Flora Shopping Centre, Roodepoort.",
  dispatched: "Your order is on its way.",
  delivered: "Your order has been delivered. Enjoy your fragrance!",
  cancelled: "Your order has been cancelled. If this is unexpected, please contact us on WhatsApp: 076 132 8213.",
};

/** Status change → the customer (only if they left an email). */
export async function notifyCustomer(o: OrderRow, base?: string) {
  const intro = customerIntro[o.status];
  if (!intro || !o.customer_email) return false;
  const courier = o.status === "dispatched" && o.courier_tracking ? `\nCourier tracking number: ${o.courier_tracking}` : "";
  const text = `Hi ${o.customer_name.split(" ")[0]},

${intro}${courier}

Order: ${o.order_number}
${itemLines(o.items)}
${deliveryBlock(o)}
Total: R${o.amount_paid ?? o.total_amount}

Track your order any time: ${trackingUrl(o.order_number, o.tracking_token, base)}

Questions? WhatsApp us on 076 132 8213.
— Scent Studio`;
  return sendEmail([o.customer_email], `Scent Studio order ${o.order_number}: ${STATUS_LABEL[o.status]}`, text);
}
