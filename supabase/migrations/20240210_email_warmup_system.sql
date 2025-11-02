-- Email Domain Warmup System
-- Gradually increases sending volume for new domains

-- Warmup schedules table
CREATE TABLE IF NOT EXISTS email_warmup_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  domain_id UUID REFERENCES email_sending_domains(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'failed')),
  start_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  current_day INTEGER NOT NULL DEFAULT 1,
  daily_limit INTEGER NOT NULL DEFAULT 100,
  target_daily_limit INTEGER NOT NULL DEFAULT 10000,
  increase_percentage DECIMAL(5,2) NOT NULL DEFAULT 50.00,
  increase_interval_days INTEGER NOT NULL DEFAULT 3,
  last_increase_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  completion_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Daily sending tracking
CREATE TABLE IF NOT EXISTS email_warmup_daily_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  schedule_id UUID REFERENCES email_warmup_schedules(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  emails_sent INTEGER NOT NULL DEFAULT 0,
  emails_delivered INTEGER NOT NULL DEFAULT 0,
  emails_bounced INTEGER NOT NULL DEFAULT 0,
  emails_complained INTEGER NOT NULL DEFAULT 0,
  bounce_rate DECIMAL(5,2) GENERATED ALWAYS AS (
    CASE WHEN emails_sent > 0 THEN (emails_bounced::DECIMAL / emails_sent * 100) ELSE 0 END
  ) STORED,
  complaint_rate DECIMAL(5,2) GENERATED ALWAYS AS (
    CASE WHEN emails_sent > 0 THEN (emails_complained::DECIMAL / emails_sent * 100) ELSE 0 END
  ) STORED,
  daily_limit INTEGER NOT NULL,
  limit_reached BOOLEAN DEFAULT FALSE,
  throttled BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Warmup milestones
CREATE TABLE IF NOT EXISTS email_warmup_milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  schedule_id UUID REFERENCES email_warmup_schedules(id) ON DELETE CASCADE,
  milestone_type TEXT NOT NULL CHECK (milestone_type IN ('day_reached', 'volume_reached', 'completion', 'throttled', 'resumed')),
  milestone_value INTEGER,
  description TEXT NOT NULL,
  achieved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notified BOOLEAN DEFAULT FALSE
);

-- Warmup throttling rules
CREATE TABLE IF NOT EXISTS email_warmup_throttle_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  bounce_rate_threshold DECIMAL(5,2) NOT NULL DEFAULT 5.00,
  complaint_rate_threshold DECIMAL(5,2) NOT NULL DEFAULT 0.50,
  action TEXT NOT NULL CHECK (action IN ('pause', 'reduce_50', 'reduce_25', 'alert_only')),
  cooldown_days INTEGER NOT NULL DEFAULT 2,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default throttling rules
INSERT INTO email_warmup_throttle_rules (name, bounce_rate_threshold, complaint_rate_threshold, action, cooldown_days) VALUES
('Critical - Pause', 10.00, 1.00, 'pause', 3),
('High - Reduce 50%', 7.00, 0.75, 'reduce_50', 2),
('Medium - Reduce 25%', 5.00, 0.50, 'reduce_25', 1),
('Low - Alert Only', 3.00, 0.30, 'alert_only', 0);

-- Indexes
CREATE INDEX idx_warmup_schedules_domain ON email_warmup_schedules(domain_id);
CREATE INDEX idx_warmup_schedules_status ON email_warmup_schedules(status);
CREATE INDEX idx_warmup_daily_stats_schedule ON email_warmup_daily_stats(schedule_id);
CREATE INDEX idx_warmup_daily_stats_date ON email_warmup_daily_stats(date);
CREATE INDEX idx_warmup_milestones_schedule ON email_warmup_milestones(schedule_id);

-- RLS Policies
ALTER TABLE email_warmup_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_warmup_daily_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_warmup_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_warmup_throttle_rules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage warmup schedules" ON email_warmup_schedules FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Admins can view daily stats" ON email_warmup_daily_stats FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Admins can view milestones" ON email_warmup_milestones FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Admins can manage throttle rules" ON email_warmup_throttle_rules FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
