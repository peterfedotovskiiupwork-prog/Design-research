import { GoogleGenAI } from "@google/genai";

const PRIMARY = "gemma-4-31b-it";
const FALLBACK = "gemma-4-26b-a4b-it";

export function createAI() {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("GEMINI_API_KEY is not set");
  return new GoogleGenAI({ apiKey: key });
}

function timeoutRace(ms: number): Promise<never> {
  return new Promise((_, reject) => setTimeout(() => reject(new Error(`Timed out after ${ms}ms`)), ms));
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
      const response = await Promise.race([
        ai.models.generateContent({
          model: models[i],
          contents: userPrompt,
          config: {
            systemInstruction: systemPrompt,
            temperature: 0.5,
            maxOutputTokens,
          },
        }),
        timeoutRace(300000),
      ]);
      return response.text ?? "";
    } catch (err: any) {
      const message = err?.message ?? String(err);
      const shouldFallback =
        message.includes("500") ||
        message.includes("503") ||
        message.includes("fetch failed") ||
        message.includes("INTERNAL") ||
        message.includes("UNAVAILABLE") ||
        message.includes("try again") ||
        message.includes("timed out") ||
        err?.status === 500 ||
        err?.status === 503 ||
        err?.code === 500 ||
        err?.code === 503;

      if (shouldFallback && i < models.length - 1) {
        console.warn(`Gemma ${models[i]} failed: ${message.slice(0, 120)}, falling back to ${models[i + 1]}`);
        continue;
      }

      throw err;
    }
  }

  throw new Error("All Gemma models failed");
}
