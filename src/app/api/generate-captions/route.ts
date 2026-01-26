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

// --- Types & Interfaces ---

interface RateLimitResponse {
    allowed: boolean;
    remaining: number;
    daily_limit: number;
    plan_type: string;
    reset_at: string;
    error?: string;
}

// --- DEBUG: Environment Variables Check ---

console.log('📍 STEP 0: Checking Environment Variables...');
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) console.error('❌ MISSING: NEXT_PUBLIC_SUPABASE_URL');
if (!process.env.SUPABASE_SERVICE_ROLE_KEY) console.error('❌ MISSING: SUPABASE_SERVICE_ROLE_KEY');
if (!process.env.GEMINI_API_KEY) console.error('❌ MISSING: GEMINI_API_KEY');
if (!process.env.FIRECRAWL_API_KEY) console.error('❌ MISSING: FIRECRAWL_API_KEY');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

// --- Client Initializations ---

// CRITICAL: Initialize Supabase with service_role key to bypass RLS
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        persistSession: false,
        autoRefreshToken: false,
    }
});
console.log('✅ Supabase client initialized with service_role key');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

/**
 * Robust URL Validation
 */
const isValidUrl = (url: string) => {
    try {
        new URL(url);
        return true;
    } catch (e) {
        return false;
    }
};

/**
 * POST Handler for /api/generate-captions
 */
