import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize OpenAI
// const openai = new OpenAI({
//     apiKey: process.env.OPENAI_API_KEY,
// });

export async function POST(req: Request) {
    try {
        const { url } = await req.json();

        if (!url) {
            console.log("❌ Error: No URL provided");
            return NextResponse.json({ error: "URL is required" }, { status: 400 });
        }

        console.log("🚀 Starting processing for URL:", url);

        // 1. Scrape Content using Firecrawl (or Fallback)
        let scrapedData = "";
        const firecrawlKey = process.env.FIRECRAWL_API_KEY;

        if (firecrawlKey) {
            try {
                const response = await fetch("https://api.firecrawl.dev/v0/scrape", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${firecrawlKey}`,
                    },
                    body: JSON.stringify({ url, formats: ["markdown"] }),
                });

                console.log("🔍 Firecrawl API Status:", response.status);

                const data = await response.json();
                if (data.success) {
                    scrapedData = data.data.markdown || data.data.content || "";
                    console.log("✅ Scraped Data Length:", scrapedData.length);
                } else {
                    console.error("Firecrawl error:", data);
                    throw new Error("Failed to scrape");
                }
            } catch (error) {
                console.error("Scraping failed, utilizing fallback", error);
                // Fallback: Just use the URL itself as context if scraping fails (for demo purposes)
                scrapedData = `Content from URL: ${url}`;
            }
        } else {
            // Mock Scraping for development without key
            scrapedData = `Mock content derived from URL: ${url}. (Configure FIRECRAWL_API_KEY to scrape real content)`;
        }

        // 2. Generate Content using Google Gemini
        console.log("🧠 Sending to Gemini...");
        let content;

        try {
            const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
            const model = genAI.getGenerativeModel({
                model: "gemini-flash-latest",
                generationConfig: { responseMimeType: "application/json" }
            });

            const prompt = `
            You are an expert social media manager. 
            Repurpose the provided article content into 5 distinct pieces of content.
            
            Return ONLY valid JSON with this exact schema:
            {
                "linkedin": "string (Professional, thought leadership, bullet points)",
                "twitter": "string (Punchy, hook-driven, 1/5 style thread)",
                "facebook": "string (Engaging, community-focused, questions)",
                "newsletter": "string (Summary, 'Read more' hook)",
                "blog": "string (Teaser for the full article)"
            }

            Article Content:
            ${scrapedData.substring(0, 30000)}
            `;

            const result = await model.generateContent(prompt);
            const responseText = result.response.text();
            content = JSON.parse(responseText);

        } catch (geminiError: any) {
            console.error("⚠️ Gemini API Failed:", geminiError.message);

            content = {
                linkedin: "⚠️ (Gemini API Error)\n\nCould not generate content. Please check your GEMINI_API_KEY.",
                twitter: "🧵 1/5\n\n(Gemini API Error)",
                facebook: "(Gemini API Error)",
                newsletter: "(Gemini API Error)",
                blog: "(Gemini API Error)"
            };
        }

        return NextResponse.json(content);

    } catch (error) {
        console.error("Repurpose API Error:", error);
        return NextResponse.json(
            { error: "Failed to generate content", details: error instanceof Error ? error.message : "Unknown error" },
            { status: 500 }
        );
    }
}
