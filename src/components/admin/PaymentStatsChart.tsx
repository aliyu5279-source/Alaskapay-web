import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { usePaymentStats } from '@/hooks/usePaymentStats';
import { Skeleton } from '../ui/skeleton';
import { Alert, AlertDescription } from '../ui/alert';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface PaymentStatsChartProps {
  startDate: Date;
  endDate: Date;
  compareEnabled?: boolean;
  paymentTypes?: string[];
}

export const PaymentStatsChart: React.FC<PaymentStatsChartProps> = ({ 
  startDate, 
  endDate, 
  compareEnabled,
  paymentTypes 
}) => {
  const { data, isLoading, error } = usePaymentStats({ 
    startDate, 
    endDate, 
    compareEnabled,
    paymentTypes 
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Payment Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Payment Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertDescription>Failed to load payment statistics</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const calculateTotalChange = () => {
    if (!data || data.length === 0) return null;
    const currentTotal = data.reduce((sum, item) => sum + item.count, 0);
    const previousTotal = compareEnabled 
      ? data.reduce((sum, item) => sum + (item.compareCount || 0), 0)
      : 0;
    if (previousTotal === 0) return null;
    const change = ((currentTotal - previousTotal) / previousTotal * 100).toFixed(1);
    return { value: change, isPositive: parseFloat(change) >= 0 };
  };

  const change = calculateTotalChange();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Payment Statistics</CardTitle>
          {change && (
            <div className={`flex items-center gap-1 text-sm font-medium ${change.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {change.isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
              {change.value}%
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="type" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#8b5cf6" name="Transactions" />
            {compareEnabled && (
              <Bar dataKey="compareCount" fill="#cbd5e1" name="Previous Period" />
            )}
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
