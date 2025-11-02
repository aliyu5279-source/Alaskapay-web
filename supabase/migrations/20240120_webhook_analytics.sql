-- Webhook Analytics System
-- Aggregated analytics tables for comprehensive webhook monitoring

-- Create webhook analytics aggregation table
CREATE TABLE IF NOT EXISTS webhook_analytics_hourly (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  webhook_endpoint_id UUID REFERENCES webhook_endpoints(id) ON DELETE CASCADE,
  hour_timestamp TIMESTAMPTZ NOT NULL,
  total_requests INTEGER DEFAULT 0,
  successful_requests INTEGER DEFAULT 0,
  failed_requests INTEGER DEFAULT 0,
  avg_response_time_ms INTEGER DEFAULT 0,
  min_response_time_ms INTEGER,
  max_response_time_ms INTEGER,
  p95_response_time_ms INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(webhook_endpoint_id, hour_timestamp)
);

-- Create webhook failure reasons table
CREATE TABLE IF NOT EXISTS webhook_failure_reasons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  webhook_endpoint_id UUID REFERENCES webhook_endpoints(id) ON DELETE CASCADE,
  failure_reason TEXT NOT NULL,
  failure_count INTEGER DEFAULT 1,
  last_occurred_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(webhook_endpoint_id, failure_reason)
);

-- Create webhook performance alerts table
CREATE TABLE IF NOT EXISTS webhook_performance_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  webhook_endpoint_id UUID REFERENCES webhook_endpoints(id) ON DELETE CASCADE,
  alert_type TEXT NOT NULL, -- 'high_failure_rate', 'slow_response', 'endpoint_down'
  threshold_value NUMERIC,
  current_value NUMERIC,
  alert_message TEXT,
  is_resolved BOOLEAN DEFAULT FALSE,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes
CREATE INDEX idx_analytics_hourly_webhook ON webhook_analytics_hourly(webhook_endpoint_id);
CREATE INDEX idx_analytics_hourly_timestamp ON webhook_analytics_hourly(hour_timestamp);
CREATE INDEX idx_failure_reasons_webhook ON webhook_failure_reasons(webhook_endpoint_id);
CREATE INDEX idx_performance_alerts_webhook ON webhook_performance_alerts(webhook_endpoint_id);
CREATE INDEX idx_performance_alerts_unresolved ON webhook_performance_alerts(is_resolved) WHERE is_resolved = FALSE;

-- Enable RLS
ALTER TABLE webhook_analytics_hourly ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_failure_reasons ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_performance_alerts ENABLE ROW LEVEL SECURITY;

-- RLS Policies (admin only)
CREATE POLICY "Admin can view analytics" ON webhook_analytics_hourly FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Admin can view failure reasons" ON webhook_failure_reasons FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Admin can manage alerts" ON webhook_performance_alerts FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
);
