import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { supabase } from '@/lib/supabase';

const COLORS = ['#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16', '#22c55e'];

interface FailureData {
  name: string;
  value: number;
}

export function WebhookFailureReasonsChart({ webhookId }: { webhookId?: string }) {
  const [data, setData] = useState<FailureData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [webhookId]);

  const loadData = async () => {
    try {
      let query = supabase
        .from('webhook_delivery_logs')
        .select('error_message, delivery_status')
        .eq('delivery_status', 'failed');

      if (webhookId) {
        query = query.eq('webhook_endpoint_id', webhookId);
      }

      const { data: logs } = await query;

      if (!logs || logs.length === 0) {
        setData([]);
        setLoading(false);
        return;
      }

      const reasonCounts: Record<string, number> = {};
      logs.forEach(log => {
        const reason = log.error_message || 'Unknown Error';
        const shortReason = reason.length > 30 ? reason.substring(0, 30) + '...' : reason;
        reasonCounts[shortReason] = (reasonCounts[shortReason] || 0) + 1;
      });

      const chartData = Object.entries(reasonCounts)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 6);

      setData(chartData);
    } catch (error) {
      console.error('Error loading failure reasons:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading chart...</div>;

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Failure Reasons Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            No failures recorded
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Failure Reasons Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
