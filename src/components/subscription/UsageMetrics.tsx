import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Activity, TrendingUp, Zap } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function UsageMetrics() {
  const [usage, setUsage] = useState<any>(null);
  const [limits, setLimits] = useState<any>(null);

  useEffect(() => {
    fetchUsage();
  }, []);

  const fetchUsage = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Get current subscription
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('*, subscription_plans(*)')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single();

    if (!subscription) return;

    setLimits(subscription.subscription_plans.usage_limits);

    // Get usage for current period
    const periodStart = new Date(subscription.current_period_start);
    const { data: usageData } = await supabase
      .from('subscription_usage')
      .select('metric, quantity')
      .eq('subscription_id', subscription.id)
      .gte('timestamp', periodStart.toISOString());

    if (usageData) {
      const aggregated = usageData.reduce((acc: any, item: any) => {
        acc[item.metric] = (acc[item.metric] || 0) + item.quantity;
        return acc;
      }, {});
      setUsage(aggregated);
    }
  };

  if (!usage || !limits) return null;

  const metrics = [
    { key: 'transactions', label: 'Transactions', icon: Activity },
    { key: 'transfers', label: 'Transfers', icon: TrendingUp },
    { key: 'api_calls', label: 'API Calls', icon: Zap }
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Usage This Period</h3>
      
      {metrics.map(({ key, label, icon: Icon }) => {
        const used = usage[key] || 0;
        const limit = limits[key];
        if (!limit) return null;

        const percentage = (used / limit) * 100;
        const isNearLimit = percentage >= 80;

        return (
          <Card key={key} className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Icon className="h-5 w-5 text-gray-600" />
                <span className="font-medium">{label}</span>
              </div>
              {isNearLimit && <Badge variant="destructive">Near Limit</Badge>}
            </div>
            
            <div className="space-y-2">
              <Progress value={percentage} className="h-2" />
              <div className="flex justify-between text-sm text-gray-600">
                <span>{used.toLocaleString()} used</span>
                <span>{limit.toLocaleString()} limit</span>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
