// Runs after `vite build`. The site is a single-page app, so every URL used to
// return the same index.html, and Google saw one title for all ~150 pages. This
// writes a copy of index.html per page with that page's own title, description,
// canonical URL, social tags and structured data, plus sitemap.xml.
// Vercel serves dist/perfume/x.html at /perfume/x (cleanUrls in vercel.json).
import { build } from "esbuild";
import { mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
const tmp = join(root, "node_modules", ".seo-prerender");

// 1. Load the catalogue + SEO rules straight from the app's TypeScript sources.
await build({
  stdin: {
    contents: `export { perfumes } from "@/data/perfumes"; export * from "@/lib/seo";`,
    resolveDir: root,
    loader: "ts",
  },
  bundle: true,
  format: "esm",
  platform: "node",
  outfile: join(tmp, "seo.mjs"),
  alias: { "@": join(root, "src") },
  logLevel: "warning",
});
const seo = await import(pathToFileURL(join(tmp, "seo.mjs")).href);
const { perfumes, SITE_URL, STATIC_PAGES, perfumeMeta, perfumeJsonLd } = seo;

// 2. Published blog posts (public read). The build still succeeds if this fails.
const env = await readFile(join(root, ".env"), "utf8").catch(() => "");
const envVar = (k) => process.env[k] ?? env.match(new RegExp(`^${k}="?([^"\\r\\n]+)`, "m"))?.[1];
let posts = [];
try {
  const res = await fetch(
    `${envVar("VITE_SUPABASE_URL")}/rest/v1/blog_posts?select=slug,title,excerpt,meta_title,meta_description,cover_image,published_at,updated_at&status=eq.published&published_at=lte.${new Date().toISOString()}&order=published_at.desc`,
    { headers: { apikey: envVar("VITE_SUPABASE_PUBLISHABLE_KEY") } },
  );
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  posts = await res.json();
} catch (e) {
  console.warn(`[seo] blog posts not loaded, blog pages keep the default tags: ${e.message}`);
}

// 3. Absolute URLs for the per-category product images Vite fingerprinted.
const assets = await readdir(join(dist, "assets"));
const imageFor = (p) => {
  const file = assets.find((a) => a.startsWith(`${p.gender}-${p.category.toLowerCase()}-`) && a.endsWith(".jpeg"));
  return file ? `${SITE_URL}/assets/${file}` : undefined;
};
const defaultImage = (() => {
  const file = assets.find((a) => a.startsWith("hero-perfume-bg-"));
  return file ? `${SITE_URL}/assets/${file}` : undefined;
})();

// 4. Page HTML.
// spa.html exists only if this script already ran on this dist; reuse the untouched copy.
const template = await readFile(join(dist, "spa.html"), "utf8").catch(() => readFile(join(dist, "index.html"), "utf8"));
// Untouched copy for every other URL (cart, admin, order pages): vercel.json rewrites to it.
await writeFile(join(dist, "spa.html"), template);
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function renderPage({ title, description, path, heading, image, jsonLd = [], type = "website" }) {
  const url = `${SITE_URL}${path === "/" ? "/" : path}`;
  const img = image ?? defaultImage;
  const head = [
    `<title>${esc(title)}</title>`,
    `<meta name="description" content="${esc(description)}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:title" content="${esc(title)}" />`,
    `<meta property="og:description" content="${esc(description)}" />`,
    `<meta property="og:type" content="${type}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:site_name" content="Scent Studio" />`,
    `<meta property="og:locale" content="en_ZA" />`,
    img ? `<meta property="og:image" content="${img}" />` : "",
    `<meta name="twitter:title" content="${esc(title)}" />`,
    `<meta name="twitter:description" content="${esc(description)}" />`,
    img ? `<meta name="twitter:image" content="${img}" />` : "",
    ...jsonLd.map((d) => `<script type="application/ld+json">${JSON.stringify(d).replace(/</g, "\\u003c")}</script>`),
  ]
    .filter(Boolean)
    .join("\n    ");

  let html = template
    .replace(/<title>[\s\S]*?<\/title>\s*/, "")
    .replace(/<meta (name="description"|property="og:(title|description|type|image|url)"|name="twitter:(image|title|description)")[^>]*>\s*/g, "")
    .replace("</head>", `    ${head}\n  </head>`);
  if (heading) {
    // Plain-text preview of the page for crawlers that don't run JavaScript.
    // React replaces it with the real page on load.
    html = html.replace(
      '<div id="root"></div>',
      `<div id="root"><main><h1>${esc(heading)}</h1><p>${esc(description)}</p></main></div>`,
    );
  }
  return html;
}

async function writePage(path, html) {
  const file = path === "/" ? join(dist, "index.html") : join(dist, `${path.replace(/^\//, "")}.html`);
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, html);
}

const sitemap = [];
const today = new Date().toISOString().slice(0, 10);

for (const page of STATIC_PAGES) {
  await writePage(page.path, renderPage(page));
  sitemap.push({ loc: page.path, lastmod: today, priority: page.path === "/" ? "1.0" : page.path.startsWith("/catalog") ? "0.9" : "0.6" });
}

for (const p of perfumes) {
  const meta = perfumeMeta(p);
  const image = imageFor(p);
  await writePage(meta.path, renderPage({ ...meta, image, jsonLd: perfumeJsonLd(p, image), type: "product" }));
  sitemap.push({ loc: meta.path, lastmod: today, priority: "0.8" });
}

for (const post of posts) {
  const path = `/blog/${post.slug}`;
  const image = post.cover_image ? (post.cover_image.startsWith("http") ? post.cover_image : `${SITE_URL}${post.cover_image}`) : undefined;
  const description = post.meta_description ?? post.excerpt ?? "";
  await writePage(
    path,
    renderPage({
      title: post.meta_title ?? `${post.title} | Scent Studio`,
      description,
      path,
      heading: post.title,
      image,
      type: "article",
      jsonLd: [
        {
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          description,
          datePublished: post.published_at,
          dateModified: post.updated_at,
          author: { "@type": "Organization", name: "Scent Studio" },
          publisher: { "@type": "Organization", name: "Scent Studio", logo: { "@type": "ImageObject", url: `${SITE_URL}/favicon.png` } },
          mainEntityOfPage: `${SITE_URL}${path}`,
          ...(image ? { image } : {}),
        },
      ],
    }),
  );
  sitemap.push({ loc: path, lastmod: (post.updated_at ?? post.published_at ?? today).slice(0, 10), priority: "0.7" });
}

// 5. sitemap.xml
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemap
  .map((u) => `  <url><loc>${SITE_URL}${u.loc === "/" ? "/" : u.loc}</loc><lastmod>${u.lastmod}</lastmod><priority>${u.priority}</priority></url>`)
  .join("\n")}
</urlset>
`;
await writeFile(join(dist, "sitemap.xml"), xml);
await rm(tmp, { recursive: true, force: true });

console.log(`[seo] pre-rendered ${STATIC_PAGES.length} pages, ${perfumes.length} perfumes, ${posts.length} blog posts; sitemap has ${sitemap.length} URLs`);
