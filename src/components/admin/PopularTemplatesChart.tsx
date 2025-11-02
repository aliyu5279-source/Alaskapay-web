import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Badge } from '@/components/ui/badge';

interface PopularTemplatesChartProps {
  data: Array<{ id: string; name: string; usageCount: number; category: string }>;
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#8dd1e1', '#d084d0', '#ffb3ba', '#bae1ff', '#ffffba', '#baffc9'];

export function PopularTemplatesChart({ data }: PopularTemplatesChartProps) {
  const chartData = data.slice(0, 10).map((t, index) => ({
    name: t.name.length > 20 ? t.name.substring(0, 20) + '...' : t.name,
    usage: t.usageCount,
    fullName: t.name,
    category: t.category,
    color: COLORS[index % COLORS.length]
  }));

  return (
    <Card className="transition-all duration-500 ease-in-out">
      <CardHeader>
        <CardTitle>Most Popular Templates</CardTitle>
        <CardDescription>Top 10 templates by usage count</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" width={150} tick={{ fontSize: 12 }} />
            <Tooltip 
              content={({ active, payload }) => {
                if (active && payload && payload[0]) {
                  return (
                    <div className="bg-background border rounded-lg p-3 shadow-lg transition-all duration-200">
                      <p className="font-medium">{payload[0].payload.fullName}</p>
                      <p className="text-sm text-muted-foreground">
                        Usage: {payload[0].value}
                      </p>
                      <Badge variant="secondary" className="mt-1">
                        {payload[0].payload.category}
                      </Badge>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar 
              dataKey="usage" 
              radius={[0, 4, 4, 0]}
              animationDuration={800}
              animationEasing="ease-in-out"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} className="transition-all duration-300" />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}