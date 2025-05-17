import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: NextRequest) {
  const { message } = await req.json();

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: message }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return NextResponse.json({ reply: response.data.choices[0].message.content });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to get response from OpenAI" }, { status: 500 });
  }
}
