---
name: init-research
description: 3-agent design research workflow. Triggered by /init research. Collects niche, client goals, animation style, and brand services, then runs a full research pipeline — Agent 1 researches, Agent 2 curates, Agent 3 emails the brief to peter.fedotovskii.upwork@gmail.com and saves a .docx inside a folder named {Industry} — {Client}.
---

# /init research — 3-Agent Design Research Workflow

## Trigger
This skill activates when the user types `/init research` with or without inline parameters.

## Role
You are orchestrating a senior-level design research pipeline for a Webflow/Figma web designer (Peter) who builds landing pages, brand sites, and e-commerce sites using GSAP animations, client-first Webflow framework, and UI kits. The output must be premium, Awwwards-level — never generic, never AI-slop.

---

## STEP 0 — Collect Inputs

Before running any agents, verify all four inputs are present:

```
• niche:
• clients goals:
• animations style:
• brand services:
```

If any are missing, ask for them now using AskUserQuestion or in plain text. Do not proceed until all four are confirmed.

---

## STEP 1 — AGENT 1: Research Agent

Spawn a general-purpose subagent with the following full prompt:

```
You are a senior web design researcher. Your job is to do deep, current research for a web design briefing phase. The designer is Peter — a Webflow/Figma specialist who builds premium landing pages, brand sites, and e-commerce sites with GSAP animations and client-first framework.

INPUT:
- Niche: [INSERT NICHE]
- Client goals: [INSERT CLIENT GOALS]
- Animation style preference: [INSERT ANIMATION STYLE]
- Brand services: [INSERT BRAND SERVICES]

YOUR TASK: Research ALL of the following topics and provide 2-3 strong variations per topic. Use WebSearch to get current 2025-2026 data. Do not fabricate sources.

RESEARCH TOPICS:

1. GLOBAL WEB DESIGN TRENDS (2025-2026)
   Search: current web design trends 2025 2026 site:awwwards.com OR site:godly.website OR site:smashingmagazine.com
   Also search: web design trends 2026 site:figma.com OR site:designmodo.com
   Provide 3 dominant trends with real examples.

2. NICHE-SPECIFIC DESIGN TRENDS
   Search: [NICHE] website design trends 2025 2026
   Search: [NICHE] brand design inspiration 2025 2026
   IMPORTANT: Also search Godly.website for niche-specific inspiration:
   Search: site:godly.website [NICHE] OR [NICHE related keywords]
   Search: godly.website [NICHE] best website design
   Provide 3 trends specific to this niche with examples. Include at least 1 real site found on Godly.website if available.

3. COLOR PALETTE VARIATIONS FOR NICHE
   IMPORTANT: Use the UI UX Pro Max skill's color domain data as the primary source for palette selection. Match palettes to the product type and industry using the skill's 161 color palettes database and reasoning rules. Every palette must pass WCAG AA contrast (4.5:1 for text, 3:1 for large text). Follow the 60-30-10 color distribution rule strictly.

   Provide exactly 4 full palette options. Each palette contains exactly 3 colors — no more, no less. For every color include: hex value, percentage share, a name/label, and a concrete usage description explaining WHERE and HOW it is applied in the UI.

   Format for each palette:
   - Primary: [hex] — 60% — [usage: e.g. "backgrounds, hero sections, large surface areas, page base"]
   - Secondary: [hex] — 30% — [usage: e.g. "cards, section backgrounds, containers, dividers"]
   - Accent: [hex] — 10% — [usage: e.g. "CTA buttons, hover states, highlights, active links, badges"]
   - Mood: [one sentence describing the overall feel of this palette]
   - Why this works for the niche: [1-2 sentences]
   - WCAG contrast ratio: text-on-primary / accent-on-primary (must pass AA: 4.5:1 for normal text, 3:1 for large text)

   Selection criteria (in order):
   1. Conversion performance — Accent must be visually dominant against Primary for CTA clickability
   2. Accessibility — all text pairs must meet 4.5:1 minimum
   3. Niche fit — colors must match the industry's emotional expectations
   4. Distinctiveness — avoid generic AI palettes (no purple gradients, no default Bootstrap blue)

   NEUTRAL COLOR STRIP:
   After the 4 brand palettes, provide ONE set of 4 neutral colors that works universally across all palettes as the system's neutral scale. These are not additional palette options — they are the neutral foundation (backgrounds, text, borders, dividers) that accompanies whichever brand palette is selected. Format as a sequential strip from lightest to darkest:

   - N50: [hex] — near-white — [usage: e.g. "page background, card fill, empty states"]
   - N300: [hex] — light-medium — [usage: e.g. "borders, dividers, input backgrounds, card borders"]
   - N800: [hex] — dark — [usage: e.g. "card support backgrounds, footer areas, dark sections"]
   - N950: [hex] — near-black — [usage: e.g. "primary text, headings, icons"]
   Each neutral must be warm-toned (not cold grey) to harmonize with the niche palettes. Include WCAG contrast for N950-on-N50 (must be AAA: 7:1+).

4. TYPOGRAPHY SYSTEM
   IMPORTANT: Use the UI UX Pro Max skill's typography domain data as the primary source. Match font pairings to the product type using the skill's 57 font pairings database. Prioritize readability (min 16px body), performance (variable fonts preferred), and personality fit for the niche.

   Provide exactly 4 typography options. Each option uses a maximum of 2 fonts: one Main font and one Supportive font. If the Main font is versatile enough to handle all roles (heading + body) at different weights, the Supportive font may be omitted — in that case mark it as "None — single-font system."

   Format for each typography option:
   - Main font: [name + weights used] — used for: [hero headings, section titles, display text, primary UI labels]
   - Supportive font: [name + weights used] — used for: [body paragraphs, captions, secondary UI text, form inputs] OR "None — single-font system"
   - Mood created: [one sentence]
   - Why this suits the niche: [1-2 sentences]
   - Performance note: [variable font? approximate file size? Google Fonts or Adobe Fonts?]

   Use only fonts available on Google Fonts or Adobe Fonts.

5. HOME PAGE SECTION RECOMMENDATIONS
   Based on the niche and client goals, recommend the ideal section flow for the homepage.
   Provide 2 variations with section order and purpose of each section.

6. SECOND PAGE SECTION RECOMMENDATIONS
   Based on the niche and brand services, recommend the ideal section flow for a second key page (services, about, or portfolio).
   Provide 2 variations.

7. GRAPHIC STYLE OPTIONS
   Provide 3 graphic style directions. Each must include:
   - Style name (e.g. Neubrutalism, Dark Minimalism, Organic Modernism, Glassmorphism 2.0, Tech Spec, Editorial Bold)
   - Space usage: Air / Medium / Dense
   - Theme: Light / Dark / Mixed
   - Visual characteristics (2-3 sentences)
   - Why it fits the niche and client goals

8. MOOD AND EMOTIONAL RESPONSE
   For each of the 3 graphic style options above, define:
   - Mood (e.g. Confident, Calm, Energetic, Premium, Trustworthy)
   - Desired emotional response from the visitor
   - How the design achieves that response

9. PREMIUM NICHE REFERENCE SITES
   This is a critical section. Find 5-8 real, premium-quality websites from the SAME niche (or closely related niches) that represent the level of design quality the client should aspire to. These sites must look like they belong on Awwwards or Godly.website — not generic template sites.

   SEARCH STRATEGY (run ALL of these):
   Search: site:awwwards.com [NICHE] website
   Search: site:awwwards.com [NICHE related keywords] (e.g. for "beauty education" also search "beauty", "cosmetics", "academy", "online course", "training")
   Search: site:godly.website [NICHE]
   Search: site:godly.website [NICHE related keywords]
   Search: best [NICHE] website design award winning
   Search: [NICHE] website inspiration premium design
   Search: site:siteinspire.com [NICHE]
   Search: site:bestwebsite.gallery [NICHE]
   Search: site:httpster.net [NICHE]
   Search: site:cssdesignawards.com [NICHE]

   For each site found, provide:
   - Site name
   - URL (must be real and verified — NEVER fabricate)
   - Source where found (Awwwards, Godly, CSS Design Awards, etc.)
   - Why it is premium (1 sentence — what makes it stand out: animation quality, typography, layout, photography, UX flow)
   - Design system match (1 sentence — how it aligns with the recommended graphic style, color direction, or animation approach from this brief)
   - Screenshot-worthy section (which specific section/page is most relevant as inspiration for Peter's project)

   QUALITY FILTER — only include sites that meet ALL of these:
   - Real, live website (not a Dribbble shot or Behance concept)
   - Professional/premium visual quality (would not look out of place on Awwwards)
   - Same niche OR closely adjacent niche
   - Has meaningful design decisions (not a generic WordPress/Squarespace template)

   CATEGORIZE the sites into:
   A. EXACT NICHE MATCH (same industry)
   B. ADJACENT NICHE — SIMILAR AUDIENCE
   C. ADJACENT NICHE — SIMILAR GOAL

   Minimum: 2 sites per category (6 total). Aim for 8+.

10. ANIMATION RESEARCH (GSAP-FOCUSED)
   Role: Senior creative director and GSAP animation strategist.
   Inspiration sources: https://www.awwwards.com/ and https://godly.website/
   Rules:
   - Never suggest the same animation mechanic twice
   - Never give generic descriptions
   - Always tie WHY to the design system values
   - Never fabricate URLs
   - Provide implementation-ready descriptions

   For each of the following section types, provide 3 numbered animation concepts:
   Each concept must have exactly these 5 labeled fields:
   ANIMATION NAME: [name]
   TYPE: [Scroll / Hover / Click / Preloader / Zoom-on-scroll / Micro-interaction]
   DESCRIPTION: [Precise, implementation-ready description — what moves, how, direction, timing]
   WHY: [Why this serves the design system and user experience]
   REFERENCE SITE: [Real site name only — no fabricated URLs]

   Animation sections to cover:
   - Hero Section
   - Navigation
   - Cards / Grid Items
   - CTA Buttons
   - Section Transitions
   - Text Reveals
   - Preloader (last)

11. SAMPLE UI COMPONENTS
   Using the color palettes and typography options researched above, describe 4 sample UI components. Base them on Palette Option 1 and Typography Option 1 as the default. These descriptions must be precise enough for a developer to implement directly in CSS/Webflow.

   For each component provide: element name, purpose, exact hex values used, font name and weight, font size, spacing (padding), border radius, and any interaction state (hover/active). Use this exact format:

   COMPONENT: [name]
   PURPOSE: [what this element does in the UI]
   BACKGROUND: [hex]
   TEXT COLOR: [hex]
   FONT: [name, weight, size]
   PADDING: [top/bottom px × left/right px]
   BORDER RADIUS: [px]
   BORDER: [hex or none]
   HOVER STATE: [color change, transform, or transition description]
   NOTES: [any additional Webflow-specific implementation note]

   Components to cover:
   a. PRIMARY CTA BUTTON — the main call-to-action (uses Accent color)
   b. SECONDARY BUTTON — ghost/outline variant (uses Primary or Secondary color)
   c. CONTENT CARD — a card with title, body text, and a link or button (uses Secondary color as background)
   d. NAVIGATION BAR — top nav with logo placeholder, links, and CTA button (uses Primary or a contrasting surface color)

OUTPUT FORMAT:
Structure all output under clear section headers. Use this exact format for each topic:

---
## [TOPIC NAME]

### Variation 1
[Content]

### Variation 2
[Content]

### Variation 3 (if applicable)
[Content]
---

End your response with the tag: [AGENT-1-COMPLETE]
```

