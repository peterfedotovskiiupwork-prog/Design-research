import { task } from "@trigger.dev/sdk";
import type { ResearchInput, ResearchOutput } from "./types.js";
import { createAI, callGemma } from "./llm.js";

function validateEnv() {
  const geminiKey = process.env.GEMINI_API_KEY;
  const tavilyKey = process.env.TAVILY_API_KEY;
  if (!geminiKey) throw new Error("GEMINI_API_KEY is not set");
  if (!tavilyKey) throw new Error("TAVILY_API_KEY is not set");
  return { geminiKey, tavilyKey };
}

async function searchTavily(apiKey: string, query: string, maxResults = 6) {
  const res = await fetch("https://api.tavily.com/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      api_key: apiKey,
      query,
      search_depth: "advanced",
      include_answer: true,
      max_results: maxResults,
    }),
  });
  if (!res.ok) {
    throw new Error(`Tavily search failed: ${res.status} ${await res.text()}`);
  }
  return res.json();
}

export const agent1Research = task({
  id: "agent-1-research",
  retry: { maxAttempts: 2, factor: 2, minTimeoutInMs: 10000, maxTimeoutInMs: 120000 },
  run: async (input: ResearchInput): Promise<ResearchOutput> => {
    const { geminiKey, tavilyKey } = validateEnv();
    const ai = createAI();

    const clientDomain = `${input.clientName.toLowerCase().replace(/\s+/g, "-")}-${input.niche.toLowerCase().replace(/\s+/g, "-")}.com`;

    const searches = [
      searchTavily(tavilyKey, `web design trends 2025 2026 ${input.niche} site:awwwards.com OR site:godly.website`, 6),
      searchTavily(tavilyKey, `${input.niche} website design inspiration premium award winning`, 8),
      searchTavily(tavilyKey, `${input.niche} brand color palette typography font pairing 2025 2026`, 6),
      searchTavily(tavilyKey, `GSAP ScrollTrigger animation website inspiration ${input.animationStyle}`, 6),
      searchTavily(tavilyKey, `site:awwwards.com ${input.niche} website design`, 5),
      searchTavily(tavilyKey, `site:godly.website ${input.niche}`, 5),
      searchTavily(tavilyKey, `site:awwwards.com nail beauty OR salon OR academy site of the day`, 5),
      searchTavily(tavilyKey, `${input.niche} online courses OR education website design best 2025`, 6),
    ];

    const [trends, nicheRefs, colorType, animRefs, awwwards, godly, awwwardsNiche, eduRefs] = await Promise.all(searches);

    const searchContext = `
=== GLOBAL WEB DESIGN TRENDS ===
${JSON.stringify(trends.results?.slice(0, 6) ?? [], null, 2)}

=== NICHE REFERENCE SITES ===
${JSON.stringify(nicheRefs.results?.slice(0, 8) ?? [], null, 2)}

=== COLOR & TYPOGRAPHY RESEARCH ===
${JSON.stringify(colorType.results?.slice(0, 6) ?? [], null, 2)}

=== ANIMATION INSPIRATION ===
${JSON.stringify(animRefs.results?.slice(0, 6) ?? [], null, 2)}

=== AWWWARDS NICHE SITES ===
${JSON.stringify(awwwards.results?.slice(0, 5) ?? [], null, 2)}

=== GODLY NICHE SITES ===
${JSON.stringify(godly.results?.slice(0, 5) ?? [], null, 2)}

=== AWWWARDS SITE OF THE DAY / HONORABLE MENTION (NICHE-ADJACENT) ===
${JSON.stringify(awwwardsNiche.results?.slice(0, 5) ?? [], null, 2)}

=== EDUCATION / COURSE WEBSITE INSPIRATION ===
${JSON.stringify(eduRefs.results?.slice(0, 6) ?? [], null, 2)}
`;

    const systemPrompt = `You are a senior web design researcher and creative director. You produce design research for Peter — a Webflow/Figma specialist who builds premium landing pages, brand sites, and e-commerce sites with GSAP animations and client-first framework.

Your output MUST follow the exact structure below. Every section is required. Use the web search results as your primary source. Never fabricate URLs or reference sites. If a search returned nothing useful for a topic, use your training knowledge but flag it clearly.

OUTPUT STRUCTURE — follow this EXACT format with these EXACT section headers:`;

    const userPrompt = `INPUT:
- Niche: ${input.niche}
- Client goals: ${input.clientGoals}
- Animation style preference: ${input.animationStyle}
- Brand services: ${input.brandServices}
- Client name: ${input.clientName}
- Client domain (estimated): ${clientDomain}

WEB SEARCH RESULTS:
${searchContext}

YOUR TASK: Produce a comprehensive design research brief covering ALL 10 numbered topics below. Follow the structure exactly.

---
## 01 — WINNING DESIGN TREND
Select the single most impactful design trend for this niche based on the search results and client goals. Provide:
- Trend name (e.g. "Scroll-Triggered Immersive Storytelling")
- Why paragraph: explain why this trend serves the conversion goal, how it pairs with the animation style, and name one real niche proof point from search results.

## 02 — COLOR PALETTES (4 Options — Ranked by Performance Fit)
Provide exactly 4 palette options. Each palette has exactly 3 colors.

For each palette:
- Palette name (e.g. "Dusty Rose Soft Editorial" or "Deep Ink + Soft Champagne")
- Primary hex (60%) — exact usage description (e.g. "Page backgrounds, hero sections, card bases")
- Secondary hex (30%) — exact usage description (e.g. "Section alternates, gallery backgrounds, testimonial blocks")
- Accent hex (10%) — exact usage description (e.g. "CTA buttons, active nav, price highlights, badges")
- Mood: one sentence describing the overall feel
- WCAG: "Text X.X:1 AAA / Accent X.X:1 AA" (or "large text only" if below AA for normal)
- Why: 1-2 sentences explaining why this palette works for this niche and client
- Rank: 1-4 (1 = strongest recommendation)

Selection rules:
- Rank 1: highest conversion contrast + strongest brand differentiation + AA or AAA for all text
- Avoid millennial pink, purple gradients, default Bootstrap blue — no AI-slop palettes
- All text-on-primary pairs must pass 4.5:1 minimum

## 02B — NEUTRAL COLOR SCALE
Provide ONE set of 4 warm-toned neutrals that works across all palettes:
- N50 hex — near-white — usage (e.g. "Page background, empty states, card fill")
- N300 hex — light-medium — usage (e.g. "Borders, dividers, input backgrounds")
- N800 hex — dark — usage (e.g. "Card support, footer, dark sections")
- N950 hex — near-black — usage (e.g. "Primary text, headings, icons")
- WCAG N950-on-N50: "X.X:1 AAA"

## 03 — TYPOGRAPHY SYSTEM (4 Options — Ranked by Niche Fit)
Provide exactly 4 typography options. Each uses a maximum of 2 fonts.

For each option:
- System name (e.g. "Editorial Serif + Humanist Sans")
- Main font: name + weights — used for headings, display, hero text, primary labels
- Supportive font: name + weights — used for body, captions, secondary UI — OR "None — single-font system"
- Mood: one sentence
- Performance: variable font? Google Fonts or Adobe Fonts? approximate file size?
- Why: 1-2 sentences explaining why this suits the niche
- Rank: 1-4

Use only Google Fonts or Adobe Fonts. Prioritize variable fonts for performance.

## 04 — HOME PAGE FLOW
Provide ONE recommended section flow for the homepage. List as a numbered sequence with section name and purpose for each. Minimum 8 sections, maximum 14.

Format each as:
[number]. [SECTION NAME] — [purpose, what this section does and why it matters]

After the list, add: "Why this flow: [1-2 sentences]"

## 05 — SECOND PAGE FLOW
Pick the most important second page (Services / Courses / About / Portfolio based on brand services). Provide ONE recommended section flow as a numbered sequence.

After the list, add: "Why this flow: [1-2 sentences]"

## 06 — GRAPHIC STYLE
Provide the single best graphic style direction for this project:
- Style name (e.g. "Warm Bold Modernism" or "Soft Editorial Minimalism")
- Space usage: Air / Medium / Dense
- Theme: Light / Dark / Mixed
- Visual characteristics: 2-3 sentences
- Why selected: 1-2 sentences connecting to the niche and client goals

## 07 — MOOD & EMOTIONAL RESPONSE
- Mood: 2-3 words (e.g. "Confident, Energetic, Trustworthy")
- Desired visitor feeling: one sentence in quotes starting with "This is..."
- How design achieves it: 1-2 sentences connecting the visual choices (color, typography, animation) to the emotional response

## 08 — PREMIUM REFERENCE SITES (Ranked by Relevance)
List all real reference sites found in search results. Minimum 5, aim for 6-8.

For each site provide:
- Site name
- URL
- Source (Awwwards SOTD / Awwwards HM / Godly / CSS Design Awards / Web Search)
- Category: EXACT NICHE / ADJACENT — SIMILAR AUDIENCE / ADJACENT — SIMILAR GOAL
- Why premium: 1 sentence
- Design system match: 1 sentence explaining how this connects to the recommended style, colors, or animation approach
- Key inspiration: which section or design decision to study
- Rank: 1 = most relevant to this project

## 09 — ANIMATION DIRECTION (GSAP-Focused)
For EACH of these 7 section types, provide 1 animation concept with EXACTLY these 5 fields:
- ANIMATION NAME: [name]
- TYPE: [Scroll / Hover / Click / Preloader / Persistent / Entrance]
- DESCRIPTION: Implementation-ready description — what moves, how, direction, timing. Include a GSAP code snippet using gsap.from() or ScrollTrigger syntax.
- WHY: Why this serves the design system and user experience
- REFERENCE SITE: Real site name from search results

Section types to cover (in this order):
1. Hero
2. Navigation
3. Cards / Grid Items
4. CTA Buttons
5. Section Transitions
6. Text Reveals
7. Preloader (last)

## 10 — SAMPLE UI COMPONENTS
Using the Rank 1 palette and Rank 1 typography, describe 4 components with exact specs:
a) PRIMARY CTA BUTTON — accent bg, white text, hover state
b) SECONDARY BUTTON — ghost/outline variant
c) CONTENT CARD — with badge, title, body text, link
d) NAVIGATION BAR — logo, links, CTA button

For each: exact hex values, font name and weight, font size, padding, border radius, border, hover state.

End your response with: [AGENT-1-COMPLETE]`;

    const researchText = await callGemma(ai, systemPrompt, userPrompt);

    return {
      trends: extractSection(researchText, "01", "02"),
      nicheTrends: extractSection(researchText, "02", "02B"),
      colorPalettes: extractSection(researchText, "02B", "03"),
      typography: extractSection(researchText, "03", "04"),
      homePageSections: extractSection(researchText, "04", "05"),
      secondPageSections: extractSection(researchText, "05", "06"),
      graphicStyles: extractSection(researchText, "06", "07"),
      moodEmotional: extractSection(researchText, "07", "08"),
      referenceSites: extractSection(researchText, "08", "09"),
      animations: extractSection(researchText, "09", "10"),
      uiComponents: extractSection(researchText, "10", "[AGENT-1-COMPLETE]"),
    };
  },
});

function extractSection(text: string, fromMarker: string, toMarker: string): string {
  const lines = text.split("\n");
  let fromIdx = -1;
  let toIdx = -1;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.toLowerCase().includes(fromMarker.toLowerCase()) && line.startsWith("##")) {
      fromIdx = i;
      break;
    }
  }
  if (fromIdx === -1) {
    const simpleFrom = text.toLowerCase().indexOf(fromMarker.toLowerCase());
    if (simpleFrom === -1) return `[Section "${fromMarker}" not found]`;
    fromIdx = text.slice(0, simpleFrom).split("\n").length;
  }

  for (let i = fromIdx + 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.toLowerCase().includes(toMarker.toLowerCase()) && line.startsWith("##")) {
      toIdx = i;
      break;
    }
  }
  if (toIdx === -1) {
    const endTag = text.indexOf("[AGENT-1-COMPLETE]");
    if (endTag !== -1) {
      return lines.slice(fromIdx).join("\n").split("[AGENT-1-COMPLETE]")[0].trim();
    }
    return lines.slice(fromIdx).join("\n").trim();
  }

  return lines.slice(fromIdx, toIdx).join("\n").trim();
}
