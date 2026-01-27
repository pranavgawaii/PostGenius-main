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

        let { data: userData, error } = await supabase
            .from("users")
            .select("plan, plan_type, credits_remaining, email, is_admin")
            .eq("clerk_user_id", clerkUserId)
            .single();

        // FALLBACK SYNC: If user not found in Supabase, create them now
        if (error && error.code === 'PGRST116') {
            const { currentUser } = await import('@clerk/nextjs/server');
            const clerkUser = await currentUser();

            if (clerkUser) {
                const email = clerkUser.emailAddresses[0]?.emailAddress;
                if (email) {
                    // Insert new user
                    const { data: newUser, error: insertError } = await supabase
                        .from('users')
                        .insert({
                            clerk_user_id: clerkUserId,
                            email: email,
                            plan_type: 'free'
                        })
                        .select("plan, plan_type, credits_remaining, email, is_admin")
                        .single();

                    if (!insertError) {
                        userData = newUser;
                        error = null;
                    }
                }
            }
        }

        if (error) throw error;

        return successResponse(userData);

    } catch (error: any) {
        return handleApiError(error);
    }
}