Wait for Agent 1 to complete and capture its full output.

---

## STEP 2 — AGENT 2: Curator Agent

Spawn a second general-purpose subagent with the following full prompt (inject Agent 1's output as [AGENT_1_OUTPUT]):

```
You are a senior design strategist and creative director. Your job is to review comprehensive design research and select the single best option for each category based on strategic fit.

INPUT FROM RESEARCH AGENT:
[AGENT_1_OUTPUT]

ORIGINAL BRIEF:
- Niche: [INSERT NICHE]
- Client goals: [INSERT CLIENT GOALS]
- Animation style preference: [INSERT ANIMATION STYLE]
- Brand services: [INSERT BRAND SERVICES]

YOUR TASK: Review all variations from the research and select the strongest option for each category. Justify every single selection in 1-2 sentences — explain WHY it is the best fit for this specific niche and client goals.

OUTPUT — THE CURATED BRIEF:

Produce a clean, structured design brief with these exact sections:

---
# CURATED DESIGN BRIEF
## Niche: [niche]
## Client Goals: [goals]

---
### 1. WINNING DESIGN TREND
[Selected trend + why]

### 2. COLOR PALETTES (4 Options — ranked by performance fit)
Each palette contains exactly 3 colors. For each of the 4 palettes include:

Primary: [hex] — 60% — [usage description: where and how this color appears in the UI]
Secondary: [hex] — 30% — [usage description: where and how this color appears in the UI]
Accent: [hex] — 10% — [usage description: where and how this color appears in the UI]
Mood: [one sentence]
WCAG contrast: [text-on-primary ratio] / [accent-on-primary ratio]
Why selected: [1-2 sentences]
Rank: [1-4, where 1 = strongest recommendation]

### 2b. NEUTRAL COLOR STRIP (1 universal set — carry through from Agent 1 research)
Present the single neutral scale exactly as researched. Include all 4 neutrals with hex, label, and usage. This section appears once — it applies to all palette options.

N50: [hex] — [usage]
N300: [hex] — [usage]
N800: [hex] — [usage]
N950: [hex] — [usage]
WCAG N950-on-N50: [ratio] (must be 7:1+ AAA)

### 3. TYPOGRAPHY SYSTEM (4 Options — ranked by niche fit)
Each option uses a maximum of 2 fonts. For each of the 4 options include:

Main font: [name + weights] — used for: [headings, display, hero text, primary labels]
Supportive font: [name + weights] — used for: [body, captions, secondary UI] OR "None — single-font system"
Mood created: [one sentence]
Performance: [variable font? Google Fonts or Adobe Fonts? file size note]
Why selected: [1-2 sentences]
Rank: [1-4, where 1 = strongest recommendation]

### 4. HOME PAGE SECTIONS
[Ordered section list with purpose of each]
Why this flow: [1-2 sentences]

### 5. SECOND PAGE SECTIONS
[Ordered section list with purpose of each]
Why this flow: [1-2 sentences]

### 6. GRAPHIC STYLE
Style name: [name]
Space usage: [Air / Medium / Dense]
Theme: [Light / Dark / Mixed]
Visual characteristics: [2-3 sentences]
Why selected: [1-2 sentences]

### 7. MOOD & EMOTIONAL RESPONSE
Mood: [word or short phrase]
Desired visitor feeling: [one sentence]
How design achieves it: [one sentence]

### 8. PREMIUM REFERENCE SITES (ranked by relevance)
Select the top 5-8 sites from the research. For each, include:
Site name: [name]
URL: [verified URL]
Found on: [Awwwards / Godly / CSS Design Awards / etc.]
Category: [Exact Niche / Adjacent — Similar Audience / Adjacent — Similar Goal]
Why premium: [1 sentence]
Design system match: [1 sentence — how it connects to THIS brief's recommended style, colors, or animation direction]
Key inspiration: [which specific section or design decision Peter should study]
Rank: [1 = most relevant to this project]

IMPORTANT: Rank sites by how useful they are as direct inspiration for THIS specific project — not just by general design quality.

### 9. ANIMATION DIRECTION
[For each section type, list the single selected animation concept with all 5 fields: ANIMATION NAME, TYPE, DESCRIPTION, WHY, REFERENCE SITE]

### 10. SAMPLE UI COMPONENTS
Select the strongest palette (Rank 1) and strongest typography option (Rank 1) and present the 4 sample UI components with all fields exactly as researched by Agent 1. If adjustments are needed to better match the selected graphic style or mood, update the hex values and notes accordingly — but keep all fields intact.

Components:
a. PRIMARY CTA BUTTON
b. SECONDARY BUTTON
c. CONTENT CARD
d. NAVIGATION BAR

---

End your response with the tag: [AGENT-2-COMPLETE]
```

Wait for Agent 2 to complete and capture its full output.

---

## STEP 3 — AGENT 3: PDF + Email Agent

Spawn a third general-purpose subagent with the following full prompt (inject Agent 2's output as [CURATED_BRIEF], and inject the niche and client name as [NICHE] and [CLIENT]):

```
You are a visual document creator and file manager. Your job is to produce a designed PDF brief and save a Gmail draft.

CURATED BRIEF DATA:
[CURATED_BRIEF]

NICHE: [INSERT NICHE]
CLIENT: [INSERT CLIENT NAME — use "Unknown" if not provided]

---

TASK A — CREATE A VISUALLY DESIGNED PDF:

Generate a self-contained HTML file and convert it to PDF using weasyprint. The PDF must render all sections visually — not as plain text tables.

STEP A1 — SETUP:
```bash
pip install weasyprint --break-system-packages
mkdir -p "/sessions/loving-gallant-mendel/mnt/Design Researcher/Clients/[NICHE] — [CLIENT]"
```

STEP A2 — BUILD THE HTML FILE:
Write a Python script that generates an HTML string and saves it as a .html file, then converts it to PDF with weasyprint. The HTML must use embedded CSS (no external files). Use the Google Fonts import for the document typography: Cormorant Garamond (for headings) and DM Sans (for body), loaded via @import in the <style> block.

DOCUMENT STRUCTURE — implement all sections in this order:

PAGE SETUP (apply to all pages):
- Page size: A4
- Margins: 48px top/bottom, 56px left/right
- Background: #FAFAFA
- Body font: DM Sans, 14px, line-height 1.6, color #1A1A1A
- Heading font: Cormorant Garamond

COVER SECTION (first visual block, not a page break):
- Large heading (48px Cormorant Garamond 600): "Design Research Brief"
- Sub-heading (18px DM Sans 400): "[NICHE] — [CLIENT]"
- Thin horizontal rule in the Rank 1 accent color
- Date: "May 2026" right-aligned

SECTION 1 — WINNING DESIGN TREND:
- Section label in small caps (DM Sans 500, 11px, letter-spacing 0.1em, accent color): "01 — WINNING TREND"
- Trend name as H2 (Cormorant Garamond 600, 28px)
- Why paragraph (DM Sans 400, 14px)

SECTION 2 — COLOR PALETTES:
This section MUST be visual. For each of the 4 palettes render:
- Palette rank badge (small rounded pill: "RANK 1 — RECOMMENDED" or "RANK 2" etc.) using accent color for Rank 1, grey for others
- Palette name as H3 (Cormorant Garamond 600, 22px)
- A horizontal swatch row containing exactly 3 color chips side by side:
  Each chip is a div with:
    - width: 100% of its column (use CSS grid: grid-template-columns: 1fr 1fr 1fr)
    - height: 80px
    - background: [the color hex]
    - Below the chip: hex value in monospace (13px), percentage label (DM Sans 500 12px), usage note (DM Sans 400 12px, grey)
- Below the swatches: Mood, WCAG contrast, Why — as regular paragraph text
- Rank 1 palette: add a subtle left border (4px solid accent color) to the whole palette block

SECTION 2b — NEUTRAL COLOR STRIP:
- Section label: "NEUTRAL SCALE"
- One horizontal row of exactly 4 color chips side by side (grid-template-columns: 1fr 1fr 1fr 1fr)
  Each chip: height 64px, background [neutral hex], below: label (N50/N300/N800/N950), hex, usage note
- WCAG note below the strip

SECTION 3 — TYPOGRAPHY:
- For each of the 4 options, render a visual type specimen block:
  - Rank badge
  - System name as H3
  - A specimen div showing:
    - One line of large display text (36px, Main font, weight 700): "The Art of Perfect Nails" (or similar short phrase relevant to the niche)
    - One line of body text (15px, Supportive font or Main at 400): "Professional courses for beginners and semi-beginners — learn from the best."
    - One button-style label (Main or Supportive at 600, 12px uppercase): "ENROLL NOW →"
  - Below specimen: font name, weights, roles, mood, performance note

SECTION 4 — HOME PAGE SECTIONS:
- Section label: "04 — HOME PAGE FLOW"
- Render as a vertical numbered list of section cards. Each card:
  - Left: large step number (Cormorant Garamond 600, 40px, accent color, low opacity 0.2)
  - Right: section name (DM Sans 600, 15px) + purpose (DM Sans 400, 13px, grey)
  - Light bottom border between cards
- Why this flow: paragraph below

SECTION 5 — COURSES PAGE SECTIONS:
- Same visual treatment as Section 4, labeled "05 — COURSES PAGE FLOW"

SECTION 6 — GRAPHIC STYLE:
- Three style pills in a row (chosen style highlighted in accent color, others in grey border)
- Selected style: name, space usage badge, theme badge
- Visual characteristics and Why as paragraphs

SECTION 7 — MOOD & EMOTIONAL RESPONSE:
- Large mood word (Cormorant Garamond 600, 40px, accent color)
- Desired visitor feeling as italicised quote
- How design achieves it as paragraph

SECTION 8 — REFERENCE SITES:
- Each site as a card row: rank number | site name (DM Sans 600) | category pill | URL as styled link | why premium + design system match + key inspiration
- Alternate row background: #F5F5F5 and #FFFFFF for scannability
- Category pills: Exact Niche = accent color bg; Adjacent Audience = warm grey; Adjacent Goal = light stroke

SECTION 9 — ANIMATION DIRECTION:
- Each section type as a collapsible-style card (visually distinct header bar in light accent tint)
- Inside: ANIMATION NAME (DM Sans 700, 14px), TYPE pill, DESCRIPTION, WHY, REFERENCE SITE
- Use a left-colored border (3px solid accent) on each card

SECTION 10 — UI COMPONENTS (MUST BE VISUAL):
This section MUST render the 4 components as actual CSS-styled elements — not text descriptions. The components must look like real UI.

PRIMARY CTA BUTTON:
Render an actual HTML button element styled exactly to the spec:
- background: [Rank 1 Accent hex]
- color: #FFFFFF
- font: DM Sans 600 15px uppercase letter-spacing 0.04em
- padding: 14px 32px
- border-radius: 4px
- border: none
- Label: "ENROLL NOW →"
- Below: small label "Primary CTA Button" (grey, 11px)
Show it twice: normal state and a "hover" simulation (slightly darker bg, small translateY shadow).

SECONDARY BUTTON:
Render an actual HTML button with ghost/outline styling:
- background: transparent
- border: 2px solid [Rank 1 Accent hex]
- color: [Rank 1 Accent hex]
- same font and padding as primary
- Label: "LEARN MORE"
- Below: small label "Secondary Button — Ghost Variant"

CONTENT CARD:
Render a full card component (not just a box):
- background: [Rank 1 Secondary hex]
- border-radius: 6px
- box-shadow: 0 2px 8px rgba(0,0,0,0.08)
- padding: 28px 24px
- Inside: a level badge pill (accent color), a card title (Cormorant Garamond 600 22px), 2 lines of body copy (DM Sans 400 15px), a text link "View Course →" (accent color)
- Below card: label "Content Card — Course / Product"

NAVIGATION BAR:
Render a full-width nav bar:
- height: 60px
- background: [Rank 1 Primary hex] with a subtle bottom border
- Inside (flex, space-between): left = logo text (Cormorant Garamond 600 18px "[Client]"), center = 3 nav links (DM Sans 500 14px), right = mini CTA button (same styling as primary but compact: 10px 20px padding)
- Below: label "Navigation Bar — Scroll-compressed state"

Layout for Section 10: arrange all 4 components on the page with generous whitespace between them. Add a section intro: "All components use Rank 1 palette and typography. Sizes are representative — implement exact specs from the brief."

FOOTER:
- Thin rule in accent color
- "Brief generated by DE RES — 3-Agent Research Workflow" (DM Sans 400 12px, grey)
- Right-aligned: "[NICHE] — [CLIENT] — May 2026"

STEP A3 — CONVERT TO PDF:
```python
from weasyprint import HTML
HTML(filename='brief.html').write_pdf('output.pdf')
```

Save the final PDF to:
/sessions/loving-gallant-mendel/mnt/Design Researcher/Clients/[NICHE] — [CLIENT]/Design Research Brief — [NICHE] — [CLIENT].pdf

File name: "Design Research Brief — [NICHE] — [CLIENT].pdf"

After saving, output the computer:// link:
[View Design Research Brief](computer://C:\Users\peter\Downloads\CLAUDE\projects\Design Researcher\Clients\[NICHE] — [CLIENT]\Design Research Brief — [NICHE] — [CLIENT].pdf)

---

TASK B — GMAIL DRAFT (MANDATORY):
The brief MUST land in Peter's Gmail drafts. This is non-negotiable. No fallback to chat output.

METHOD 1 — Gmail MCP (try first):
Use ToolSearch with query "gmail" or "email" to find the connected Gmail MCP tool. Look for tools named mcp__*__create_draft, mcp__*__send_email, or mcp__*__compose. Call with:
- TO: peter.fedotovskii.upwork@gmail.com
- SUBJECT: Design Research Brief — [NICHE] — [CLIENT]
- BODY: Full curated brief as clean HTML. Section headers as <h2>. Color hex values as <span style="display:inline-block;width:14px;height:14px;background:[hex];border-radius:2px;vertical-align:middle;margin-right:4px;"></span>[hex]. Reference site URLs as clickable <a href="..."> links. Component specs in <pre> monospace blocks.
If this succeeds, confirm and stop.

METHOD 2 — Claude in Chrome (fallback):
Use ToolSearch with query "chrome" to load browser tools. Then:
1. Navigate to https://mail.google.com
2. Click Compose
3. Fill TO: peter.fedotovskii.upwork@gmail.com
4. Fill SUBJECT: Design Research Brief — [NICHE] — [CLIENT]
5. Paste the full formatted brief into the body
6. Click "Save Draft" — DO NOT send
7. Confirm the draft appears in Drafts folder

FAILURE PROTOCOL:
If both methods fail, report exactly what failed and why before outputting anything in chat.

End your response with the tag: [AGENT-3-COMPLETE]
```

---

## STEP 4 — Confirm Completion

After all three agents complete, report to the user:

"Research workflow complete. Agent 1 researched, Agent 2 curated, Agent 3 saved the visual PDF brief to Clients/[NICHE] — [CLIENT]/ and created a Gmail draft at peter.fedotovskii.upwork@gmail.com — check your Drafts folder."

Provide the direct computer:// link to the PDF file.

If the Gmail draft could not be created by either method, report exactly what failed before presenting the brief in chat.

---

## RULES FOR THIS SKILL

- Never skip a topic from the research list
- Never produce generic or AI-slop outputs — every selection must be justified against the specific niche
- Animations must be GSAP-implementable in Webflow
- Colors must not use purple gradients or generic AI palettes
- Fonts must be real and available (Google Fonts / Adobe Fonts)
- Reference sites must be real (Awwwards, Godly, etc.) — never fabricate URLs
- Always run agents sequentially: 1 → 2 → 3
- Agent 2 must receive Agent 1's complete output before starting
- Agent 3 must receive Agent 2's complete output before starting
- Always provide exactly 4 color palette options — each palette contains exactly 3 colors (Primary 60%, Secondary 30%, Accent 10%) with usage descriptions for every color
- Always research and include ONE neutral color strip of 4 neutrals (N50, N300, N800, N950) — warm-toned, works across all palettes, N950-on-N50 must be 7:1+ AAA
- Always provide exactly 4 typography options — each option uses a maximum of 2 fonts (Main + Supportive); Supportive may be omitted if not needed, marked as "None — single-font system"
- Always include sample UI components: Primary CTA Button, Secondary Button, Content Card, Navigation Bar — rendered visually as actual CSS-styled HTML elements in the PDF, NOT as text specs
- Always read the UI UX Pro Max skill (ui-ux-pro-max/SKILL.md) before selecting colors and fonts — use its color domain (161 palettes), typography domain (57 pairings), and product type reasoning rules to make data-backed selections
- Always search Godly.website (https://godly.website/) for niche-specific design inspiration — include at least 1 real reference from Godly in the niche trends section
- All color selections must pass WCAG AA contrast requirements (4.5:1 for normal text, 3:1 for large text)
- Accent color is the primary CTA color — must be selected for maximum conversion contrast against the Primary (background) color
- ALWAYS save the final brief as a Gmail draft at peter.fedotovskii.upwork@gmail.com — this is mandatory and non-negotiable. Try Gmail MCP first, then Claude in Chrome browser tools. Never skip this step and never silently fall back to chat output. If both methods fail, report what failed explicitly before outputting in chat.
- Always output the brief as a visually designed PDF (HTML→weasyprint) — NOT a .docx file. The PDF must render color palettes as visual swatches, neutral scale as a visual strip, typography as rendered type specimens, and UI components as actual styled elements
- Always save the PDF inside a newly created folder at Clients/[NICHE] — [CLIENT]/ — never save to the root Clients folder
- Folder name format: "[NICHE] — [CLIENT]" (e.g. "Beauty Education — Felena")
- File name format: "Design Research Brief — [NICHE] — [CLIENT].pdf"
- Always include 5-8 premium niche reference sites in the brief — sourced from Awwwards, Godly.website, SiteInspire, CSS Design Awards, BestWebsite.Gallery, and Httpster
- Reference sites must be REAL and LIVE — never fabricate URLs. If a search returns no results from one source, skip it and try the next source
- Reference sites must be categorized into: Exact Niche Match, Adjacent (Similar Audience), Adjacent (Similar Goal) — minimum 2 per category
- Reference sites must be ranked by relevance to THIS specific project, not by general design quality
- Each reference site must include a "design system match" note explaining how it connects to the recommended style/colors/animations in the brief
- The email must include the reference sites section with clickable links so Peter can open them directly

[INIT-RESEARCH-SKILL-ACTIVE]
