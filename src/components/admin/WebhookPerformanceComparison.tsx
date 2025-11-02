import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Clock, CheckCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface PerformanceData {
  webhook_id: string;
  webhook_name: string;
  event_type: string;
  total_deliveries: number;
  success_rate: number;
  avg_response_time: number;
}

export function WebhookPerformanceComparison() {
  const [data, setData] = useState<PerformanceData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const { data: performance, error } = await supabase.functions.invoke('webhook-analytics', {
        body: { action: 'get_performance_comparison' }
      });

      if (error) throw error;
      setData(performance.data || []);
    } catch (error) {
      console.error('Error loading performance comparison:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading comparison...</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Comparison by Event Type</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map(item => (
            <div key={item.webhook_id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{item.webhook_name}</span>
                  <Badge variant="outline">{item.event_type}</Badge>
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {item.total_deliveries} total deliveries
                </div>
              </div>
              <div className="flex gap-6">
                <div className="text-center">
                  <div className="flex items-center gap-1">
                    {item.success_rate >= 95 ? (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    )}
                    <span className={`text-lg font-bold ${
                      item.success_rate >= 95 ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {item.success_rate}%
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">Success Rate</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-blue-500" />
                    <span className="text-lg font-bold">{item.avg_response_time}ms</span>
                  </div>
                  <div className="text-xs text-muted-foreground">Avg Response</div>
                </div>
              </div>
            </div>
          ))}

          {data.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No performance data available
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
