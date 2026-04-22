import { Link } from "react-router-dom";
import { useEffect } from "react";
import Header from "@/components/Header";
import SiteFooter from "@/components/SiteFooter";
import { blogPosts } from "@/data/blog-posts";

const BlogPage = () => {
  useEffect(() => {
    document.title = "The Journal | Scent Studio Fragrance Blog";
    const desc = "Fragrance guides, scent advice and perfume tips from Scent Studio — South Africa's home of affordable, long-lasting oil-based inspired perfumes.";
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", desc);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-6 py-20 md:py-28">
        <header className="mb-16 text-center">
          <p className="mb-3 font-sans text-xs uppercase tracking-[0.4em] text-muted-foreground">The Journal</p>
          <h1 className="font-display text-4xl font-light text-foreground md:text-5xl">Fragrance Notes &amp; Guides</h1>
          <p className="mx-auto mt-4 max-w-xl font-body text-base text-muted-foreground">
            Honest writing on scent, longevity and the craft behind oil-based perfumes.
          </p>
        </header>

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-10 md:grid-cols-2">
          {blogPosts.map((post) => (
            <article key={post.slug} className="group">
              <Link to={`/blog/${post.slug}`} className="block">
                <div className="mb-5 overflow-hidden border border-border">
                  <img
                    src={post.image}
                    alt={post.imageAlt}
                    loading="lazy"
                    className="h-64 w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <p className="mb-2 font-sans text-[0.65rem] uppercase tracking-[0.3em] text-muted-foreground">
                  {new Date(post.date).toLocaleDateString("en-ZA", { year: "numeric", month: "long", day: "numeric" })} · {post.readingTime}
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
      </main>
      <SiteFooter />
    </div>
  );
};

export default BlogPage;