import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * Logs a sensitive action to the audit_log table.
 */
export async function logAction(userId: number | string | null, action: string, metadata: any = {}, req?: Request) {
    try {
        const ip = req ? (req.headers.get("x-real-ip") || req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown") : "system";
        const userAgent = req ? (req.headers.get("user-agent") || "unknown") : "system";

        const { error } = await supabase
            .from("audit_log")
            .insert({
                user_id: typeof userId === 'string' ? null : userId, // Handle null or clerk strings
                clerk_user_id: typeof userId === 'string' ? userId : null,
                action,
                ip_address: ip,
                user_agent: userAgent,
                metadata,
                created_at: new Date().toISOString()
            });

        if (error) {
            console.error("❌ FAILED TO WRITE AUDIT LOG:", error.message);
        }
    } catch (err) {
        console.error("❌ AUDIT LOG SYSTEM ERROR:", err);
    }
}
