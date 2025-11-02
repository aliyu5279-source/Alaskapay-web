-- Create notification_preferences table
CREATE TABLE IF NOT EXISTS notification_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  welcome_emails BOOLEAN DEFAULT true,
  password_reset_emails BOOLEAN DEFAULT true,
  payment_confirmations BOOLEAN DEFAULT true,
  transaction_receipts BOOLEAN DEFAULT true,
  account_activity_alerts BOOLEAN DEFAULT true,
  marketing_emails BOOLEAN DEFAULT false,
  new_device_login BOOLEAN DEFAULT true,
  failed_login_attempts BOOLEAN DEFAULT true,
  large_transactions BOOLEAN DEFAULT true,
  password_changes BOOLEAN DEFAULT true,
  email_changes BOOLEAN DEFAULT true,
  two_factor_changes BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create notification_history table
CREATE TABLE IF NOT EXISTS notification_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  notification_type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies for notification_preferences
CREATE POLICY "Users can view own preferences"
  ON notification_preferences FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own preferences"
  ON notification_preferences FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences"
  ON notification_preferences FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for notification_history
CREATE POLICY "Users can view own notifications"
  ON notification_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
  ON notification_history FOR UPDATE
  USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX idx_notification_preferences_user ON notification_preferences(user_id);
CREATE INDEX idx_notification_history_user ON notification_history(user_id);
CREATE INDEX idx_notification_history_sent ON notification_history(sent_at DESC);
CREATE INDEX idx_notification_history_type ON notification_history(notification_type);
