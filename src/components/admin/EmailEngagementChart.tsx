import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useEmailEngagement } from '@/hooks/useEmailEngagement';
import { Skeleton } from '../ui/skeleton';
import { Alert, AlertDescription } from '../ui/alert';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface EmailEngagementChartProps {
  startDate: Date;
  endDate: Date;
  compareEnabled?: boolean;
  emailCampaigns?: string[];
}

export const EmailEngagementChart: React.FC<EmailEngagementChartProps> = ({ 
  startDate, 
  endDate, 
  compareEnabled,
  emailCampaigns 
}) => {
  const { data, isLoading, error } = useEmailEngagement({ 
    startDate, 
    endDate, 
    compareEnabled,
    emailCampaigns 
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Email Engagement</CardTitle>
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
          <CardTitle>Email Engagement</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertDescription>Failed to load email engagement data</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const calculateOpenRateChange = () => {
    if (!data || data.length < 2) return null;
    const currentRate = data[data.length - 1].opened / data[data.length - 1].sent * 100;
    const previousRate = compareEnabled && data[data.length - 1].compareOpened && data[data.length - 1].compareSent
      ? (data[data.length - 1].compareOpened! / data[data.length - 1].compareSent! * 100)
      : (data[data.length - 2].opened / data[data.length - 2].sent * 100);
    const change = previousRate > 0 ? ((currentRate - previousRate) / previousRate * 100).toFixed(1) : '0';
    return { value: change, isPositive: parseFloat(change) >= 0 };
  };

  const change = calculateOpenRateChange();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Email Engagement</CardTitle>
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
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey="opened" stackId="1" stroke="#f59e0b" fill="#f59e0b" name="Opened" />
            <Area type="monotone" dataKey="clicked" stackId="1" stroke="#3b82f6" fill="#3b82f6" name="Clicked" />
            {compareEnabled && (
              <>
                <Area type="monotone" dataKey="compareOpened" stroke="#cbd5e1" fill="none" name="Previous Opened" strokeDasharray="5 5" />
                <Area type="monotone" dataKey="compareClicked" stroke="#94a3b8" fill="none" name="Previous Clicked" strokeDasharray="5 5" />
              </>
            )}
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
