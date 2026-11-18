// Page titles, descriptions and structured data. Used in two places:
// - in the browser (react-helmet-async) when a visitor navigates between pages
// - at build time by scripts/prerender-seo.mjs, which writes them into the raw HTML
//   of every page so Google sees the right title without running any JavaScript.
// Keep this file free of React and asset imports so the build script can load it.
import type { Perfume } from "@/data/perfumes";
import { PERFUME_HOUSES, designerName } from "@/data/perfume-houses";
import type { BlogPost } from "@/lib/blog-format";

export const SITE_URL = "https://www.scentstudiosa.co.za";
export const SITE_NAME = "Scent Studio";

export const DISCLAIMER =
  "Scent Studio fragrances are our own oil-based compositions inspired by the scent profiles of well-known designer perfumes. We are not affiliated with, endorsed by, or associated with any of the brands mentioned. Brand names are used for descriptive comparison only.";

export interface PageMeta {
  title: string;
  description: string;
  path: string;
  /** Visible heading used in the pre-rendered HTML before the app loads. */
  heading?: string;
  noindex?: boolean;
}

export const STATIC_PAGES: PageMeta[] = [
  {
    path: "/",
    title: "Oil-Based Perfume Dupes in South Africa from R120 | Scent Studio",
    description:
      "Long-lasting, alcohol-free perfumes inspired by designer favourites like Sauvage, Aventus, Baccarat Rouge 540 and Black Opium. From R120. Flora Centre, Roodepoort, or order on WhatsApp.",
    heading: "Oil-based perfumes inspired by designer favourites, from R120",
  },
  {
    path: "/catalog/men",
    title: "Men's Perfume Dupes, Oil-Based from R120 | Scent Studio",
    description:
      "Men's oil-based fragrances inspired by Dior Sauvage, Creed Aventus, Paco Rabanne 1 Million and more. Long-lasting, from R120 for 30ml. Order on WhatsApp.",
    heading: "Men's fragrances inspired by designer scents",
  },
  {
    path: "/catalog/women",
    title: "Women's Perfume Dupes, Oil-Based from R120 | Scent Studio",
    description:
      "Women's oil-based fragrances inspired by YSL Black Opium, Chanel No.5, Baccarat Rouge 540 and more. Long-lasting, from R120 for 30ml. Order on WhatsApp.",
    heading: "Women's fragrances inspired by designer scents",
  },
  {
    path: "/exclusive",
    title: "Exclusive & Niche Fragrance Dupes | Scent Studio",
    description: "Our exclusive collection of oil-based fragrances inspired by niche and luxury houses. Long-lasting and affordable.",
    heading: "Exclusive collection",
  },
  {
    path: "/blog",
    title: "The Scent Studio Journal: Perfume Guides & Dupe Reviews",
    description:
      "Guides to perfume dupes in South Africa, making fragrance last longer, oil vs alcohol perfume and choosing the right scent.",
    heading: "The Scent Studio Journal",
  },
  {
    path: "/find-my-scent",
    title: "Find My Scent: Free Fragrance Matcher | Scent Studio",
    description: "Answer a few questions and get matched to the oil-based fragrance that suits you, from R120.",
    heading: "Find your scent",
  },
  {
    path: "/quiz",
    title: "30-Second Fragrance Quiz | Scent Studio",
    description: "Take our quick quiz to find a long-lasting oil-based perfume you'll love.",
    heading: "Fragrance quiz",
  },
  {
    path: "/reviews",
    title: "Customer Reviews | Scent Studio Roodepoort",
    description: "What customers say about Scent Studio's oil-based perfumes.",
    heading: "Customer reviews",
  },
  {
    path: "/about",
    title: "About Scent Studio | Oil-Based Perfume Boutique, Roodepoort",
    description: "Scent Studio is an oil-based perfume boutique at Flora Shopping Centre, Roodepoort, making designer-inspired fragrances affordable.",
    heading: "About Scent Studio",
  },
  {
    path: "/contact",
    title: "Visit Us: Perfume Shop at Flora Centre, Roodepoort | Scent Studio",
    description: "Find Scent Studio at Flora Shopping Centre, Roodepoort, or order on WhatsApp on 076 132 8213 for nationwide delivery.",
    heading: "Visit Scent Studio",
  },
];

/** Pages that must never appear in search results. */
export const NOINDEX_PREFIXES = ["/cart", "/login", "/admin", "/order", "/payment"];

export const staticMeta = (path: string) => STATIC_PAGES.find((p) => p.path === path);

const startingPrice = (p: Perfume) =>
  Math.min(...(Object.values(p.prices).filter((v): v is number => typeof v === "number")));

const truncate = (s: string, max: number) => (s.length <= max ? s : `${s.slice(0, max - 1).replace(/\s+\S*$/, "")}…`);

export const WHATSAPP_DISPLAY = "076 132 8213";
export const DELIVERY_FEES = { aramex: 99, postnet: 109 };

