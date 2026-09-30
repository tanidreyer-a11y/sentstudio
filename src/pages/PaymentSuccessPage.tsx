import { Navigate, Link } from "react-router-dom";
import Header from "@/components/Header";
import SiteFooter from "@/components/SiteFooter";
import { getRecentOrders, orderPath } from "@/lib/recent-orders";

// Yoco now returns customers to /order/:number. This route stays for checkouts
// started before that change: it forwards to the latest order's tracking page.
const PaymentSuccessPage = () => {
  const latest = getRecentOrders()[0];
  if (latest) return <Navigate to={`${orderPath(latest)}&paid=1`} replace />;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-6 max-w-2xl text-center">
          <h1 className="font-display text-4xl md:text-5xl font-light text-foreground mb-6">Thank you</h1>
          <p className="font-body text-lg text-muted-foreground mb-10">
            If your payment went through, Scent Studio has been notified. Message us on WhatsApp with your name if you'd like
            to confirm your order.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="https://wa.me/27761328213"
              target="_blank"
              rel="noopener noreferrer"
              className="px-10 py-4 bg-[#25D366] text-white font-sans text-sm tracking-[0.2em] uppercase"
            >
              WhatsApp us
            </a>
            <Link to="/" className="px-10 py-4 border border-primary text-primary font-sans text-sm tracking-[0.2em] uppercase">
              Home
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
};

export default PaymentSuccessPage;
