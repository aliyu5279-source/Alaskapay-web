import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { supabase } from '@/lib/supabase';

export default function EmailClientEngagementChart() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    fetchClientData();
  }, []);

  const fetchClientData = async () => {
    const { data: clientData, error } = await supabase
      .from('email_client_metrics')
      .select('*')
      .order('total_sent', { ascending: false })
      .limit(10);

    if (!error && clientData) {
      const chartData = clientData.map(item => ({
        client: item.client_name,
        openRate: (parseFloat(item.open_rate) * 100).toFixed(1),
        clickRate: (parseFloat(item.click_rate) * 100).toFixed(1),
        totalSent: item.total_sent
      }));
      setData(chartData);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Email Client Engagement</CardTitle>
        <CardDescription>Open and click rates by email client</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="client" />
            <YAxis label={{ value: 'Rate (%)', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="openRate" fill="#3b82f6" name="Open Rate" />
            <Bar dataKey="clickRate" fill="#10b981" name="Click Rate" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
