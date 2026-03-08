import { useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import Header from "@/components/Header";
import SiteFooter from "@/components/SiteFooter";
import { useCart } from "@/contexts/CartContext";

const PaymentSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
  }, []);

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
            <p className="font-sans text-xs tracking-wider text-muted-foreground/70 mb-12">
              Order ref: {orderId.slice(0, 8).toUpperCase()}
            </p>
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
