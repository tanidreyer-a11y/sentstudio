import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import SiteFooter from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

interface Post {
  id: string; slug: string; title: string; status: string;
  published_at: string | null; scheduled_for: string | null; updated_at: string;
}

const AdminBlogPage = () => {
  const { signOut } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("blog_posts")
      .select("id, slug, title, status, published_at, scheduled_for, updated_at")
      .order("updated_at", { ascending: false });
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    setPosts(data ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const createNew = async () => {
    const slug = `untitled-${Date.now()}`;
    const { data, error } = await supabase
      .from("blog_posts")
      .insert({ slug, title: "Untitled draft", status: "draft" })
      .select("id").single();
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    window.location.href = `/admin/post/${data.id}`;
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this post?")) return;
    const { error } = await supabase.from("blog_posts").delete().eq("id", id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: "Deleted" }); load(); }
  };

  const statusBadge = (p: Post) => {
    if (p.status === "published") return <span className="text-primary">● Published</span>;
    if (p.status === "scheduled") return <span className="text-yellow-500">● Scheduled</span>;
    return <span className="text-muted-foreground">● Draft</span>;
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet><title>Admin · Blog | Scent Studio</title><meta name="robots" content="noindex,nofollow" /></Helmet>
      <Header />
      <main className="container mx-auto px-6 py-24">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
          <div>
            <p className="font-sans text-[0.65rem] uppercase tracking-[0.4em] text-muted-foreground">Admin</p>
            <h1 className="font-display text-4xl font-light text-foreground">Blog Posts</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/admin/calendar"><Button variant="outline" className="rounded-none">Content Calendar</Button></Link>
            <Button onClick={createNew} className="rounded-none">+ New Post</Button>
            <Button variant="ghost" onClick={signOut} className="rounded-none">Sign out</Button>
          </div>
        </div>

        {loading ? (
          <p className="text-muted-foreground">Loading…</p>
        ) : posts.length === 0 ? (
          <p className="text-muted-foreground">No posts yet. Create your first draft.</p>
        ) : (
          <div className="border border-border divide-y divide-border">
            {posts.map((p) => (
              <div key={p.id} className="flex flex-wrap items-center justify-between gap-3 p-5">
                <div className="min-w-0 flex-1">
                  <p className="font-display text-lg text-foreground truncate">{p.title}</p>
                  <p className="font-sans text-xs text-muted-foreground mt-1">/{p.slug}</p>
                </div>
                <div className="font-sans text-xs uppercase tracking-[0.2em]">{statusBadge(p)}</div>
                <div className="flex gap-2">
                  <Link to={`/admin/post/${p.id}`}><Button size="sm" variant="outline" className="rounded-none">Edit</Button></Link>
                  {p.status === "published" && (
                    <Link to={`/blog/${p.slug}`} target="_blank"><Button size="sm" variant="ghost" className="rounded-none">View</Button></Link>
                  )}
                  <Button size="sm" variant="ghost" onClick={() => remove(p.id)} className="rounded-none text-destructive">Delete</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
};
export default AdminBlogPage;