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

        // Call RPC to check rate limit
        const { data: limitData, error: limitError } = await supabase.rpc("check_user_rate_limit", {
            user_clerk_id: clerkUserId,
        });

        // Get user data
        const { data: userData } = await supabase
            .from("users")
            .select("id, daily_request_count")
            .eq("clerk_user_id", clerkUserId)
            .single();

        let totalGenerations = 0;
        let dailyRequestCount = 0;

        if (userData?.id) {
            dailyRequestCount = userData.daily_request_count || 0;
            const { count } = await supabase
                .from("generations")
                .select("*", { count: "exact", head: true })
                .eq("user_id", userData.id);

            totalGenerations = count || 0;
        }

        return successResponse({
            ...limitData,
            daily_request_count: dailyRequestCount,
            total_generations: totalGenerations,
        });
    } catch (error: any) {
        return handleApiError(error);
    }
}
