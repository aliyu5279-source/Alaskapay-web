import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface PlanDistributionChartProps {
  data?: Array<{ name: string; value: number; revenue: number }>;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function PlanDistributionChart({ data = [] }: PlanDistributionChartProps) {
  const mockData = data.length > 0 ? data : [
    { name: 'Basic', value: 245, revenue: 2450 },
    { name: 'Pro', value: 156, revenue: 7800 },
    { name: 'Business', value: 89, revenue: 8900 },
    { name: 'Enterprise', value: 34, revenue: 17000 }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subscription Plan Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium mb-4">By Subscriber Count</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={mockData} cx="50%" cy="50%" labelLine={false} label={({ name, percent }) => 
                  `${name}: ${(percent * 100).toFixed(0)}%`} outerRadius={80} fill="#8884d8" dataKey="value">
                  {mockData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div>
            <h3 className="text-sm font-medium mb-4">By Revenue Contribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={mockData} cx="50%" cy="50%" labelLine={false} label={({ name, percent }) => 
                  `${name}: ${(percent * 100).toFixed(0)}%`} outerRadius={80} fill="#8884d8" dataKey="revenue">
                  {mockData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `$${value}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
