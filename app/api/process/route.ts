import { NextRequest, NextResponse } from "next/server";
import { chatCompletion } from "@/lib/ai/openrouter";

export async function POST(request: NextRequest) {
  try {
    const { prompt, data, model, apiKey } = await request.json();

    if (!prompt || !data) {
      return NextResponse.json(
        { error: "Missing prompt or data" },
        { status: 400 }
      );
    }

    // Determine API Key: Client provided > Server Env > Fail
    const token = apiKey || process.env.OPENROUTER_API_KEY;

    if (!token) {
      return NextResponse.json(
        { error: "OpenRouter API Key not configured" },
        { status: 401 }
      );
    }

    // Construct the prompt
    const fullPrompt = `${prompt}\n\nINPUT DATA:\n${data}`;

    const response = await chatCompletion({
      config: {
        apiKey: token,
        model: model || "anthropic/claude-3-sonnet", // Default model
        temperature: 0.3,
      },
      messages: [
        { role: "system", content: "You are a helpful research assistant." },
        { role: "user", content: fullPrompt },
      ],
    });

    if (!response.success) {
      return NextResponse.json(
        { error: response.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      content: response.data,
      usage: response.usage,
    });

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
