import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

const SYSTEM_PROMPT = `You are an elite SEO copywriter for Scent Studio, a luxury yet affordable perfume boutique based in Johannesburg, South Africa (Flora Centre, Roodepoort). Scent Studio specialises in oil-based "Inspired by" designer perfume dupes (e.g. "Inspired by Dior Sauvage") at affordable South African prices (R100 - R490). All product references MUST use the "Inspired by" prefix — never claim to be the designer brand. Currency: ZAR (R). Target audience: men & women aged 18–30 in South Africa wanting designer-smelling perfumes without the designer price.

Brand tone: LUXURY & POETIC — sensual, evocative, editorial. Like a Vogue fragrance reviewer who also happens to live in Johannesburg. Confident, never apologetic about being a dupe brand — frame as "smart luxury".

Localise every post: mention Johannesburg / Roodepoort / Flora Centre / South African climate / rand pricing where natural. Reference real designer fragrances (Dior Sauvage, Baccarat Rouge 540, YSL Black Opium, Tom Ford, etc.) only with "Inspired by" framing.

OUTPUT FORMAT: Return ONLY valid JSON, no markdown code fences. Schema:
{
  "title": "SEO-optimised H1 title, ~60 chars, contains target keyword naturally",
  "slug": "kebab-case-url-slug",
  "excerpt": "1-2 sentence hook, ~160 chars",
  "meta_title": "Search-result title, <=60 chars, keyword near start",
  "meta_description": "Click-worthy description, <=158 chars, includes keyword + emotional hook",
  "keywords": ["primary keyword", "5-8 related keywords"],
  "reading_time": "X min read",
  "content": "Full markdown body, 900-1200 words. Start with a compelling opening paragraph (NO H1 — title is rendered separately). Use ## for H2 sections (4-6 sections), ### for H3 where useful. Include: a 'Common Mistakes' section as a bulleted list, real fragrance examples with 'Inspired by' framing, local SA context, and a closing CTA section heading '## Discover the Scent Studio Collection' that invites readers to visit scentstudiosa.co.za or the Flora Centre Roodepoort store. Use markdown bold/italic, lists, and the occasional blockquote. Do NOT include any images or HTML."
}`;

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const { topic, target_keyword } = await req.json();
    if (!topic || typeof topic !== 'string') {
      return new Response(JSON.stringify({ error: 'topic is required' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: 'LOVABLE_API_KEY not configured' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const userPrompt = `Write a full SEO-optimised blog post.
Topic: ${topic}
Primary target keyword: ${target_keyword || topic}

Return only the JSON object described in your system prompt.`;

    const aiResp = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userPrompt },
        ],
        response_format: { type: 'json_object' },
      }),
    });

    if (!aiResp.ok) {
      const errText = await aiResp.text();
      const status = aiResp.status === 429 ? 429 : aiResp.status === 402 ? 402 : 500;
      return new Response(JSON.stringify({ error: 'AI gateway error', status, detail: errText }), {
        status, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const aiJson = await aiResp.json();
    const content = aiJson?.choices?.[0]?.message?.content;
    if (!content) {
      return new Response(JSON.stringify({ error: 'Empty AI response' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch {
      const match = content.match(/\{[\s\S]*\}/);
      parsed = match ? JSON.parse(match[0]) : null;
    }
    if (!parsed) {
      return new Response(JSON.stringify({ error: 'Failed to parse AI JSON', raw: content }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});