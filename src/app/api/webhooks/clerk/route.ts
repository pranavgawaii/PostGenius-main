import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { createClient } from '@supabase/supabase-js';
import { WebhookEvent } from '@clerk/nextjs/server';
import { handleApiError } from '@/lib/errors';

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '1mb'
        }
    }
};

// POST handler for Clerk webhooks
export async function POST(req: Request) {
    try {
        const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!webhookSecret || !supabaseUrl || !supabaseKey) {
            throw new Error("Missing critical environment variables for webhook");
        }

        const headerPayload = await headers();
        const svix_id = headerPayload.get('svix-id');
        const svix_timestamp = headerPayload.get('svix-timestamp');
        const svix_signature = headerPayload.get('svix-signature');

        if (!svix_id || !svix_timestamp || !svix_signature) {
            return Response.json({ error: 'Missing webhook headers' }, { status: 400 });
        }

        const body = await req.text();
        const wh = new Webhook(webhookSecret);
        let evt: WebhookEvent;

        try {
            evt = wh.verify(body, {
                'svix-id': svix_id,
                'svix-timestamp': svix_timestamp,
                'svix-signature': svix_signature,
            }) as WebhookEvent;
        } catch (err) {
            return Response.json({ error: 'Invalid signature' }, { status: 401 });
        }

        const eventType = evt.type;
        const supabase = createClient(supabaseUrl, supabaseKey, {
            auth: { persistSession: false, autoRefreshToken: false }
        });

        if (eventType === 'user.created') {
            const { id, email_addresses } = evt.data;
            const email = email_addresses?.[0]?.email_address;
            if (!email) return Response.json({ error: 'No email in webhook' }, { status: 400 });

            const { error } = await supabase
                .from('users')
                .insert({
                    clerk_user_id: id,
                    email: email,
                    plan_type: 'free',
                });

            if (error && error.code !== '23505') throw error;
        }

        if (eventType === 'user.updated') {
            const { id, email_addresses } = evt.data;
            const email = email_addresses?.[0]?.email_address;
            if (id && email) {
                await supabase.from('users').update({ email }).eq('clerk_user_id', id);
            }
        }

        if (eventType === 'user.deleted') {
            const { id } = evt.data;
            if (id) await supabase.from('users').delete().eq('clerk_user_id', id);
        }

        return Response.json({ success: true });

    } catch (error) {
        return handleApiError(error);
    }
}
