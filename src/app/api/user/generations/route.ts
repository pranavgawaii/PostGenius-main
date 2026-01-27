import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabase";
import { globalRateLimiter, getIP } from "@/lib/ratelimit";
import { handleApiError, successResponse } from "@/lib/errors";

export async function GET(req: Request) {
    try {
        // 1. GLOBAL RATE LIMITING
        if (globalRateLimiter) {
            const ip = getIP(req);
            const { success } = await globalRateLimiter.limit(ip);
            if (!success) return NextResponse.json({ success: false, error: "Too many requests" }, { status: 429 });
        }

        const { userId: clerkUserId } = await auth();
        if (!clerkUserId) throw new Error("Unauthorized");

        const { searchParams } = new URL(req.url);
        const limit = Math.min(parseInt(searchParams.get("limit") || "10"), 50); // Hard limit to 50
        const offset = parseInt(searchParams.get("offset") || "0");

        // Get user id first
        const { data: user } = await supabase
            .from("users")
            .select("id")
            .eq("clerk_user_id", clerkUserId)
            .single();

        if (!user) return successResponse([]);

        const { data, error } = await supabase
            .from("generations")
            .select("*, newsletter_caption:Newsletter_caption, blog_caption:Blog_caption")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false })
            .range(offset, offset + limit - 1);

        if (error) throw error;

        // Transform to new structure
        const formattedData = data.map(item => ({
            id: item.id,
            url: item.blog_url,
            title: item.blog_title || "Untitled",
            created_at: item.created_at,
            user_id: item.user_id,
            workflow: item.workflow || 'social_media',
            output: item.output,
            captions: {
                instagram: item.instagram_caption,
                twitter: item.twitter_caption,
                linkedin: item.linkedin_caption,
                facebook: item.facebook_caption,
                newsletter: item.newsletter_caption,
                blog: item.blog_caption
            },
            metadata: {
                total_captions: [
                    item.instagram_caption,
                    item.twitter_caption,
                    item.linkedin_caption,
                    item.facebook_caption,
                    item.newsletter_caption,
                    item.blog_caption
                ].filter(Boolean).length
            }
        }));

        return successResponse(formattedData);
    } catch (error: any) {
        return handleApiError(error);
    }
}
