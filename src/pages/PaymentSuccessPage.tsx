import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle, MessageCircle } from "lucide-react";
import Header from "@/components/Header";
import SiteFooter from "@/components/SiteFooter";
import { useCart } from "@/contexts/CartContext";
import { ARAMEX_FEE } from "@/components/DeliveryForm";
import type { DeliveryDetails } from "@/components/DeliveryForm";

interface OrderItem {
  name: string;
  size: string;
  quantity: number;
  price: number;
  gender: string;
}

interface PendingOrder {
  items: OrderItem[];
  delivery: DeliveryDetails;
  totalPrice: number;
  deliveryFee: number;
  grandTotal: number;
}

const deliveryLabels: Record<string, string> = {
  pickup: "Customer Pickup",
  uber: "Uber Pickup Selected",
  local: "Local Delivery",
  aramex: "Aramex Courier",
};

const PaymentSuccessPage = () => {
  const { clearCart } = useCart();
  const [order, setOrder] = useState<PendingOrder | null>(null);
  const [whatsAppSent, setWhatsAppSent] = useState(false);

  useEffect(() => {
    clearCart();
    const raw = localStorage.getItem("pending_order");
    if (raw) {
      try {
        setOrder(JSON.parse(raw));
      } catch {}
      localStorage.removeItem("pending_order");
    }
  }, []);

  const getWhatsAppUrl = () => {
    if (!order) return "#";
    const itemsList = order.items
      .map(
        (i) => `• ${i.name} (${i.size}) x${i.quantity} — R${i.price * i.quantity}`
      )
      .join("\n");

    const d = order.delivery;
    const needsAddress = d.option === "local" || d.option === "aramex";
    const addressBlock = needsAddress
      ? `\n\n📍 Address:\n${d.streetAddress}\n${d.cityArea}\n${d.postalCode}`
      : "";

    const feeInfo =
      d.option === "aramex" ? `\n🚚 Delivery Fee: R${ARAMEX_FEE}` : "";

    const message = `✅ *Payment Confirmed — Scent Studio*\n\n👤 Customer: ${d.fullName}\n📞 Phone: ${d.phone}\n\n📦 Items:\n${itemsList}\n\n🚀 Delivery: ${deliveryLabels[d.option]}${addressBlock}${d.instructions ? `\n📝 Instructions: ${d.instructions}` : ""}${feeInfo}\n\n💰 *Total Paid: R${order.grandTotal}*\n\nPayment received via Yoco. Please prepare the order. Thank you!`;

    return `https://wa.me/27761328213?text=${encodeURIComponent(message)}`;
  };

  const handleWhatsAppConfirm = () => {
    window.open(getWhatsAppUrl(), "_blank");
    setWhatsAppSent(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-24 pb-20">
        <div className="container mx-auto px-6 max-w-2xl text-center">
          <CheckCircle className="w-20 h-20 text-primary mx-auto mb-8" />
          <h1 className="font-display text-4xl md:text-5xl font-light text-foreground mb-4">
            Payment Successful
          </h1>
          <div className="w-16 h-px bg-primary mx-auto my-8" />
          <p className="font-body text-lg text-muted-foreground mb-8">
            Thank you for your order! We'll prepare your fragrances with care.
          </p>

          {/* WhatsApp confirmation */}
          {order && !whatsAppSent && (
            <div className="bg-card border border-border p-6 mb-8 max-w-md mx-auto">
              <p className="font-sans text-sm text-muted-foreground mb-4">
                Tap below to send your order confirmation via WhatsApp so we can
                start preparing it right away.
              </p>
              <button
                onClick={handleWhatsAppConfirm}
                className="w-full py-4 bg-[#25D366] text-white font-sans text-sm tracking-[0.2em] uppercase hover:bg-[#20bd5a] transition-colors duration-300 flex items-center justify-center gap-3"
              >
                <MessageCircle size={18} />
                Confirm via WhatsApp
              </button>
            </div>
          )}

          {whatsAppSent && (
            <div className="bg-card border border-primary/30 p-4 mb-8 max-w-md mx-auto">
              <p className="font-sans text-sm text-primary">
                ✓ WhatsApp confirmation sent! We'll get back to you shortly.
              </p>
            </div>
          )}

          {!order && (
            <div className="bg-card border border-border p-4 mb-8 max-w-md mx-auto">
              <p className="font-sans text-sm text-muted-foreground">
                Order details unavailable. Please contact us on WhatsApp to confirm.
              </p>
            </div>
          )}

          <Link
            to="/catalog/women"
            className="inline-block px-10 py-4 bg-primary text-primary-foreground font-sans text-sm tracking-[0.2em] uppercase hover:bg-gold-light transition-colors duration-300"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
};

export default PaymentSuccessPage;
