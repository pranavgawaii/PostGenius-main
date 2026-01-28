import { createClient } from "@supabase/supabase-js";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { globalRateLimiter, getIP } from "@/lib/ratelimit";
import { handleApiError, successResponse } from "@/lib/errors";
import { AdminStatsQuerySchema, validateRequest } from "@/lib/validators";

export const dynamic = "force-dynamic"; // Ensure API is never cached

export async function GET(req: Request) {
    try {
        // 1. GLOBAL RATE LIMITING (IP Based)
        if (globalRateLimiter) {
            const ip = getIP(req);
            const { success } = await globalRateLimiter.limit(ip);
            if (!success) return NextResponse.json({ success: false, error: "Too many requests" }, { status: 429 });
        }

        const { userId } = await auth();
        if (!userId) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

        // 2. QUERY VALIDATION
        const url = new URL(req.url);
        const validatedQuery = await validateRequest(AdminStatsQuerySchema, {
            timeframe: url.searchParams.get("timeframe") || "today"
        });

        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // 3. ADMIN VERIFICATION
        const { data: currentUser, error: userError } = await supabase
            .from("users")
            .select("is_admin")
            .eq("clerk_user_id", userId)
            .single();

        if (userError || !currentUser?.is_admin) {
            return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
        }

        // 4. TIMING & DATA FETCHING
        const now = new Date();
        const istOffset = 5.5 * 60 * 60 * 1000;
        const startOfIstDay = new Date(now.getTime() + istOffset);
        startOfIstDay.setUTCHours(0, 0, 0, 0);

        const startOfTodayUtc = new Date(startOfIstDay.getTime() - istOffset);
        const startOfTodayIso = startOfTodayUtc.toISOString();

        // Data fetching logic (reused from original)
        const [
            { count: totalUsers },
            { count: newUsersToday },
            { count: totalGenerations },
            { count: generationsToday },
            { data: todayCreditsData },
            { data: activeUsersTodayData }
        ] = await Promise.all([
            supabase.from("users").select("*", { count: 'exact', head: true }),
            supabase.from("users").select("*", { count: 'exact', head: true }).gte("created_at", startOfTodayIso),
            supabase.from("generations").select("*", { count: 'exact', head: true }),
            supabase.from("generations").select("*", { count: 'exact', head: true }).gte("created_at", startOfTodayIso),
            supabase.from("generations").select("credits_used").gte("created_at", startOfTodayIso),
            supabase.from("generations").select("user_id").gte("created_at", startOfTodayIso)
        ]);

        const creditsConsumedToday = (todayCreditsData as any[])?.reduce((sum, item) => sum + (item.credits_used || 0), 0) || (generationsToday || 0);
        const activeUsersTodaySet = new Set((activeUsersTodayData as any[])?.map(item => item.user_id));
        const activeUsersToday = activeUsersTodaySet.size;

        const { data: recentActivity } = await supabase
            .from("generations")
            .select(`id, workflow, url, created_at, users (email)`)
            .order("created_at", { ascending: false })
            .limit(20);

        const { data: usersList } = await supabase
            .from("users")
            .select(`id, email, plan, credits_remaining, last_activity, created_at`)
            .order("last_activity", { ascending: false, nullsFirst: false });

        const { data: genCounts } = await supabase.from("generations").select("user_id");
        const countMap: Record<string, number> = {};
        genCounts?.forEach(g => {
            const uid = String(g.user_id);
            countMap[uid] = (countMap[uid] || 0) + 1;
        });

        const usersWithStats = usersList?.map(u => ({
            ...u,
            total_generations: countMap[String(u.id)] || 0
        })) || [];

        const { data: apiCostsData } = await supabase.from('generations').select('firecrawl_cost_usd, gemini_cost_usd, created_at, workflow, user_id');

        const apiCosts = {
            total_firecrawl_cost: apiCostsData?.reduce((sum, g) => sum + (g.firecrawl_cost_usd || 0), 0) || 0,
            total_gemini_cost: apiCostsData?.reduce((sum, g) => sum + (g.gemini_cost_usd || 0), 0) || 0,
            total_cost: apiCostsData?.reduce((sum, g) => sum + (g.firecrawl_cost_usd || 0) + (g.gemini_cost_usd || 0), 0) || 0,
            firecrawl_cost_today: apiCostsData?.filter(g => new Date(g.created_at) >= startOfTodayUtc)
                .reduce((sum, g) => sum + (g.firecrawl_cost_usd || 0), 0) || 0,
            gemini_cost_today: apiCostsData?.filter(g => new Date(g.created_at) >= startOfTodayUtc)
                .reduce((sum, g) => sum + (g.gemini_cost_usd || 0), 0) || 0,
        };

        const totalOverallCost = apiCosts.total_cost || 1;
        const costByWorkflowRaw = apiCostsData?.reduce((acc, g) => {
            const workflow = g.workflow || 'unknown';
            if (!acc[workflow]) acc[workflow] = { total_cost: 0, count: 0 };
            acc[workflow].total_cost += (g.firecrawl_cost_usd || 0) + (g.gemini_cost_usd || 0);
            acc[workflow].count += 1;
            return acc;
        }, {} as Record<string, { total_cost: number, count: number }>) || {};

        const costByWorkflow = Object.entries(costByWorkflowRaw).map(([workflow, data]) => ({
            workflow,
            total_cost: data.total_cost,
            generation_count: data.count,
            percentage: ((data.total_cost / totalOverallCost) * 100).toFixed(2)
        })).sort((a, b) => b.total_cost - a.total_cost);

        const userCostsRaw = apiCostsData?.reduce((acc, g) => {
            const uid = String(g.user_id);
            if (!acc[uid]) acc[uid] = { total_cost: 0, count: 0 };
            acc[uid].total_cost += (g.firecrawl_cost_usd || 0) + (g.gemini_cost_usd || 0);
            acc[uid].count += 1;
            return acc;
        }, {} as Record<string, { total_cost: number, count: number }>) || {};

        const topSpenders = Object.entries(userCostsRaw)
            .map(([uid, data]) => ({
                email: usersList?.find(u => String(u.id) === uid)?.email || 'Unknown',
                total_spent: data.total_cost,
                generation_count: data.count
            }))
            .sort((a, b) => b.total_spent - a.total_spent)
            .slice(0, 10);

        return successResponse({
            stats: {
                total_users: totalUsers || 0,
                new_users_today: newUsersToday || 0,
                total_generations: totalGenerations || 0,
                generations_today: generationsToday || 0,
                total_credits_consumed: totalGenerations || 0,
                credits_consumed_today: creditsConsumedToday,
                active_users_today: activeUsersToday
            },
            recent_activity: recentActivity?.map((a: any) => ({
                id: a.id,
                user_email: (Array.isArray(a.users) ? a.users[0]?.email : a.users?.email) || 'Unknown',
                workflow: a.workflow,
                url: a.url,
                created_at: a.created_at
            })) || [],
            users: usersWithStats,
            apiCosts,
            costByWorkflow,
            topSpenders
        });

    } catch (error) {
        return handleApiError(error);
    }
}
