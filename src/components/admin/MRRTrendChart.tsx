import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface MRRTrendChartProps {
  data?: Array<{ month: string; mrr: number; newMRR: number; churnedMRR: number; expansionMRR: number }>;
}

export default function MRRTrendChart({ data = [] }: MRRTrendChartProps) {
  const mockData = data.length > 0 ? data : [
    { month: 'Jan', mrr: 12500, newMRR: 2500, churnedMRR: 500, expansionMRR: 1000 },
    { month: 'Feb', mrr: 15200, newMRR: 3200, churnedMRR: 700, expansionMRR: 1200 },
    { month: 'Mar', mrr: 18400, newMRR: 3800, churnedMRR: 600, expansionMRR: 1500 },
    { month: 'Apr', mrr: 22100, newMRR: 4200, churnedMRR: 500, expansionMRR: 1800 },
    { month: 'May', mrr: 26800, newMRR: 5100, churnedMRR: 400, expansionMRR: 2000 },
    { month: 'Jun', mrr: 31500, newMRR: 5500, churnedMRR: 800, expansionMRR: 2300 }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Recurring Revenue Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={mockData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value) => `$${value}`} />
            <Legend />
            <Line type="monotone" dataKey="mrr" stroke="#8884d8" strokeWidth={3} name="Total MRR" />
            <Line type="monotone" dataKey="newMRR" stroke="#82ca9d" name="New MRR" />
            <Line type="monotone" dataKey="expansionMRR" stroke="#ffc658" name="Expansion MRR" />
            <Line type="monotone" dataKey="churnedMRR" stroke="#ff6b6b" name="Churned MRR" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
