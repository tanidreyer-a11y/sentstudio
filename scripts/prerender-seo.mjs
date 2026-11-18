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
    contents: `export { perfumes } from "@/data/perfumes"; export * from "@/lib/seo"; export { parsePost, isPublished, sortNewestFirst } from "@/lib/blog-format";`,
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
const { perfumes, SITE_URL, STATIC_PAGES, perfumeMeta, perfumeJsonLd, blogMeta, blogJsonLd, designerName, DISCLAIMER } = seo;

// 2. Published blog posts from content/blog/*.md (a bad post fails the build loudly).
const blogDir = join(root, "content", "blog");
const blogFiles = (await readdir(blogDir).catch(() => [])).filter((f) => f.endsWith(".md"));
const allPosts = seo.sortNewestFirst(
  await Promise.all(blogFiles.map(async (f) => seo.parsePost(f.replace(/\.md$/, ""), await readFile(join(blogDir, f), "utf8")))),
);
const published = allPosts.filter((p) => seo.isPublished(p));

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

for (const post of published) {
  const meta = blogMeta(post);
  const image = post.cover ? (post.cover.startsWith("http") ? post.cover : `${SITE_URL}${post.cover}`) : undefined;
  await writePage(meta.path, renderPage({ ...meta, image, type: "article", jsonLd: blogJsonLd(post, image) }));
  sitemap.push({ loc: meta.path, lastmod: post.updatedAt ?? post.publishedAt, priority: "0.7" });
}

// 4b. Files for AI assistants (ChatGPT, Perplexity, Claude): a site summary and plain-text prices.
const tiers = [
  ["Standard", 120, 170, 290],
  ["Premium", 150, 200, 330],
  ["Ultra Premium", 200, 270, 490],
];
const tierOf = (p) => tiers.find((t) => t[1] === p.prices["30ml"])?.[0] ?? "Other";
const productLine = (p) =>
  `- [Inspired by ${designerName(p)}](${SITE_URL}/perfume/${p.id}): ${["30ml", "50ml", "100ml"].filter((k) => p.prices[k]).map((k) => `${k} R${p.prices[k]}`).join(", ")}`;
const llms = `# Scent Studio

> Oil-based, alcohol-free perfumes inspired by well-known designer fragrances, made affordable for South Africa. Store at Flora Shopping Centre, Roodepoort (Johannesburg). Orders on WhatsApp 076 132 8213; nationwide delivery by Aramex (R99) or PostNet (R109). Prices from R120 for 30ml.

${DISCLAIMER}

## Shop
- [Men's perfumes](${SITE_URL}/catalog/men): ${perfumes.filter((p) => p.gender === "men").length} men's fragrances
- [Women's perfumes](${SITE_URL}/catalog/women): ${perfumes.filter((p) => p.gender === "women").length} women's fragrances
- [Prices](${SITE_URL}/pricing.md): every product and size in plain text
- [Find My Scent](${SITE_URL}/find-my-scent): fragrance matcher

## Guides
${published.map((p) => `- [${p.title}](${SITE_URL}/blog/${p.slug}): ${p.excerpt}`).join("\n")}

## About
- [About](${SITE_URL}/about)
- [Contact and store location](${SITE_URL}/contact)
`;
await writeFile(join(dist, "llms.txt"), llms);

const pricing = `# Scent Studio prices (South African rand, ${today})

All fragrances are oil-based and inspired by designer scents. Order on WhatsApp 076 132 8213.

| Tier | 30ml | 50ml | 100ml |
|---|---|---|---|
${tiers.map((t) => `| ${t[0]} | R${t[1]} | R${t[2]} | R${t[3]} |`).join("\n")}

Delivery: store pickup free (Flora Shopping Centre, Roodepoort); Aramex R99; PostNet R109.

${tiers
  .map((t) => `## ${t[0]}\n${perfumes.filter((p) => tierOf(p) === t[0]).map(productLine).join("\n")}`)
  .join("\n\n")}
${perfumes.some((p) => tierOf(p) === "Other") ? `\n## Other\n${perfumes.filter((p) => tierOf(p) === "Other").map(productLine).join("\n")}\n` : ""}`;
await writeFile(join(dist, "pricing.md"), pricing);

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

console.log(`[seo] pre-rendered ${STATIC_PAGES.length} pages, ${perfumes.length} perfumes, ${published.length} blog posts (${allPosts.length - published.length} scheduled/draft); sitemap has ${sitemap.length} URLs; wrote llms.txt + pricing.md`);
