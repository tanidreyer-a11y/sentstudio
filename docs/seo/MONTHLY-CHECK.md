# Monthly SEO health check: instructions for the scheduled agent

Check the live site https://www.scentstudiosa.co.za and report. Do not change the live site directly.

## Checks
1. Fetch `/sitemap.xml`. Request every URL in it. Record any that are not HTTP 200.
2. For every product page (`/perfume/...`), blog post and main page: the raw HTML must contain exactly one `<title>`,
   a `<meta name="description">`, a `<link rel="canonical">` pointing to its own URL, and the right JSON-LD
   (Product + BreadcrumbList + FAQPage on products, BlogPosting on posts). List any page that fails.
3. Duplicate titles or descriptions across pages: list them.
4. `/robots.txt` allows crawling and names the sitemap. `/llms.txt` and `/pricing.md` load and their prices match
   `src/data/*-perfumes.ts` in the repo.
5. `/cart`, `/order/x`, `/admin` still load the app (HTTP 200).
6. Prices on the site (pricing.md, product pages) match the repo data; posts in `content/blog/` don't quote prices
   that no longer exist (search for `R` followed by a number and compare with the price tiers).
7. Search the web for "perfume dupes South Africa", "oil based perfume South Africa", "inspired by perfume Johannesburg"
   and note whether scentstudiosa.co.za appears and which competitors rank. One run is a snapshot, not a measurement.

## Report
- If everything passes: email tanidreyer@gmail.com, subject `Scent Studio SEO check: all good (<month>)`, with the
  check-7 snapshot.
- If anything fails and the fix is inside the repo (a price in a post, a missing tag, a broken link): fix it on a branch
  `seo/monthly-<yyyy-mm>`, run `npm install && npm run build`, open a pull request listing every problem and fix, and email
  the pull request link with the subject `Scent Studio SEO check: fixes to approve (<month>)`.
- Never push to `main` or merge your own pull request. No em dashes in anything you write.
