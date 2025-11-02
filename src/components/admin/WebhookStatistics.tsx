import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, Clock, TrendingUp } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface WebhookStats {
  webhook_id: string;
  webhook_name: string;
  total_deliveries: number;
  successful_deliveries: number;
  failed_deliveries: number;
  success_rate: number;
  avg_response_time: number;
}

export function WebhookStatistics() {
  const [stats, setStats] = useState<WebhookStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [totals, setTotals] = useState({
    total: 0,
    success: 0,
    failed: 0,
    avgTime: 0
  });

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    try {
      // Get webhook statistics
      const { data: webhooks } = await supabase
        .from('webhook_endpoints')
        .select('id, name');

      if (!webhooks) return;

      const statsPromises = webhooks.map(async (webhook) => {
        const { data: logs } = await supabase
          .from('webhook_delivery_logs')
          .select('delivery_status, duration_ms')
          .eq('webhook_endpoint_id', webhook.id);

        if (!logs || logs.length === 0) {
          return {
            webhook_id: webhook.id,
            webhook_name: webhook.name,
            total_deliveries: 0,
            successful_deliveries: 0,
            failed_deliveries: 0,
            success_rate: 0,
            avg_response_time: 0
          };
        }

        const total = logs.length;
        const successful = logs.filter(l => l.delivery_status === 'success').length;
        const failed = logs.filter(l => l.delivery_status === 'failed').length;
        const avgTime = Math.round(
          logs.reduce((sum, l) => sum + (l.duration_ms || 0), 0) / total
        );

        return {
          webhook_id: webhook.id,
          webhook_name: webhook.name,
          total_deliveries: total,
          successful_deliveries: successful,
          failed_deliveries: failed,
          success_rate: Math.round((successful / total) * 100),
          avg_response_time: avgTime
        };
      });

      const results = await Promise.all(statsPromises);
      setStats(results);

      // Calculate totals
      const totalDeliveries = results.reduce((sum, s) => sum + s.total_deliveries, 0);
      const totalSuccess = results.reduce((sum, s) => sum + s.successful_deliveries, 0);
      const totalFailed = results.reduce((sum, s) => sum + s.failed_deliveries, 0);
      const avgResponseTime = Math.round(
        results.reduce((sum, s) => sum + s.avg_response_time, 0) / results.length
      );

      setTotals({
        total: totalDeliveries,
        success: totalSuccess,
        failed: totalFailed,
        avgTime: avgResponseTime
      });
    } catch (error) {
      console.error('Error loading statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading statistics...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Deliveries</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totals.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Successful</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{totals.success}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Failed</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{totals.failed}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totals.avgTime}ms</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Webhook Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.map(stat => (
              <div key={stat.webhook_id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <div className="font-medium">{stat.webhook_name}</div>
                  <div className="text-sm text-muted-foreground">
                    {stat.total_deliveries} deliveries • {stat.avg_response_time}ms avg
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">{stat.success_rate}%</div>
                  <div className="text-sm text-muted-foreground">success rate</div>
                </div>
              </div>
            ))}

            {stats.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No statistics available yet
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
