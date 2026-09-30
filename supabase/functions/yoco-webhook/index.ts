// Receives Yoco payment notifications and marks orders paid / failed.
// Every event is signature-checked (https://developer.yoco.com/guides/online-payments/webhooks/verifying-the-events)
// because this URL is public: without the check anyone could mark an order as paid.
import { serviceClient } from "../_shared/admin.ts";
import { json } from "../_shared/orders.ts";
import { notifyCustomer, notifyShopPaid, type OrderRow } from "../_shared/notify.ts";

const MAX_CLOCK_SKEW_SECONDS = 180;

async function webhookSecret(db: ReturnType<typeof serviceClient>) {
  const fromEnv = Deno.env.get("YOCO_WEBHOOK_SECRET");
  if (fromEnv) return fromEnv;
  // Written by the yoco-setup function when it registers the webhook.
  const { data } = await db.from("app_settings").select("value").eq("key", "yoco_webhook_secret").maybeSingle();
  return data?.value ?? null;
}

function timingSafeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

async function isAuthentic(req: Request, rawBody: string, secret: string) {
  const id = req.headers.get("webhook-id");
  const timestamp = req.headers.get("webhook-timestamp");
  const signatures = req.headers.get("webhook-signature");
  if (!id || !timestamp || !signatures) return false;
  if (Math.abs(Date.now() / 1000 - Number(timestamp)) > MAX_CLOCK_SKEW_SECONDS) return false;

  const keyBytes = Uint8Array.from(atob(secret.split("_")[1] ?? ""), (c) => c.charCodeAt(0));
  const key = await crypto.subtle.importKey("raw", keyBytes, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const mac = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(`${id}.${timestamp}.${rawBody}`));
  const expected = btoa(String.fromCharCode(...new Uint8Array(mac)));

  return signatures.split(" ").some((entry) => timingSafeEqual(entry.split(",")[1] ?? "", expected));
}

Deno.serve(async (req) => {
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const rawBody = await req.text();
  const db = serviceClient();

  const secret = await webhookSecret(db);
  if (!secret) {
    // Non-2xx makes Yoco retry for up to ~2 days, so nothing is lost while setup finishes.
    console.error("Yoco webhook secret is not configured; rejecting event");
    return json({ error: "Webhook not configured" }, 503);
  }
  if (!(await isAuthentic(req, rawBody, secret))) {
    console.warn("Rejected Yoco webhook with invalid signature");
    return json({ error: "Invalid signature" }, 401);
  }

  let event: any;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }

  const type: string = event?.type ?? "";
  const payment = event?.payload ?? {};
  const meta = payment.metadata ?? {};
  console.log("Yoco event", type, event?.id, "checkout", meta.checkoutId, "order", meta.orderNumber);

  if (type !== "payment.succeeded" && type !== "payment.failed") {
    return json({ received: true, ignored: type });
  }

  // payload.id is the PAYMENT id; the checkout id lives in metadata.checkoutId.
  const columns =
    "id, order_number, tracking_token, customer_name, customer_phone, customer_email, items, total_amount, delivery_fee, delivery_method, delivery_address, estimated_delivery, courier_tracking, status, amount_paid, payment_mode";
  let order: (OrderRow & { id: string }) | null = null;
  if (meta.checkoutId) {
    const { data } = await db.from("orders").select(columns).eq("yoco_checkout_id", meta.checkoutId).maybeSingle();
    order = data as typeof order;
  }
  if (!order && meta.orderId) {
    const { data } = await db.from("orders").select(columns).eq("id", meta.orderId).maybeSingle();
    order = data as typeof order;
  }
  if (!order && (meta.orderNumber || payment.externalId)) {
    const { data } = await db.from("orders").select(columns).eq("order_number", meta.orderNumber ?? payment.externalId).maybeSingle();
    order = data as typeof order;
  }
  if (!order) {
    console.error("Yoco event did not match any order", JSON.stringify({ checkoutId: meta.checkoutId, meta }));
    // 200 so Yoco stops retrying an event we can never match; it stays in the logs.
    return json({ received: true, matched: false });
  }

  if (type === "payment.failed") {
    await db.from("orders").update({ status: "failed" }).eq("id", order.id).eq("status", "pending");
    return json({ received: true });
  }

  const amountPaid = Math.round(Number(payment.amount ?? 0) / 100);
  const amountMismatch = amountPaid !== order.total_amount;

  // Only the first delivery of this event flips pending/failed → paid; retries are no-ops.
  const { data: updated, error } = await db
    .from("orders")
    .update({
      status: "paid",
      paid_at: new Date().toISOString(),
      amount_paid: amountPaid,
      yoco_payment_id: payment.id ?? null,
      payment_mode: payment.mode ?? order.payment_mode,
      admin_notes: amountMismatch ? `AMOUNT MISMATCH: paid R${amountPaid}, order total R${order.total_amount}` : undefined,
    })
    .eq("id", order.id)
    .in("status", ["pending", "failed"])
    .select(columns)
    .maybeSingle();

  if (error) {
    console.error("Failed to mark order paid", error);
    return json({ error: "Update failed" }, 500); // Yoco will retry
  }
  if (!updated) return json({ received: true, alreadyProcessed: true });

  const paidOrder = updated as unknown as OrderRow;
  const results = await Promise.allSettled([notifyShopPaid(paidOrder, amountMismatch), notifyCustomer(paidOrder)]);
  results.forEach((r) => r.status === "rejected" && console.error("Notification error", r.reason));

  return json({ received: true });
});
