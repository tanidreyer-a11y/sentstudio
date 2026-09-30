import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type OrderItem = {
  name: string;
  size: string;
  quantity: number;
  price: number;
  customBlend?: { fragrances: string[]; oilConcentration: number };
};

type Address = { streetAddress?: string; cityArea?: string; postalCode?: string; instructions?: string } | null;

type Order = {
  id: string;
  order_number: string;
  tracking_token: string;
  customer_name: string;
  customer_phone: string | null;
  customer_email: string | null;
  items: OrderItem[];
  total_amount: number;
  amount_paid: number | null;
  delivery_fee: number;
  delivery_method: string | null;
  delivery_address: Address;
  estimated_delivery: string | null;
  courier_tracking: string | null;
  payment_mode: string | null;
  admin_notes: string | null;
  status: string;
  created_at: string;
  paid_at: string | null;
};

type YocoStatus = {
  configured: boolean;
  keyMode?: string;
  ready?: boolean;
  error?: string;
  webhooks?: { id: string; url: string; mode: string; ours: boolean }[];
  secretStoredAt?: string | null;
  registered?: boolean;
};

const STATUSES = ["pending", "paid", "processing", "ready_for_pickup", "dispatched", "delivered", "cancelled", "failed"];

const STATUS_LABEL: Record<string, string> = {
  pending: "Awaiting payment",
  paid: "Paid",
  processing: "Being prepared",
  ready_for_pickup: "Ready for collection",
  dispatched: "Dispatched",
  delivered: "Delivered / collected",
  cancelled: "Cancelled",
  failed: "Payment failed",
};

const statusStyles: Record<string, string> = {
  pending: "text-muted-foreground",
  paid: "text-blue-500",
  processing: "text-amber-500",
  ready_for_pickup: "text-teal-600",
  dispatched: "text-purple-500",
  delivered: "text-green-600",
  cancelled: "text-destructive",
  failed: "text-destructive",
};

const DELIVERY_LABEL: Record<string, string> = {
  pickup: "Store pickup",
  uber: "Uber / Bolt",
  aramex: "Aramex",
  postnet: "PostNet",
};

const customerMessage: Record<string, string> = {
  paid: "your payment was received and your order is confirmed",
  processing: "your order is being prepared",
  ready_for_pickup: "your order is ready for collection at Flora Shopping Centre",
  dispatched: "your order is on its way",
  delivered: "your order has been delivered. Enjoy your fragrance!",
  cancelled: "your order has been cancelled",
};

const waNumber = (phone: string) => "27" + phone.replace(/\D/g, "").replace(/^(27|0)/, "");

const trackingLink = (o: Order) => `${window.location.origin}/order/${o.order_number}?t=${o.tracking_token}`;

