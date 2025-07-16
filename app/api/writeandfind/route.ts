import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

interface Restaurant {
    name: string;
    description: string;
    cuisine: string;
    price_range: string;
    rating: number;
    location: string;
    highlights: string[];
    dietary_options: string[];
}

export async function POST(request: Request) {
    try {
        const { customPrompt } = await request.json();

        if (!customPrompt || customPrompt.trim().length === 0) {
            return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
        }

        const apiKey = process.env.GOOGLE_AI_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: "API key not configured" }, { status: 500 });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `${customPrompt}
Format the response as a JSON array of restaurant objects with these exact fields:
{
  "name": string,
  "description": string,
  "cuisine": string,
  "price_range": string,
  "rating": number,
  "location": string,
  "highlights": string[],
  "dietary_options": string[]
}
Make sure the response is valid JSON without any additional text or markdown formatting.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Clean up markdown formatting
        const cleanedText = text.replace(/```json\n?|\n?```/g, '').replace(/\*\*Note:[\s\S]*$/, '').trim();

        let restaurants: Restaurant[];
        try {
            restaurants = JSON.parse(cleanedText);
        } catch (err) {
            return NextResponse.json({ error: "Failed to parse Gemini response", details: cleanedText }, { status: 500 });
        }

        return NextResponse.json({ restaurants });
    } catch (error) {
        return NextResponse.json({ error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
    }
}