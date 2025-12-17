import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

type ChattelItem = {
  name: string;
  replacementCost: number;
  confidence: number; // 0–1
};

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const image = formData.get("image") as File | null;

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    // --- No-cost stub: exit BEFORE any SDK import/calls ---
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        items: [] as ChattelItem[],
        notes:
          "AI analyser not configured (missing ANTHROPIC_API_KEY). Placeholder result for testing."
      });
    }
    // ------------------------------------------------------

    // Only read bytes and import SDK if we actually have a key
    const bytes = await image.arrayBuffer();
    const base64Image = Buffer.from(bytes).toString("base64");

    // Lazy import Anthropic so there’s zero SDK initialisation without a key
    const { default: Anthropic } = await import("@anthropic-ai/sdk");
    const anthropic = new Anthropic({ apiKey });

    const message = await anthropic.messages.create({
      model: "claude-3-7-sonnet-20250219",
      max_tokens: 4096,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text:
                "Please analyze this image and identify all chattels and furniture items. For each item, provide its name and estimate its replacement cost in GBP. Focus on significant items that would be considered in a property inventory. Format your response as a JSON array of objects, where each object has 'name', 'replacementCost' (in GBP), and 'confidence' (0-1) properties."
            },
            {
              type: "image",
              source: {
                type: "base64",
                media_type:
                  (image.type as "image/jpeg" | "image/png" | "image/webp" | "image/gif") ||
                  "image/jpeg",
                data: base64Image
              }
            }
          ]
        }
      ]
    });

    const first = message.content[0];
    if (first.type !== "text") {
      throw new Error("Unexpected response type from Claude");
    }

    let items: ChattelItem[] = [];

    try {
      // Extract JSON array/object from free-form text
      const jsonMatch = first.text.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        items = Array.isArray(parsed) ? parsed : (parsed.items as ChattelItem[] | undefined) ?? [];
      }
    } catch (err) {
      console.error("Error parsing Claude's response:", err);
      return NextResponse.json(
        { error: "Failed to parse analysis results" },
        { status: 500 }
      );
    }

    return NextResponse.json({ items });
  } catch (error) {
    console.error("Error analyzing image:", error);
    return NextResponse.json(
      { error: "Failed to analyze image" },
      { status: 500 }
    );
  }
}
