import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";
import { GoogleGenerativeAI } from "@google/generative-ai";

// --- Types & Interfaces ---

interface Captions {
    instagram: string;
    twitter: string;
    linkedin: string;
    facebook: string;
    newsletter: string;
    blog: string;
}

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
// model moved inside POST handler for better hot-reloading

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

        // 4. INPUT VALIDATION
        const body = await req.json();
        const { blogUrl } = body;
        console.log('📍 STEP 5: Validating URL:', blogUrl);

        if (!blogUrl || !isValidUrl(blogUrl)) {
            console.error('❌ Invalid Blog URL:', blogUrl);
            return NextResponse.json({ success: false, error: "Invalid blog URL provided" }, { status: 400 });
        }

        // 5. CACHING LOGIC
        console.log('📍 STEP 6: Checking cache for URL:', blogUrl);
        const { data: cacheRow, error: cacheError } = await supabase
            .from("scraped_cache")
            .select("content, expires_at")
            .eq("blog_url", blogUrl)
            .single();

        if (cacheError && cacheError.code !== 'PGRST116') {
            console.warn('⚠️ Cache fetch warning:', cacheError.message);
        }

        let scrapedContent = "";
        if (cacheRow && new Date(cacheRow.expires_at) > new Date()) {
            console.log('✅ STEP 7: Cache HIT! Using stored content.');
            scrapedContent = cacheRow.content;
            cacheHit = true;

            console.log('📍 STEP 7a: Logging cache hit to usage_logs...');
            await supabase.from("usage_logs").insert({
                user_id: userId,
                action_type: "cache_hit",
                success: true
            });
        } else {
            console.log('❌ STEP 7: Cache MISS or Expired. Scraping...');

            // 6. FIRECRAWL SCRAPING
            console.log('📍 STEP 8: Requesting Firecrawl scrape...');
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
                scrapedContent = scrapeData.data?.markdown || scrapeData.data?.content || "";

                if (!scrapedContent) throw new Error("Scraped content is empty");
                console.log('✅ STEP 9: Content scraped successfully. Length:', scrapedContent.length);

                // Update Cache
                console.log('📍 STEP 9a: Updating scraped_cache table...');
                const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
                const { error: upsertError } = await supabase.from("scraped_cache").upsert({
                    blog_url: blogUrl,
                    content: scrapedContent,
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
                throw new Error(`Scraping failed: ${scrapeErr.message}`);
            }
        }

        // 7. GEMINI CAPTION GENERATION
        const currentModelName = "gemini-flash-latest";
        console.log(`📍 STEP 10: Calling Gemini API (${currentModelName}) for batched captions...`);
        const model = genAI.getGenerativeModel({ model: currentModelName });
        let captions: Captions;

        try {
            const prompt = `You are a social media content expert. Generate platform-specific captions from this blog content.
   
   Blog Content:
   ${scrapedContent.substring(0, 30000)}
   
   Generate captions for these platforms with exact character limits:
   
   1. INSTAGRAM (150 characters max): Casual tone, emojis, engaging
   2. TWITTER (280 characters max): Hook + value, relevant hashtags
   3. LINKEDIN (2000 characters max): Professional, detailed, paragraph format
   4. FACEBOOK (500 characters max): Community-focused, conversational
   5. NEWSLETTER (300 characters max): Email-friendly, compelling subject line style
   6. BLOG (500 characters max): SEO-optimized, informative summary
   
   Rules:
   - Stay within character limits
   - Include relevant hashtags where appropriate
   - Maintain blog's core message
   - Use platform-appropriate tone
   - Make content engaging and actionable
   
   Return ONLY valid JSON in this exact format:
   {
     "instagram": "caption here",
     "twitter": "caption here",
     "linkedin": "caption here",
     "facebook": "caption here",
     "newsletter": "caption here",
     "blog": "caption here"
   }`;

            const result = await model.generateContent(prompt);
            const geminiResponse = await result.response;
            const text = geminiResponse.text();

            console.log('✅ STEP 11: Gemini raw response received');

            const cleanedJson = text.replace(/```json|```/g, "").trim();
            captions = JSON.parse(cleanedJson);

            const requiredFields: (keyof Captions)[] = ["instagram", "twitter", "linkedin", "facebook", "newsletter", "blog"];
            for (const field of requiredFields) {
                if (!captions[field]) throw new Error(`Missing Gemini output for: ${field}`);
            }
            console.log('✅ STEP 12: Caption parsing and validation complete');

            console.log('📍 STEP 12a: Logging generation to usage_logs...');
            await supabase.from("usage_logs").insert({ user_id: userId, action_type: "generate", success: true });
        } catch (genErr: any) {
            console.error('❌ STEP 12 ERROR: Generation failed:', genErr.message);
            await supabase.from("usage_logs").insert({
                user_id: userId,
                action_type: "generate",
                success: false,
                error_message: genErr.message
            });
            throw new Error("AI Content generation failed.");
        }

        // 8. DATABASE STORAGE
        console.log('📍 STEP 13: Saving all captions to generations table...');
        const blogTitle = scrapedContent.split('\n')[0].replace(/[#*]/g, '').trim().substring(0, 255) || "Untitled Post";

        const { data: genData, error: genError } = await supabase
            .from("generations")
            .insert([{
                user_id: userId,
                blog_url: blogUrl,
                blog_title: blogTitle,
                scraped_content: scrapedContent,
                instagram_caption: captions.instagram,
                twitter_caption: captions.twitter,
                linkedin_caption: captions.linkedin,
                facebook_caption: captions.facebook,
                Newsletter_caption: captions.newsletter,
                Blog_caption: captions.blog,
            }])
            .select("id")
            .single();

        if (genError) {
            console.error('❌ CRITICAL: Failed to save to generations table:', genError);
            throw new Error(`Database save error: ${genError.message}`);
        }

        generationId = genData.id;
        console.log('✅ STEP 14: Generation saved successfully. Generation ID:', generationId);

        // 9. USAGE INCREMENT
        console.log('📍 STEP 15: Incrementing user usage counter...');
        const { error: incError } = await supabase.rpc("increment_user_usage", {
            user_clerk_id: clerkUserId
        });

        if (incError) {
            console.error('⚠️ Usage increment RPC failed:', incError.message);
        } else {
            console.log('✅ STEP 16: Usage increment successful');
        }

        // 10. FINAL RESPONSE
        console.log('🌟 GENERATION COMPLETE! Returning success response.');
        return NextResponse.json({
            success: true,
            generation_id: generationId,
            blog_url: blogUrl,
            blog_title: blogTitle,
            captions,
            requests_remaining: limits.remaining - 1,
            daily_limit: limits.daily_limit,
            plan_type: limits.plan_type,
            reset_at: limits.reset_at,
            upgrade_available: limits.plan_type === 'free',
            debug: {
                user_created: wasUserCreated,
                cache_hit: cacheHit,
                user_db_id: userId
            }
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
