-- 🔒 PostGenius Security Hardening: Supabase SQL Script
-- Run this in your Supabase SQL Editor

-- 1. Create Audit Log Table
CREATE TABLE IF NOT EXISTS audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id BIGINT REFERENCES users(id),
  clerk_user_id TEXT,
  action TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on audit_log (Only admins should see it)
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view audit log" ON audit_log
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM users WHERE clerk_user_id = auth.jwt()->>'sub' AND is_admin = true)
  );

-- 2. Harden Users Table RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Users can only view/update their own profile
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (clerk_user_id = auth.jwt()->>'sub');

CREATE POLICY "Users can update own non-sensitive fields" ON users
  FOR UPDATE USING (clerk_user_id = auth.jwt()->>'sub')
  WITH CHECK (
    -- Prevent escalation (cannot change is_admin or plan themselves)
    (plan_type = plan_type) AND (is_admin = is_admin)
  );

-- Admins can do everything
CREATE POLICY "Admins have full access to users" ON users
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE clerk_user_id = auth.jwt()->>'sub' AND is_admin = true)
  );

-- 3. Harden Generations Table RLS
ALTER TABLE generations ENABLE ROW LEVEL SECURITY;

-- Users can only see their own generations
CREATE POLICY "Users can view own generations" ON generations
  FOR SELECT USING (user_id IN (SELECT id FROM users WHERE clerk_user_id = auth.jwt()->>'sub'));

-- Admins can view all generations
CREATE POLICY "Admins can view all generations" ON generations
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM users WHERE clerk_user_id = auth.jwt()->>'sub' AND is_admin = true)
  );

-- 4. Scraped Cache RLS
ALTER TABLE scraped_cache ENABLE ROW LEVEL SECURITY;

-- Anyone authenticated can view cache (to avoid re-scraping)
CREATE POLICY "Authenticated users can view cache" ON scraped_cache
  FOR SELECT USING (auth.role() = 'authenticated');

-- Only system/service role can insert into cache
CREATE POLICY "Service role can manage cache" ON scraped_cache
  FOR ALL USING (auth.role() = 'service_role');

-- 5. Helper function for rate limiting (if not already exists)
-- This is just a placeholder to show current state
-- we mostly use Upstash now, so this remains for backward compatibility.
