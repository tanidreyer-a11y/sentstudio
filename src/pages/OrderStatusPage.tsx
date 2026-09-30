import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { CheckCircle, Loader2, MessageCircle, XCircle } from "lucide-react";
import Header from "@/components/Header";
import SiteFooter from "@/components/SiteFooter";
import { useCart } from "@/contexts/CartContext";
import { supabase } from "@/integrations/supabase/client";
import { rememberOrder } from "@/lib/recent-orders";

interface OrderStatus {
  orderNumber: string;
  firstName: string;
  status: string;
  statusLabel: string;
  items: { name: string; size: string; quantity: number; price: number; customBlend: { fragrances: string[]; oilConcentration: number } | null }[];
  total: number;
  deliveryFee: number;
  deliveryMethod: string | null;
  deliveryLabel: string | null;
  estimatedDelivery: string | null;
  courierTracking: string | null;
  createdAt: string;
  paidAt: string | null;
}

const PAID_STATES = ["paid", "processing", "ready_for_pickup", "dispatched", "delivered"];
const COLLECTED = ["pickup", "uber"];
// Yoco normally confirms within seconds; keep checking for two minutes before
// telling the customer it's taking longer than usual.
const POLL_MS = 3000;
const POLL_LIMIT = 40;

const steps = (method: string | null) =>
  COLLECTED.includes(method ?? "")
    ? [
        { key: "paid", label: "Payment received" },
        { key: "processing", label: "Being prepared" },
        { key: "ready_for_pickup", label: "Ready for collection" },
        { key: "delivered", label: "Collected" },
      ]
    : [
        { key: "paid", label: "Payment received" },
        { key: "processing", label: "Being prepared" },
        { key: "dispatched", label: "On its way" },
        { key: "delivered", label: "Delivered" },
      ];

const whatsAppUrl = (orderNumber: string) =>
  `https://wa.me/27761328213?text=${encodeURIComponent(`Hi Scent Studio, I have a question about my order ${orderNumber}.`)}`;

