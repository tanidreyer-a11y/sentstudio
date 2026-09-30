// Admin-only: checks the Yoco connection and registers this project's webhook.
// Yoco shows a webhook's signing secret only once, at registration, so it is
// stored straight into the private app_settings table (never sent to the browser).
//
// POST { action: "status" }   → key mode + registered webhooks
// POST { action: "register" } → registers the webhook (replacing stale ones for our URL)
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { requireAdmin, serviceClient } from "../_shared/admin.ts";
import { json } from "../_shared/orders.ts";

const YOCO = "https://payments.yoco.com/api/webhooks";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const db = serviceClient();
  if (!(await requireAdmin(req, db))) return json({ error: "Not allowed" }, 403, corsHeaders);

  const key = Deno.env.get("YOCO_SECRET_KEY");
  if (!key) return json({ configured: false, error: "YOCO_SECRET_KEY secret is missing in Lovable Cloud." }, 200, corsHeaders);

  const keyMode = key.startsWith("sk_live") ? "live" : key.startsWith("sk_test") ? "test" : "unknown";
  const webhookUrl = `${Deno.env.get("SUPABASE_URL")}/functions/v1/yoco-webhook`;
  const auth = { Authorization: `Bearer ${key}`, "Content-Type": "application/json" };

  const { action } = await req.json().catch(() => ({ action: "status" }));

  const listRes = await fetch(YOCO, { headers: auth });
  const list = await listRes.json().catch(() => ({}));
  if (!listRes.ok) {
    return json({ configured: true, keyMode, error: `Yoco rejected the secret key (${listRes.status}).`, detail: list }, 200, corsHeaders);
  }
  const hooks: any[] = Array.isArray(list) ? list : list.subscriptions ?? list.webhooks ?? list.data ?? [];
  const ours = hooks.filter((h) => h.url === webhookUrl);

  const { data: stored } = await db.from("app_settings").select("updated_at").eq("key", "yoco_webhook_secret").maybeSingle();

  if (action === "register") {
    // A secret we can't read back is useless, so replace any existing registration for our URL.
    for (const h of ours) await fetch(`${YOCO}/${h.id}`, { method: "DELETE", headers: auth });

    const regRes = await fetch(YOCO, { method: "POST", headers: auth, body: JSON.stringify({ name: "scent-studio-orders", url: webhookUrl }) });
    const reg = await regRes.json().catch(() => ({}));
    if (!regRes.ok || !reg.secret) {
      return json({ configured: true, keyMode, error: `Webhook registration failed (${regRes.status}).`, detail: reg }, 200, corsHeaders);
    }
    const { error } = await db
      .from("app_settings")
      .upsert({ key: "yoco_webhook_secret", value: reg.secret, updated_at: new Date().toISOString() });
    if (error) return json({ configured: true, keyMode, error: `Registered, but the secret could not be saved: ${error.message}` }, 200, corsHeaders);

    return json({ configured: true, keyMode, registered: true, webhook: { id: reg.id, mode: reg.mode, url: reg.url } }, 200, corsHeaders);
  }

  return json(
    {
      configured: true,
      keyMode,
      webhookUrl,
      webhooks: hooks.map((h) => ({ id: h.id, name: h.name, url: h.url, mode: h.mode, ours: h.url === webhookUrl })),
      secretStoredAt: stored?.updated_at ?? null,
      ready: ours.length > 0 && !!stored,
    },
    200,
    corsHeaders,
  );
});
