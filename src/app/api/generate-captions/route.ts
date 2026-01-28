import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { fetchGitHubRepo } from "@/lib/githubApi";
import {
    getGitHubReadmePrompt,
    getResumeBulletsPrompt,
    getStudyNotesPrompt,
    getLinkedInPostPrompt,
    getSocialMediaCaptionsPrompt
} from "@/lib/prompts";
import {
    parseWorkflowOutput,
    validateWorkflowInput,
    getWorkflowMetadata
} from "@/lib/workflowUtils";
import { GenerationRequestSchema, validateRequest } from "@/lib/validators";
import { globalRateLimiter, generationRateLimiter, getIP } from "@/lib/ratelimit";
import { handleApiError, successResponse } from "@/lib/errors";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { persistSession: false, autoRefreshToken: false }
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

/**
 * POST Handler for /api/generate-captions
 */
export async function POST(req: Request) {
    let userId: number | null = null;
    let clerkUserId: string | null = null;
    let generationId: number | null = null;

    try {
        // 1. GLOBAL RATE LIMITING (IP Based)
        if (globalRateLimiter) {
            const ip = getIP(req);
            const { success } = await globalRateLimiter.limit(ip);
            if (!success) {
                return NextResponse.json({ success: false, error: "Too many requests. Please slow down." }, { status: 429 });
            }
        }

        // DEBUG: Check Environment
        console.log("Clerk Secret Key loaded:", process.env.CLERK_SECRET_KEY ? "YES" : "NO");

        // 2. AUTHENTICATION
        let authId: string | null = null;
        try {
            const authResponse = await auth();
            authId = authResponse.userId;
        } catch (authErr: any) {
            console.error("Clerk auth() failed:", authErr);
            throw new Error(`Authentication service unreachable: ${authErr.message}`);
        }

        if (!authId) throw new Error("Unauthorized");
        clerkUserId = authId;

        // 3. INPUT VALIDATION (Zod)
        const body = await req.json();
        const validatedData = await validateRequest(GenerationRequestSchema, {
            url: body.blogUrl, // Map blogUrl to url schema
            workflow: body.workflow
        });

        const blogUrl = validatedData.url;
        const workflow = validatedData.workflow;

        // 4. USER RATE LIMITING (Upstash)
        if (generationRateLimiter) {
            const { success } = await generationRateLimiter.limit(clerkUserId);
            if (!success) {
                return NextResponse.json({
                    success: false,
                    error: "Usage limit exceeded",
                    message: "You have exceeded the hourly generation limit."
                }, { status: 429 });
            }
        }

        // 5. USER MANAGEMENT (Syncing with DB)
        const user = await currentUser();
        const email = user?.emailAddresses[0]?.emailAddress || "";

        const { data: userRows } = await supabase
            .from("users")
            .select("id, plan, credits_remaining, is_admin")
            .eq("clerk_user_id", clerkUserId)
            .limit(1);

        let sbUser = userRows && userRows.length > 0 ? userRows[0] : null;

        if (!sbUser) {
            const { data: newUser, error: insertError } = await supabase
                .from("users")
                .insert([{ clerk_user_id: clerkUserId, email, plan_type: "free" }])
                .select()
                .single();

            if (insertError) throw new Error(`User sync failed: ${insertError.message}`);
            sbUser = newUser;
        }

        if (!sbUser) throw new Error("User record could not be established");
        userId = sbUser.id;

        // 6. DB CREDIT CHECK (Legacy fallback)
        if (sbUser.plan === 'free' && !sbUser.is_admin && sbUser.credits_remaining <= 0) {
            return NextResponse.json({
                success: false,
                error: 'Credits exhausted',
                message: 'You have used all your credits for today.',
                upgradeUrl: '/pricing'
            }, { status: 402 });
        }

        // 7. FETCH CONTENT
        let content: any;
        let scrapedContentString = "";
        const workflowMeta = getWorkflowMetadata(workflow);

        if (workflowMeta.usesGitHubAPI) {
            content = await fetchGitHubRepo(blogUrl);
            scrapedContentString = JSON.stringify({
                name: content.name,
                description: content.description,
                stars: content.stars,
                readme_excerpt: content.readme.substring(0, 500)
            });
        } else {
            // Check Cache
            const { data: cacheRow } = await supabase
                .from("scraped_cache")
                .select("content, expires_at")
                .eq("blog_url", blogUrl)
                .single();

            if (cacheRow && new Date(cacheRow.expires_at) > new Date()) {
                content = cacheRow.content;
                scrapedContentString = content;
            } else {
                // Scraping via Firecrawl with Retry Logic (Node.js fetch timeout workaround)
                let scrapeData: any = null;
                let lastError: Error | null = null;
                const maxRetries = 3;

                for (let attempt = 1; attempt <= maxRetries; attempt++) {
                    try {
                        console.log(`Firecrawl attempt ${attempt}/${maxRetries}...`);
                        const scrapeResponse = await fetch("https://api.firecrawl.dev/v1/scrape", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                "Authorization": `Bearer ${process.env.FIRECRAWL_API_KEY}`,
                            },
                            body: JSON.stringify({ url: blogUrl, formats: ["markdown"] }),
                            signal: AbortSignal.timeout(60000), // Increased to 60s
                        });

                        if (!scrapeResponse.ok) {
                            throw new Error(`Firecrawl returned ${scrapeResponse.status}`);
                        }

                        scrapeData = await scrapeResponse.json();
                        console.log(`✓ Firecrawl succeeded on attempt ${attempt}`);
                        break; // Success, exit retry loop
                    } catch (err: any) {
                        lastError = err;
                        console.warn(`Firecrawl attempt ${attempt} failed:`, err.message);

                        if (attempt < maxRetries) {
                            const backoffMs = Math.pow(2, attempt) * 1000; // 2s, 4s, 8s
                            console.log(`Retrying in ${backoffMs}ms...`);
                            await new Promise(resolve => setTimeout(resolve, backoffMs));
                        }
                    }
                }

                if (!scrapeData) {
                    throw new Error(`Firecrawl failed after ${maxRetries} attempts: ${lastError?.message}`);
                }

                content = scrapeData.data?.markdown || scrapeData.data?.content || "";
                scrapedContentString = content;

                if (!content) throw new Error("Scraped content is empty");

                // Update Cache
                await supabase.from("scraped_cache").upsert({
                    blog_url: blogUrl,
                    content: content,
                    cached_at: new Date().toISOString(),
                    expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
                });
            }
        }

        // 8. GEMINI GENERATION
        const prompt = workflow === 'github_readme' ? getGitHubReadmePrompt(content) :
            workflow === 'resume' ? getResumeBulletsPrompt(content) :
                workflow === 'notes' ? getStudyNotesPrompt(content as string) :
                    workflow === 'linkedin' ? getLinkedInPostPrompt(content as string, { name: user?.fullName || "User" }) :
                        getSocialMediaCaptionsPrompt(content as string, ['instagram', 'linkedin', 'twitter']);

        console.log("--- GENERATION START ---");
        console.log("API Key loaded:", process.env.GEMINI_API_KEY ? `YES (Starts with ${process.env.GEMINI_API_KEY.substring(0, 4)}...)` : "NO");
        console.log("Workflow:", workflow);

        // UPDATED: Optimized Fallback Chain
        let model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        let result;
        try {
            result = await model.generateContent(prompt);
        } catch (error: any) {
            console.warn("Gemini 2.5 Flash failed (503/429?), trying fallback to gemini-2.0-flash...", error.message);
            model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
            try {
                result = await model.generateContent(prompt);
            } catch (fallbackError: any) {
                console.warn("Gemini 2.0 Flash failed, trying gemini-1.5-pro...", fallbackError.message);
                model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" }); // Stable legacy fallback
                result = await model.generateContent(prompt);
            }
        }
        const rawOutput = (await result.response).text();
        const tokenUsage = (await result.response).usageMetadata?.totalTokenCount || 0;

        if (!rawOutput) throw new Error("AI failed to generate response");

        // 9. PARSE & SAVE
        let parsedOutput: any;
        try {
            parsedOutput = parseWorkflowOutput(workflow, rawOutput);
        } catch {
            parsedOutput = { text: rawOutput };
        }

        const geminiCost = tokenUsage * 0.0000001;

        // FAIL-SAFE DB SAVE: Even if DB fails, allow user to see result
        try {
            const { data: genData, error: genError } = await supabase
                .from("generations")
                .insert([{
                    user_id: userId,
                    blog_url: blogUrl,
                    blog_title: (scrapedContentString.split('\n')[0] || "Generation").substring(0, 100),
                    workflow: workflow,
                    output: parsedOutput,
                    instagram_caption: parsedOutput?.instagram?.text || "",
                    linkedin_caption: parsedOutput?.linkedin?.text || "",
                    twitter_caption: parsedOutput?.twitter?.text || "",
                    facebook_caption: parsedOutput?.facebook?.text || "",
                    Newsletter_caption: "",
                    Blog_caption: "",
                    credits_used: 1,
                    firecrawl_cost_usd: workflowMeta.requiresFirecrawl ? 0.01 : 0,
                    gemini_cost_usd: geminiCost
                }])
                .select("id")
                .single();

            if (genError) {
                console.error("Database save failed (Constraints?):", genError.message);
            } else {
                generationId = genData?.id || null;

                // 10. CREDIT DEDUCTION & ACTIVITY LOGGING
                const updatePayload: any = {
                    last_activity: new Date().toISOString()
                };

                // Only deduct credits if free plan and not admin
                if (sbUser.plan === 'free' && !sbUser.is_admin) {
                    updatePayload.credits_remaining = sbUser.credits_remaining - 1;
                }

                console.log(`Updating user ${userId} with payload:`, updatePayload); // DEBUG LOG

                const { error: updateError } = await supabase.from('users').update(updatePayload).eq('id', userId);

                if (updateError) {
                    console.error("❌ Failed to update last_activity:", updateError.message);
                } else {
                    console.log("✅ Successfully updated last_activity for user", userId);
                }
            }
        } catch (dbError) {
            console.error("Critical Database Error during save (Ignoring to show output):", dbError);
        }

        return successResponse({
            generation_id: generationId,
            workflow,
            output: parsedOutput,
            requests_remaining: (sbUser.plan === 'free' && !sbUser.is_admin) ? sbUser.credits_remaining - 1 : 999,
        });

    } catch (error: any) {
        return handleApiError(error);
    }
}
