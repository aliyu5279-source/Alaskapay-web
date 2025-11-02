import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { supabase } from '@/lib/supabase';

interface ChartData {
  timestamp: string;
  avgResponseTime: number;
  p95ResponseTime: number;
}

export function WebhookResponseTimeChart({ webhookId, days = 7 }: { webhookId?: string; days?: number }) {
  const [data, setData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [webhookId, days]);

  const loadData = async () => {
    try {
      const { data: analytics, error } = await supabase.functions.invoke('webhook-analytics', {
        body: { action: 'get_response_time_trend', webhook_id: webhookId, days }
      });

      if (error) throw error;

      const chartData = analytics.data.map((item: any) => ({
        timestamp: new Date(item.hour_timestamp).toLocaleString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          hour: '2-digit' 
        }),
        avgResponseTime: item.avg_response_time_ms || 0,
        p95ResponseTime: item.p95_response_time_ms || 0
      }));

      setData(chartData);
    } catch (error) {
      console.error('Error loading response time data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading chart...</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Response Time Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="timestamp" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="avgResponseTime" 
              stroke="#3b82f6" 
              name="Avg Response (ms)" 
              strokeWidth={2}
            />
            <Line 
              type="monotone" 
              dataKey="p95ResponseTime" 
              stroke="#f59e0b" 
              name="P95 Response (ms)" 
              strokeWidth={2}
              strokeDasharray="5 5"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