export async function POST(req: Request) {
    console.log('\n--- 🚀 NEW GENERATION REQUEST START ---');
    let userId: number | null = null;
    let clerkUserId: string | null = null;
    let wasUserCreated = false;
    let cacheHit = false;
    let generationId: number | null = null;

    try {
        // 1. AUTHENTICATION
        console.log('📍 STEP 1: Authenticating with Clerk...');
        const { userId: authId } = await auth();
        if (!authId) {
            console.error('❌ Authentication failed: No session');
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }
        clerkUserId = authId;
        console.log('✅ Clerk Authentication Success:', clerkUserId);

        // Get email from Clerk for new user entry
        const user = await currentUser();
        const email = user?.emailAddresses[0]?.emailAddress || "";
        const userName = user?.fullName || user?.firstName || undefined;

        // 2. USER MANAGEMENT
        console.log('📍 STEP 2: Checking if user exists in Supabase:', clerkUserId);
        const { data: userRows, error: userCheckError } = await supabase
            .from("users")
            .select("id, daily_request_count")
            .eq("clerk_user_id", clerkUserId)
            .limit(1);

        let sbUser = userRows && userRows.length > 0 ? userRows[0] : null;

        if (userCheckError) {
            console.log('ℹ️ User lookup error (non-critical):', userCheckError.message);
        }

        if (!sbUser) {
            console.log('📍 STEP 3: User not found. Creating new user in Supabase...');
            const { data: newUser, error: insertError } = await supabase
                .from("users")
                .insert([{ clerk_user_id: clerkUserId, email, plan_type: "free" }])
                .select()
                .single();

            if (insertError) {
                console.error('❌ CRITICAL: User creation failed:', insertError);
                throw new Error(`User creation failed: ${insertError.message}`);
            }

            if (newUser) {
                sbUser = newUser;
                wasUserCreated = true;
                console.log('✅ New user created successfully. DB ID:', newUser.id);
            }
        } else if (sbUser) {
            console.log('✅ Existing user found. DB ID:', sbUser.id);
        }

        if (!sbUser) {
            throw new Error("User record could not be established in Supabase");
        }

        userId = sbUser.id;

        // 3. RATE LIMITING CHECK
        console.log('📍 STEP 4: Checking rate limits via RPC for:', clerkUserId);
        const { data: limitData, error: limitError } = await supabase.rpc("check_user_rate_limit", {
            user_clerk_id: clerkUserId,
        });

        if (limitError) {
            console.error('❌ RPC Error (check_user_rate_limit):', limitError);
            throw new Error(`Rate limit check failed: ${limitError.message}`);
        }

        const limits = limitData as RateLimitResponse;
        console.log('✅ Rate Limit Result:', limits);

        if (!limits.allowed) {
            console.warn('⚠️ Rate limit exceeded for user:', clerkUserId);
            return NextResponse.json(
                {
                    success: false,
                    error: limits.error || "Daily generation limit reached (30/30).",
                    requests_remaining: 0,
                    reset_at: limits.reset_at
                },
                { status: 429 }
            );
        }

        // 4. INPUT PROCESSING
        const body = await req.json();
        const { blogUrl, workflow = 'social_media' } = body;
        console.log(`📍 STEP 5: Validating URL for workflow [${workflow}]:`, blogUrl);

        if (!blogUrl) {
            return NextResponse.json({ success: false, error: "URL is required" }, { status: 400 });
        }

        const validation = validateWorkflowInput(workflow, blogUrl);
        if (!validation.valid) {
            console.error('❌ Input Validation Failed:', validation.error);
            return NextResponse.json({ success: false, error: validation.error }, { status: 400 });
        }

        // 5. FETCH CONTENT
        let content: any;
        let scrapedContentString = ""; // For DB legacy column/logging
        const workflowMeta = getWorkflowMetadata(workflow);

        if (workflowMeta.usesGitHubAPI) {
            // --- GITHUB API FETCH ---
            console.log(`[${workflow}] Fetching GitHub repo:`, blogUrl);
            try {
                content = await fetchGitHubRepo(blogUrl);
                scrapedContentString = JSON.stringify({
                    name: content.name,
                    description: content.description,
                    stars: content.stars,
                    readme_excerpt: content.readme.substring(0, 500)
                });
            } catch (error: any) {
                console.error('GitHub API error:', error);
                return NextResponse.json(
                    { success: false, error: error.message || 'Failed to fetch GitHub repository' },
                    { status: 400 }
                );
            }
        } else {
            // --- FIRECRAWL Fetch ---
            // 5a. CACHING LOGIC (Only for web scraping workflows)
            console.log('📍 STEP 6: Checking cache for URL:', blogUrl);
            const { data: cacheRow, error: cacheError } = await supabase
                .from("scraped_cache")
                .select("content, expires_at")
                .eq("blog_url", blogUrl)
                .single();

            if (cacheError && cacheError.code !== 'PGRST116') {
                console.warn('⚠️ Cache fetch warning:', cacheError.message);
            }

            if (cacheRow && new Date(cacheRow.expires_at) > new Date()) {
                console.log('✅ STEP 7: Cache HIT! Using stored content.');
                content = cacheRow.content;
                scrapedContentString = content;
                cacheHit = true;

                await supabase.from("usage_logs").insert({
                    user_id: userId,
                    action_type: "cache_hit",
                    success: true
                });
            } else {
                console.log('❌ STEP 7: Cache MISS or Expired. Scraping with Firecrawl...');
                try {
                    const scrapeResponse = await fetch("https://api.firecrawl.dev/v1/scrape", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${process.env.FIRECRAWL_API_KEY}`,
                        },
                        body: JSON.stringify({ url: blogUrl, formats: ["markdown"] }),
                        signal: AbortSignal.timeout(30000), // 30s timeout
                    });

                    if (!scrapeResponse.ok) {
                        const errText = await scrapeResponse.text();
                        throw new Error(`Firecrawl failed (${scrapeResponse.status}): ${errText}`);
                    }

                    const scrapeData = await scrapeResponse.json();
                    content = scrapeData.data?.markdown || scrapeData.data?.content || "";
                    scrapedContentString = content;

                    if (!content) throw new Error("Scraped content is empty");
                    console.log('✅ STEP 9: Content scraped successfully. Length:', content.length);

                    // Update Cache
                    console.log('📍 STEP 9a: Updating scraped_cache table...');
                    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
                    const { error: upsertError } = await supabase.from("scraped_cache").upsert({
                        blog_url: blogUrl,
                        content: content, // Save full content to cache
                        cached_at: new Date().toISOString(),
                        expires_at: expiresAt
                    });

                    if (upsertError) console.error('⚠️ Failed to update cache table:', upsertError.message);

                    console.log('📍 STEP 9b: Logging scrape action to usage_logs...');
                    await supabase.from("usage_logs").insert({
                        user_id: userId,
                        action_type: "scrape",
                        success: true
                    });
                } catch (scrapeErr: any) {
                    console.error('❌ STEP 9 ERROR: Scraping failed:', scrapeErr.message);
                    await supabase.from("usage_logs").insert({
                        user_id: userId,
                        action_type: "scrape",
                        success: false,
                        error_message: scrapeErr.message
                    });
                    return NextResponse.json(
                        { success: false, error: "Failed to scrape content. Please check the URL and try again." },
                        { status: 400 }
                    );
                }
            }
        }

        // 6. PREPARE PROMPT
        let prompt = "";
        if (workflow === 'github_readme') {
            prompt = getGitHubReadmePrompt(content);
        } else if (workflow === 'resume') {
            prompt = getResumeBulletsPrompt(content);
        } else if (workflow === 'notes') {
            prompt = getStudyNotesPrompt(content as string);
        } else if (workflow === 'linkedin') {
            prompt = getLinkedInPostPrompt(content as string, { name: userName });
        } else {
            // Default: Social Media
            const platforms = ['instagram', 'linkedin', 'twitter', 'facebook', 'newsletter', 'blog'];
            prompt = getSocialMediaCaptionsPrompt(content as string, platforms);
        }

        // 7. GEMINI GENERATION
        const currentModelName = "gemini-flash-latest"; // or gemini-1.5-flash
        console.log(`📍 STEP 10: Calling Gemini API (${currentModelName}) for [${workflow}]...`);
        let rawOutput = "";

        try {
            const model = genAI.getGenerativeModel({ model: currentModelName });
            const result = await model.generateContent(prompt);
            const geminiResponse = await result.response;
            rawOutput = geminiResponse.text();

            if (!rawOutput) throw new Error("Gemini returned empty response");
            console.log('✅ STEP 11: Gemini response received');

            await supabase.from("usage_logs").insert({ user_id: userId, action_type: "generate", success: true });
        } catch (genErr: any) {
            console.error('❌ STEP 12 ERROR: Generation failed:', genErr.message);
            await supabase.from("usage_logs").insert({
                user_id: userId,
                action_type: "generate",
                success: false,
                error_message: genErr.message
            });
            return NextResponse.json({ success: false, error: "AI Content generation failed." }, { status: 500 });
        }

        // 8. PARSE OUTPUT
        let parsedOutput: any;
        try {
            parsedOutput = parseWorkflowOutput(workflow, rawOutput);
            console.log('✅ STEP 12: Output parsed successfully');
        } catch (parseErr) {
            console.error('⚠️ Output parsing warning, using raw:', parseErr);
            parsedOutput = { text: rawOutput };
        }

        // 9. DATABASE STORAGE
        console.log('📍 STEP 13: Saving to generations table...');

        const blogTitle = (scrapedContentString.split('\n')[0] || "Generations").substring(0, 100).replace(/[#*]/g, '').trim();

        const isSocial = workflow === 'social_media';

        // Helper to ensure safe strings for legacy columns
        const getCaption = (obj: any, key: string) => {
            if (!obj) return "";
            const val = obj[key];
            if (typeof val === 'string') return val;
            if (val && typeof val === 'object' && val.text) return val.text;
            return "";
        };

        const insertData: any = {
            user_id: userId,
            blog_url: blogUrl,
            blog_title: blogTitle,
            scraped_content: scrapedContentString.substring(0, 100000),
            workflow: workflow,
            output: parsedOutput,
            // FIX: Ensure no NULLs for legacy NOT NULL columns
            instagram_caption: getCaption(parsedOutput, 'instagram'),
            twitter_caption: getCaption(parsedOutput, 'twitter'),
            linkedin_caption: getCaption(parsedOutput, 'linkedin'),
            facebook_caption: getCaption(parsedOutput, 'facebook'),
            Newsletter_caption: getCaption(parsedOutput, 'newsletter'),
            Blog_caption: getCaption(parsedOutput, 'blog'),
            credits_used: 1
        };

        const { data: genData, error: genError } = await supabase
            .from("generations")
            .insert([insertData])
            .select("id")
            .single();

        if (genError) {
            console.warn('⚠️ Save failed. Attempting fallback insert...', genError.message);
            // Fallback: minimal valid data
            const fallbackData = {
                ...insertData,
                instagram_caption: "See output",
                twitter_caption: "See output",
                linkedin_caption: "See output",
                facebook_caption: "See output",
                Newsletter_caption: "See output",
                Blog_caption: "See output",
            };

            const { data: retryData, error: retryError } = await supabase
                .from("generations")
                .insert([fallbackData])
                .select("id")
                .single();

            if (retryError) {
                console.error('❌ CRITICAL: Failed to save generation:', retryError);
                // We proceed to return data to user, but log the error
            } else {
                generationId = retryData?.id;
            }
        } else {
            generationId = genData?.id;
            console.log('✅ STEP 14: Generation saved. ID:', generationId);
        }

        // 10. CREDIT DEDUCTION
        console.log('📍 STEP 15: Updating usage and credits...');
        // 1. Increment total generations stats
        await supabase.rpc("increment_user_usage", { user_clerk_id: clerkUserId });

        // 2. Deduct credits explicitly (FIX for live update)
        if (limits.plan_type !== 'unlimited') {
            const newCredits = Math.max(0, limits.remaining - 1);
            const { error: deductError } = await supabase
                .from('users')
                .update({ credits_remaining: newCredits })
                .eq('clerk_user_id', clerkUserId);

            if (deductError) console.error('⚠️ Credit deduction failed:', deductError.message);
            else console.log(`✅ Credits deducted. Remaining: ${newCredits}`);
        }

        // 11. FINAL RESPONSE
        return NextResponse.json({
            success: true,
            generation_id: generationId,
            workflow: workflow,
            output: parsedOutput,
            captions: isSocial ? parsedOutput : undefined,
            // Return updated limit
            requests_remaining: limits.plan_type === 'unlimited' ? 999 : Math.max(0, limits.remaining - 1),
            daily_limit: limits.daily_limit,
            plan_type: limits.plan_type,
            reset_at: limits.reset_at
        });

    } catch (error: any) {
        console.error('💥 CRITICAL API FAILURE:', error.message);

        // Log final error to usage_logs if possible
        if (userId) {
            try {
                await supabase.from("usage_logs").insert({
                    user_id: userId,
                    action_type: "api_error",
                    success: false,
                    error_message: error.message
                });
                console.log('✅ Logged API error to usage_logs');
            } catch (logErr) {
                console.error('⚠️ Failed to log error to DB');
            }
        }

        return NextResponse.json(
            {
                success: false,
                error: error.message || "An unexpected error occurred",
                requests_remaining: 0,
            },
            { status: 500 }
        );
    } finally {
        console.log('--- 🏁 GENERATION REQUEST END ---\n');
    }
}
