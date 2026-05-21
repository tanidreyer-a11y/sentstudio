import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";

type Lead = {
  id: string;
  email: string;
  phone: string | null;
  discount_code: string;
  source: string;
  redeemed: boolean;
  created_at: string;
};

const AdminLeadsPage = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast({ title: "Failed to load", description: error.message, variant: "destructive" });
    else setLeads((data as Lead[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const toggleRedeemed = async (lead: Lead) => {
    const next = !lead.redeemed;
    setLeads((prev) => prev.map((l) => (l.id === lead.id ? { ...l, redeemed: next } : l)));
    const { error } = await supabase.from("leads").update({ redeemed: next }).eq("id", lead.id);
    if (error) {
      toast({ title: "Update failed", description: error.message, variant: "destructive" });
      setLeads((prev) => prev.map((l) => (l.id === lead.id ? { ...l, redeemed: !next } : l)));
    }
  };

  const total = leads.length;
  const redeemed = leads.filter((l) => l.redeemed).length;

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto max-w-6xl px-6">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="font-sans text-xs uppercase tracking-[0.3em] text-muted-foreground">Admin</p>
            <h1 className="font-display text-3xl font-light text-foreground">Discount Leads</h1>
          </div>
          <nav className="flex gap-4 font-sans text-xs uppercase tracking-[0.2em]">
            <Link to="/admin/blog" className="text-muted-foreground hover:text-primary">Blog</Link>
            <Link to="/admin/calendar" className="text-muted-foreground hover:text-primary">Calendar</Link>
            <Link to="/admin/leads" className="text-primary">Leads</Link>
            <Link to="/admin/orders" className="text-muted-foreground hover:text-primary">Orders</Link>
          </nav>
        </div>

        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
          <div className="border border-border bg-secondary p-5">
            <p className="font-sans text-xs uppercase tracking-[0.2em] text-muted-foreground">Total leads</p>
            <p className="mt-2 font-display text-3xl text-foreground">{total}</p>
          </div>
          <div className="border border-border bg-secondary p-5">
            <p className="font-sans text-xs uppercase tracking-[0.2em] text-muted-foreground">Redeemed</p>
            <p className="mt-2 font-display text-3xl text-primary">{redeemed}</p>
          </div>
          <div className="border border-border bg-secondary p-5">
            <p className="font-sans text-xs uppercase tracking-[0.2em] text-muted-foreground">Outstanding</p>
            <p className="mt-2 font-display text-3xl text-foreground">{total - redeemed}</p>
          </div>
        </div>

        <div className="overflow-x-auto border border-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-secondary font-sans text-xs uppercase tracking-[0.15em] text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Code</th>
                <th className="px-4 py-3">Source</th>
                <th className="px-4 py-3">Captured</th>
                <th className="px-4 py-3 text-right">Redeemed</th>
              </tr>
            </thead>
            <tbody className="font-body text-foreground">
              {loading ? (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">Loading…</td></tr>
              ) : leads.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">No leads yet.</td></tr>
              ) : (
                leads.map((l) => (
                  <tr key={l.id} className="border-t border-border">
                    <td className="px-4 py-3">{l.email}</td>
                    <td className="px-4 py-3">{l.phone ?? "—"}</td>
                    <td className="px-4 py-3 font-mono text-primary">{l.discount_code}</td>
                    <td className="px-4 py-3 text-muted-foreground">{l.source}</td>
                    <td className="px-4 py-3 text-muted-foreground">{new Date(l.created_at).toLocaleString()}</td>
                    <td className="px-4 py-3 text-right">
                      <Switch checked={l.redeemed} onCheckedChange={() => toggleRedeemed(l)} />
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

export default AdminLeadsPage;