import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Header from "@/components/Header";
import SiteFooter from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface Post {
  slug: string; title: string; excerpt: string; content: string;
  meta_title: string | null; meta_description: string | null;
  keywords: string[]; cover_image: string | null; cover_alt: string | null;
  published_at: string | null; updated_at: string; reading_time: string | null;
}

const BASE = "https://scentstudiosa.co.za";

const BlogPostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    supabase
      .from("blog_posts")
      .select("slug, title, excerpt, content, meta_title, meta_description, keywords, cover_image, cover_alt, published_at, updated_at, reading_time")
      .eq("slug", slug)
      .eq("status", "published")
      .lte("published_at", new Date().toISOString())
      .maybeSingle()
      .then(({ data }) => { setPost((data as Post) ?? null); setLoading(false); });
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-6 py-32 text-center text-muted-foreground">Loading…</main>
        <SiteFooter />
      </div>
    );
  }
  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-6 py-32 text-center">
          <h1 className="font-display text-3xl text-foreground">Post not found</h1>
          <Link to="/blog" className="mt-6 inline-block font-sans text-xs uppercase tracking-[0.3em] text-primary">
            Back to the Journal
          </Link>
        </main>
        <SiteFooter />
      </div>
    );
  }

  const metaTitle = post.meta_title ?? `${post.title} | Scent Studio`;
  const metaDesc = post.meta_description ?? post.excerpt;
  const canonical = `${BASE}/blog/${post.slug}`;
  const ogImage = post.cover_image?.startsWith("http") ? post.cover_image : post.cover_image ? `${BASE}${post.cover_image}` : undefined;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: metaDesc,
    datePublished: post.published_at,
    dateModified: post.updated_at,
    author: { "@type": "Organization", name: "Scent Studio" },
    publisher: {
      "@type": "Organization",
      name: "Scent Studio",
      logo: { "@type": "ImageObject", url: `${BASE}/favicon.png` },
    },
    mainEntityOfPage: canonical,
    ...(ogImage ? { image: ogImage } : {}),
    keywords: post.keywords?.join(", "),
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDesc} />
        {post.keywords?.length ? <meta name="keywords" content={post.keywords.join(", ")} /> : null}
        <link rel="canonical" href={canonical} />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDesc} />
        <meta property="og:url" content={canonical} />
        <meta property="og:type" content="article" />
        {ogImage && <meta property="og:image" content={ogImage} />}
        {post.published_at && <meta property="article:published_time" content={post.published_at} />}
        <meta property="article:author" content="Scent Studio" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metaTitle} />
        <meta name="twitter:description" content={metaDesc} />
        {ogImage && <meta name="twitter:image" content={ogImage} />}
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>
      <Header />
      <main>
        <div className="relative h-[50vh] min-h-[320px] w-full overflow-hidden bg-secondary">
          {post.cover_image && (
            <>
              <img src={post.cover_image} alt={post.cover_alt ?? post.title} className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-background/60" />
            </>
          )}
          <div className="relative z-10 flex h-full items-end">
            <div className="container mx-auto px-6 pb-10">
              <Link to="/blog" className="font-sans text-[0.65rem] uppercase tracking-[0.3em] text-primary">
                ← The Journal
              </Link>
              <h1 className="mt-4 max-w-3xl font-display text-3xl font-light text-foreground md:text-5xl">
                {post.title}
              </h1>
              <p className="mt-3 font-sans text-xs uppercase tracking-[0.3em] text-muted-foreground">
                {post.published_at && new Date(post.published_at).toLocaleDateString("en-ZA", { year: "numeric", month: "long", day: "numeric" })}
                {post.reading_time ? ` · ${post.reading_time}` : ""}
              </p>
            </div>
          </div>
        </div>

        <article className="container mx-auto max-w-3xl px-6 py-16 md:py-20">
          <div className="blog-content font-body text-base leading-relaxed text-foreground/90 [&_h2]:mt-12 [&_h2]:mb-4 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-light [&_h2]:text-foreground [&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:font-display [&_h3]:text-xl [&_h3]:font-light [&_h3]:text-primary [&_p]:mb-5 [&_ul]:mb-6 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:mb-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:mb-2 [&_strong]:text-foreground [&_em]:text-foreground/80 [&_blockquote]:border-l-2 [&_blockquote]:border-primary [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-muted-foreground [&_a]:text-primary [&_a]:underline">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
          </div>

          <div className="mt-16 border-t border-border pt-10 text-center">
            <p className="mb-4 font-sans text-xs uppercase tracking-[0.3em] text-muted-foreground">Find your match</p>
            <h3 className="font-display text-2xl font-light text-foreground">Discover your signature scent</h3>
            <p className="mx-auto mt-3 max-w-md font-body text-base text-muted-foreground">
              Take our quick scent quiz and we'll guide you to the oil-based fragrance that fits you best.
            </p>
            <Link to="/quiz" className="mt-6 inline-block">
              <Button size="lg" className="rounded-none px-8">Find My Scent</Button>
            </Link>
          </div>
        </article>
      </main>
      <SiteFooter />
    </div>
  );
};

export default BlogPostPage;