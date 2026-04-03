

## Plan: Regenerate All Perfume Images Using Actual Bottle Photos as Reference

### The Problem
Previous attempts generated bottles that don't match your actual Scent Studio bottle. The AI was inventing its own bottle design from text prompts instead of using your real bottle.

### The Solution
Use the `edit-image` approach — feed your actual uploaded bottle photos directly to the AI image model as a visual reference, so it reproduces the exact bottle (shape, cap, label) in every generated image.

- **Men's bottle reference**: `IMG_3239` (black knurled cap)
- **Women's bottle reference**: `IMG_3242` (gold knurled cap)

### How It Works

1. Copy both bottle reference photos into the project as base images
2. For each perfume, call the image editing model with the reference bottle photo + a prompt describing:
   - Lay the bottle flat on [category color] canvas
   - Add specific note elements from that perfume's data
   - Add category props (rotating: ice/water/shells for Fresh, roses/watches/velvet for Luxury, honey/cinnamon/flowers for Sweet, wood/coffee/pinecones for Musky)
   - Gold glitter accents, 4:5 ratio, photorealistic 8K
3. Save each generated image to `src/assets/men/` or `src/assets/women/`

### Batch Order
1. **Men's Luxury** (16 perfumes) — black canvas, black-cap bottle
2. **Men's Sweet** (13 perfumes) — caramel canvas, black-cap bottle
3. **Men's Musky** (26 perfumes) — woody brown canvas, black-cap bottle
4. **Men's Fresh** (27 perfumes) — midnight blue canvas, black-cap bottle
5. **Women's Luxury** (17 perfumes) — black canvas, gold-cap bottle
6. **Women's Sweet** (25 perfumes) — caramel canvas, gold-cap bottle
7. **Women's Musky** (10 perfumes) — woody brown canvas, gold-cap bottle
8. **Women's Fresh** (17 perfumes) — midnight blue canvas, gold-cap bottle

Total: ~151 images across both collections.

### Technical Details
- Uses `edit-image` mode with `google/gemini-2.5-flash-image` model
- Each perfume's specific notes (from `mens-perfumes.ts` / `womens-perfumes.ts`) drive the prop selection
- Images saved as `.jpg` to existing asset paths — no code changes needed since the image registry files already wire everything up

