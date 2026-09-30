// Creates an order and its Yoco checkout, server-side.
// Replaces create-yoco-checkout, which trusted the amount sent by the browser and
// relied on browser-side database writes that the orders table's security rules block.
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { serviceClient } from "../_shared/admin.ts";
import { DELIVERY, generateOrderNumber, json, priceOrder, safeOrigin, type DeliveryOption } from "../_shared/orders.ts";

const clean = (v: unknown, max = 200) => (typeof v === "string" ? v.trim().slice(0, max) : "");

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405, corsHeaders);

  const yocoKey = Deno.env.get("YOCO_SECRET_KEY");
  if (!yocoKey) return json({ error: "Online payment is not configured." }, 503, corsHeaders);

  let body: any;
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid request." }, 400, corsHeaders);
  }

  const d = body?.delivery ?? {};
  const option = clean(d.option, 20) as DeliveryOption;
  if (!DELIVERY[option]) return json({ error: "Please choose a delivery method." }, 400, corsHeaders);

  const fullName = clean(d.fullName, 120);
  const phone = clean(d.phone, 30);
  const email = clean(body?.email, 200).toLowerCase();
  const address = {
    streetAddress: clean(d.streetAddress),
    cityArea: clean(d.cityArea, 120),
    postalCode: clean(d.postalCode, 12),
    instructions: clean(d.instructions, 500),
  };

  if (!fullName || phone.replace(/\D/g, "").length < 9) {
    return json({ error: "Please enter your name and a valid phone number." }, 400, corsHeaders);
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ error: "Please check your email address." }, 400, corsHeaders);
  }
  if (DELIVERY[option].needsAddress && (!address.streetAddress || !address.cityArea || !address.postalCode)) {
    return json({ error: "Please enter your full delivery address." }, 400, corsHeaders);
  }

  let priced;
  try {
    priced = priceOrder(body?.items, body?.discount, option);
  } catch (e) {
    return json({ error: (e as Error).message }, 400, corsHeaders);
  }

  const db = serviceClient();
  const origin = safeOrigin(body?.origin);

  // Retry on the (very unlikely) order-number collision.
  let order: { id: string; order_number: string; tracking_token: string } | null = null;
  for (let attempt = 0; attempt < 3 && !order; attempt++) {
    const { data, error } = await db
      .from("orders")
      .insert({
        order_number: generateOrderNumber(),
        customer_name: fullName,
        customer_phone: phone,
        customer_email: email || null,
        items: priced.items,
        total_amount: priced.total,
        delivery_fee: priced.deliveryFee,
        delivery_method: option,
        delivery_address: DELIVERY[option].needsAddress ? address : { instructions: address.instructions },
        estimated_delivery: DELIVERY[option].eta,
        admin_notes: priced.discount ? `Discount applied: R${priced.discount}` : null,
        status: "pending",
        source: "online",
      })
      .select("id, order_number, tracking_token")
      .single();
    if (data) order = data;
    else if (error?.code !== "23505") {
      console.error("Order insert failed", error);
      return json({ error: "We couldn't save your order. Please try again or order via WhatsApp." }, 500, corsHeaders);
    }
  }
  if (!order) return json({ error: "We couldn't save your order. Please try again." }, 500, corsHeaders);

  const orderPage = `${origin}/order/${order.order_number}?t=${order.tracking_token}`;
  const yocoRes = await fetch("https://payments.yoco.com/api/checkouts", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${yocoKey}`,
      "Content-Type": "application/json",
      "Idempotency-Key": order.id,
    },
    body: JSON.stringify({
      amount: priced.total * 100,
      currency: "ZAR",
      successUrl: `${orderPage}&paid=1`,
      cancelUrl: `${origin}/payment/cancel?order=${order.order_number}`,
      failureUrl: `${origin}/payment/cancel?order=${order.order_number}&failed=1`,
      externalId: order.order_number,
      metadata: { orderId: order.id, orderNumber: order.order_number },
      ...(priced.discount ? { totalDiscount: priced.discount * 100, subtotalAmount: (priced.subtotal + priced.deliveryFee) * 100 } : {}),
    }),
  });
  const checkout = await yocoRes.json().catch(() => ({}));

  if (!yocoRes.ok || !checkout?.id || !checkout?.redirectUrl) {
    console.error("Yoco checkout failed", yocoRes.status, checkout);
    await db.from("orders").update({ status: "failed", admin_notes: `Yoco checkout could not be created (${yocoRes.status})` }).eq("id", order.id);
    return json({ error: "The payment page couldn't be opened. Please try again or order via WhatsApp." }, 502, corsHeaders);
  }

  const { error: linkError } = await db
    .from("orders")
    .update({ yoco_checkout_id: checkout.id, payment_mode: checkout.processingMode ?? null })
    .eq("id", order.id);
  if (linkError) console.error("Could not store checkout id", linkError);

  return json(
    {
      redirectUrl: checkout.redirectUrl,
      orderNumber: order.order_number,
      trackingToken: order.tracking_token,
      total: priced.total,
    },
    200,
    corsHeaders,
  );
});
