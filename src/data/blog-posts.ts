import blogOilVsAlcohol from "@/assets/blog-oil-vs-alcohol.jpg";
import blogPerfumeFadesFast from "@/assets/blog-perfume-fades-fast.jpg";
import blogDupeFragrancesSA from "@/assets/blog-dupe-fragrances-sa.jpg";

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  metaDescription: string;
  date: string;
  readingTime: string;
  image: string;
  imageAlt: string;
  /** Long-form HTML content. Uses semantic h2/h3/p/ul. */
  contentHtml: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: "best-dupe-fragrances-south-africa",
    title: "The Best Dupe Fragrances in South Africa (And Why Scent Studio Leads the Pack)",
    excerpt:
      "Dupe fragrances are exploding in South Africa — but quality varies wildly. Here's an honest look at the market, what to avoid, and why Scent Studio has become the country's most trusted name in inspired perfumes.",
    metaDescription:
      "Looking for the best dupe fragrances in South Africa? A 2026 guide to inspired perfumes, oil-based long-lasting scents, fair pricing and why Scent Studio is leading the SA dupe perfume market.",
    date: "2026-05-15",
    readingTime: "7 min read",
    image: blogDupeFragrancesSA,
    imageAlt: "Amber Scent Studio inspired perfume bottle on warm wood lit by golden South African afternoon light",
    contentHtml: `
      <p>Walk into any South African mall in 2026 and you will see it: dupe fragrances are everywhere. Inspired perfumes, oil-based attars, "smells like" sprays — what was once a niche corner of the market has become one of the fastest-growing categories in SA beauty. And honestly, it makes sense. With the rand under pressure and a 100ml designer bottle costing upwards of R3 000, more South Africans than ever are choosing to buy the <em>scent</em> they love without paying for the <em>label</em> they don't need.</p>
      <p>But not all dupe fragrances are created equal. This guide breaks down the South African dupe perfume market honestly — what's good, what to avoid, and where <strong>Scent Studio</strong> fits in.</p>

      <h2>What is a "dupe fragrance"?</h2>
      <p>A dupe fragrance — also called an inspired perfume, designer-inspired scent or fragrance dupe — is a perfume crafted to capture the character of an iconic designer scent at a fraction of the price. It is <strong>not</strong> a counterfeit. There is no fake branding, no copied bottle, no attempt to deceive. It is a legal, transparent alternative built around the same fragrance family — woody, oud, gourmand, fresh — without the designer markup.</p>
      <p>Think of it the way you think about generic medicine, supermarket olive oil, or Woolworths-brand cereal: same quality category, honest labelling, far better value.</p>

      <h2>Why dupe fragrances are exploding in South Africa</h2>
      <ul>
        <li><strong>Designer prices keep climbing.</strong> A 100ml of Baccarat Rouge 540 retails near R8 000 in SA. A 100ml of Dior Sauvage sits around R3 200. For most working South Africans, that is simply not realistic for an everyday scent.</li>
        <li><strong>Oil-based perfumes last longer in our climate.</strong> Alcohol-heavy designer EDTs flash off the skin in our heat. A quality oil-based dupe holds for 8–12 hours.</li>
        <li><strong>The stigma is gone.</strong> Influencers, TikTok and a generation that values smart spending have made "I bought the dupe" a flex, not an apology.</li>
        <li><strong>Local craftsmanship is improving fast.</strong> The gap between a well-blended SA inspired perfume and a department store EDP has narrowed dramatically in the last two years.</li>
      </ul>

      <h2>What to look for in a quality dupe fragrance</h2>
      <h3>1. Honest, transparent naming</h3>
      <p>A trustworthy brand says <em>"Inspired by Baccarat Rouge 540"</em> — not pretending to be the original. If a brand is hiding what scent it dupes, they are usually hiding the formulation too.</p>
      <h3>2. Oil-based formulation</h3>
      <p>For South African weather, oil wins. It does not flash off in the heat, sits closer to the skin, and lasts a full workday without re-application. Cheap alcohol-based dupes are usually the ones that disappear by lunch.</p>
      <h3>3. Real fragrance concentration</h3>
      <p>A good inspired perfume runs 20%+ in fragrance oil. Many supermarket "dupes" sit under 5% — which is why they smell weak and vanish in an hour.</p>
      <h3>4. Fair, transparent pricing</h3>
      <p>If a "dupe" of a R3 000 designer scent is being sold for R900, you are still being overcharged. A fair price for a 50ml inspired perfume in SA is in the R150–R250 range.</p>
      <h3>5. Real customer reviews</h3>
      <p>Look for South African reviews from real people in your climate. International reviews don't tell you how a scent performs in Joburg summer.</p>

      <h2>Why Scent Studio leads the SA dupe fragrance market</h2>
      <p>We're not the loudest brand in South Africa. We don't run flashy paid campaigns or pretend to be something we're not. But we have quietly become one of the most trusted names in inspired perfumes in the country — and here's why.</p>

      <h3>Honest "Inspired by" naming, every single bottle</h3>
      <p>Every Scent Studio fragrance is clearly labelled as <em>Inspired by</em> the designer scent it pays tribute to. No fake branding. No misleading bottle shapes. Just transparent craft.</p>

      <h3>100% oil-based, built for South African weather</h3>
      <p>Every scent in our catalogue — men's, women's, exclusive — is oil-based and formulated to survive Highveld summers, Cape winters and everything in between. No alcohol burn. No midday fade.</p>

      <h3>Honest pricing across the whole range</h3>
      <ul>
        <li><strong>Standard Collection:</strong> 30ml R100 · 50ml R150 · 100ml R280</li>
        <li><strong>Premium Collection:</strong> 30ml R130 · 50ml R180 · 100ml R320</li>
        <li><strong>Ultra-Premium (Baccarat Rouge, Initio Oud, Yara Pink):</strong> 30ml R160 · 50ml R250 · 100ml R490</li>
      </ul>
      <p>Compare that to the R3 000–R8 000 you would pay for the originals. Same scent profile, same all-day performance, a fraction of the cost.</p>

      <h3>The largest curated dupe catalogue in SA</h3>
      <p>From Dior Sauvage and Creed Aventus to MFK Baccarat Rouge 540, Tom Ford Oud Wood, Yara Pink and Portrait of a Lady — we cover the scents South Africans actually search for, not just the easy ones.</p>

      <h3>Build Your Own signature blend</h3>
      <p>No other SA dupe brand lets you design your own perfume. Our <strong>Craft Your Own</strong> studio lets you blend up to 3 fragrances into a single custom 30ml, 50ml or 100ml bottle, with adjustable oil concentration. It is the most personal fragrance experience available in the country.</p>

      <h3>Find My Scent — a real fragrance stylist quiz</h3>
      <p>Our 6-step quiz uses a 25-point personality and intensity matrix to recommend three scents that genuinely suit you. Not a gimmick — a tool built by people who actually understand fragrance families.</p>

      <h3>Real South African reviews, real local fulfilment</h3>
      <p>Every order ships from our SA studio. Every review on our site is from a verified South African customer. WhatsApp support is answered by an actual human, usually within minutes.</p>

      <h2>Common dupe fragrance mistakes South Africans make</h2>
      <ul>
        <li><strong>Buying the cheapest bottle on Takealot.</strong> Most R49–R99 "perfume oils" are heavily diluted and won't last an hour.</li>
        <li><strong>Falling for fake designer copies.</strong> If a bottle <em>looks</em> identical to Sauvage, that's a counterfeit, not a dupe. Avoid.</li>
        <li><strong>Spraying alcohol-based dupes in summer.</strong> They evaporate before they project. Switch to oil.</li>
        <li><strong>Skipping moisturiser.</strong> Even the best oil perfume needs hydrated skin to anchor properly.</li>
      </ul>

      <h2>The bottom line</h2>
      <p>The dupe fragrance market in South Africa is no longer a back-alley alternative to designer perfume — it is the smarter, more honest mainstream choice. But quality varies wildly, and most of what's sold cheaply online is not worth your money.</p>
      <p>Scent Studio has built its reputation on three simple promises: <strong>honest naming, oil-based craft, fair SA pricing</strong>. That's why our customers stay, refer friends, and come back for the next bottle.</p>
      <p>If you've never tried a properly made South African inspired perfume, take our short scent quiz — it'll match you to the fragrance you'll actually wear every day.</p>
    `,
  },
  {
    slug: "why-does-my-perfume-fade-so-fast",
    title: "Why Does My Perfume Fade So Fast? (And How to Fix It)",
    excerpt:
      "If your fragrance disappears by lunchtime, you're not imagining it. Here's why perfume fades fast in South African weather — and the simple fixes that make it last.",
    metaDescription:
      "Why does your perfume fade so fast? A South African guide to fragrance longevity, skin chemistry, climate effects and how to make affordable perfumes last all day.",
    date: "2026-04-29",
    readingTime: "5 min read",
    image: blogPerfumeFadesFast,
    imageAlt: "Amber perfume bottle on cream silk lit by warm golden afternoon light",
    contentHtml: `
      <p>You spray your favourite perfume in the morning, step out the door, and by mid-afternoon — nothing. No trail, no whisper, no scent at all. Sound familiar? It is one of the most common frustrations we hear from South African fragrance lovers, and the good news is that there is almost always a fixable reason behind it.</p>
      <p>This guide explains exactly why your perfume fades so fast, what our climate has to do with it, and the small changes that turn a 2-hour scent into an all-day signature.</p>

      <h2>1. Your skin type changes everything</h2>
      <p>Dry skin is the number one reason perfume disappears quickly. Fragrance molecules need moisture to cling to — when your skin is dry, those molecules evaporate into the air instead of settling in. People with naturally oily skin almost always get longer wear from the same bottle.</p>
      <p><strong>The fix:</strong> Apply an unscented moisturiser or a light body oil to your pulse points <em>before</em> spraying. This single habit can double how long your scent lasts.</p>

      <h2>2. South African heat is brutal on fragrance</h2>
      <p>Hot, dry weather — the kind we get across most of Gauteng, the Free State and the Northern Cape — accelerates evaporation. Alcohol-based eau de toilettes especially flash off the skin within an hour or two when temperatures climb above 25°C.</p>
      <p><strong>The fix:</strong> Switch to <strong>oil-based perfumes</strong> for daytime wear. Without alcohol as a carrier, the scent does not evaporate the same way. Oil perfumes were literally invented in hot climates for exactly this reason.</p>

      <h2>3. You're spraying the wrong places</h2>
      <p>Spraying onto clothes or into the air does very little. Fragrance is activated by body heat, which is why pulse points work — the warmth of your blood vessels gradually releases the scent throughout the day.</p>
      <p><strong>The fix:</strong> Apply directly to: inner wrists, the side of the neck, behind the ears, the inner elbow, and behind the knees. Do not rub your wrists together — it crushes the top notes.</p>

      <h2>4. You've gone "nose blind"</h2>
      <p>Sometimes your perfume has not actually faded — you have just stopped smelling it. Your nose adapts to scents you wear regularly, a phenomenon called olfactory fatigue. Ask a friend or partner mid-afternoon. You might be surprised.</p>
      <p><strong>The fix:</strong> Rotate two or three different fragrances through your week so your nose stays sensitive to each one.</p>

      <h2>5. You bought a weak formulation</h2>
      <p>Not all perfumes are created equal. Many cheap supermarket sprays contain very low concentrations of fragrance oil — sometimes under 5%. Designer eau de toilettes sit around 5–15%. A quality oil-based <em>inspired perfume</em> often runs 20% or higher in pure fragrance concentration, which is why it lasts so much longer.</p>
      <p><strong>The fix:</strong> Look for "perfume oil," "extrait" or "parfum" rather than "eau de toilette" or "body mist" if longevity matters to you.</p>

      <h2>6. You're storing your perfume badly</h2>
      <p>Sunlight, heat and humidity break down fragrance compounds over time. A bottle left on a sunny bathroom shelf can lose its character within months — even if it still smells "fine" to you.</p>
      <p><strong>The fix:</strong> Store bottles in a cool, dark drawer or cupboard. Bedrooms work better than bathrooms.</p>

      <h2>The quick longevity checklist</h2>
      <ul>
        <li><strong>Moisturise</strong> before applying.</li>
        <li>Apply to <strong>warm pulse points</strong>, not clothes.</li>
        <li><strong>Do not rub</strong> — dab and let it settle.</li>
        <li>Choose <strong>oil-based perfumes</strong> for hot weather and long days.</li>
        <li>Layer with a <strong>matching body oil</strong> if you really want it to anchor.</li>
        <li>Store away from <strong>heat and sunlight</strong>.</li>
      </ul>

      <h2>Why oil-based perfumes solve most of this</h2>
      <p>Most of the problems above point in the same direction: alcohol-based sprays simply struggle in our climate. Oil-based <em>long-lasting fragrances</em> sit on the skin instead of flashing off it, release slowly through the day, and do not need re-application every few hours.</p>
      <p>At Scent Studio, every fragrance we craft is oil-based and built around the realities of South African weather and South African budgets. You get the character of iconic designer scents — without the designer price tag, and without the midday fade.</p>

      <h2>The bottom line</h2>
      <p>If your perfume fades fast, it is rarely your fault. It is usually a mix of dry skin, hot weather, the wrong application points and a formulation that was never designed to last. Adjust those four things — or switch to a quality oil-based perfume — and you will notice the difference within a single day of wear.</p>
      <p>Not sure which oil-based scent will suit you best? Our short scent quiz takes about a minute and points you to the fragrance family that fits your personality and lifestyle.</p>
    `,
  },
  {
    slug: "oil-based-perfumes-vs-alcohol-perfumes",
    title: "Oil-Based Perfumes vs Alcohol Perfumes: Which Lasts Longer?",
    excerpt:
      "A clear, honest look at oil-based perfumes vs alcohol perfumes — longevity, projection, skin compatibility and value for South African fragrance lovers.",
    metaDescription:
      "Oil-based perfumes vs alcohol perfumes compared: longevity, projection, skin compatibility and price. A guide for South Africans seeking affordable, long-lasting fragrances.",
    date: "2026-04-22",
    readingTime: "6 min read",
    image: blogOilVsAlcohol,
    imageAlt: "Amber oil-based perfume bottles on dark silk with warm golden light",
    contentHtml: `
      <p>If you have ever stood in a fragrance aisle wondering why one bottle costs R200 and another costs R2 000 — and why one fades by lunchtime while the other clings to your shirt for days — you are not alone. The debate of <strong>oil-based perfumes vs alcohol perfumes</strong> is one of the most common questions we get from South Africans looking for <em>affordable perfumes South Africa</em> shoppers can actually trust.</p>
      <p>This guide breaks it down honestly: no jargon, no overselling. Just the real differences, who each type suits best, and how to make any fragrance last longer on your skin.</p>

      <h2>What are oil-based perfumes?</h2>
      <p>Oil-based perfumes (sometimes called <em>perfume oils</em> or <em>attars</em>) suspend fragrance compounds in a carrier oil — usually a light, skin-safe oil rather than alcohol. They are typically rolled or dabbed onto pulse points instead of sprayed.</p>
      <p>Because there is no alcohol to evaporate, the scent sits closer to the skin and releases slowly throughout the day. They tend to feel softer at first spray, then bloom into their full character once warmed by your body heat.</p>

      <h2>What are alcohol-based perfumes?</h2>
      <p>Alcohol-based perfumes — the classic eau de parfum or eau de toilette in a glass bottle — mix fragrance oils with denatured alcohol and a little water. The alcohol acts as a carrier that flashes off the skin, projecting the scent outward in those first dramatic minutes.</p>
      <p>This is why a spritz of an EDP fills a room: you are smelling the alcohol carrying the fragrance into the air. It is also why these scents can fade faster, especially in hot, dry climates like much of South Africa.</p>

      <h2>The key differences</h2>

      <h3>1. Longevity — how long they last</h3>
      <p>Oil-based perfumes generally last <strong>longer on the skin</strong>, often 8–12 hours or more. Alcohol perfumes can be intense for the first 2–4 hours, then drop off significantly. If you want a scent that quietly stays with you from morning meeting to evening dinner, oil wins.</p>

      <h3>2. Scent strength and projection</h3>
      <p>Alcohol perfumes project further — people across the room may catch your scent. Oil perfumes have a smaller "scent bubble," which is more intimate. In offices, gyms and warm South African weather, this is often a feature, not a flaw.</p>

      <h3>3. Skin compatibility</h3>
      <p>Alcohol can dry out or irritate sensitive skin, especially in winter or for anyone prone to eczema. Oil-based perfumes are usually gentler and even moisturise slightly. They also tend to behave more predictably across different skin types.</p>

      <h3>4. Price and affordability</h3>
      <p>Designer alcohol-based perfumes carry the cost of branding, packaging, marketing and retail markups. A high-quality oil-based <em>inspired perfume</em> can deliver a comparable scent profile at a fraction of the price — without compromising on the actual fragrance composition.</p>

      <h2>Pros and cons at a glance</h2>
      <h3>Oil-based perfumes</h3>
      <ul>
        <li><strong>Pros:</strong> long-lasting, skin-friendly, more affordable, travel-safe (no spray, no leaks), no alcohol smell.</li>
        <li><strong>Cons:</strong> softer projection, applied by dab or roll-on rather than spritz.</li>
      </ul>
      <h3>Alcohol-based perfumes</h3>
      <ul>
        <li><strong>Pros:</strong> strong opening projection, classic spray application, wide variety of designer options.</li>
        <li><strong>Cons:</strong> shorter wear time, can dry out skin, significantly more expensive, evaporates quickly in hot weather.</li>
      </ul>

      <h2>Who should choose oil-based perfumes?</h2>
      <p>Oil-based fragrances are an excellent choice if you:</p>
      <ul>
        <li>Want a scent that lasts an entire workday without re-application.</li>
        <li>Have sensitive skin or react to alcohol-heavy sprays.</li>
        <li>Prefer a more personal, intimate scent rather than a room-filling one.</li>
        <li>Want premium-quality fragrance without the designer price tag.</li>
        <li>Travel often and want a leak-proof, hand-luggage-friendly bottle.</li>
      </ul>

      <h2>How to make any perfume last longer</h2>
      <ul>
        <li><strong>Moisturise first.</strong> Fragrance clings to hydrated skin. Apply unscented lotion before your perfume.</li>
        <li><strong>Target pulse points.</strong> Wrists, neck, behind the ears, inner elbows — warmth releases scent throughout the day.</li>
        <li><strong>Do not rub.</strong> Rubbing wrists together breaks down the top notes. Dab and let it settle.</li>
        <li><strong>Layer scents.</strong> A matching body oil under your perfume can double wear time.</li>
        <li><strong>Store it properly.</strong> Keep bottles out of sunlight and away from heat to protect the formula.</li>
      </ul>

      <h2>A note on Scent Studio</h2>
      <p>At Scent Studio we focus on premium <strong>oil-based inspired perfumes</strong> crafted for South African weather and South African budgets. Each fragrance is built to deliver the character of an iconic designer scent — without the designer price tag — and to wear comfortably from morning to night.</p>
      <p>If you are tired of paying premium prices for perfumes that fade by midday, oil-based <em>long-lasting fragrances</em> are worth a serious look.</p>

      <h2>The verdict</h2>
      <p>Both formats have a place. Alcohol perfumes give you that big, projecting opening; oil perfumes give you longevity, skin comfort and far better value. For most everyday wearers in South Africa — especially those who want their scent to last and their wallet to breathe — oil-based perfumes are the smarter, more elegant choice.</p>
      <p>Curious which oil-based scent suits your personality? Take a few minutes with our short scent quiz and we will guide you to the fragrance that fits you best.</p>
    `,
  },
];

export const getBlogPostBySlug = (slug: string) =>
  blogPosts.find((post) => post.slug === slug);