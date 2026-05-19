import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import SiteFooter from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface CalEntry {
  id: string; month_number: number; week_number: number;
  phase: string; topic: string; target_keyword: string;
  status: string; post_id: string | null;
}

const PHASE_META: Record<string, { label: string; range: string; color: string; description: string }> = {
  foundation: { label: "Foundation", range: "Months 1–3", color: "border-l-blue-500", description: "Local SEO + product pages" },
  authority: { label: "Authority", range: "Months 4–6", color: "border-l-purple-500", description: "How-to + problem solving" },
  conversion: { label: "Conversion", range: "Months 7–9", color: "border-l-primary", description: "Customer stories + comparisons" },
  compounding: { label: "Compounding", range: "Months 10–12", color: "border-l-green-500", description: "Refresh top performers" },
};

const AdminCalendarPage = () => {
  const [entries, setEntries] = useState<CalEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("content_calendar")
      .select("*")
      .order("week_number")
      .then(({ data, error }) => {
        if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
        setEntries(data ?? []);
        setLoading(false);
      });
  }, []);

  const draftFromTopic = async (entry: CalEntry) => {
    const slug = entry.topic.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60) + `-${Date.now()}`;
    const { data, error } = await supabase
      .from("blog_posts")
      .insert({
        slug, title: entry.topic, status: "draft",
        keywords: [entry.target_keyword],
      })
      .select("id").single();
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    await supabase.from("content_calendar").update({ post_id: data.id, status: "drafted" }).eq("id", entry.id);
    window.location.href = `/admin/post/${data.id}?topic=${encodeURIComponent(entry.topic)}&keyword=${encodeURIComponent(entry.target_keyword)}`;
  };

  const grouped = (["foundation","authority","conversion","compounding"] as const).map((ph) => ({
    phase: ph,
    items: entries.filter((e) => e.phase === ph),
  }));

  return (
    <div className="min-h-screen bg-background">
      <Helmet><title>Admin · Content Calendar | Scent Studio</title><meta name="robots" content="noindex,nofollow" /></Helmet>
      <Header />
      <main className="container mx-auto px-6 py-24">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
          <div>
            <p className="font-sans text-[0.65rem] uppercase tracking-[0.4em] text-muted-foreground">Admin</p>
            <h1 className="font-display text-4xl font-light text-foreground">12-Month Content Roadmap</h1>
            <p className="mt-2 font-body text-muted-foreground max-w-2xl">
              52 SEO topics organised into four growth phases. Click "AI Draft" on any topic to generate a full blog post.
            </p>
          </div>
          <Link to="/admin/blog"><Button variant="outline" className="rounded-none">← Back to Posts</Button></Link>
        </div>

        {loading ? <p className="text-muted-foreground">Loading…</p> : (
          <div className="space-y-12">
            {grouped.map(({ phase, items }) => {
              const meta = PHASE_META[phase];
              return (
                <section key={phase}>
                  <div className="mb-5">
                    <p className="font-sans text-[0.65rem] uppercase tracking-[0.4em] text-muted-foreground">{meta.range}</p>
                    <h2 className="font-display text-2xl font-light text-foreground">{meta.label}</h2>
                    <p className="text-sm text-muted-foreground">{meta.description}</p>
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    {items.map((e) => (
                      <div key={e.id} className={`border border-border border-l-4 ${meta.color} p-4 flex flex-col gap-3`}>
                        <div>
                          <p className="font-sans text-[0.6rem] uppercase tracking-[0.3em] text-muted-foreground">
                            Week {e.week_number} · Month {e.month_number} · {e.status}
                          </p>
                          <p className="font-display text-base text-foreground mt-1">{e.topic}</p>
                          <p className="font-sans text-xs text-primary mt-1">🎯 {e.target_keyword}</p>
                        </div>
                        <div className="flex gap-2">
                          {e.post_id ? (
                            <Link to={`/admin/post/${e.post_id}`}><Button size="sm" variant="outline" className="rounded-none">Open Draft</Button></Link>
                          ) : (
                            <Button size="sm" onClick={() => draftFromTopic(e)} className="rounded-none">✨ AI Draft</Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
};
export default AdminCalendarPage;