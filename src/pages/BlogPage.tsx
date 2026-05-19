import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import SiteFooter from "@/components/SiteFooter";
import { supabase } from "@/integrations/supabase/client";

interface PostRow {
  slug: string; title: string; excerpt: string;
  cover_image: string | null; cover_alt: string | null;
  published_at: string | null; reading_time: string | null;
}

const BlogPage = () => {
  const [posts, setPosts] = useState<PostRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("blog_posts")
      .select("slug, title, excerpt, cover_image, cover_alt, published_at, reading_time")
      .eq("status", "published")
      .lte("published_at", new Date().toISOString())
      .order("published_at", { ascending: false })
      .then(({ data }) => { setPosts(data ?? []); setLoading(false); });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>The Journal | Scent Studio Fragrance Blog</title>
        <meta name="description" content="Fragrance guides, scent advice and perfume tips from Scent Studio — Johannesburg's home of affordable, long-lasting oil-based inspired perfumes." />
        <link rel="canonical" href="https://scentstudiosa.co.za/blog" />
        <meta property="og:title" content="The Journal | Scent Studio" />
        <meta property="og:description" content="Fragrance guides from South Africa's leading inspired-perfume boutique." />
        <meta property="og:url" content="https://scentstudiosa.co.za/blog" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
      <Header />
      <main className="container mx-auto px-6 py-20 md:py-28">
        <header className="mb-16 text-center">
          <p className="mb-3 font-sans text-xs uppercase tracking-[0.4em] text-muted-foreground">The Journal</p>
          <h1 className="font-display text-4xl font-light text-foreground md:text-5xl">Fragrance Notes &amp; Guides</h1>
          <p className="mx-auto mt-4 max-w-xl font-body text-base text-muted-foreground">
            Honest writing on scent, longevity and the craft behind oil-based perfumes.
          </p>
        </header>

        {loading ? (
          <p className="text-center text-muted-foreground">Loading…</p>
        ) : posts.length === 0 ? (
          <p className="text-center text-muted-foreground">No posts yet. Check back soon.</p>
        ) : (
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-10 md:grid-cols-2">
          {posts.map((post) => (
            <article key={post.slug} className="group">
              <Link to={`/blog/${post.slug}`} className="block">
                {post.cover_image && (
                  <div className="mb-5 overflow-hidden border border-border">
                    <img
                      src={post.cover_image}
                      alt={post.cover_alt ?? post.title}
                      loading="lazy"
                      className="h-64 w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                )}
                <p className="mb-2 font-sans text-[0.65rem] uppercase tracking-[0.3em] text-muted-foreground">
                  {post.published_at && new Date(post.published_at).toLocaleDateString("en-ZA", { year: "numeric", month: "long", day: "numeric" })}
                  {post.reading_time ? ` · ${post.reading_time}` : ""}
                </p>
                <h2 className="font-display text-2xl font-light text-foreground transition-colors group-hover:text-primary">
                  {post.title}
                </h2>
                <p className="mt-3 font-body text-base text-muted-foreground">{post.excerpt}</p>
                <span className="mt-4 inline-block font-sans text-xs uppercase tracking-[0.3em] text-primary">Read more →</span>
              </Link>
            </article>
          ))}
        </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
};

export default BlogPage;