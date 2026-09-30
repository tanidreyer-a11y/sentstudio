// Admin-only: change an order's status / courier tracking number and email the
// customer about it (if they gave an email at checkout).
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { requireAdmin, serviceClient } from "../_shared/admin.ts";
import { STATUSES, json, safeOrigin, type OrderStatus } from "../_shared/orders.ts";
import { notifyCustomer, type OrderRow } from "../_shared/notify.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const db = serviceClient();
  if (!(await requireAdmin(req, db))) return json({ error: "Not allowed" }, 403, corsHeaders);

  const body = await req.json().catch(() => ({}));
  const id = typeof body?.id === "string" ? body.id : "";
  const status = body?.status as OrderStatus | undefined;
  const courierTracking = typeof body?.courierTracking === "string" ? body.courierTracking.trim().slice(0, 80) : undefined;
  const notify = body?.notify !== false;

  if (!id) return json({ error: "Missing order id" }, 400, corsHeaders);
  if (status && !STATUSES.includes(status)) return json({ error: "Unknown status" }, 400, corsHeaders);

  const patch: Record<string, unknown> = {};
  if (status) patch.status = status;
  if (courierTracking !== undefined) patch.courier_tracking = courierTracking || null;
  if (Object.keys(patch).length === 0) return json({ error: "Nothing to update" }, 400, corsHeaders);

  const { data: before } = await db.from("orders").select("status").eq("id", id).maybeSingle();
  const { data: order, error } = await db.from("orders").update(patch).eq("id", id).select("*").maybeSingle();
  if (error || !order) return json({ error: error?.message ?? "Order not found" }, 400, corsHeaders);

  let emailed = false;
  if (notify && status && before?.status !== status) {
    emailed = await notifyCustomer(order as unknown as OrderRow, safeOrigin(body?.origin)).catch((e) => {
      console.error("Customer notification failed", e);
      return false;
    });
  }

  return json({ order, emailed }, 200, corsHeaders);
});
