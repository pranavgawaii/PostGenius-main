import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { auth, currentUser } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";
import { GenerationRequestSchema, validateRequest } from "@/lib/validators";
import { globalRateLimiter, generationRateLimiter, getIP } from "@/lib/ratelimit";
import { handleApiError, successResponse } from "@/lib/errors";

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '1mb'
        }
    }
};

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * POST Handler for /api/repurpose
 */
export async function POST(req: Request) {
    let userId: number | null = null;
    let clerkUserId: string | null = null;

    try {
        // 1. GLOBAL RATE LIMITING
        if (globalRateLimiter) {
            const ip = getIP(req);
            const { success } = await globalRateLimiter.limit(ip);
            if (!success) return NextResponse.json({ success: false, error: "Too many requests" }, { status: 429 });
        }

        // 2. AUTHENTICATION
        const { userId: authId } = await auth();
        if (!authId) throw new Error("Unauthorized");
        clerkUserId = authId;

        // 3. INPUT VALIDATION
        const body = await req.json();
        const validatedData = await validateRequest(GenerationRequestSchema, {
            url: body.url,
            workflow: "notes" // Defaulting to notes for this endpoint as it's a "repurpose" action, or we can use a generic one
        });

        // 4. USER RATE LIMITING
        if (generationRateLimiter) {
            const { success } = await generationRateLimiter.limit(clerkUserId);
            if (!success) return NextResponse.json({ success: false, error: "Usage limit exceeded" }, { status: 429 });
        }

        // 5. USER MANAGEMENT
        const { data: userRows } = await supabaseAdmin
            .from("users")
            .select("id, plan, credits_remaining, is_admin")
            .eq("clerk_user_id", clerkUserId)
            .limit(1);

        let userData = userRows && userRows.length > 0 ? userRows[0] : null;

        if (!userData) {
            const user = await currentUser();
            const { data: newUser, error: insertError } = await supabaseAdmin
                .from("users")
                .insert([{ clerk_user_id: clerkUserId, email: user?.emailAddresses[0]?.emailAddress || "", plan_type: "free" }])
                .select()
                .single();

            if (insertError) throw new Error("Sync failed");
            userData = newUser;
        }
        if (!userData) throw new Error("User record unavailable");
        userId = userData.id;

        // 6. CREDIT CHECK
        if (userData.plan === 'free' && !userData.is_admin && userData.credits_remaining <= 0) {
            return NextResponse.json({ success: false, error: "Credits exhausted" }, { status: 402 });
        }

        // 7. SCRAPE (Simplified/Hardened)
        let scrapedData = "";
        const firecrawlKey = process.env.FIRECRAWL_API_KEY;
        if (firecrawlKey) {
            const response = await fetch("https://api.firecrawl.dev/v1/scrape", {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${firecrawlKey}` },
                body: JSON.stringify({ url: validatedData.url, formats: ["markdown"] }),
            });
            const data = await response.json();
            if (data.success) scrapedData = data.data.markdown || data.data.content || "";
        }

        if (!scrapedData) scrapedData = `Content from URL: ${validatedData.url}`;

        // 8. GENERATE
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            generationConfig: { responseMimeType: "application/json" }
        });

        const prompt = `Repurpose the following article into 5 posts (linkedin, twitter, facebook, newsletter, blog). JSON output required.\n\nArticle: ${scrapedData.substring(0, 30000)}`;
        const result = await model.generateContent(prompt);
        const geminiResponse = await result.response;
        const generatedContent = JSON.parse(geminiResponse.text());
        const tokenUsage = geminiResponse.usageMetadata?.totalTokenCount || 0;

        // 9. DB STORAGE
        await supabaseAdmin.from('generations').insert({
            user_id: userId,
            workflow: 'repurpose',
            url: validatedData.url,
            output: generatedContent,
            credits_used: 1,
            firecrawl_credits_used: firecrawlKey ? 1 : 0,
            gemini_tokens_used: tokenUsage,
            firecrawl_cost_usd: firecrawlKey ? 0.01 : 0,
            gemini_cost_usd: tokenUsage * 0.0000001,
            created_at: new Date().toISOString()
        });

        // 10. CREDIT DEDUCTION
        if (userData.plan === 'free' && !userData.is_admin) {
            await supabaseAdmin.from('users').update({
                credits_remaining: userData.credits_remaining - 1,
                last_activity: new Date().toISOString()
            }).eq('id', userId);
        } else {
            await supabaseAdmin.from('users').update({ last_activity: new Date().toISOString() }).eq('id', userId);
        }

        return successResponse(generatedContent);

    } catch (error: any) {
        return handleApiError(error);
    }
}
