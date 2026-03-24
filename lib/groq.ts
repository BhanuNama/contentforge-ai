import Groq from "groq-sdk";
import { withRetry } from "./utils";

export const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function callGroq(
  systemPrompt: string,
  userMessage: string,
  options: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
    responseFormat?: "json" | "text";
  } = {}
): Promise<string> {
  const {
    model = "llama-3.3-70b-versatile",
    temperature = 0.7,
    maxTokens = 2048,
    responseFormat = "text",
  } = options;

  return withRetry(async () => {
    const completion = await groq.chat.completions.create({
      model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
      temperature,
      max_tokens: maxTokens,
      ...(responseFormat === "json" && {
        response_format: { type: "json_object" },
      }),
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) throw new Error("Empty response from Groq");
    return content;
  }, 3, 1500);
}

export const MODELS = {
  ORCHESTRATOR: "llama-3.3-70b-versatile",
  ANALYST: "llama-3.3-70b-versatile",
  PLATFORM: "llama-3.3-70b-versatile",
  CRITIC: "llama-3.1-8b-instant",
  VOICE: "llama-3.3-70b-versatile",
} as const;
