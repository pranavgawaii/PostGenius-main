import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { handleApiError, successResponse } from '@/lib/errors'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
    return handleReset(request);
}

export async function POST(request: Request) {
    return handleReset(request);
}

async function handleReset(request: Request) {
    try {
        // 1. SECURITY: Check secret token
        const authHeader = request.headers.get('authorization');
        const cronSecret = process.env.CRON_SECRET;

        // Vercel Cron jobs send 'Bearer CRON_SECRET'
        if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        // 2. Initialize Supabase
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // 3. FETCH FREE USERS
        const { data: freeUsers, error: fetchError } = await supabase
            .from('users')
            .select('id, last_credit_reset')
            .eq('plan', 'free');

        if (fetchError) throw fetchError;

        // 4. RESET LOGIC (IST TARGETED)
        // Get today's date in IST format YYYY-MM-DD
        const now = new Date();
        const istDate = new Intl.DateTimeFormat('en-CA', {
            timeZone: 'Asia/Kolkata',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).format(now); // "YYYY-MM-DD" in IST

        const userIds = freeUsers
            .filter(user => {
                if (!user.last_credit_reset) return true;

                // Compare previous reset date in IST
                const lastResetDateIst = new Intl.DateTimeFormat('en-CA', {
                    timeZone: 'Asia/Kolkata',
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit'
                }).format(new Date(user.last_credit_reset));

                return lastResetDateIst < istDate;
            })
            .map(u => u.id);

        if (userIds.length === 0) {
            return successResponse({ updated: 0, message: "All users up to date in IST" });
        }

        // 5. BATCH UPDATE
        const { error: updateError } = await supabase
            .from('users')
            .update({
                credits_remaining: 5,
                last_credit_reset: now.toISOString()
            })
            .in('id', userIds);

        if (updateError) throw updateError;

        return successResponse({
            updated: userIds.length,
            message: 'Credits reset successfully for IST day'
        });

    } catch (error) {
        return handleApiError(error);
    }
}
