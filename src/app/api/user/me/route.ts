import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";
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

        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        const { data: userData, error } = await supabase
            .from("users")
            .select("plan, plan_type, credits_remaining, email, is_admin")
            .eq("clerk_user_id", clerkUserId)
            .single();

        if (error) throw error;

        return successResponse(userData);

    } catch (error: any) {
        return handleApiError(error);
    }
}
