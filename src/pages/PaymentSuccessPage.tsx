import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { CheckCircle, MessageCircle } from "lucide-react";
import Header from "@/components/Header";
import SiteFooter from "@/components/SiteFooter";
import { useCart } from "@/contexts/CartContext";
import { supabase } from "@/integrations/supabase/client";

interface OrderItem {
  name: string;
  size: string;
  quantity: number;
  price: number;
  gender: string;
}

const PaymentSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");
  const { clearCart } = useCart();
  const [order, setOrder] = useState<{
    customer_name: string;
    items: OrderItem[];
    total_amount: number;
  } | null>(null);
  const [whatsAppSent, setWhatsAppSent] = useState(false);

  useEffect(() => {
    clearCart();
  }, []);

  useEffect(() => {
    if (!orderId) return;
    const fetchOrder = async () => {
      const { data } = await supabase
        .from("orders")
        .select("customer_name, items, total_amount")
        .eq("id", orderId)
        .single();
      if (data) {
        setOrder({
          customer_name: data.customer_name,
          items: data.items as unknown as OrderItem[],
          total_amount: data.total_amount,
        });
      }
    };
    fetchOrder();
  }, [orderId]);

  const getWhatsAppUrl = () => {
    if (!order) return "#";
    const itemsList = order.items
      .map((i) => `• ${i.name} (${i.size}) x${i.quantity} — R${i.price * i.quantity}`)
      .join("\n");
    const message = `✅ *Payment Confirmed — Scent Studio*\n\n👤 Customer: ${order.customer_name}\n📋 Order Ref: ${orderId?.slice(0, 8).toUpperCase()}\n\n📦 Items:\n${itemsList}\n\n💰 *Total Paid: R${order.total_amount}*\n\nPayment received via Yoco. Please prepare the order. Thank you!`;
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
          <p className="font-body text-lg text-muted-foreground mb-2">
            Thank you for your order! We'll prepare your fragrances with care.
          </p>
          {orderId && (
            <p className="font-sans text-xs tracking-wider text-muted-foreground/70 mb-8">
              Order ref: {orderId.slice(0, 8).toUpperCase()}
            </p>
          )}

          {/* WhatsApp Confirmation */}
          {order && !whatsAppSent && (
            <div className="bg-card border border-border p-6 mb-8 max-w-md mx-auto">
              <p className="font-sans text-sm text-muted-foreground mb-4">
                Tap below to send your order confirmation via WhatsApp so we can start preparing it right away.
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
