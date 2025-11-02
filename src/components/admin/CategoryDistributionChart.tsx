import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface CategoryDistributionChartProps {
  data: Array<{ category: string; count: number }>;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

const CATEGORY_LABELS: Record<string, string> = {
  'daily-reports': 'Daily Reports',
  'weekly-summaries': 'Weekly Summaries',
  'monthly-analytics': 'Monthly Analytics',
  'custom': 'Custom'
};

export function CategoryDistributionChart({ data }: CategoryDistributionChartProps) {
  const chartData = data.map(item => ({
    name: CATEGORY_LABELS[item.category] || item.category,
    value: item.count,
    category: item.category
  }));

  const total = data.reduce((acc, item) => acc + item.count, 0);

  return (
    <Card className="transition-all duration-500 ease-in-out">
      <CardHeader>
        <CardTitle>Template Category Distribution</CardTitle>
        <CardDescription>Breakdown of templates by category</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                animationDuration={800}
                animationEasing="ease-in-out"
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]}
                    className="transition-all duration-300 hover:opacity-80"
                  />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          <div className="space-y-4">
            <h4 className="font-semibold">Category Breakdown</h4>
            {chartData.map((item, index) => (
              <div 
                key={item.category} 
                className="flex items-center justify-between p-2 rounded-lg transition-all duration-200 hover:bg-muted"
              >
                <div className="flex items-center gap-2">
                  <div 
                    className="w-4 h-4 rounded transition-all duration-300" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-sm">{item.name}</span>
                </div>
                <div className="text-right">
                  <p className="font-medium">{item.value}</p>
                  <p className="text-xs text-muted-foreground">
                    {((item.value / total) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}