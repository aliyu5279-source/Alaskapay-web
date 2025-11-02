import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { supabase } from '@/lib/supabase';

interface ChartData {
  timestamp: string;
  successRate: number;
  totalRequests: number;
}

export function WebhookSuccessRateChart({ webhookId, days = 7 }: { webhookId?: string; days?: number }) {
  const [data, setData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [webhookId, days]);

  const loadData = async () => {
    try {
      const { data: analytics, error } = await supabase.functions.invoke('webhook-analytics', {
        body: { action: 'get_success_rate_trend', webhook_id: webhookId, days }
      });

      if (error) throw error;

      const chartData = analytics.data.map((item: any) => ({
        timestamp: new Date(item.hour_timestamp).toLocaleString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          hour: '2-digit' 
        }),
        successRate: item.total_requests > 0 
          ? Math.round((item.successful_requests / item.total_requests) * 100) 
          : 0,
        totalRequests: item.total_requests
      }));

      setData(chartData);
    } catch (error) {
      console.error('Error loading success rate data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading chart...</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Success Rate Over Time</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="timestamp" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="successRate" 
              stroke="#10b981" 
              name="Success Rate (%)" 
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
