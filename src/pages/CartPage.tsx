import { useState } from "react";
import { Minus, Plus, Trash2, Loader2 } from "lucide-react";
import Header from "@/components/Header";
import SiteFooter from "@/components/SiteFooter";
import { useCart } from "@/contexts/CartContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import DeliveryForm, {
  type DeliveryDetails,
  ARAMEX_FEE,
} from "@/components/DeliveryForm";

const CartPage = () => {
  const { items, removeFromCart, updateQuantity, clearCart, totalPrice, discounts, totalDiscount, finalPrice } =
    useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const [delivery, setDelivery] = useState<DeliveryDetails>({
    option: "pickup",
    fullName: "",
    phone: "",
    streetAddress: "",
    cityArea: "",
    postalCode: "",
    instructions: "",
  });

  const needsAddress = delivery.option === "aramex";
  const deliveryFee = delivery.option === "aramex" ? ARAMEX_FEE : 0;
  const grandTotal = finalPrice + deliveryFee;

  const isFormValid =
    delivery.fullName.trim() &&
    delivery.phone.trim() &&
    (!needsAddress ||
      (delivery.streetAddress.trim() &&
        delivery.cityArea.trim() &&
        delivery.postalCode.trim()));

  const handlePayOnline = async () => {
    if (!isFormValid) return;
    setIsProcessing(true);

    try {
      // Store order details in localStorage for success page
      const orderData = {
        items: items.map((i) => ({
          name: i.name,
          size: i.size,
          quantity: i.quantity,
          price: i.price,
          gender: i.gender,
        })),
        delivery,
        totalPrice,
        deliveryFee,
        grandTotal,
      };
      localStorage.setItem("pending_order", JSON.stringify(orderData));

      const origin = window.location.origin;
      const { data, error } = await supabase.functions.invoke(
        "create-yoco-checkout",
        {
          body: {
            amount: grandTotal,
            successUrl: `${origin}/payment/success`,
            cancelUrl: `${origin}/payment/cancel`,
          },
        }
      );

      if (error) throw error;
      if (data?.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (err: any) {
      console.error("Payment error:", err);
      toast({
        title: "Payment Error",
        description:
          "Could not initiate payment. Please try WhatsApp ordering instead.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const getWhatsAppUrl = () => {
    const itemsList = items
      .map((i) => {
        const base = `• ${i.name} (${i.size}) x${i.quantity} — R${i.price * i.quantity}`;
        if (i.customBlend) {
          return `${base}\n  Blend: ${i.customBlend.fragrances.join(" + ")} | Oil: ${i.customBlend.oilConcentration}%`;
        }
        return base;
      })
      .join("\n");

    const deliveryLabels: Record<string, string> = {
      pickup: "Store Pickup",
      uber: "Uber Pickup Selected",
      local: "Local Delivery",
      aramex: "Aramex Courier",
    };

    let addressBlock = "";
    if (needsAddress) {
      addressBlock = `\n\n📍 Address:\n${delivery.streetAddress}\n${delivery.cityArea}\n${delivery.postalCode}`;
    }

    const feeInfo =
      delivery.option === "aramex" ? `\n🚚 Delivery Fee: R${ARAMEX_FEE}` : "";

    const discountInfo = discounts.length > 0
      ? `\n\n🎉 Discounts:\n${discounts.map((d) => `  − ${d.label}: -R${d.amount}`).join("\n")}`
      : "";

    const message = `🛍️ *New Order — Scent Studio*\n\n👤 Customer: ${delivery.fullName}\n📞 Phone: ${delivery.phone}\n\n📦 Items:\n${itemsList}${discountInfo}\n\n🚀 Delivery: ${deliveryLabels[delivery.option]}${addressBlock}${delivery.instructions ? `\n📝 Instructions: ${delivery.instructions}` : ""}${feeInfo}\n\n💰 *Total: R${grandTotal}*\n\nPlease confirm availability. Thank you!`;

    return `https://wa.me/27761328213?text=${encodeURIComponent(message)}`;
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
                        Aramex Delivery
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

                <button
                  onClick={() => {
                    if (!isFormValid) return;
                    window.open(getWhatsAppUrl(), "_blank");
                  }}
                  disabled={!isFormValid}
                  className="w-full py-4 border border-primary text-primary font-sans text-sm tracking-[0.2em] uppercase hover:bg-primary hover:text-primary-foreground transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Order via WhatsApp
                </button>

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
