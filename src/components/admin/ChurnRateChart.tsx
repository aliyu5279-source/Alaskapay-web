import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ChurnRateChartProps {
  data?: Array<{ month: string; churnRate: number; voluntaryChurn: number; involuntaryChurn: number }>;
}

export default function ChurnRateChart({ data = [] }: ChurnRateChartProps) {
  const mockData = data.length > 0 ? data : [
    { month: 'Jan', churnRate: 5.2, voluntaryChurn: 3.5, involuntaryChurn: 1.7 },
    { month: 'Feb', churnRate: 4.8, voluntaryChurn: 3.2, involuntaryChurn: 1.6 },
    { month: 'Mar', churnRate: 4.5, voluntaryChurn: 2.9, involuntaryChurn: 1.6 },
    { month: 'Apr', churnRate: 4.1, voluntaryChurn: 2.6, involuntaryChurn: 1.5 },
    { month: 'May', churnRate: 3.8, voluntaryChurn: 2.4, involuntaryChurn: 1.4 },
    { month: 'Jun', churnRate: 3.5, voluntaryChurn: 2.2, involuntaryChurn: 1.3 }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Churn Rate Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={mockData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value) => `${value}%`} />
            <Area type="monotone" dataKey="churnRate" stackId="1" stroke="#ff6b6b" fill="#ff6b6b" name="Total Churn" />
            <Area type="monotone" dataKey="voluntaryChurn" stackId="2" stroke="#ffc658" fill="#ffc658" name="Voluntary" />
            <Area type="monotone" dataKey="involuntaryChurn" stackId="2" stroke="#8884d8" fill="#8884d8" name="Involuntary" />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
