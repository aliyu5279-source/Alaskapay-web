import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ComposedChart, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface RevenueForecastChartProps {
  data?: Array<{ month: string; actual?: number; forecast: number; confidence: { low: number; high: number } }>;
}

export default function RevenueForecastChart({ data = [] }: RevenueForecastChartProps) {
  const mockData = data.length > 0 ? data : [
    { month: 'Jan', actual: 12500, forecast: 12500, confidence: { low: 12000, high: 13000 } },
    { month: 'Feb', actual: 15200, forecast: 15200, confidence: { low: 14500, high: 15900 } },
    { month: 'Mar', actual: 18400, forecast: 18400, confidence: { low: 17600, high: 19200 } },
    { month: 'Apr', actual: 22100, forecast: 22100, confidence: { low: 21100, high: 23100 } },
    { month: 'May', actual: 26800, forecast: 26800, confidence: { low: 25600, high: 28000 } },
    { month: 'Jun', actual: 31500, forecast: 31500, confidence: { low: 30100, high: 32900 } },
    { month: 'Jul', forecast: 36800, confidence: { low: 34800, high: 38800 } },
    { month: 'Aug', forecast: 42500, confidence: { low: 39800, high: 45200 } },
    { month: 'Sep', forecast: 48900, confidence: { low: 45400, high: 52400 } }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue Forecast (3-Month Projection)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={mockData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value) => `$${value}`} />
            <Legend />
            <Area type="monotone" dataKey="confidence.high" fill="#e3f2fd" stroke="none" name="High Confidence" />
            <Area type="monotone" dataKey="confidence.low" fill="#ffffff" stroke="none" name="Low Confidence" />
            <Line type="monotone" dataKey="actual" stroke="#2196f3" strokeWidth={3} name="Actual Revenue" />
            <Line type="monotone" dataKey="forecast" stroke="#ff9800" strokeWidth={2} strokeDasharray="5 5" name="Forecast" />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
