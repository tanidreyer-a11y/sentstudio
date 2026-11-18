import { Link, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Header from "@/components/Header";
import SiteFooter from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { getPost } from "@/lib/blog";
import { blogJsonLd, blogMeta, SITE_URL } from "@/lib/seo";

const formatDate = (iso: string) =>
  new Date(`${iso}T12:00:00`).toLocaleDateString("en-ZA", { year: "numeric", month: "long", day: "numeric" });

const BlogPostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getPost(slug) : null;

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

  const meta = blogMeta(post);
  const canonical = `${SITE_URL}${meta.path}`;
  const ogImage = post.cover ? (post.cover.startsWith("http") ? post.cover : `${SITE_URL}${post.cover}`) : undefined;

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
        <link rel="canonical" href={canonical} />
        <meta property="og:title" content={meta.title} />
        <meta property="og:description" content={meta.description} />
        <meta property="og:url" content={canonical} />
        <meta property="og:type" content="article" />
        {ogImage && <meta property="og:image" content={ogImage} />}
        <meta name="twitter:card" content="summary_large_image" />
        {blogJsonLd(post, ogImage).map((d, i) => (
          <script key={i} type="application/ld+json">
            {JSON.stringify(d)}
          </script>
        ))}
      </Helmet>
      <Header />
      <main>
        <div className="relative h-[50vh] min-h-[320px] w-full overflow-hidden bg-secondary">
          {post.cover && (
            <>
              <img src={post.cover} alt={post.coverAlt ?? post.title} className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-background/60" />
            </>
          )}
          <div className="relative z-10 flex h-full items-end">
            <div className="container mx-auto px-6 pb-10">
              <Link to="/blog" className="font-sans text-[0.65rem] uppercase tracking-[0.3em] text-primary">
                ← The Journal
              </Link>
              <h1 className="mt-4 max-w-3xl font-display text-3xl font-light text-foreground md:text-5xl">{post.title}</h1>
              <p className="mt-3 font-sans text-xs uppercase tracking-[0.3em] text-muted-foreground">
                {formatDate(post.publishedAt)}
                {post.readingTime ? ` · ${post.readingTime}` : ""} · {post.author}
              </p>
              {post.updatedAt && post.updatedAt > post.publishedAt && (
                <p className="mt-1 font-sans text-[0.65rem] uppercase tracking-[0.25em] text-muted-foreground/80">
                  Last updated {formatDate(post.updatedAt)}
                </p>
              )}
            </div>
          </div>
        </div>

        <article className="container mx-auto max-w-3xl px-6 py-16 md:py-20">
          <div className="blog-content font-body text-base leading-relaxed text-foreground/90 [&_h2]:mt-12 [&_h2]:mb-4 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-light [&_h2]:text-foreground [&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:font-display [&_h3]:text-xl [&_h3]:font-light [&_h3]:text-primary [&_p]:mb-5 [&_ul]:mb-6 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:mb-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:mb-2 [&_strong]:text-foreground [&_em]:text-foreground/80 [&_blockquote]:border-l-2 [&_blockquote]:border-primary [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-muted-foreground [&_a]:text-primary [&_a]:underline [&_table]:mb-6 [&_table]:w-full [&_th]:border-b [&_th]:border-border [&_th]:py-2 [&_th]:text-left [&_td]:border-b [&_td]:border-border/60 [&_td]:py-2">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.body}</ReactMarkdown>
          </div>

          {post.faq.length > 0 && (
            <section className="mt-14 border-t border-border pt-10" aria-labelledby="faq-heading">
              <h2 id="faq-heading" className="mb-6 font-display text-2xl font-light text-foreground">
                Frequently asked questions
              </h2>
              <dl className="space-y-6">
                {post.faq.map((f) => (
                  <div key={f.q}>
                    <dt className="font-display text-lg text-foreground">{f.q}</dt>
                    <dd className="mt-2 font-body text-base leading-relaxed text-foreground/85">{f.a}</dd>
                  </div>
                ))}
              </dl>
            </section>
          )}

          <div className="mt-16 border-t border-border pt-10 text-center">
            <h3 className="font-display text-2xl font-light text-foreground">Discover your signature scent</h3>
            <p className="mx-auto mt-3 max-w-md font-body text-base text-muted-foreground">
              Take our quick scent quiz and we'll guide you to the oil-based fragrance that fits you best.
            </p>
            <Link to="/quiz" className="mt-6 inline-block">
              <Button size="lg" className="rounded-none px-8">
                Find My Scent
              </Button>
            </Link>
          </div>
        </article>
      </main>
      <SiteFooter />
    </div>
  );
};

export default BlogPostPage;
