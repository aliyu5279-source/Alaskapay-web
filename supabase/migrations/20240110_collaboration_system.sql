-- Enable Realtime for custom_report_templates table
ALTER PUBLICATION supabase_realtime ADD TABLE custom_report_templates;

-- Create report_collaboration_sessions table for tracking active sessions
CREATE TABLE IF NOT EXISTS report_collaboration_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID REFERENCES custom_report_templates(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  session_end TIMESTAMP WITH TIME ZONE,
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  cursor_position JSONB,
  selected_field TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create report_edit_history table for tracking all edits
CREATE TABLE IF NOT EXISTS report_edit_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID REFERENCES custom_report_templates(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  field_name TEXT NOT NULL,
  old_value JSONB,
  new_value JSONB,
  edit_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  version_number INTEGER DEFAULT 1,
  conflict_resolved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_collaboration_sessions_report ON report_collaboration_sessions(report_id);
CREATE INDEX idx_collaboration_sessions_user ON report_collaboration_sessions(user_id);
CREATE INDEX idx_edit_history_report ON report_edit_history(report_id);
CREATE INDEX idx_edit_history_timestamp ON report_edit_history(edit_timestamp DESC);

-- Enable RLS
ALTER TABLE report_collaboration_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE report_edit_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view collaboration sessions" ON report_collaboration_sessions
  FOR SELECT USING (true);

CREATE POLICY "Users can create their own sessions" ON report_collaboration_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sessions" ON report_collaboration_sessions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view edit history" ON report_edit_history
  FOR SELECT USING (true);

CREATE POLICY "Users can create edit history" ON report_edit_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);
