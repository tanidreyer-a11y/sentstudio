import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload = await req.json();
    console.log("Yoco webhook received:", JSON.stringify(payload));

    const eventType = payload.type;
    const checkoutId = payload.payload?.metadata?.checkoutId || payload.id;

    // Yoco sends "payment.succeeded" for successful payments
    if (eventType === "payment.succeeded") {
      const supabase = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
      );

      // Try matching by yoco_checkout_id from metadata
      const yocoCheckoutId = payload.payload?.metadata?.checkoutId || payload.payload?.checkoutId;
      
      let updateQuery;
      if (yocoCheckoutId) {
        updateQuery = supabase
          .from("orders")
          .update({ status: "paid" })
          .eq("yoco_checkout_id", yocoCheckoutId);
      } else {
        // Fallback: try to find by the payment ID in metadata
        const orderId = payload.payload?.metadata?.orderId;
        if (orderId) {
          updateQuery = supabase
            .from("orders")
            .update({ status: "paid" })
            .eq("id", orderId);
        } else {
          console.warn("No checkout or order ID found in webhook payload");
          return new Response(JSON.stringify({ received: true }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
      }

      const { error } = await updateQuery;
      if (error) {
        console.error("Failed to update order:", error);
      } else {
        console.log("Order updated to paid");
      }
    } else if (eventType === "payment.failed") {
      const supabase = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
      );

      const orderId = payload.payload?.metadata?.orderId;
      if (orderId) {
        await supabase
          .from("orders")
          .update({ status: "failed" })
          .eq("id", orderId);
        console.log("Order marked as failed");
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Webhook error:", err);
    return new Response(JSON.stringify({ error: "Webhook processing failed" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