const OrderStatusPage = () => {
  const { orderNumber = "" } = useParams();
  const [params] = useSearchParams();
  const token = params.get("t") ?? "";
  const fromPayment = params.get("paid") === "1";

  const { clearCart } = useCart();
  const [order, setOrder] = useState<OrderStatus | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [waitedTooLong, setWaitedTooLong] = useState(false);
  const polls = useRef(0);
  const cartCleared = useRef(false);

  const load = useCallback(async () => {
    const { data, error } = await supabase.functions.invoke("order-status", { body: { orderNumber, token } });
    if (error || !data?.orderNumber) {
      setNotFound(true);
      return null;
    }
    setOrder(data as OrderStatus);
    return data as OrderStatus;
  }, [orderNumber, token]);

  useEffect(() => {
    if (token) rememberOrder(orderNumber, token);
    let timer: ReturnType<typeof setTimeout> | undefined;
    let cancelled = false;

    const tick = async () => {
      const o = await load();
      if (cancelled || !o) return;
      if (PAID_STATES.includes(o.status) && fromPayment && !cartCleared.current) {
        cartCleared.current = true;
        clearCart();
      }
      if (fromPayment && o.status === "pending") {
        polls.current += 1;
        if (polls.current >= POLL_LIMIT) setWaitedTooLong(true);
        else timer = setTimeout(tick, POLL_MS);
      }
    };
    tick();
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
    // clearCart is recreated each render by the cart context; excluding it avoids a poll restart loop.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [load, fromPayment, orderNumber, token]);

  const isPaid = order && PAID_STATES.includes(order.status);
  const flow = steps(order?.deliveryMethod ?? null);
  const reached = order ? flow.findIndex((s) => s.key === order.status) : -1;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-6 max-w-2xl">
          {notFound ? (
            <div className="text-center">
              <h1 className="font-display text-4xl font-light text-foreground mb-6">Order not found</h1>
              <p className="font-body text-lg text-muted-foreground mb-10">
                This tracking link is incomplete. Please use the link from your confirmation, or message us with your order number.
              </p>
              <a
                href={whatsAppUrl(orderNumber)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-10 py-4 bg-[#25D366] text-white font-sans text-sm tracking-[0.2em] uppercase"
              >
                <MessageCircle size={18} /> WhatsApp us
              </a>
            </div>
          ) : !order ? (
            <div className="flex justify-center py-24" role="status" aria-label="Loading your order">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              <div className="text-center mb-12">
                {order.status === "failed" || order.status === "cancelled" ? (
                  <XCircle className="w-16 h-16 text-destructive mx-auto mb-6" />
                ) : isPaid ? (
                  <CheckCircle className="w-16 h-16 text-primary mx-auto mb-6" />
                ) : (
                  <Loader2 className="w-16 h-16 text-primary mx-auto mb-6 animate-spin motion-reduce:animate-none" />
                )}
                <h1 className="font-display text-4xl md:text-5xl font-light text-foreground mb-4">
                  {order.status === "pending"
                    ? fromPayment
                      ? "Confirming your payment"
                      : "Awaiting payment"
                    : order.status === "paid" && fromPayment
                      ? `Thank you, ${order.firstName}`
                      : order.statusLabel}
                </h1>
                <p className="font-sans text-sm tracking-[0.2em] text-primary">Order {order.orderNumber}</p>
                <p className="font-body text-base text-muted-foreground mt-6 max-w-md mx-auto" aria-live="polite">
                  {order.status === "pending" && fromPayment && !waitedTooLong &&
                    "We're waiting for Yoco to confirm your payment. This usually takes a few seconds."}
                  {order.status === "pending" && waitedTooLong &&
                    "Confirmation is taking longer than usual. If your card was charged, your order is safe. We'll confirm it with you on WhatsApp."}
                  {order.status === "pending" && !fromPayment && "This order hasn't been paid yet."}
                  {order.status === "paid" && "Your order is confirmed and Scent Studio has been notified. Bookmark this page to follow your order."}
                  {order.status === "failed" && "Your payment didn't go through, so you haven't been charged. You can try again from your cart."}
                  {order.status === "cancelled" && "This order was cancelled. Message us if you have any questions."}
                </p>
              </div>

              {isPaid && (
                <ol className="grid grid-cols-4 gap-2 mb-12" aria-label="Order progress">
                  {flow.map((step, i) => {
                    const done = i <= reached;
                    return (
                      <li key={step.key} aria-current={i === reached ? "step" : undefined}>
                        <div className="h-px bg-border overflow-hidden mb-3">
                          <div
                            className="h-full bg-primary origin-left transition-transform duration-700 motion-reduce:transition-none"
                            style={{ transform: `scaleX(${done ? 1 : 0})`, transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)", transitionDelay: `${i * 80}ms` }}
                          />
                        </div>
                        <p className={`font-sans text-[0.7rem] leading-snug tracking-[0.1em] uppercase ${done ? "text-foreground" : "text-muted-foreground/60"}`}>
                          {step.label}
                        </p>
                      </li>
                    );
                  })}
                </ol>
              )}

              {order.courierTracking && (
                <div className="border border-primary/40 bg-primary/5 p-5 mb-8">
                  <p className="font-sans text-xs tracking-[0.2em] uppercase text-muted-foreground mb-1">Courier tracking number</p>
                  <p className="font-display text-2xl text-primary tracking-wider select-all">{order.courierTracking}</p>
                </div>
              )}

              <div className="bg-card border border-border p-6 mb-8">
                <ul className="font-body text-sm text-foreground space-y-2 mb-4">
                  {order.items.map((i, idx) => (
                    <li key={idx} className="flex justify-between gap-4">
                      <span>
                        {i.customBlend ? `Custom blend: ${i.customBlend.fragrances.join(" + ")}` : i.name} ({i.size}) ×{i.quantity}
                      </span>
                      <span className="text-muted-foreground tabular-nums">R{i.price * i.quantity}</span>
                    </li>
                  ))}
                </ul>
                <dl className="font-sans text-sm border-t border-border pt-4 space-y-2">
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted-foreground">Delivery</dt>
                    <dd className="text-foreground text-right">{order.deliveryLabel ?? "—"}</dd>
                  </div>
                  {order.estimatedDelivery && (
                    <div className="flex justify-between gap-4">
                      <dt className="text-muted-foreground">Estimated</dt>
                      <dd className="text-foreground text-right">{order.estimatedDelivery}</dd>
                    </div>
                  )}
                  <div className="flex justify-between gap-4 pt-2 border-t border-border">
                    <dt className="text-muted-foreground">{isPaid ? "Total paid" : "Total"}</dt>
                    <dd className="font-display text-xl text-primary tabular-nums">R{order.total}</dd>
                  </div>
                </dl>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href={whatsAppUrl(order.orderNumber)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-3 py-4 border border-[#25D366] text-foreground font-sans text-xs tracking-[0.2em] uppercase hover:bg-[#25D366]/10 transition-colors"
                >
                  <MessageCircle size={16} className="text-[#25D366]" /> Questions? WhatsApp us
                </a>
                <Link
                  to={order.status === "failed" ? "/cart" : "/catalog/women"}
                  className="flex-1 inline-flex items-center justify-center py-4 bg-primary text-primary-foreground font-sans text-xs tracking-[0.2em] uppercase hover:bg-gold-light transition-colors"
                >
                  {order.status === "failed" ? "Back to cart" : "Continue shopping"}
                </Link>
              </div>
            </>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
};

export default OrderStatusPage;
