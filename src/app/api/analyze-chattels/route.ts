import { NextRequest, NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const image = formData.get("image") as File

    if (!image) {
      return NextResponse.json(
        { error: "No image provided" },
        { status: 400 }
      )
    }

    const bytes = await image.arrayBuffer()
    const base64Image = Buffer.from(bytes).toString("base64")

    const message = await anthropic.messages.create({
      model: "claude-3-7-sonnet-20250219",
      max_tokens: 4096,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Please analyze this image and identify all chattels and furniture items. For each item, provide its name and estimate its replacement cost in GBP. Focus on significant items that would be considered in a property inventory. Format your response as a JSON array of objects, where each object has 'name', 'replacementCost' (in GBP), and 'confidence' (0-1) properties."
            },
            {
              type: "image",
              source: {
                type: "base64",
                media_type: "image/jpeg",
                data: base64Image
              }
            }
          ]
        }
      ]
    })

    const content = message.content[0]
    if (content.type !== "text") {
      throw new Error("Unexpected response type from Claude")
    }

    let items = []

    try {
      // Extract JSON from the response
      const jsonMatch = content.text.match(/\{[\s\S]*\}|\[[\s\S]*\]/)
      if (jsonMatch) {
        items = JSON.parse(jsonMatch[0])
      }
    } catch (error) {
      console.error("Error parsing Claude's response:", error)
      return NextResponse.json(
        { error: "Failed to parse analysis results" },
        { status: 500 }
      )
    }

    return NextResponse.json({ items })
  } catch (error) {
    console.error("Error analyzing image:", error)
    return NextResponse.json(
      { error: "Failed to analyze image" },
      { status: 500 }
    )
  }
}

export const runtime = "nodejs" 