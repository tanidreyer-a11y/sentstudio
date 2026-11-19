# Weekly blog post: instructions for the scheduled agent

You are writing one blog post for Scent Studio (scentstudiosa.co.za), an oil-based perfume shop at Flora Shopping
Centre, Roodepoort, Johannesburg, that sells alcohol-free fragrances inspired by designer scents. Tanid chose auto-publish
(2026-11-19): you publish the post yourself, then email him what went live.

## Steps
1. Read `docs/seo/CALENDAR.md`. Take the first line still marked `[ ]`. If none are left, write the post you judge most
   useful for search from the rules below and add it to the calendar.
2. Research it on the web (what South Africans search, what competitors say, real designer prices). Note your sources.
3. Get every Scent Studio fact from the repo, never from memory:
   - products and prices: `src/data/mens-perfumes.ts`, `src/data/womens-perfumes.ts`
     (the `notes` in these files are placeholders, not real: never quote them. For what a scent smells like, use the
     designer fragrance's published notes and link the source)
   - designer houses: `src/data/perfume-houses.ts`
   - delivery fees and contact: `src/lib/seo.ts` (`DELIVERY_FEES`, `WHATSAPP_DISPLAY`)
   - existing posts: `content/blog/` (do not repeat a topic; link to related posts)
4. Write `content/blog/<slug>.md` in the exact format described at the top of `src/lib/blog-format.ts`:
   - `publishedAt` and `updatedAt` = today's date in South Africa (YYYY-MM-DD), `author` = "Scent Studio"
   - `metaTitle` 50-60 characters with the main search phrase first; `metaDescription` 140-160 characters
   - `faq`: 3-5 real questions people ask about the topic, each answered in 1-3 sentences
5. Run `npm install` and `npm run build`. The build must pass and print the post in its count. Fix and rebuild if not.
6. Mark the calendar line `[x]` with the slug, on the same branch.
7. Commit on a branch `blog/<slug>`, push, and open a pull request titled `Blog: <post title>`. The PR body: the target
   search phrase, a 3-line summary, the products linked, and your sources.
8. Merge the pull request yourself (squash merge) only if `npm run build` passed. Ignore the Vercel ("Account is
   blocked") and Cloudflare preview checks on the PR: they fail on every branch and say nothing about the post. The live
   site redeploys from `main` in about 2 minutes.
9. Wait 3 minutes, then confirm `https://www.scentstudiosa.co.za/blog/<slug>` returns the new title. Check again a few
   minutes later if it does not yet.
10. Email tanidreyer@gmail.com with the subject `New Scent Studio blog post is live: <post title>`. In the body: what the
   post is about in 3-4 plain sentences, the search phrase it targets, the products it links, the live link, and the pull
   request link with "To take it down or change it, reply to me in Claude Code or revert the pull request on GitHub."
   If the build failed or the post is not live, do not merge: email the subject `Scent Studio blog needs a look: <post
   title>` with what went wrong and the pull request link instead.

## Writing rules
- 900-1,500 words, South African English, rand prices, warm and direct, written for a person, not for search engines.
- Answer the question in the first 2-3 sentences. Use H2 headings phrased the way people search. Tables for comparisons.
- Link 3-5 product pages as `/perfume/<id>` and 1-2 related posts as `/blog/<slug>`. Link the WhatsApp order route
  (`https://wa.me/27761328213`) once near the end.
- Say "inspired by <house> <name>"; never "replica", "copy", "fake", "1:1" or "same as". Never claim to be the original
  brand or affiliated with it.
- Never invent reviews, testimonials, customer quotes, sales numbers, awards or longevity hours. Only state numbers you
  can source (link the source) or that are in the repo.
- No em dashes. Avoid: elevate, seamless, unleash, game-changer, delve, embark, testament, curated, in today's world.
- Keyword stuffing hurts: use the main phrase naturally in the title, first paragraph, one H2 and the meta description.

## Never
- Touch or commit any file outside `content/blog/` and `docs/seo/CALENDAR.md` (discard `package-lock.json` changes from `npm install`).
- Push to `main` directly (always go through the pull request), or merge a pull request whose build failed.
