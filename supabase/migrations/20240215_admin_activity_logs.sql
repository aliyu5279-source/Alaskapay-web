-- Admin Activity Logs Table
CREATE TABLE IF NOT EXISTS admin_activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action_type VARCHAR(100) NOT NULL,
  target_resource VARCHAR(255),
  target_id VARCHAR(255),
  changes_made JSONB,
  ip_address INET,
  user_agent TEXT,
  status VARCHAR(50) DEFAULT 'success',
  error_message TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_admin_activity_admin_id ON admin_activity_logs(admin_id);
CREATE INDEX idx_admin_activity_action_type ON admin_activity_logs(action_type);
CREATE INDEX idx_admin_activity_created_at ON admin_activity_logs(created_at DESC);
CREATE INDEX idx_admin_activity_target_resource ON admin_activity_logs(target_resource);

-- RLS Policies
ALTER TABLE admin_activity_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can view activity logs
CREATE POLICY "Admins can view all activity logs"
  ON admin_activity_logs FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- System can insert logs
CREATE POLICY "System can insert activity logs"
  ON admin_activity_logs FOR INSERT
  TO authenticated
  WITH CHECK (true);