export function perfumeMeta(p: Perfume): PageMeta {
  const forWho = p.gender === "men" ? "Men's" : "Women's";
  const from = startingPrice(p);
  const designer = designerName(p);
  const notes = [...p.notes.top, ...p.notes.middle].slice(0, 2).join(", ").toLowerCase();
  const long = `Inspired by ${designer}: ${forWho} Oil Perfume from R${from} | Scent Studio`;
  return {
    path: `/perfume/${p.id}`,
    // Google shows ~60-70 characters; long names drop the middle part.
    title: long.length <= 72 ? long : `Inspired by ${designer} | Scent Studio`,
    description: truncate(
      `Long-lasting oil-based ${forWho.toLowerCase()} perfume inspired by ${designer}${notes ? `, with ${notes}` : ""}. From R${from} (30ml). Order on WhatsApp or collect in Roodepoort.`,
      160,
    ),
    heading: `Inspired by ${designer}`,
  };
}

const priceLine = (p: Perfume) =>
  (["30ml", "50ml", "100ml"] as const)
    .filter((s) => typeof p.prices[s] === "number")
    .map((s) => `R${p.prices[s]} for ${s}`)
    .join(", ");

/** Questions shown on every product page and marked up as FAQPage. Facts only, from the catalogue. */
export function perfumeFaq(p: Perfume) {
  const designer = designerName(p);
  const house = PERFUME_HOUSES[p.id];
  const notes = (list: string[]) => list.join(", ").toLowerCase();
  return [
    {
      q: `Is this the original ${designer}?`,
      a: `No. It is Scent Studio's own oil-based fragrance inspired by the scent profile of ${designer}. We are not affiliated with or endorsed by ${house ?? "the original brand"}.`,
    },
    {
      q: `How much does the ${designer} inspired perfume cost?`,
      a: `${priceLine(p)}.`,
    },
    {
      q: `What does it smell like?`,
      a: `Top notes: ${notes(p.notes.top)}. Heart: ${notes(p.notes.middle)}. Base: ${notes(p.notes.base)}.`,
    },
    {
      q: `Why choose an oil-based perfume?`,
      a: `Oil-based perfumes contain no alcohol, so they sit close to the skin, don't dry it out and usually last longer than alcohol-based sprays, especially in hot weather.`,
    },
    {
      q: `How do I order?`,
      a: `Message Scent Studio on WhatsApp (${WHATSAPP_DISPLAY}) or visit us at Flora Shopping Centre, Roodepoort. We deliver nationwide by Aramex (R${DELIVERY_FEES.aramex}) or PostNet (R${DELIVERY_FEES.postnet}).`,
    },
  ];
}

const faqPage = (faq: { q: string; a: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
});

export function perfumeJsonLd(p: Perfume, imageUrl?: string) {
  const prices = Object.values(p.prices).filter((v): v is number => typeof v === "number");
  const url = `${SITE_URL}/perfume/${p.id}`;
  const designer = designerName(p);
  return [
    {
      "@context": "https://schema.org",
      "@type": "Product",
      name: `Scent Studio: inspired by ${designer}`,
      description: p.description,
      category: p.gender === "men" ? "Men's fragrance" : "Women's fragrance",
      brand: { "@type": "Brand", name: SITE_NAME },
      url,
      ...(imageUrl ? { image: imageUrl } : {}),
      offers: {
        "@type": "AggregateOffer",
        priceCurrency: "ZAR",
        lowPrice: Math.min(...prices),
        highPrice: Math.max(...prices),
        offerCount: prices.length,
        availability: "https://schema.org/InStock",
        url,
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: p.gender === "men" ? "Men" : "Women", item: `${SITE_URL}/catalog/${p.gender}` },
        { "@type": "ListItem", position: 3, name: `Inspired by ${designer}`, item: url },
      ],
    },
    faqPage(perfumeFaq(p)),
  ];
}

export function blogMeta(post: BlogPost): PageMeta {
  return {
    path: `/blog/${post.slug}`,
    title: post.metaTitle ?? `${post.title} | Scent Studio`,
    description: post.metaDescription ?? post.excerpt,
    heading: post.title,
  };
}

export function blogJsonLd(post: BlogPost, imageUrl?: string) {
  const url = `${SITE_URL}/blog/${post.slug}`;
  const docs: object[] = [
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      description: post.metaDescription ?? post.excerpt,
      datePublished: post.publishedAt,
      dateModified: post.updatedAt ?? post.publishedAt,
      author: { "@type": "Organization", name: post.author, url: SITE_URL },
      publisher: { "@type": "Organization", name: SITE_NAME, logo: { "@type": "ImageObject", url: `${SITE_URL}/favicon.png` } },
      mainEntityOfPage: url,
      ...(imageUrl ? { image: imageUrl } : {}),
      ...(post.keywords.length ? { keywords: post.keywords.join(", ") } : {}),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: "Journal", item: `${SITE_URL}/blog` },
        { "@type": "ListItem", position: 3, name: post.title, item: url },
      ],
    },
  ];
  if (post.faq.length) docs.push(faqPage(post.faq));
  return docs;
}

export { designerName };
