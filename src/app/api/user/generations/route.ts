import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabase";

export async function GET(req: Request) {
    try {
        const { userId: clerkUserId } = await auth();
        if (!clerkUserId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const limit = parseInt(searchParams.get("limit") || "10");
        const offset = parseInt(searchParams.get("offset") || "0");

        // Get user id first
        const { data: user } = await supabase
            .from("users")
            .select("id")
            .eq("clerk_user_id", clerkUserId)
            .single();

        if (!user) {
            return NextResponse.json([]);
        }

        const { data, error } = await supabase
            .from("generations")
            .select("*, newsletter_caption:Newsletter_caption, blog_caption:Blog_caption")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false })
            .range(offset, offset + limit - 1);

        if (error) throw error;

        return NextResponse.json(data);
    } catch (error: any) {
        console.error("Generations fetch error:", error.message);
        return NextResponse.json({ error: "Failed to fetch generations" }, { status: 500 });
    }
}
