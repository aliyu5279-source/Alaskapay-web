-- Add rate limiting columns to webhook_endpoints
ALTER TABLE webhook_endpoints
ADD COLUMN rate_limit_enabled BOOLEAN DEFAULT false,
ADD COLUMN max_requests_per_minute INTEGER DEFAULT 100,
ADD COLUMN burst_limit INTEGER DEFAULT 10,
ADD COLUMN rate_limit_window_seconds INTEGER DEFAULT 60;

-- Create webhook_rate_limit_tracking table
CREATE TABLE webhook_rate_limit_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  webhook_id UUID REFERENCES webhook_endpoints(id) ON DELETE CASCADE,
  window_start TIMESTAMPTZ NOT NULL,
  request_count INTEGER DEFAULT 0,
  throttled_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create webhook_queue table for throttled requests
CREATE TABLE webhook_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  webhook_id UUID REFERENCES webhook_endpoints(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL,
  scheduled_for TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'queued', -- queued, processing, delivered, failed
  attempts INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  processed_at TIMESTAMPTZ
);

-- Indexes for performance
CREATE INDEX idx_rate_limit_tracking_webhook ON webhook_rate_limit_tracking(webhook_id, window_start);
CREATE INDEX idx_webhook_queue_scheduled ON webhook_queue(scheduled_for, status);
CREATE INDEX idx_webhook_queue_webhook ON webhook_queue(webhook_id, status);

-- RLS policies
ALTER TABLE webhook_rate_limit_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_queue ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view rate limit tracking"
  ON webhook_rate_limit_tracking FOR SELECT
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can manage webhook queue"
  ON webhook_queue FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');
