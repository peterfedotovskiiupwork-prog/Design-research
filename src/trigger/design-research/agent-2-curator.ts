import { task } from "@trigger.dev/sdk";
import { GoogleGenAI } from "@google/genai";
import type { ResearchInput, ResearchOutput } from "./types.js";

const gemmaModel = "gemma-4-31b-it";

function validateEnv() {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("GEMINI_API_KEY is not set");
  return key;
}

async function callGemma(ai: GoogleGenAI, systemPrompt: string, userPrompt: string) {
  const response = await ai.models.generateContent({
    model: gemmaModel,
    contents: userPrompt,
    config: {
      systemInstruction: systemPrompt,
      temperature: 0.5,
      maxOutputTokens: 48000,
    },
  });
  return response.text ?? "";
}

export const agent2Curator = task({
  id: "agent-2-curator",
  retry: { maxAttempts: 2, factor: 2, minTimeoutInMs: 10000, maxTimeoutInMs: 120000 },
  run: async (payload: { input: ResearchInput; research: ResearchOutput }): Promise<string> => {
    const apiKey = validateEnv();
    const ai = new GoogleGenAI({ apiKey });
    const { input, research } = payload;

    const combinedResearch = Object.entries(research)
      .map(([key, val]) => `=== ${key.toUpperCase()} ===\n${val}`)
      .join("\n\n");

    const systemPrompt = `You are a senior design strategist and creative director. Your job is to review comprehensive design research and select the single best option for each category. Justify every selection in 1-2 sentences. Never produce generic or AI-slop outputs — every selection must be justified against the specific niche and client goals.

Your output will be fed DIRECTLY into a visual PDF generator. The section labels and structure must be EXACT — the PDF generator looks for specific keywords to render each section visually.`;

    const userPrompt = `ORIGINAL BRIEF:
- Niche: ${input.niche}
- Client goals: ${input.clientGoals}
- Animation style preference: ${input.animationStyle}
- Brand services: ${input.brandServices}
- Client name: ${input.clientName}

RESEARCH FROM AGENT 1:
${combinedResearch}

YOUR TASK: Review all variations and select the single strongest option per category. Produce a CURATED DESIGN BRIEF with the EXACT structure below. Format it so every section is clearly separated and ready for a visual PDF generator.

---
### 01 — WINNING DESIGN TREND
[Selected trend name]
[1-2 sentence why, referencing niche and client goals]

### 02 — COLOR PALETTES (4 Options — Ranked by Performance Fit)

RANK 1 — RECOMMENDED
[Palette name]
Primary: [hex] — 60% — [usage: where and how this color appears in the UI]
Secondary: [hex] — 30% — [usage: where and how this color appears in the UI]
Accent: [hex] — 10% — [usage: where and how this color appears in the UI]
Mood: [one sentence]
WCAG: Text [X.X]:1 AAA / Accent [X.X]:1 AA
Why #1: [1-2 sentences]

RANK 2
[Same format as above]

RANK 3
[Same format]

RANK 4
[Same format]

### 02B — NEUTRAL COLOR SCALE
N50: [hex] — [usage]
N300: [hex] — [usage]
N800: [hex] — [usage]
N950: [hex] — [usage]
WCAG N950 on N50: [X.X]:1 AAA

### 03 — TYPOGRAPHY SYSTEM (4 Options — Ranked by Niche Fit)

RANK 1 — RECOMMENDED
[System name]
Main: [font name + weights] — used for: [headings, display, hero text, primary labels]
Supportive: [font name + weights] — used for: [body, captions, secondary UI] OR "None — single-font system"
Mood: [one sentence]
Performance: [variable font? Google Fonts or Adobe Fonts? file size note]
Why #1: [1-2 sentences]

RANK 2
[Same format]

RANK 3
[Same format]

RANK 4
[Same format]

### 04 — HOME PAGE FLOW
[Numbered list of sections, each with name + purpose]
Why this flow: [1-2 sentences]

### 05 — SECOND PAGE FLOW
[Numbered list of sections, each with name + purpose]
Why this flow: [1-2 sentences]

### 06 — GRAPHIC STYLE
Style name: [name]
Space usage: [Air / Medium / Dense]
Theme: [Light / Dark / Mixed]
Visual characteristics: [2-3 sentences]
Why selected: [1-2 sentences]

### 07 — MOOD & EMOTIONAL RESPONSE
Mood: [2-3 words]
Desired visitor feeling: "[quote starting with 'This is...']"
How design achieves it: [1-2 sentences]

### 08 — PREMIUM REFERENCE SITES (Ranked by Relevance)
[RANK 1]
Site name: [name]
URL: [url]
Source: [Awwwards SOTD / Awwwards HM / Godly / Web Search / etc.]
Category: EXACT NICHE / ADJACENT — SIMILAR AUDIENCE / ADJACENT — SIMILAR GOAL
Why premium: [1 sentence]
Design system match: [1 sentence]
Key inspiration: [which section or design decision to study]

[RANK 2 through RANK N — same format for each]

### 09 — ANIMATION DIRECTION
For each section type in this exact order:
1. Hero
2. Navigation
3. Cards / Grid Items
4. CTA Buttons
5. Section Transitions
6. Text Reveals
7. Preloader

Format each as:
#### [SECTION TYPE]
ANIMATION NAME: [name]
TYPE: [Scroll / Hover / Click / Preloader / Persistent / Entrance]
DESCRIPTION: [implementation-ready description with GSAP code snippet]
WHY: [why this serves the design system]
REFERENCE SITE: [real site name]

### 10 — SAMPLE UI COMPONENTS
Using Rank 1 palette and Rank 1 typography.

a) PRIMARY CTA BUTTON
BG: [hex] | Text: [hex] | Font: [name weight size] | Padding: [top/bottom x left/right] | Radius: [px] | Border: [hex or none] | Hover: [description]

b) SECONDARY BUTTON (Ghost Variant)
BG: [hex or transparent] | Border: [hex] | Text: [hex] | Font: [same specs] | Hover: [description]

c) CONTENT CARD
BG: [hex] | Radius: [px] | Shadow: [value] | Heading font: [name weight size] | Body font: [name weight size] | Badge color: [hex] | Link color: [hex]

d) NAVIGATION BAR
BG: [hex] | Height: [px] | Logo font: [name weight size] | Links font: [name weight size] | CTA: mini primary button | Bottom border: [hex or none]

End your response with: [AGENT-2-COMPLETE]`;

    return callGemma(ai, systemPrompt, userPrompt);
  },
});
