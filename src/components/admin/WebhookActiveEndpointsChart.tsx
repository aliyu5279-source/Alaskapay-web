import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { supabase } from '@/lib/supabase';

interface EndpointData {
  name: string;
  requests: number;
}

export function WebhookActiveEndpointsChart() {
  const [data, setData] = useState<EndpointData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const { data: endpoints } = await supabase
        .from('webhook_endpoints')
        .select('id, name');

      if (!endpoints) return;

      const statsPromises = endpoints.map(async (endpoint) => {
        const { count } = await supabase
          .from('webhook_delivery_logs')
          .select('*', { count: 'exact', head: true })
          .eq('webhook_endpoint_id', endpoint.id);

        return {
          name: endpoint.name.length > 20 ? endpoint.name.substring(0, 20) + '...' : endpoint.name,
          requests: count || 0
        };
      });

      const results = await Promise.all(statsPromises);
      const sorted = results.sort((a, b) => b.requests - a.requests).slice(0, 10);
      setData(sorted);
    } catch (error) {
      console.error('Error loading active endpoints:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading chart...</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Most Active Endpoints</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="requests" fill="#8b5cf6" name="Total Requests" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
