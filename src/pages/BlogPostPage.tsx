import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Header from "@/components/Header";
import SiteFooter from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { getBlogPostBySlug } from "@/data/blog-posts";

const BlogPostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getBlogPostBySlug(slug) : undefined;

  useEffect(() => {
    if (!post) return;
    document.title = `${post.title} | Scent Studio`;
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", post.metaDescription);

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", `${window.location.origin}/blog/${post.slug}`);

    const ldId = "blog-post-jsonld";
    document.getElementById(ldId)?.remove();
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = ldId;
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      description: post.metaDescription,
      datePublished: post.date,
      author: { "@type": "Organization", name: "Scent Studio" },
      image: `${window.location.origin}${post.image}`,
    });
    document.head.appendChild(script);
    return () => {
      document.getElementById(ldId)?.remove();
    };
  }, [post]);

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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <div className="relative h-[50vh] min-h-[320px] w-full overflow-hidden">
          <img src={post.image} alt={post.imageAlt} className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-background/60" />
          <div className="relative z-10 flex h-full items-end">
            <div className="container mx-auto px-6 pb-10">
              <Link to="/blog" className="font-sans text-[0.65rem] uppercase tracking-[0.3em] text-primary">
                ← The Journal
              </Link>
              <h1 className="mt-4 max-w-3xl font-display text-3xl font-light text-foreground md:text-5xl">
                {post.title}
              </h1>
              <p className="mt-3 font-sans text-xs uppercase tracking-[0.3em] text-muted-foreground">
                {new Date(post.date).toLocaleDateString("en-ZA", { year: "numeric", month: "long", day: "numeric" })} · {post.readingTime}
              </p>
            </div>
          </div>
        </div>

        <article className="container mx-auto max-w-3xl px-6 py-16 md:py-20">
          <div
            className="blog-content font-body text-base leading-relaxed text-foreground/90 [&_h2]:mt-12 [&_h2]:mb-4 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-light [&_h2]:text-foreground [&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:font-display [&_h3]:text-xl [&_h3]:font-light [&_h3]:text-primary [&_p]:mb-5 [&_ul]:mb-6 [&_ul]:list-disc [&_ul]:pl-6 [&_li]:mb-2 [&_strong]:text-foreground [&_em]:text-foreground/80"
            dangerouslySetInnerHTML={{ __html: post.contentHtml }}
          />

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