import { task } from "@trigger.dev/sdk";
import { GoogleGenAI } from "@google/genai";
import puppeteer from "puppeteer";
import nodemailer from "nodemailer";
import fs from "fs/promises";
import path from "path";
import type { ResearchInput } from "./types.js";

const gemmaModel = "gemma-4-31b-it";
const OUTPUT_DIR = path.join(process.cwd(), "out");

function validateEnv() {
  const geminiKey = process.env.GEMINI_API_KEY;
  const gmailUser = process.env.GMAIL_USER;
  const gmailPass = process.env.GMAIL_APP_PASSWORD;
  if (!geminiKey) throw new Error("GEMINI_API_KEY is not set");
  if (!gmailUser) throw new Error("GMAIL_USER is not set");
  if (!gmailPass) throw new Error("GMAIL_APP_PASSWORD is not set");
  return { geminiKey, gmailUser, gmailPass };
}

async function callGemma(ai: GoogleGenAI, systemPrompt: string, userPrompt: string, maxTokens = 64000) {
  const response = await ai.models.generateContent({
    model: gemmaModel,
    contents: userPrompt,
    config: {
      systemInstruction: systemPrompt,
      temperature: 0.6,
      maxOutputTokens: maxTokens,
    },
  });
  return response.text ?? "";
}

