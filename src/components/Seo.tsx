import { Helmet } from "react-helmet-async";
import { SITE_URL, type PageMeta } from "@/lib/seo";

/** Keeps the title/description in step with the page as visitors navigate. The
 * same values are written into each page's HTML at build time (scripts/prerender-seo.mjs). */
const Seo = ({ meta, jsonLd }: { meta?: PageMeta; jsonLd?: object[] }) => {
  if (!meta) return null;
  const url = `${SITE_URL}${meta.path}`;
  return (
    <Helmet>
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={meta.title} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:url" content={url} />
      {jsonLd?.map((d, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(d)}
        </script>
      ))}
    </Helmet>
  );
};

export default Seo;
