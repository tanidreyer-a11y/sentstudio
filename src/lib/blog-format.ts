// Blog post file format, shared by the site and the build script (scripts/prerender-seo.mjs).
//
// Each post is content/blog/<slug>.md:
//   ---
//   title: "…"                      (every value is JSON, so quotes, arrays and lists are unambiguous)
//   excerpt: "…"
//   metaTitle: "…"                  optional, defaults to "<title> | Scent Studio"
//   metaDescription: "…"            optional, defaults to the excerpt
//   keywords: ["…", "…"]
//   cover: "/blog/x.jpg"            optional
//   coverAlt: "…"
//   publishedAt: "2026-11-23"       posts dated in the future stay hidden until that day
//   updatedAt: "2026-11-23"
//   readingTime: "5 min read"
//   author: "Scent Studio"
//   faq: [{"q": "…", "a": "…"}]     optional; shown at the end and marked up as FAQPage
//   draft: true                     optional; never published
//   ---
//   Markdown body…

export interface BlogFaq {
  q: string;
  a: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  metaTitle?: string;
  metaDescription?: string;
  keywords: string[];
  cover?: string;
  coverAlt?: string;
  publishedAt: string;
  updatedAt?: string;
  readingTime?: string;
  author: string;
  faq: BlogFaq[];
  draft?: boolean;
  body: string;
}

export function parsePost(slug: string, raw: string): BlogPost {
  const text = raw.replace(/\r\n/g, "\n");
  const match = text.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) throw new Error(`Blog post ${slug} has no front matter`);
  const meta: Record<string, unknown> = {};
  for (const line of match[1].split("\n")) {
    if (!line.trim()) continue;
    const i = line.indexOf(":");
    if (i < 1) throw new Error(`Blog post ${slug}: bad front matter line "${line}"`);
    const key = line.slice(0, i).trim();
    try {
      meta[key] = JSON.parse(line.slice(i + 1).trim());
    } catch {
      throw new Error(`Blog post ${slug}: the value of "${key}" must be JSON (wrap text in double quotes)`);
    }
  }
  for (const required of ["title", "excerpt", "publishedAt"]) {
    if (typeof meta[required] !== "string" || !meta[required]) throw new Error(`Blog post ${slug} is missing "${required}"`);
  }
  return {
    slug,
    title: meta.title as string,
    excerpt: meta.excerpt as string,
    metaTitle: meta.metaTitle as string | undefined,
    metaDescription: meta.metaDescription as string | undefined,
    keywords: Array.isArray(meta.keywords) ? (meta.keywords as string[]) : [],
    cover: meta.cover as string | undefined,
    coverAlt: meta.coverAlt as string | undefined,
    publishedAt: meta.publishedAt as string,
    updatedAt: meta.updatedAt as string | undefined,
    readingTime: meta.readingTime as string | undefined,
    author: (meta.author as string) || "Scent Studio",
    faq: Array.isArray(meta.faq) ? (meta.faq as BlogFaq[]).filter((f) => f && f.q && f.a) : [],
    draft: meta.draft === true,
    body: match[2].trim(),
  };
}

/** Published = not a draft and dated today or earlier (South African time). */
export function isPublished(post: BlogPost, today = new Date()) {
  const sa = new Date(today.getTime() + 2 * 3600 * 1000).toISOString().slice(0, 10);
  return !post.draft && post.publishedAt <= sa;
}

export function sortNewestFirst(posts: BlogPost[]) {
  return [...posts].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}