async function generateHtml(ai: GoogleGenAI, curatedBrief: string, input: ResearchInput): Promise<string> {
  const systemPrompt = `You are a visual design document creator. You create beautiful, self-contained HTML documents for premium design research briefs. Your HTML must use embedded CSS only — no external files. Load Cormorant Garamond (headings) and DM Sans (body) via Google Fonts @import.

The document will be converted to A4 PDF via Puppeteer. Every visual element (color swatches, type specimens, UI components) must be rendered as actual styled HTML elements — not text descriptions. This is a VISUAL document meant to impress clients.`;

  const userPrompt = `Create a complete, self-contained HTML document for a Design Research Brief PDF. This is a VISUAL document for a premium web design client. Make it look like it belongs on Awwwards — clean, sophisticated, editorial.

CLIENT: ${input.clientName}
NICHE: ${input.niche}

CURATED BRIEF DATA:
${curatedBrief}

EXACT LAYOUT REQUIREMENTS:

PAGE SETUP:
- Font import: Cormorant Garamond 300/400/500/600/700 + DM Sans 400/500/600/700 via @import
- Page background: #FAFAFA
- Body font: DM Sans 14px, line-height 1.6, color #1A1A1A
- Heading font: Cormorant Garamond
- Margins simulate A4: use padding 48px top/bottom, 56px left/right on the main container
- Max-width: 720px, centered

COVER SECTION (first block, no page-break):
- Small label top-left: "DE RES — 3-AGENT RESEARCH WORKFLOW" — DM Sans 400 10px, letter-spacing 0.15em, color: #B0A8A0
- Large heading: "Design Research Brief" — Cormorant Garamond 600 48px, color #1A1A1A, letter-spacing -0.02em
- Sub-heading: "[NICHE]" in DM Sans 400 18px, color #666
- Client line: "Client: ${input.clientName}" in DM Sans 400 14px, color #888
- Thin horizontal rule in accent color (find accent in the curated brief RANK 1 palette)
- Date: "May 2026" right-aligned, DM Sans 400 14px, color #999

SECTION LABELS (consistent across all sections):
- Each section starts with a label: DM Sans 500 11px, letter-spacing 0.1em, text-transform uppercase, color: the accent color from Rank 1 palette
- Format: "0X — SECTION NAME" (e.g. "01 — WINNING DESIGN TREND")
- Followed by a horizontal rule in accent color (thin, 1px)
- Then the section content

SECTION 01 — WINNING DESIGN TREND:
- Trend name as H2: Cormorant Garamond 600 28px
- Why paragraph: DM Sans 400 15px, line-height 1.7
- Subtle left border: 3px solid accent color

SECTION 02 — COLOR PALETTES (4 Options):
For each palette, render a visual block:
- Rank badge: a small rounded pill — "RANK 1 — RECOMMENDED" in white text on accent bg (for Rank 1) OR "RANK 2" / "RANK 3" / "RANK 4" in grey text on light grey bg
- Palette name as H3: Cormorant Garamond 600 22px
- Color swatch row: CSS grid with 3 columns, each column:
  - Color chip: 80px height, background: the hex value
  - Below chip: hex in monospace 13px (Courier New or DM Sans Mono), then percentage label (DM Sans 500 11px), then usage note (DM Sans 400 11px, #888)
- Below swatches: Mood paragraph, WCAG line, Why paragraph
- Rank 1 palette: add subtle left border (4px solid accent color) to the whole block

SECTION 02B — NEUTRAL COLOR SCALE:
- Label: "NEUTRAL SCALE" as H3
- One horizontal row of 4 color chips side by side (CSS grid 1fr 1fr 1fr 1fr)
- Each chip: 64px height, background: the neutral hex
- Below chip: label (N50/N300/N800/N950) in DM Sans 500 12px, hex in monospace 12px, usage note in DM Sans 400 11px #888
- WCAG note below: "WCAG N950 on N50: X.X:1 AAA" in DM Sans 400 13px #666

SECTION 03 — TYPOGRAPHY (4 Options):
For each typography option, render a type specimen block:
- Rank badge (same pill style as colors)
- System name as H3
- A specimen card with light grey bg (#F5F5F5), padding 28px, border-radius 6px:
  - One line of large display text (36px, the Main font at 700): "The Art of Perfect [Niche]" — pick a phrase relevant to the niche
  - One line of body text (15px, the Supportive font or Main at 400): "Professional courses for beginners and semi-beginners — learn from the best."
  - One button-style label (Main or Supportive at 600, 12px uppercase, letter-spacing 0.04em): "ENROLL NOW →" in accent color
- Below specimen card: font name and weights used, usage roles, mood sentence, performance note

SECTION 04 — HOME PAGE FLOW:
- Render as a vertical list of section cards. Each card:
  - Flex layout: left column has a large step number (Cormorant Garamond 600 40px, accent color at 0.2 opacity)
  - Right column: section name (DM Sans 600 15px) + purpose (DM Sans 400 13px, #666)
  - Light bottom border (#E8E8E8) between cards
- "Why this flow:" paragraph below the card list (DM Sans 400 14px, italic)

SECTION 05 — SECOND PAGE FLOW:
Same visual treatment as Section 04.

SECTION 06 — GRAPHIC STYLE:
- Style name as H3 (Cormorant 600 22px)
- Two small pills/badges in a row: Space usage pill (DM Sans 500 11px, accent border) and Theme pill (DM Sans 500 11px, accent border)
- Visual characteristics paragraph (DM Sans 400 15px)
- Why selected paragraph (DM Sans 400 15px)

SECTION 07 — MOOD & EMOTIONAL RESPONSE:
- Large mood word: Cormorant Garamond 600 40px, accent color
- Desired visitor feeling: italicised quote in DM Sans 400 18px, color #555
- How design achieves it: paragraph DM Sans 400 15px

SECTION 08 — PREMIUM REFERENCE SITES:
Each site as a card row with alternating backgrounds (#F5F5F5 and #FFFFFF):
- Rank number (DM Sans 600 14px, accent color for #1, grey for others)
- Site name (DM Sans 600 15px)
- Category pill: EXACT NICHE = accent color bg white text; "ADJACENT" pills = warm grey bg
- URL as styled text (DM Sans 400 12px, #999)
- Why premium + Design system match + Key inspiration each on their own line (DM Sans 400 13px, #555)

SECTION 09 — ANIMATION DIRECTION:
For each animation section type, render a card with:
- Section type header (DM Sans 600 14px, uppercase, letter-spacing 0.05em) with a left colored border (3px solid accent)
- Inside the card: ANIMATION NAME (DM Sans 700 14px) | TYPE pill (DM Sans 500 11px, light accent bg, accent text) | DESCRIPTION (DM Sans 400 13px, with GSAP code in a monospace block) | WHY (DM Sans 400 13px) | REFERENCE SITE (DM Sans 400 13px, #888)
- Light grey bg (#FAFAFA), padding 20px, border-radius 4px, margin-bottom 12px

SECTION 10 — UI COMPONENTS (MUST BE VISUAL HTML ELEMENTS):
This section MUST render the 4 components as actual styled HTML elements — not text descriptions.

PRIMARY CTA BUTTON:
Render an actual <button> element:
- background: Rank 1 Accent hex
- color: #FFFFFF
- font: DM Sans 600 13px uppercase, letter-spacing 0.04em
- padding: 14px 32px
- border-radius: 4px
- border: none
- cursor: pointer
- Label: "ENROLL NOW →"
Show it twice: normal state and hover state (slightly darker bg, shadow: 0 8px 20px rgba(accent, 0.35))
Below: small label "Primary CTA Button" (DM Sans 400 11px, #999)

SECONDARY BUTTON — GHOST VARIANT:
Render an actual <button> element:
- background: transparent
- border: 2px solid Rank 1 Accent hex
- color: Rank 1 Accent hex
- font: DM Sans 600 13px uppercase, letter-spacing 0.04em
- padding: 14px 32px
- border-radius: 4px
- cursor: pointer
- Label: "LEARN MORE"
Show default state + hover state (fill sweeps left to right with accent color, text turns white)
Below: small label "Secondary Button — Ghost Variant"

CONTENT CARD:
Render a full card component:
- background: Rank 1 Secondary hex
- border-radius: 6px
- box-shadow: 0 2px 8px rgba(0,0,0,0.08)
- padding: 28px 24px
- Inside: a level badge pill (accent bg, white text, DM Sans 500 11px uppercase, e.g. "BEGINNER"), a card title (Cormorant Garamond 600 22px), 2 lines of body copy (DM Sans 400 15px, color #4A2E38 or appropriate contrast), a text link "View Course →" in accent color
Below: label "Content Card — Course / Product"

NAVIGATION BAR:
Render a full-width nav bar:
- height: 60px
- background: Rank 1 Primary hex with subtle bottom border
- display: flex, justify-content: space-between, align-items: center
- Left: logo text (Cormorant Garamond 600 18px)
- Center: 3 nav links (DM Sans 500 14px, inline with gaps 24px)
- Right: mini CTA button (same styling as primary but compact: 10px 20px padding, 12px font)
Below: label "Navigation Bar — Scroll-compressed state"

LAYOUT FOR SECTION 10: Arrange all 4 components on the page with generous whitespace between them. Add a section intro: "All components use Rank 1 palette and typography. Sizes are representative — implement exact specs from the brief."

FOOTER:
- Thin rule in accent color
- "Brief generated by DE RES — 3-Agent Research Workflow" (DM Sans 400 12px, #999)
- Right-aligned: "[NICHE] — [CLIENT] — May 2026" (DM Sans 400 12px, #999)

CRITICAL RULES:
- Return ONLY the complete HTML document. No markdown, no explanation, no code fences.
- Start directly with <!DOCTYPE html>
- Every color must use the hex values from the curated brief — never invent colors
- Every font name must be from the curated brief — never invent fonts
- Do NOT use page-break CSS — the document should flow naturally
- Use actual HTML elements (<button>, <div>, <span>) for UI components — not CSS shapes or text descriptions
- Make the document look premium — it represents a professional design agency's output

Return ONLY the raw HTML starting with <!DOCTYPE html>.`;

  return callGemma(ai, systemPrompt, userPrompt, 64000);
}

