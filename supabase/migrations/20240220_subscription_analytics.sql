-- Subscription Analytics Views and Functions

-- View for MRR calculation
CREATE OR REPLACE VIEW subscription_mrr AS
SELECT 
  DATE_TRUNC('month', created_at) as month,
  SUM(CASE WHEN status = 'active' THEN amount ELSE 0 END) as total_mrr,
  SUM(CASE WHEN status = 'active' AND created_at >= DATE_TRUNC('month', CURRENT_DATE) THEN amount ELSE 0 END) as new_mrr,
  SUM(CASE WHEN status = 'cancelled' AND cancelled_at >= DATE_TRUNC('month', CURRENT_DATE) THEN amount ELSE 0 END) as churned_mrr
FROM subscriptions
GROUP BY month
ORDER BY month DESC;

-- View for churn rate calculation
CREATE OR REPLACE VIEW subscription_churn_rate AS
SELECT 
  DATE_TRUNC('month', cancelled_at) as month,
  COUNT(*) as churned_count,
  (SELECT COUNT(*) FROM subscriptions WHERE status = 'active') as active_count,
  ROUND((COUNT(*)::numeric / NULLIF((SELECT COUNT(*) FROM subscriptions WHERE status = 'active'), 0)) * 100, 2) as churn_rate
FROM subscriptions
WHERE cancelled_at IS NOT NULL
GROUP BY month
ORDER BY month DESC;

-- Function to calculate subscription analytics
CREATE OR REPLACE FUNCTION calculate_subscription_analytics(
  time_range TEXT DEFAULT '30d',
  requested_metrics TEXT DEFAULT 'all'
)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'mrr', (SELECT COALESCE(SUM(amount), 0) FROM subscriptions WHERE status = 'active'),
    'activeSubscriptions', (SELECT COUNT(*) FROM subscriptions WHERE status = 'active'),
    'churnRate', (SELECT COALESCE(AVG(churn_rate), 0) FROM subscription_churn_rate WHERE month >= CURRENT_DATE - INTERVAL '3 months'),
    'avgCLV', (SELECT COALESCE(AVG(amount * 12), 0) FROM subscriptions WHERE status = 'active')
  ) INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Grant permissions
GRANT SELECT ON subscription_mrr TO authenticated;
GRANT SELECT ON subscription_churn_rate TO authenticated;
GRANT EXECUTE ON FUNCTION calculate_subscription_analytics TO authenticated;
