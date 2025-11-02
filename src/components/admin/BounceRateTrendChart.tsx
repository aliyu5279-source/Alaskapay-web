import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { supabase } from '@/lib/supabase';
import { format } from 'date-fns';

interface BounceRateTrendChartProps {
  dateRange: { from: Date; to: Date };
}

export default function BounceRateTrendChart({ dateRange }: BounceRateTrendChartProps) {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    fetchBounceData();
  }, [dateRange]);

  const fetchBounceData = async () => {
    const { data: bounceData, error } = await supabase
      .from('sender_reputation_metrics')
      .select('*')
      .gte('date', format(dateRange.from, 'yyyy-MM-dd'))
      .lte('date', format(dateRange.to, 'yyyy-MM-dd'))
      .order('date', { ascending: true });

    if (!error && bounceData) {
      const chartData = bounceData.map(item => ({
        date: format(new Date(item.date), 'MMM dd'),
        bounceRate: (parseFloat(item.bounce_rate) * 100).toFixed(2),
        spamRate: (parseFloat(item.spam_rate) * 100).toFixed(2),
        complaintRate: (parseFloat(item.complaint_rate) * 100).toFixed(2)
      }));
      setData(chartData);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bounce Rate Trends</CardTitle>
        <CardDescription>Track bounce, spam, and complaint rates over time</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis label={{ value: 'Rate (%)', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="bounceRate" stroke="#ef4444" name="Bounce Rate" />
            <Line type="monotone" dataKey="spamRate" stroke="#f59e0b" name="Spam Rate" />
            <Line type="monotone" dataKey="complaintRate" stroke="#8b5cf6" name="Complaint Rate" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