export const agent3Output = task({
  id: "agent-3-output",
  retry: { maxAttempts: 2, factor: 2, minTimeoutInMs: 15000, maxTimeoutInMs: 120000 },
  run: async (payload: { input: ResearchInput; curatedBrief: string }): Promise<{ pdfPath: string; emailStatus: string }> => {
    const { geminiKey, gmailUser, gmailPass } = validateEnv();
    const ai = new GoogleGenAI({ apiKey: geminiKey });
    const { input, curatedBrief } = payload;

    await fs.mkdir(OUTPUT_DIR, { recursive: true });

    const html = await generateHtml(ai, curatedBrief, input);
    const htmlPath = path.join(OUTPUT_DIR, `brief-${input.niche.replace(/\s+/g, "-")}-${input.clientName.replace(/\s+/g, "-")}.html`);
    await fs.writeFile(htmlPath, html, "utf-8");

    const pdfPath = htmlPath.replace(/\.html$/, ".pdf");
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    try {
      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: "load" });
      await page.waitForSelector("body", { timeout: 10000 });
      await page.evaluate(() => document.fonts?.ready);
      await page.pdf({
        path: pdfPath,
        format: "A4",
        margin: { top: "0px", bottom: "0px", left: "0px", right: "0px" },
        printBackground: true,
        preferCSSPageSize: true,
      });
    } finally {
      await browser.close();
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: gmailUser, pass: gmailPass },
    });

    const pdfBuffer = await fs.readFile(pdfPath);

    const mailResult = await transporter.sendMail({
      from: gmailUser,
      to: gmailUser,
      subject: `Design Research Brief — ${input.niche} — ${input.clientName}`,
      text: `Design research brief for ${input.niche} — ${input.clientName} is attached. Generated by the 3-Agent Research Workflow.`,
      attachments: [
        {
          filename: `Design Research Brief — ${input.niche} — ${input.clientName}.pdf`,
          content: pdfBuffer,
        },
      ],
    });

    return {
      pdfPath,
      emailStatus: `Sent (messageId: ${mailResult.messageId})`,
    };
  },
});
