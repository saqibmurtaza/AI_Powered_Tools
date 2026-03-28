import { NextResponse } from "next/server";

type SummarizeRequest = {
  text?: string;
  context?: string;
};

function getGeminiConfig() {
  const baseUrl =
    process.env.GEMINI_BASE_URL ||
    process.env.NEXT_PUBLIC_GEMINI_BASE_URL ||
    "https://generativelanguage.googleapis.com/v1beta";
  const model =
    process.env.GEMINI_MODEL ||
    process.env.NEXT_PUBLIC_GEMINI_MODEL ||
    "gemini-1.5-flash";
  const apiKey =
    process.env.GEMINI_API_KEY ||
    process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
    "";

  return { baseUrl, model, apiKey };
}

function buildPrompt(text: string, context?: string): string {
  const baseInstruction = context?.trim()
    ? context.trim()
    : "Summarize this clearly and concisely. Focus on the most important facts, themes, and takeaways.";

  return `${baseInstruction}\n\nTEXT:\n${text}`;
}

function createFallbackSummary(text: string): string {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (!normalized) {
    return "No summary available.";
  }

  const sentences = normalized
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);

  if (sentences.length === 0) {
    return normalized.slice(0, 240);
  }

  const ranked = sentences
    .map((sentence, index) => ({
      sentence,
      index,
      score: sentence.length + (index === 0 ? 20 : 0),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, Math.min(3, sentences.length))
    .sort((a, b) => a.index - b.index)
    .map((item) => item.sentence);

  const summary = ranked.join(" ");
  return summary.length > 600 ? `${summary.slice(0, 597).trim()}...` : summary;
}

export async function POST(req: Request) {
  try {
    const { text, context }: SummarizeRequest = await req.json();

    if (!text?.trim()) {
      return NextResponse.json({ error: "No text provided" }, { status: 400 });
    }

    const { baseUrl, model, apiKey } = getGeminiConfig();
    const fallbackSummary = createFallbackSummary(text);

    if (!apiKey) {
      console.warn("Gemini summarize skipped because no API key is configured.");
      return NextResponse.json({ summary: fallbackSummary, fallback: true });
    }

    const response = await fetch(`${baseUrl}/models/${model}:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: buildPrompt(text, context) }],
          },
        ],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("Gemini API Error:", err);
      return NextResponse.json({ summary: fallbackSummary, fallback: true });
    }

    const data = await response.json();
    const summary = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    return NextResponse.json({
      summary: summary || fallbackSummary,
      fallback: !summary,
    });
  } catch (err) {
    console.error("Gemini summarize error:", err);
    return NextResponse.json({ summary: "No summary available.", fallback: true });
  }
}
