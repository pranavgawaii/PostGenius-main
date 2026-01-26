-- ==========================================================
-- 1. CREATE plan_limits TABLE
-- ==========================================================
CREATE TABLE IF NOT EXISTS plan_limits (
    plan_type text PRIMARY KEY,
    daily_limit int NOT NULL,
    monthly_price int NOT NULL,
    features jsonb NOT NULL,
    display_name text NOT NULL,
    description text NOT NULL
);

-- ==========================================================
-- 2. INSERT INITIAL PLAN DATA
-- ==========================================================
INSERT INTO plan_limits (plan_type, daily_limit, monthly_price, features, display_name, description)
VALUES 
(
    'free', 
    5, 
    0, 
    '{"platforms": 6, "cache": true, "priority_support": false, "api_access": false, "custom_tone": false, "hashtag_generator": false, "export_csv": false}',
    'Free',
    'Perfect for casual creators'
),
(
    'premium', 
    50, 
    149, 
    '{"platforms": 6, "cache": true, "priority_support": true, "api_access": false, "custom_tone": true, "hashtag_generator": true, "export_csv": true}',
    'Premium',
    'For serious social growers'
),
(
    'pro', 
    200, 
    399, 
    '{"platforms": 6, "cache": true, "priority_support": true, "api_access": true, "custom_tone": true, "hashtag_generator": true, "export_csv": true}',
    'Professional',
    'The ultimate content engine'
),
(
    'unlimited', 
    999999, 
    0, 
    '{"platforms": 6, "cache": true, "priority_support": true, "api_access": true, "custom_tone": true, "hashtag_generator": true, "export_csv": true}',
    'Unlimited',
    'Developer/Admin Access'
)
ON CONFLICT (plan_type) DO UPDATE SET
    daily_limit = EXCLUDED.daily_limit,
    monthly_price = EXCLUDED.monthly_price,
    features = EXCLUDED.features,
    display_name = EXCLUDED.display_name,
    description = EXCLUDED.description;

-- ==========================================================
-- 3. UPDATE check_user_rate_limit FUNCTION
-- ==========================================================
CREATE OR REPLACE FUNCTION check_user_rate_limit(user_clerk_id text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    user_record RECORD;
    plan_rec RECORD;
    v_remaining int;
    v_daily_limit int;
    v_reset_at timestamp with time zone;
    v_plan_type text;
    v_used_count int;
BEGIN
    -- 1. Get user and their plan
    SELECT u.*, u.plan_type as user_plan INTO user_record
    FROM users u
    WHERE u.clerk_user_id = user_clerk_id;

    IF NOT FOUND THEN
        -- Auto-create user record if missing (Safety net)
        -- Note: email is a placeholder as Clerk webhook usually handles this
        INSERT INTO users (clerk_user_id, email, plan_type, daily_request_count, last_request_date)
        VALUES (user_clerk_id, 're-syncing@user.com', 'free', 0, CURRENT_DATE)
        RETURNING *, plan_type as user_plan INTO user_record;
    END IF;

    -- 2. Get limits for this plan
    SELECT * INTO plan_rec
    FROM plan_limits
    WHERE plan_type = user_record.user_plan;

    -- Fallback to free plan limits if not found
    IF NOT FOUND THEN
        SELECT * INTO plan_rec FROM plan_limits WHERE plan_type = 'free';
    END IF;

    v_daily_limit := plan_rec.daily_limit;
    v_plan_type := user_record.user_plan;
    v_used_count := COALESCE(user_record.daily_request_count, 0);

    -- 3. Handle limit reset (if date is older than today or NULL)
    IF user_record.last_request_date IS NULL OR user_record.last_request_date < CURRENT_DATE THEN
        UPDATE users
        SET daily_request_count = 0,
            last_request_date = CURRENT_DATE
        WHERE clerk_user_id = user_clerk_id;
        
        v_used_count := 0;
    END IF;

    -- 4. Check if allowed
    IF v_used_count < v_daily_limit THEN
        v_remaining := v_daily_limit - v_used_count;
        RETURN json_build_object(
            'allowed', true,
            'remaining', v_remaining,
            'daily_limit', v_daily_limit,
            'plan_type', v_plan_type,
            'reset_at', (CURRENT_DATE + 1)::timestamp with time zone
        );
    ELSE
        RETURN json_build_object(
            'allowed', false,
            'remaining', 0,
            'daily_limit', v_daily_limit,
            'plan_type', v_plan_type,
            'reset_at', (CURRENT_DATE + 1)::timestamp with time zone,
            'error', 'Daily generation limit reached (' || v_daily_limit || '/' || v_daily_limit || '). Upgrade your plan for more!'
        );
    END IF;
END;
$$;

-- ==========================================================
-- 4. SET UNLIMITED PLAN FOR SPECIFIC USER
-- ==========================================================
UPDATE users 
SET plan_type = 'unlimited' 
WHERE clerk_user_id = 'user_35fMXAgMxPvEMhcLHZiJyMZIZPK';

-- Verification
SELECT clerk_user_id, email, plan_type 
FROM users 
WHERE clerk_user_id = 'user_35fMXAgMxPvEMhcLHZiJyMZIZPK';
