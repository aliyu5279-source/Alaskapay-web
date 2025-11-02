import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useUserGrowth } from '@/hooks/useAnalytics';
import { Skeleton } from '../ui/skeleton';
import { Alert, AlertDescription } from '../ui/alert';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface UserGrowthChartProps {
  startDate: Date;
  endDate: Date;
  compareEnabled?: boolean;
  userSegments?: string[];
}

export const UserGrowthChart: React.FC<UserGrowthChartProps> = ({ 
  startDate, 
  endDate, 
  compareEnabled,
  userSegments 
}) => {
  const { data, isLoading, error } = useUserGrowth({ 
    startDate, 
    endDate, 
    compareEnabled,
    userSegments 
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>User Growth</CardTitle>
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
          <CardTitle>User Growth</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertDescription>Failed to load user growth data</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const calculateChange = () => {
    if (!data || data.length < 2) return null;
    const current = data[data.length - 1].newUsers;
    const previous = compareEnabled && data[data.length - 1].compareNewUsers 
      ? data[data.length - 1].compareNewUsers!
      : data[data.length - 2].newUsers;
    const change = previous > 0 ? ((current - previous) / previous * 100).toFixed(1) : '0';
    return { value: change, isPositive: parseFloat(change) >= 0 };
  };

  const change = calculateChange();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>User Growth</CardTitle>
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
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="newUsers" stroke="#3b82f6" name="New Users" strokeWidth={2} />
            {compareEnabled && (
              <Line type="monotone" dataKey="compareNewUsers" stroke="#94a3b8" name="Previous Period" strokeWidth={2} strokeDasharray="5 5" />
            )}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
