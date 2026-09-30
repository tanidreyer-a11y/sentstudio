// Public order tracking. Needs the order number AND its secret tracking token, so
// order numbers can't be guessed to read other customers' orders. Returns no
// phone number or street address.
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { serviceClient } from "../_shared/admin.ts";
import { DELIVERY, STATUS_LABEL, json, type DeliveryOption, type OrderStatus } from "../_shared/orders.ts";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const body = await req.json().catch(() => ({}));
  const orderNumber = typeof body?.orderNumber === "string" ? body.orderNumber.trim().toUpperCase() : "";
  const token = typeof body?.token === "string" ? body.token.trim() : "";
  if (!/^SS-[A-Z0-9]{4,12}$/.test(orderNumber) || !UUID.test(token)) {
    return json({ error: "Order not found." }, 404, corsHeaders);
  }

  const { data: o } = await serviceClient()
    .from("orders")
    .select("order_number, customer_name, items, total_amount, delivery_fee, delivery_method, estimated_delivery, courier_tracking, status, amount_paid, created_at, paid_at, updated_at")
    .eq("order_number", orderNumber)
    .eq("tracking_token", token)
    .maybeSingle();

  if (!o) return json({ error: "Order not found." }, 404, corsHeaders);

  const method = o.delivery_method as DeliveryOption | null;
  return json(
    {
      orderNumber: o.order_number,
      firstName: String(o.customer_name).split(" ")[0],
      status: o.status,
      statusLabel: STATUS_LABEL[o.status as OrderStatus] ?? o.status,
      items: (o.items as any[]).map((i) => ({ name: i.name, size: i.size, quantity: i.quantity, price: i.price, customBlend: i.customBlend ?? null })),
      total: o.amount_paid ?? o.total_amount,
      deliveryFee: o.delivery_fee,
      deliveryMethod: method,
      deliveryLabel: method ? DELIVERY[method]?.label ?? method : null,
      estimatedDelivery: o.estimated_delivery,
      courierTracking: o.status === "dispatched" || o.status === "delivered" ? o.courier_tracking : null,
      createdAt: o.created_at,
      paidAt: o.paid_at,
      updatedAt: o.updated_at,
    },
    200,
    corsHeaders,
  );
});
