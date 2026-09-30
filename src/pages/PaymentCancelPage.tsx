import { Link, useSearchParams } from "react-router-dom";
import { XCircle } from "lucide-react";
import Header from "@/components/Header";
import SiteFooter from "@/components/SiteFooter";

const PaymentCancelPage = () => {
  const [params] = useSearchParams();
  const failed = params.get("failed") === "1";

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-24 pb-20">
        <div className="container mx-auto px-6 max-w-2xl text-center">
          <XCircle className="w-20 h-20 text-destructive mx-auto mb-8" />
          <h1 className="font-display text-4xl md:text-5xl font-light text-foreground mb-4">
            {failed ? "Payment Unsuccessful" : "Payment Cancelled"}
          </h1>
          <div className="w-16 h-px bg-primary mx-auto my-8" />
          <p className="font-body text-lg text-muted-foreground mb-12">
            {failed ? "Your payment didn't go through, so you haven't been charged." : "Your payment was not completed and you haven't been charged."}{" "}
            Your cart items are still saved.
          </p>
          <Link
            to="/cart"
            className="inline-block px-10 py-4 bg-primary text-primary-foreground font-sans text-sm tracking-[0.2em] uppercase hover:bg-gold-light transition-colors duration-300"
          >
            Return to Cart
          </Link>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
};

export default PaymentCancelPage;
