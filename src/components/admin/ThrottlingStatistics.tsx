import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { Activity, Clock, AlertCircle, TrendingUp } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface ThrottlingStats {
  totalRequests: number;
  throttledRequests: number;
  throttleRate: number;
  queuedRequests: number;
  avgWaitTime: number;
}

interface ThrottlingStatisticsProps {
  webhookId: string;
}

export function ThrottlingStatistics({ webhookId }: ThrottlingStatisticsProps) {
  const [stats, setStats] = useState<ThrottlingStats>({
    totalRequests: 0,
    throttledRequests: 0,
    throttleRate: 0,
    queuedRequests: 0,
    avgWaitTime: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStatistics();
    const interval = setInterval(loadStatistics, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, [webhookId]);

  const loadStatistics = async () => {
    try {
      // Get rate limit tracking data
      const { data: tracking } = await supabase
        .from('webhook_rate_limit_tracking')
        .select('*')
        .eq('webhook_id', webhookId)
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

      // Get queue data
      const { data: queue } = await supabase
        .from('webhook_queue')
        .select('*')
        .eq('webhook_id', webhookId)
        .eq('status', 'queued');

      const totalRequests = tracking?.reduce((sum, t) => sum + t.request_count, 0) || 0;
      const throttledRequests = tracking?.reduce((sum, t) => sum + (t.throttled_count || 0), 0) || 0;
      const throttleRate = totalRequests > 0 ? (throttledRequests / totalRequests) * 100 : 0;

      // Calculate average wait time for queued requests
      const now = new Date();
      const avgWaitTime = queue && queue.length > 0
        ? queue.reduce((sum, q) => {
            const scheduledFor = new Date(q.scheduled_for);
            return sum + Math.max(0, (scheduledFor.getTime() - now.getTime()) / 1000);
          }, 0) / queue.length
        : 0;

      setStats({
        totalRequests,
        throttledRequests,
        throttleRate,
        queuedRequests: queue?.length || 0,
        avgWaitTime,
      });
    } catch (error) {
      console.error('Failed to load throttling statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading statistics...</div>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Request Volume (24h)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalRequests.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Total webhook requests
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            Throttled Requests
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.throttledRequests.toLocaleString()}</div>
          <Progress value={stats.throttleRate} className="mt-2" />
          <p className="text-xs text-muted-foreground mt-1">
            {stats.throttleRate.toFixed(1)}% throttle rate
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Queued Requests
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.queuedRequests}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Waiting for delivery
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Avg Wait Time
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{Math.round(stats.avgWaitTime)}s</div>
          <p className="text-xs text-muted-foreground mt-1">
            Average queue delay
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
