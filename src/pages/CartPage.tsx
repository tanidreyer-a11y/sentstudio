import { useState } from "react";
import { Minus, Plus, Trash2, Loader2 } from "lucide-react";
import Header from "@/components/Header";
import SiteFooter from "@/components/SiteFooter";
import { useCart } from "@/contexts/CartContext";
import { MOTHERS_DAY_CODE, isMothersDayActive } from "@/lib/promotions";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import DeliveryForm, {
  type DeliveryDetails,
  ARAMEX_FEE,
  POSTNET_FEE,
  DELIVERY_LABELS,
} from "@/components/DeliveryForm";
import { rememberOrder } from "@/lib/recent-orders";
import { ONLINE_PAYMENTS_ENABLED, PAYMENTS_PAUSED_NOTE, orderReference, whatsAppLink } from "@/lib/ordering";

const CartPage = () => {
  const { items, removeFromCart, updateQuantity, clearCart, totalPrice, discounts, totalDiscount, finalPrice, promoCode, setPromoCode } =
    useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const [delivery, setDelivery] = useState<DeliveryDetails>({
    option: "pickup",
    fullName: "",
    phone: "",
    email: "",
    streetAddress: "",
    cityArea: "",
    postalCode: "",
    instructions: "",
  });

  const needsAddress = delivery.option === "aramex" || delivery.option === "postnet";
  const deliveryFee = delivery.option === "aramex" ? ARAMEX_FEE : delivery.option === "postnet" ? POSTNET_FEE : 0;
  const grandTotal = finalPrice + deliveryFee;

  const isFormValid =
    delivery.fullName.trim() &&
    delivery.phone.trim() &&
    (!needsAddress ||
      (delivery.streetAddress.trim() &&
        delivery.cityArea.trim() &&
        delivery.postalCode.trim()));

  // The order is saved and priced on the server (create-order), which returns the Yoco
  // payment page. The browser never writes to the orders table.
  const handlePayOnline = async () => {
    if (!isFormValid) return;
    setIsProcessing(true);

    try {
      const { email, ...deliveryDetails } = delivery;
      const { data, error } = await supabase.functions.invoke("create-order", {
        body: {
          items,
          delivery: deliveryDetails,
          email,
          discount: totalDiscount,
          origin: window.location.origin,
        },
      });

      if (error || !data?.redirectUrl) {
        let message = "Could not open the payment page. Please try again or order via WhatsApp.";
        const ctx = (error as { context?: Response } | null)?.context;
        if (ctx && typeof ctx.json === "function") {
          const body = await ctx.json().catch(() => null);
          if (body?.error) message = body.error;
        }
        throw new Error(message);
      }

      rememberOrder(data.orderNumber, data.trackingToken);
      window.location.href = data.redirectUrl;
    } catch (err) {
      console.error("Payment error:", err);
      toast({
        title: "Payment Error",
        description: (err as Error).message,
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };

  const getWhatsAppUrl = (ref: string) => {
    const itemsList = items
      .map((i) => {
        const base = `• ${i.name} (${i.size}) x${i.quantity} — R${i.price * i.quantity}`;
        if (i.customBlend) {
          return `${base}\n  Blend: ${i.customBlend.fragrances.join(" + ")} | Oil: ${i.customBlend.oilConcentration}%`;
        }
        return base;
      })
      .join("\n");

    let addressBlock = "";
    if (needsAddress) {
      addressBlock = `\n\n📍 Address:\n${delivery.streetAddress}\n${delivery.cityArea}\n${delivery.postalCode}`;
    }

    const feeInfo =
      (delivery.option === "aramex" || delivery.option === "postnet")
        ? `\n🚚 Delivery Fee: R${deliveryFee}`
        : "";

    const discountInfo = discounts.length > 0
      ? `\n\n🎉 Discounts:\n${discounts.map((d) => `  − ${d.label}: -R${d.amount}`).join("\n")}`
      : "";

    const emailLine = delivery.email.trim() ? `\n✉️ Email: ${delivery.email.trim()}` : "";
    const message = `🛍️ *New Order — Scent Studio*\n🧾 Ref: ${ref}\n\n👤 Customer: ${delivery.fullName}\n📞 Phone: ${delivery.phone}${emailLine}\n\n📦 Items:\n${itemsList}${discountInfo}\n\n🚀 Delivery: ${DELIVERY_LABELS[delivery.option]}${addressBlock}${delivery.instructions ? `\n📝 Instructions: ${delivery.instructions}` : ""}${feeInfo}\n\n💰 *Total: R${grandTotal}*\n\nPlease confirm availability and how I can pay. Thank you!`;

    return whatsAppLink(message);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-24 pb-20">
        <div className="container mx-auto px-6 max-w-3xl">
          <div className="text-center mb-16">
            <p className="font-sans text-sm tracking-[0.4em] uppercase text-primary mb-4">
              Your Selection
            </p>
            <h1 className="font-display text-4xl md:text-5xl font-light text-foreground">
              Shopping Cart
            </h1>
            <div className="w-16 h-px bg-primary mx-auto mt-8" />
          </div>

          {items.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-body text-lg text-muted-foreground">
                Your cart is empty.
              </p>
            </div>
          ) : (
            <>
              {/* Cart items */}
              <div className="space-y-6 mb-12">
                {items.map((item) => (
                  <div
                    key={`${item.perfumeId}-${item.size}`}
                    className="flex items-center gap-4 sm:gap-6 p-4 sm:p-6 bg-card border border-border"
                  >
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-secondary flex items-center justify-center shrink-0">
                      <span className="font-display text-xl sm:text-2xl text-primary/40">
                        {item.name[0]}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      {item.customBlend ? (
                        <>
                          <p className="font-sans text-[10px] tracking-wider text-primary/70 uppercase">
                            Signature Blend
                          </p>
                          <h3 className="font-display text-base sm:text-lg text-foreground truncate">
                            Custom Blend
                          </h3>
                          <p className="font-sans text-xs tracking-wider text-muted-foreground">
                            {item.size} · {item.customBlend.oilConcentration}% oil
                          </p>
                          <p className="font-body text-xs text-muted-foreground/80 truncate">
                            {item.customBlend.fragrances.join(" + ")}
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="font-sans text-[10px] tracking-wider text-muted-foreground/70 uppercase">
                            Inspired by
                          </p>
                          <h3 className="font-display text-base sm:text-lg text-foreground truncate">
                            {item.name}
                          </h3>
                          <p className="font-sans text-xs tracking-wider text-muted-foreground">
                            {item.size} ·{" "}
                            {item.gender === "men" ? "For Him" : "For Her"}
                          </p>
                        </>
                      )}
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3">
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.perfumeId,
                            item.size,
                            item.quantity - 1
                          )
                        }
                        className="w-8 h-8 border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="font-sans text-sm w-6 text-center text-foreground">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.perfumeId,
                            item.size,
                            item.quantity + 1
                          )
                        }
                        className="w-8 h-8 border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <p className="font-sans text-sm tracking-wider text-primary font-medium w-16 sm:w-20 text-right">
                      R{item.price * item.quantity}
                    </p>

                    <button
                      onClick={() => removeFromCart(item.perfumeId, item.size)}
                      className="text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Delivery form */}
              <div className="border-t border-border pt-8 mb-8">
                <DeliveryForm details={delivery} onChange={setDelivery} />
              </div>

              {/* Promo code */}
              <div className="border-t border-border pt-8 mb-8">
                <label className="block font-sans text-xs tracking-[0.2em] uppercase text-muted-foreground mb-3">
                  Promo Code
                </label>
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Enter code (e.g. #MUM)"
                  className="w-full px-4 py-3 bg-background border border-border font-sans text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
                />
                {isMothersDayActive() && (
                  <p className="font-body text-xs text-muted-foreground mt-2">
                    💐 Mother's Day Special: Use <span className="text-primary font-medium">{MOTHERS_DAY_CODE}</span> for 10% off when you buy 2+ perfumes (one must be a women's fragrance).
                  </p>
                )}
              </div>

              {/* Totals & actions */}
              <div className="border-t border-border pt-8 space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-sans text-sm text-muted-foreground">
                      Subtotal
                    </span>
                    <span className="font-sans text-sm text-foreground">
                      R{totalPrice}
                    </span>
                  </div>
                  {discounts.map((d, idx) => (
                    <div key={idx} className="flex justify-between items-center">
                      <span className="font-sans text-sm text-green-600">
                        {d.label}
                      </span>
                      <span className="font-sans text-sm text-green-600">
                        −R{d.amount}
                      </span>
                    </div>
                  ))}
                  {deliveryFee > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="font-sans text-sm text-muted-foreground">
                        {DELIVERY_LABELS[delivery.option]}
                      </span>
                      <span className="font-sans text-sm text-foreground">
                        R{deliveryFee}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between items-center pt-2 border-t border-border">
                    <span className="font-sans text-sm tracking-[0.2em] uppercase text-muted-foreground">
                      Total
                    </span>
                    <span className="font-display text-2xl text-primary">
                      R{grandTotal}
                    </span>
                  </div>
                </div>

                {ONLINE_PAYMENTS_ENABLED ? (
                  <>
                    <button
                      onClick={handlePayOnline}
                      disabled={!isFormValid || isProcessing}
                      className="w-full py-4 bg-primary text-primary-foreground font-sans text-sm tracking-[0.2em] uppercase hover:bg-gold-light transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 size={18} className="animate-spin" />
                          Processing…
                        </>
                      ) : (
                        `Pay Online — R${grandTotal}`
                      )}
                    </button>

                    <div className="relative flex items-center gap-4">
                      <div className="flex-1 h-px bg-border" />
                      <span className="font-sans text-xs tracking-wider text-muted-foreground uppercase">
                        or
                      </span>
                      <div className="flex-1 h-px bg-border" />
                    </div>
                  </>
                ) : (
                  <div role="note" className="border border-primary/40 bg-primary/5 p-4">
                    <p className="font-sans text-sm text-foreground leading-relaxed">{PAYMENTS_PAUSED_NOTE}</p>
                  </div>
                )}

                <button
                  onClick={() => {
                    if (!isFormValid) return;
                    window.open(getWhatsAppUrl(orderReference()), "_blank");
                  }}
                  disabled={!isFormValid}
                  className={`w-full py-4 font-sans text-sm tracking-[0.2em] uppercase transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                    ONLINE_PAYMENTS_ENABLED
                      ? "border border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                      : "bg-primary text-primary-foreground hover:bg-gold-light"
                  }`}
                >
                  {ONLINE_PAYMENTS_ENABLED ? "Order via WhatsApp" : `Send Order on WhatsApp — R${grandTotal}`}
                </button>
                {!isFormValid && (
                  <p className="font-sans text-xs text-muted-foreground text-center -mt-3">
                    Enter your name and phone number{needsAddress ? " and delivery address" : ""} above to continue.
                  </p>
                )}

                <button
                  onClick={clearCart}
                  className="w-full py-3 border border-border font-sans text-xs tracking-[0.2em] uppercase text-muted-foreground hover:border-destructive hover:text-destructive transition-colors"
                >
                  Clear Cart
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      <SiteFooter />
    </div>
  );
};

export default CartPage;
