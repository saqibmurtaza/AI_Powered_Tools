import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    if (!text) {
      return NextResponse.json({ error: "No text provided" }, { status: 400 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_GEMINI_BASE_URL!;
    const model = process.env.NEXT_PUBLIC_GEMINI_MODEL!;
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY!;

    const response = await fetch(`${baseUrl}/models/${model}:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: `Summarize this clearly and concisely:\n\n${text}` }],
          },
        ],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("Gemini API Error:", err);
      return NextResponse.json({ error: "Gemini API request failed" }, { status: response.status });
    }

    const data = await response.json();
    const summary = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No summary available.";

    return NextResponse.json({ summary });
  } catch (err) {
    console.error("Gemini summarize error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
