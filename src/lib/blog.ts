// Blog posts live in the repo as content/blog/*.md (format in blog-format.ts) and are
// bundled into the site at build time, so a new post goes live with a normal deploy.
import { isPublished, parsePost, sortNewestFirst, type BlogPost } from "./blog-format";

const files = import.meta.glob("/content/blog/*.md", { query: "?raw", import: "default", eager: true }) as Record<string, string>;

const all: BlogPost[] = Object.entries(files).map(([path, raw]) =>
  parsePost(path.split("/").pop()!.replace(/\.md$/, ""), raw),
);

export const getPublishedPosts = () => sortNewestFirst(all.filter((p) => isPublished(p)));

export const getPost = (slug: string) => all.find((p) => p.slug === slug && isPublished(p)) ?? null;

export type { BlogPost };
