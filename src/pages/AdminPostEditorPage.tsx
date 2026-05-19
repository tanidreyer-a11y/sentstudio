import { useEffect, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import SiteFooter from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface Post {
  id: string; slug: string; title: string; excerpt: string; content: string;
  meta_title: string | null; meta_description: string | null;
  keywords: string[]; cover_image: string | null; cover_alt: string | null;
  status: string; scheduled_for: string | null; published_at: string | null;
  reading_time: string | null;
}

const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80);

const computeReadingTime = (md: string) => {
  const words = md.trim().split(/\s+/).length;
  return `${Math.max(1, Math.round(words / 220))} min read`;
};

const AdminPostEditorPage = () => {
  const { id } = useParams<{ id: string }>();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [aiBusy, setAiBusy] = useState(false);
  const [topic, setTopic] = useState(params.get("topic") ?? "");
  const [keyword, setKeyword] = useState(params.get("keyword") ?? "");

  useEffect(() => {
    if (!id) return;
    supabase.from("blog_posts").select("*").eq("id", id).single().then(({ data, error }) => {
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
      setPost(data as Post);
      if (!topic && data?.title) setTopic(data.title);
      if (!keyword && data?.keywords?.[0]) setKeyword(data.keywords[0]);
      setLoading(false);
    });
  }, [id]);

  const update = (patch: Partial<Post>) => setPost((p) => p ? { ...p, ...patch } : p);

  const save = async (overrides: Partial<Post> = {}) => {
    if (!post) return;
    setSaving(true);
    const next = { ...post, ...overrides };
    const { error } = await supabase
      .from("blog_posts")
      .update({
        slug: next.slug || slugify(next.title),
        title: next.title,
        excerpt: next.excerpt,
        content: next.content,
        meta_title: next.meta_title,
        meta_description: next.meta_description,
        keywords: next.keywords,
        cover_image: next.cover_image,
        cover_alt: next.cover_alt,
        status: next.status,
        scheduled_for: next.scheduled_for,
        published_at: next.published_at,
        reading_time: next.reading_time || computeReadingTime(next.content || ""),
      })
      .eq("id", post.id);
    setSaving(false);
    if (error) toast({ title: "Save failed", description: error.message, variant: "destructive" });
    else { toast({ title: "Saved" }); setPost(next); }
  };

  const publishNow = () => save({ status: "published", published_at: new Date().toISOString(), scheduled_for: null });
  const saveDraft = () => save({ status: "draft" });
  const schedule = () => {
    if (!post?.scheduled_for) { toast({ title: "Pick a date first", variant: "destructive" }); return; }
    save({ status: "scheduled", published_at: null });
  };

  const generateAI = async () => {
    if (!topic) { toast({ title: "Enter a topic first", variant: "destructive" }); return; }
    setAiBusy(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-blog-draft", {
        body: { topic, target_keyword: keyword || topic },
      });
      if (error) throw new Error(error.message);
      if ((data as any)?.error) throw new Error((data as any).error);
      update({
        title: data.title ?? post?.title ?? "",
        slug: data.slug ?? slugify(data.title ?? ""),
        excerpt: data.excerpt ?? "",
        meta_title: data.meta_title ?? null,
        meta_description: data.meta_description ?? null,
        keywords: Array.isArray(data.keywords) ? data.keywords : [],
        content: data.content ?? "",
        reading_time: data.reading_time ?? computeReadingTime(data.content ?? ""),
      });
      toast({ title: "✨ Draft generated", description: "Review and save when ready." });
    } catch (e: any) {
      const msg = String(e?.message || e);
      if (msg.includes("429")) toast({ title: "Rate limit", description: "Too many requests, try again shortly.", variant: "destructive" });
      else if (msg.includes("402")) toast({ title: "AI credits exhausted", description: "Add credits in Workspace settings.", variant: "destructive" });
      else toast({ title: "AI error", description: msg, variant: "destructive" });
    } finally { setAiBusy(false); }
  };

  if (loading || !post) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-6 py-32 text-center text-muted-foreground">Loading…</main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Helmet><title>Editing: {post.title} | Admin</title><meta name="robots" content="noindex,nofollow" /></Helmet>
      <Header />
      <main className="container mx-auto px-6 py-24 max-w-5xl">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
          <Link to="/admin/blog" className="font-sans text-xs uppercase tracking-[0.3em] text-muted-foreground hover:text-primary">← All posts</Link>
          <div className="flex flex-wrap gap-2">
            <Button onClick={saveDraft} disabled={saving} variant="outline" className="rounded-none">Save draft</Button>
            <Button onClick={schedule} disabled={saving} variant="outline" className="rounded-none">Schedule</Button>
            <Button onClick={publishNow} disabled={saving} className="rounded-none">Publish now</Button>
          </div>
        </div>

        <section className="border border-border p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl text-foreground">✨ AI Draft Generator</h2>
            <Button onClick={generateAI} disabled={aiBusy} className="rounded-none">
              {aiBusy ? "Generating…" : "Generate full post"}
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="topic">Topic</Label>
              <Input id="topic" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g. Best Inspired by Dior Sauvage dupes in Johannesburg" className="mt-2 rounded-none" />
            </div>
            <div>
              <Label htmlFor="keyword">Target keyword</Label>
              <Input id="keyword" value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="e.g. inspired by Dior Sauvage South Africa" className="mt-2 rounded-none" />
            </div>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">Generates 900–1,200 word SEO-optimised post via Lovable AI (Gemini).</p>
        </section>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-5">
            <div>
              <Label htmlFor="title">Title (H1)</Label>
              <Input id="title" value={post.title} onChange={(e) => update({ title: e.target.value })} className="mt-2 rounded-none text-lg" />
            </div>
            <div>
              <Label htmlFor="slug">Slug</Label>
              <Input id="slug" value={post.slug} onChange={(e) => update({ slug: e.target.value })} className="mt-2 rounded-none" />
            </div>
            <div>
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea id="excerpt" value={post.excerpt} onChange={(e) => update({ excerpt: e.target.value })} className="mt-2 rounded-none min-h-[80px]" />
            </div>
            <div>
              <Label htmlFor="content">Content (Markdown)</Label>
              <Textarea id="content" value={post.content} onChange={(e) => update({ content: e.target.value })} className="mt-2 rounded-none min-h-[600px] font-mono text-sm" />
            </div>
          </div>

          <aside className="space-y-5">
            <div className="border border-border p-4">
              <p className="font-sans text-[0.65rem] uppercase tracking-[0.3em] text-muted-foreground mb-3">SEO</p>
              <Label htmlFor="meta_title">Meta title</Label>
              <Input id="meta_title" value={post.meta_title ?? ""} onChange={(e) => update({ meta_title: e.target.value })} className="mt-2 rounded-none" />
              <Label htmlFor="meta_description" className="mt-4 block">Meta description</Label>
              <Textarea id="meta_description" value={post.meta_description ?? ""} onChange={(e) => update({ meta_description: e.target.value })} className="mt-2 rounded-none min-h-[80px]" />
              <Label htmlFor="keywords" className="mt-4 block">Keywords (comma-separated)</Label>
              <Input
                id="keywords"
                value={(post.keywords ?? []).join(", ")}
                onChange={(e) => update({ keywords: e.target.value.split(",").map((k) => k.trim()).filter(Boolean) })}
                className="mt-2 rounded-none"
              />
            </div>
            <div className="border border-border p-4">
              <p className="font-sans text-[0.65rem] uppercase tracking-[0.3em] text-muted-foreground mb-3">Cover image</p>
              <Label htmlFor="cover">Image URL</Label>
              <Input id="cover" value={post.cover_image ?? ""} onChange={(e) => update({ cover_image: e.target.value })} placeholder="/lovable-uploads/…" className="mt-2 rounded-none" />
              <Label htmlFor="alt" className="mt-3 block">Alt text</Label>
              <Input id="alt" value={post.cover_alt ?? ""} onChange={(e) => update({ cover_alt: e.target.value })} className="mt-2 rounded-none" />
            </div>
            <div className="border border-border p-4">
              <p className="font-sans text-[0.65rem] uppercase tracking-[0.3em] text-muted-foreground mb-3">Schedule</p>
              <Label htmlFor="sched">Publish at</Label>
              <Input
                id="sched" type="datetime-local"
                value={post.scheduled_for ? new Date(post.scheduled_for).toISOString().slice(0,16) : ""}
                onChange={(e) => update({ scheduled_for: e.target.value ? new Date(e.target.value).toISOString() : null })}
                className="mt-2 rounded-none"
              />
              <p className="mt-3 text-xs text-muted-foreground">Status: <span className="text-foreground">{post.status}</span></p>
              {post.published_at && <p className="mt-1 text-xs text-muted-foreground">Published: {new Date(post.published_at).toLocaleString()}</p>}
            </div>
          </aside>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
};
export default AdminPostEditorPage;