const whatsAppUpdate = (o: Order) => {
  const first = o.customer_name.split(" ")[0];
  const line = customerMessage[o.status] ?? `your order status is: ${STATUS_LABEL[o.status] ?? o.status}`;
  const courier = o.status === "dispatched" && o.courier_tracking ? `\nCourier tracking number: ${o.courier_tracking}` : "";
  const text = `Hi ${first}, this is Scent Studio. Your order ${o.order_number}: ${line}.${courier}\n\nTrack it here: ${trackingLink(o)}`;
  return `https://wa.me/${waNumber(o.customer_phone ?? "")}?text=${encodeURIComponent(text)}`;
};

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUnpaid, setShowUnpaid] = useState(false);
  const [yoco, setYoco] = useState<YocoStatus | null>(null);
  const [yocoBusy, setYocoBusy] = useState(false);
  const [courierDrafts, setCourierDrafts] = useState<Record<string, string>>({});

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast({ title: "Failed to load orders", description: error.message, variant: "destructive" });
    else setOrders((data as unknown as Order[]) ?? []);
    setLoading(false);
  };

  const yocoCall = async (action: "status" | "register") => {
    setYocoBusy(true);
    const { data, error } = await supabase.functions.invoke("yoco-setup", { body: { action } });
    setYocoBusy(false);
    if (error) {
      setYoco({ configured: false, error: error.message });
      return;
    }
    if (action === "register") {
      if (data?.registered) toast({ title: "Yoco connected", description: `Payment confirmations are now switched on (${data.keyMode} mode).` });
      else toast({ title: "Could not connect Yoco", description: data?.error ?? "Unknown error", variant: "destructive" });
      return yocoCall("status");
    }
    setYoco(data as YocoStatus);
  };

  useEffect(() => {
    load();
    yocoCall("status");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const save = async (order: Order, patch: { status?: string; courierTracking?: string }) => {
    const { data, error } = await supabase.functions.invoke("admin-update-order", {
      body: { id: order.id, ...patch, origin: window.location.origin },
    });
    if (error || !data?.order) {
      toast({ title: "Update failed", description: error?.message ?? "Unknown error", variant: "destructive" });
      return;
    }
    setOrders((p) => p.map((o) => (o.id === order.id ? (data.order as Order) : o)));
    if (patch.status) {
      toast({
        title: `${order.order_number}: ${STATUS_LABEL[patch.status]}`,
        description: data.emailed
          ? "The customer was emailed."
          : "No email sent (customer gave no email, or email isn't set up). Use the WhatsApp button to let them know.",
      });
    } else {
      toast({ title: "Tracking number saved" });
    }
  };

  const visible = showUnpaid ? orders : orders.filter((o) => o.status !== "pending" && o.status !== "failed");

  const counts = STATUSES.reduce<Record<string, number>>((acc, s) => {
    acc[s] = orders.filter((o) => o.status === s).length;
    return acc;
  }, {});

  const formatAddress = (addr: Address) => {
    if (!addr || typeof addr !== "object") return "—";
    const parts = [addr.streetAddress, addr.cityArea, addr.postalCode].filter(Boolean);
    return parts.length ? parts.join(", ") : "—";
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto max-w-7xl px-6">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <h1 className="font-display text-3xl font-light text-foreground">Orders</h1>
          <nav className="flex gap-4 font-sans text-xs uppercase tracking-[0.2em]">
            <Link to="/admin/blog" className="text-muted-foreground hover:text-primary">Blog</Link>
            <Link to="/admin/calendar" className="text-muted-foreground hover:text-primary">Calendar</Link>
            <Link to="/admin/leads" className="text-muted-foreground hover:text-primary">Leads</Link>
            <Link to="/admin/orders" className="text-primary">Orders</Link>
          </nav>
        </div>

        {/* Yoco connection */}
        <div className={`mb-8 border p-4 font-sans text-sm ${yoco?.ready ? "border-green-600/40 bg-green-600/5" : "border-amber-500/50 bg-amber-500/5"}`}>
          {!yoco ? (
            <p className="text-muted-foreground">Checking the Yoco connection…</p>
          ) : yoco.ready ? (
            <p className="text-foreground">
              Online payments connected ({yoco.keyMode === "live" ? "LIVE — real payments" : `${yoco.keyMode} mode`}). Paid orders confirm automatically.
            </p>
          ) : (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-foreground">
                {yoco.error
                  ? yoco.error
                  : "Payment confirmations are not connected yet: paid orders would stay on “Awaiting payment”."}
                {yoco.keyMode && ` (Yoco key: ${yoco.keyMode} mode)`}
              </p>
              {yoco.configured && !yoco.error?.includes("rejected") && (
                <button
                  onClick={() => yocoCall("register")}
                  disabled={yocoBusy}
                  className="px-4 py-2 bg-primary text-primary-foreground text-xs uppercase tracking-[0.2em] disabled:opacity-50"
                >
                  {yocoBusy ? "Connecting…" : "Connect payment confirmations"}
                </button>
              )}
            </div>
          )}
        </div>

        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
          {STATUSES.map((s) => (
            <div key={s} className="border border-border bg-secondary p-4">
              <p className="font-sans text-[0.65rem] uppercase tracking-[0.15em] text-muted-foreground">{STATUS_LABEL[s]}</p>
              <p className={`mt-1 font-display text-2xl ${statusStyles[s]}`}>{counts[s] || 0}</p>
            </div>
          ))}
        </div>

        <label className="mb-4 flex items-center gap-2 font-sans text-xs text-muted-foreground">
          <input type="checkbox" checked={showUnpaid} onChange={(e) => setShowUnpaid(e.target.checked)} />
          Show unpaid and failed checkouts
        </label>

        <div className="overflow-x-auto border border-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-secondary font-sans text-xs uppercase tracking-[0.15em] text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Order #</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Items</th>
                <th className="px-4 py-3">Delivery</th>
                <th className="px-4 py-3">Paid</th>
                <th className="px-4 py-3">Placed</th>
                <th className="px-4 py-3 w-56">Status</th>
              </tr>
            </thead>
            <tbody className="font-body text-foreground">
              {loading ? (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">Loading…</td></tr>
              ) : visible.length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">No paid orders yet.</td></tr>
              ) : (
                visible.map((o) => (
                  <tr key={o.id} className="border-t border-border align-top">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <a href={trackingLink(o)} target="_blank" rel="noopener noreferrer" className="font-mono text-primary hover:underline">
                        {o.order_number}
                      </a>
                      {o.payment_mode === "test" && (
                        <div className="mt-1 inline-block border border-amber-500 px-1 text-[0.6rem] uppercase text-amber-600">Test</div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium">{o.customer_name}</div>
                      {o.customer_phone && <div className="text-xs text-muted-foreground">{o.customer_phone}</div>}
                      {o.customer_email && <div className="text-xs text-muted-foreground break-all">{o.customer_email}</div>}
                    </td>
                    <td className="px-4 py-3 text-xs">
                      {Array.isArray(o.items) && o.items.map((it, i) => (
                        <div key={i}>
                          • {it.name} ({it.size}) ×{it.quantity}
                          {it.customBlend && (
                            <div className="pl-3 text-muted-foreground">
                              {it.customBlend.fragrances.join(" + ")} · {it.customBlend.oilConcentration}% oil
                            </div>
                          )}
                        </div>
                      ))}
                      {o.admin_notes && <div className="mt-2 text-destructive">{o.admin_notes}</div>}
                    </td>
                    <td className="px-4 py-3 text-xs">
                      <div className="font-medium">{DELIVERY_LABEL[o.delivery_method ?? ""] ?? o.delivery_method ?? "—"}</div>
                      <div className="text-muted-foreground">{formatAddress(o.delivery_address)}</div>
                      {o.delivery_address?.instructions && (
                        <div className="text-muted-foreground/80">Note: {o.delivery_address.instructions}</div>
                      )}
                      {(o.delivery_method === "aramex" || o.delivery_method === "postnet") && (
                        <form
                          className="mt-2 flex gap-1"
                          onSubmit={(e) => {
                            e.preventDefault();
                            save(o, { courierTracking: courierDrafts[o.id] ?? o.courier_tracking ?? "" });
                          }}
                        >
                          <input
                            aria-label={`Courier tracking number for ${o.order_number}`}
                            placeholder="Tracking no."
                            value={courierDrafts[o.id] ?? o.courier_tracking ?? ""}
                            onChange={(e) => setCourierDrafts((d) => ({ ...d, [o.id]: e.target.value }))}
                            className="w-28 border border-border bg-background px-2 py-1"
                          />
                          <button type="submit" className="border border-border px-2 hover:border-primary">Save</button>
                        </form>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap tabular-nums">
                      R{o.amount_paid ?? o.total_amount}
                      {o.delivery_fee > 0 && <div className="text-xs text-muted-foreground">incl. R{o.delivery_fee} delivery</div>}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(o.created_at).toLocaleString("en-ZA")}
                    </td>
                    <td className="px-4 py-3 space-y-2">
                      <Select value={o.status} onValueChange={(v) => save(o, { status: v })}>
                        <SelectTrigger className={`h-9 ${statusStyles[o.status]}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {STATUSES.map((s) => (
                            <SelectItem key={s} value={s}>{STATUS_LABEL[s]}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {o.customer_phone && (
                        <a
                          href={whatsAppUpdate(o)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 border border-[#25D366] py-1.5 text-xs text-foreground hover:bg-[#25D366]/10"
                        >
                          <MessageCircle size={14} className="text-[#25D366]" /> WhatsApp update
                        </a>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminOrdersPage;
