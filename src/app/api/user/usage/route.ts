import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
    try {
        const { userId: clerkUserId } = await auth();
        if (!clerkUserId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Call RPC to check rate limit
        const { data: limitData, error: limitError } = await supabase.rpc("check_user_rate_limit", {
            user_clerk_id: clerkUserId,
        });

        if (limitError) {
            console.warn("RPC Limit Error:", limitError.message);
            // Return a fallback instead of throwing
            return NextResponse.json({
                success: true,
                allowed: true,
                remaining: 5,
                daily_limit: 5,
                plan_type: 'free',
                reset_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
                daily_request_count: 0,
                total_generations: 0
            });
        }

        // Get user data (id and daily_request_count)
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

        return NextResponse.json({
            success: true,
            ...limitData,
            daily_request_count: dailyRequestCount,
            total_generations: totalGenerations,
        });
    } catch (error: any) {
        console.error("Usage API Error:", error.message);
        return NextResponse.json({ error: "Failed to fetch usage data" }, { status: 500 });
    }
}
