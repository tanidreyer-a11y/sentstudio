import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface PreviewPost {
  slug: string; title: string; excerpt: string;
  cover_image: string | null; cover_alt: string | null; reading_time: string | null;
}

const JournalPreview = () => {
  const [posts, setPosts] = useState<PreviewPost[]>([]);
  useEffect(() => {
    supabase.from("blog_posts")
      .select("slug, title, excerpt, cover_image, cover_alt, reading_time")
      .eq("status", "published")
      .lte("published_at", new Date().toISOString())
      .order("published_at", { ascending: false })
      .limit(3)
      .then(({ data }) => setPosts(data ?? []));
  }, []);
  if (posts.length === 0) return null;

  return (
    <section className="bg-background py-16 md:py-24 border-t border-border">
      <div className="container mx-auto px-6">
        <div className="mb-12 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="mb-2 font-sans text-xs uppercase tracking-[0.4em] text-muted-foreground">The Journal</p>
            <h2 className="font-display text-3xl font-light text-foreground md:text-4xl">Fragrance Notes &amp; Guides</h2>
          </div>
          <Link to="/blog" className="font-sans text-xs uppercase tracking-[0.3em] text-primary hover:text-gold-light transition-colors">
            View all articles →
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {posts.map((post) => (
            <Link key={post.slug} to={`/blog/${post.slug}`} className="group block">
              {post.cover_image && (
                <div className="mb-4 overflow-hidden border border-border">
                  <img
                    src={post.cover_image}
                    alt={post.cover_alt ?? post.title}
                    loading="lazy"
                    className="h-56 w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
              )}
              {post.reading_time && (
                <p className="mb-2 font-sans text-[0.65rem] uppercase tracking-[0.3em] text-muted-foreground">{post.reading_time}</p>
              )}
              <h3 className="font-display text-xl font-light text-foreground transition-colors group-hover:text-primary">
                {post.title}
              </h3>
              <p className="mt-2 font-body text-sm text-muted-foreground line-clamp-3">{post.excerpt}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default JournalPreview;