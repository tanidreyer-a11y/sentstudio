import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload = await req.json();
    console.log("Yoco webhook received:", JSON.stringify(payload));

    const eventType = payload.type;
    const eventPayload = payload.payload || {};

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Extract identifiers from the webhook payload in order of reliability
    const checkoutId =
      eventPayload.id ||
      eventPayload.checkout?.id ||
      payload.id ||
      eventPayload.metadata?.checkoutId;
    const orderNumber =
      eventPayload.externalId ||
      eventPayload.metadata?.orderNumber ||
      eventPayload.metadata?.externalId;
    const orderId =
      eventPayload.metadata?.orderId ||
      eventPayload.metadata?.order_id;

    if (eventType === "payment.succeeded") {
      let updateResult;

      if (checkoutId) {
        updateResult = await supabase
          .from("orders")
          .update({ status: "paid" })
          .eq("yoco_checkout_id", checkoutId);
      }

      if (!updateResult && orderNumber) {
        updateResult = await supabase
          .from("orders")
          .update({ status: "paid" })
          .eq("order_number", orderNumber);
      }

      if (!updateResult && orderId) {
        updateResult = await supabase
          .from("orders")
          .update({ status: "paid" })
          .eq("id", orderId);
      }

      if (!updateResult) {
        console.warn(
          "No checkout or order ID found in webhook payload",
          JSON.stringify({ checkoutId, orderNumber, orderId })
        );
      } else if (updateResult.error) {
        console.error("Failed to update order:", updateResult.error);
      } else {
        console.log("Order updated to paid");
      }
    } else if (eventType === "payment.failed") {
      let updateResult;

      if (checkoutId) {
        updateResult = await supabase
          .from("orders")
          .update({ status: "failed" })
          .eq("yoco_checkout_id", checkoutId);
      }

      if (!updateResult && orderNumber) {
        updateResult = await supabase
          .from("orders")
          .update({ status: "failed" })
          .eq("order_number", orderNumber);
      }

      if (!updateResult && orderId) {
        updateResult = await supabase
          .from("orders")
          .update({ status: "failed" })
          .eq("id", orderId);
      }

      if (!updateResult) {
        console.warn("No checkout or order ID found in failed payment payload");
      } else if (updateResult.error) {
        console.error("Failed to update order:", updateResult.error);
      } else {
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
