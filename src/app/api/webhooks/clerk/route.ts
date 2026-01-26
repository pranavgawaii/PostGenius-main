import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { createClient } from '@supabase/supabase-js';
import { WebhookEvent } from '@clerk/nextjs/server';

// GET handler for testing
export async function GET() {
    return Response.json({
        status: 'Webhook endpoint is running',
        timestamp: new Date().toISOString()
    });
}

// POST handler for Clerk webhooks
export async function POST(req: Request) {
    console.log('🔔 ========== WEBHOOK POST RECEIVED ==========');
    console.log('⏰ Timestamp:', new Date().toISOString());

    try {
        // 1. Check environment variables
        const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        console.log('🔍 Environment check:', {
            hasWebhookSecret: !!webhookSecret,
            hasSupabaseUrl: !!supabaseUrl,
            hasSupabaseKey: !!supabaseKey
        });

        if (!webhookSecret) {
            console.error('❌ CLERK_WEBHOOK_SECRET is missing!');
            return Response.json({ error: 'Webhook secret not configured' }, { status: 500 });
        }

        if (!supabaseUrl || !supabaseKey) {
            console.error('❌ Supabase credentials missing!');
            return Response.json({ error: 'Supabase not configured' }, { status: 500 });
        }

        // 2. Get headers
        const headerPayload = await headers();
        const svix_id = headerPayload.get('svix-id');
        const svix_timestamp = headerPayload.get('svix-timestamp');
        const svix_signature = headerPayload.get('svix-signature');

        console.log('📝 Webhook headers:', {
            svix_id,
            svix_timestamp,
            hasSignature: !!svix_signature
        });

        if (!svix_id || !svix_timestamp || !svix_signature) {
            console.error('❌ Missing svix headers!');
            return Response.json({ error: 'Missing webhook headers' }, { status: 400 });
        }

        // 3. Get body
        const body = await req.text();
        console.log('📦 Webhook body length:', body.length);
        console.log('📦 Webhook body preview:', body.substring(0, 200));

        // 4. Verify signature
        const wh = new Webhook(webhookSecret);
        let evt: WebhookEvent;

        try {
            evt = wh.verify(body, {
                'svix-id': svix_id,
                'svix-timestamp': svix_timestamp,
                'svix-signature': svix_signature,
            }) as WebhookEvent;
            console.log('✅ Signature verified successfully');
        } catch (err) {
            console.error('❌ Signature verification failed:', err);
            return Response.json({ error: 'Invalid signature' }, { status: 401 });
        }

        // 5. Handle event
        const eventType = evt.type;
        console.log('📨 Event type:', eventType);

        if (eventType === 'user.created') {
            console.log('👤 Processing user.created event');

            const { id, email_addresses } = evt.data;
            const email = email_addresses?.[0]?.email_address;

            console.log('📧 User details:', {
                clerk_user_id: id,
                email: email
            });

            if (!email) {
                console.error('❌ No email found in webhook data!');
                return Response.json({ error: 'No email in webhook' }, { status: 400 });
            }

            // 6. Create Supabase client
            const supabase = createClient(supabaseUrl, supabaseKey, {
                auth: {
                    persistSession: false,
                    autoRefreshToken: false,
                }
            });
            console.log('✅ Supabase client created');

            // 7. Insert user
            console.log('💾 Attempting to insert user into Supabase...');

            const { data, error } = await supabase
                .from('users')
                .insert({
                    clerk_user_id: id,
                    email: email,
                    plan_type: 'free',
                    daily_request_count: 0,
                    total_generations: 0
                })
                .select();

            if (error) {
                // Check if it's a duplicate (user already exists)
                if (error.code === '23505') {
                    console.log('ℹ️ User already exists in database (duplicate key)');
                    return Response.json({
                        success: true,
                        message: 'User already exists'
                    });
                }

                console.error('❌ Failed to insert user:', error);
                console.error('Error details:', {
                    message: error.message,
                    details: error.details,
                    hint: error.hint,
                    code: error.code
                });

                return Response.json({
                    error: 'Database error',
                    details: error.message
                }, { status: 500 });
            }

            console.log('✅ User created successfully in Supabase!');
            console.log('✅ User data:', data);
            console.log('========== WEBHOOK COMPLETED SUCCESSFULLY ==========\n');

            return Response.json({
                success: true,
                message: 'User created',
                user_id: id
            });
        }

        // Other event types (updated, deleted)
        if (eventType === 'user.updated') {
            console.log('👤 Processing user.updated event');
            const { id, email_addresses } = evt.data;
            const email = email_addresses?.[0]?.email_address;

            if (id && email) {
                const supabase = createClient(supabaseUrl, supabaseKey);
                const { error } = await supabase
                    .from('users')
                    .update({ email })
                    .eq('clerk_user_id', id);

                if (error) console.error('❌ Update failed:', error.message);
                else console.log('✅ User email updated');
            }
        }

        if (eventType === 'user.deleted') {
            console.log('👤 Processing user.deleted event');
            const { id } = evt.data;
            if (id) {
                const supabase = createClient(supabaseUrl, supabaseKey);
                const { error } = await supabase
                    .from('users')
                    .delete()
                    .eq('clerk_user_id', id);

                if (error) console.error('❌ Deletion failed:', error.message);
                else console.log('✅ User deleted');
            }
        }

        console.log('ℹ️ Event type handled:', eventType);
        return Response.json({ success: true, message: `Event ${eventType} processed` });

    } catch (error) {
        console.error('💥 CRITICAL ERROR IN WEBHOOK:', error);
        console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');

        return Response.json({
            error: 'Internal server error',
            message: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
