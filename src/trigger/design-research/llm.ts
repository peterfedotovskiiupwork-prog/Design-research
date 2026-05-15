import { GoogleGenAI } from "@google/genai";

const PRIMARY = "gemma-4-31b-it";
const FALLBACK = "gemma-4-26b-a4b-it";

export function createAI() {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("GEMINI_API_KEY is not set");
  return new GoogleGenAI({ apiKey: key });
}

export async function callGemma(
  ai: GoogleGenAI,
  systemPrompt: string,
  userPrompt: string,
  maxOutputTokens = 48000
) {
  const models = [PRIMARY, FALLBACK];

  for (let i = 0; i < models.length; i++) {
    try {
      const response = await ai.models.generateContent({
        model: models[i],
        contents: userPrompt,
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.5,
          maxOutputTokens,
        },
      });
      return response.text ?? "";
    } catch (err: any) {
      const is500 =
        err?.message?.includes("500") ||
        err?.message?.includes("INTERNAL") ||
        err?.status === 500 ||
        err?.code === 500;

      if (is500 && i < models.length - 1) {
        console.warn(`Gemma ${models[i]} returned 500, falling back to ${models[i + 1]}`);
        continue;
      }

      throw err;
    }
  }

  throw new Error("All Gemma models failed");
}
