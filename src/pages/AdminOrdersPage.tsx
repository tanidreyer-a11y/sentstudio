import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
};

type Order = {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string | null;
  items: OrderItem[];
  total_amount: number;
  delivery_fee: number;
  delivery_method: string | null;
  delivery_address: any;
  estimated_delivery: string | null;
  status: string;
  created_at: string;
};

const STATUSES = ["pending", "paid", "processing", "dispatched", "delivered", "cancelled", "failed"];

const statusStyles: Record<string, string> = {
  pending: "text-muted-foreground",
  paid: "text-blue-500",
  processing: "text-amber-500",
  dispatched: "text-purple-500",
  delivered: "text-green-600",
  cancelled: "text-destructive",
  failed: "text-destructive",
};

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (order: Order, status: string) => {
    const prev = order.status;
    setOrders((p) => p.map((o) => (o.id === order.id ? { ...o, status } : o)));
    const { error } = await supabase.from("orders").update({ status }).eq("id", order.id);
    if (error) {
      toast({ title: "Update failed", description: error.message, variant: "destructive" });
      setOrders((p) => p.map((o) => (o.id === order.id ? { ...o, status: prev } : o)));
    }
  };

  const counts = STATUSES.reduce<Record<string, number>>((acc, s) => {
    acc[s] = orders.filter((o) => o.status === s).length;
    return acc;
  }, {});

  const formatAddress = (addr: any) => {
    if (!addr || typeof addr !== "object") return "—";
    const parts = [addr.streetAddress, addr.cityArea, addr.postalCode].filter(Boolean);
    return parts.length ? parts.join(", ") : "—";
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto max-w-7xl px-6">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-sans text-xs uppercase tracking-[0.3em] text-muted-foreground">Admin</p>
            <h1 className="font-display text-3xl font-light text-foreground">Orders</h1>
          </div>
          <nav className="flex gap-4 font-sans text-xs uppercase tracking-[0.2em]">
            <Link to="/admin/blog" className="text-muted-foreground hover:text-primary">Blog</Link>
            <Link to="/admin/calendar" className="text-muted-foreground hover:text-primary">Calendar</Link>
            <Link to="/admin/leads" className="text-muted-foreground hover:text-primary">Leads</Link>
            <Link to="/admin/orders" className="text-primary">Orders</Link>
          </nav>
        </div>

        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          {STATUSES.map((s) => (
            <div key={s} className="border border-border bg-secondary p-4">
              <p className="font-sans text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground">{s}</p>
              <p className={`mt-1 font-display text-2xl ${statusStyles[s]}`}>{counts[s] || 0}</p>
            </div>
          ))}
        </div>

        <div className="overflow-x-auto border border-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-secondary font-sans text-xs uppercase tracking-[0.15em] text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Order #</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Items</th>
                <th className="px-4 py-3">Delivery</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Placed</th>
                <th className="px-4 py-3 w-44">Status</th>
              </tr>
            </thead>
            <tbody className="font-body text-foreground">
              {loading ? (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">Loading…</td></tr>
              ) : orders.length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">No orders yet.</td></tr>
              ) : (
                orders.map((o) => (
                  <tr key={o.id} className="border-t border-border align-top">
                    <td className="px-4 py-3 font-mono text-primary whitespace-nowrap">{o.order_number}</td>
                    <td className="px-4 py-3">
                      <div className="font-medium">{o.customer_name}</div>
                      {o.customer_phone && (
                        <a href={`https://wa.me/27${o.customer_phone.replace(/^0/, "").replace(/\D/g, "")}`}
                           target="_blank" rel="noopener noreferrer"
                           className="text-xs text-muted-foreground hover:text-primary">
                          {o.customer_phone}
                        </a>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs">
                      {Array.isArray(o.items) && o.items.map((it, i) => (
                        <div key={i}>• {it.name} ({it.size}) ×{it.quantity}</div>
                      ))}
                    </td>
                    <td className="px-4 py-3 text-xs">
                      <div className="font-medium capitalize">{o.delivery_method ?? "—"}</div>
                      <div className="text-muted-foreground">{formatAddress(o.delivery_address)}</div>
                      {o.estimated_delivery && (
                        <div className="text-muted-foreground/80">ETA: {o.estimated_delivery}</div>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">R{o.total_amount}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(o.created_at).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <Select value={o.status} onValueChange={(v) => updateStatus(o, v)}>
                        <SelectTrigger className={`h-9 ${statusStyles[o.status]}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {STATUSES.map((s) => (
                            <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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