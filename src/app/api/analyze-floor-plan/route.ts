import { NextRequest, NextResponse } from 'next/server';
import { Anthropic } from '@anthropic-ai/sdk';

// Specify Node.js runtime for this API route
export const runtime = 'nodejs';

// Used in response typing
interface ErrorResponse {
  error: string;
}

// Supported image types by Claude API
type SupportedImageType = 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp';

const SUPPORTED_IMAGE_TYPES: SupportedImageType[] = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp'
];

// Set a longer timeout for this API route
export const maxDuration = 60; // 60 seconds

export async function POST(request: NextRequest) {
  try {
    // Get the image data from the request
    const formData = await request.formData();
    const image = formData.get('image') as File;

    if (!image) {
      return NextResponse.json(
        { error: 'No image provided' } as ErrorResponse,
        { status: 400 }
      );
    }

    // Validate image type
    if (!SUPPORTED_IMAGE_TYPES.includes(image.type as SupportedImageType)) {
      return NextResponse.json(
        { error: `Invalid file type. Supported formats are: ${SUPPORTED_IMAGE_TYPES.join(', ')}` } as ErrorResponse,
        { status: 400 }
      );
    }

    const bytes = await image.arrayBuffer();
    const base64Image = Buffer.from(bytes).toString('base64');

    // Get API key from server environment
    const apiKey = process.env.ANTHROPIC_API_KEY;

    // ===== No-cost stub: allow full pipeline without a key =====
    if (!apiKey) {
      return NextResponse.json({
        rooms: [],
        totalArea: 0,
        notes: 'AI analyser not configured (missing ANTHROPIC_API_KEY). Placeholder result for testing.'
      });
    }
    // ===========================================================

    // Initialize Anthropic client
    const anthropic = new Anthropic({ apiKey });

    try {
      // Call Claude API
      const message = await anthropic.messages.create({
        model: 'claude-3-7-sonnet-20250219',
        max_tokens: 4096,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text:
                  'Analyze this floor plan image in detail. Please identify all rooms, their dimensions (in feet), area (in square feet), and any notable features. If this appears to be a screenshot or not an actual floor plan, respond with a JSON object: {"error": "The provided image does not appear to be a floor plan. Please upload an architectural floor plan image."}. Otherwise format the response as JSON with the following structure: { rooms: [{ name: string, dimensions: string, area: number, features: string[] }], totalArea: number, notes: string }. Don\'t include any explanatory text, just the JSON.'
              },
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: image.type as SupportedImageType,
                  data: base64Image
                }
              }
            ]
          }
        ]
      });

      // Parse response text
      const responseText =
        message.content[0].type === 'text' ? message.content[0].text : '';

      if (!responseText) {
        return NextResponse.json(
          { error: 'Empty response from Claude API' } as ErrorResponse,
          { status: 500 }
        );
      }

      // Log first 100 chars of response for debugging
      console.log(
        'Claude API response (first 100 chars):',
        responseText.substring(0, 100)
      );

      try {
        const jsonResponse = JSON.parse(responseText);
        return NextResponse.json(jsonResponse);
      } catch (error: unknown) {
        console.error('Failed to parse API response:', error);
        console.error('Raw response content:', responseText.substring(0, 200));

        // Return a valid JSON response even when parsing fails
        return NextResponse.json(
          {
            error: 'Failed to parse Claude API response',
            rawResponsePreview: responseText.substring(0, 100)
          } as ErrorResponse & { rawResponsePreview: string },
          { status: 500 }
        );
      }
    } catch (claudeError: unknown) {
      console.error('Claude API error:', claudeError);

      // Format Claude-specific errors
      const errorMessage =
        claudeError instanceof Error
          ? claudeError.message
          : 'Error communicating with Claude API';

      return NextResponse.json(
        { error: errorMessage } as ErrorResponse,
        { status: 500 }
      );
    }
  } catch (error: unknown) {
    console.error('Error analyzing floor plan:', error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : 'An error occurred while analyzing the floor plan';

    return NextResponse.json(
      { error: errorMessage } as ErrorResponse,
      { status: 500 }
    );
  }
}
