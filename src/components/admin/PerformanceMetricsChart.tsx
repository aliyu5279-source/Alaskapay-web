import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Badge } from '@/components/ui/badge';

interface PerformanceMetricsChartProps {
  data: Array<{
    templateId: string;
    total: number;
    success: number;
    failed: number;
    successRate: number;
  }>;
}

export function PerformanceMetricsChart({ data }: PerformanceMetricsChartProps) {
  const chartData = data.map(item => ({
    id: item.templateId.substring(0, 8),
    success: item.success,
    failed: item.failed,
    successRate: item.successRate.toFixed(1)
  }));

  return (
    <Card className="transition-all duration-500 ease-in-out">
      <CardHeader>
        <CardTitle>Template Performance Metrics</CardTitle>
        <CardDescription>Success vs failure rates for each template</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 grid grid-cols-3 gap-4">
          <div className="text-center transition-all duration-300 hover:scale-105">
            <p className="text-2xl font-bold text-green-600">
              {data.reduce((acc, item) => acc + item.success, 0)}
            </p>
            <p className="text-sm text-muted-foreground">Total Successes</p>
          </div>
          <div className="text-center transition-all duration-300 hover:scale-105">
            <p className="text-2xl font-bold text-red-600">
              {data.reduce((acc, item) => acc + item.failed, 0)}
            </p>
            <p className="text-sm text-muted-foreground">Total Failures</p>
          </div>
          <div className="text-center transition-all duration-300 hover:scale-105">
            <p className="text-2xl font-bold">
              {data.length > 0
                ? ((data.reduce((acc, item) => acc + item.successRate, 0) / data.length).toFixed(1))
                : 0}%
            </p>
            <p className="text-sm text-muted-foreground">Avg Success Rate</p>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis dataKey="id" tick={{ fontSize: 12 }} />
            <YAxis />
            <Tooltip 
              content={({ active, payload }) => {
                if (active && payload && payload[0]) {
                  return (
                    <div className="bg-background border rounded-lg p-3 shadow-lg transition-all duration-200">
                      <p className="font-medium mb-2">Template: {payload[0].payload.id}</p>
                      <div className="space-y-1">
                        <p className="text-sm text-green-600">Success: {payload[0].payload.success}</p>
                        <p className="text-sm text-red-600">Failed: {payload[0].payload.failed}</p>
                        <Badge variant="secondary" className="mt-1">
                          {payload[0].payload.successRate}% Success Rate
                        </Badge>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend />
            <Bar 
              dataKey="success" 
              fill="#22c55e" 
              name="Success"
              animationDuration={800}
              animationEasing="ease-in-out"
              radius={[4, 4, 0, 0]}
            />
            <Bar 
              dataKey="failed" 
              fill="#ef4444" 
              name="Failed"
              animationDuration={800}
              animationEasing="ease-in-out"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}