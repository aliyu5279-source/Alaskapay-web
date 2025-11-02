import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Download, TrendingUp, Users, DollarSign, BarChart3 } from 'lucide-react';
import MRRTrendChart from './MRRTrendChart';
import ChurnRateChart from './ChurnRateChart';
import PlanDistributionChart from './PlanDistributionChart';
import CohortAnalysisTable from './CohortAnalysisTable';
import RevenueForecastChart from './RevenueForecastChart';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export default function SubscriptionAnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('get-subscription-analytics', {
        body: { timeRange, metrics: 'all' }
      });
      if (error) throw error;
      setAnalytics(data);
    } catch (error: any) {
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  const exportReport = async () => {
    toast.success('Exporting report...');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Subscription Analytics</h2>
        <Button onClick={exportReport}><Download className="mr-2 h-4 w-4" />Export</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card><CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">MRR</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" /></CardHeader>
          <CardContent><div className="text-2xl font-bold">${analytics?.mrr || 0}</div>
          <p className="text-xs text-muted-foreground">+12% from last month</p></CardContent></Card>
        
        <Card><CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Active Subs</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" /></CardHeader>
          <CardContent><div className="text-2xl font-bold">{analytics?.activeSubscriptions || 0}</div>
          <p className="text-xs text-muted-foreground">+8% growth</p></CardContent></Card>
        
        <Card><CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Churn Rate</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" /></CardHeader>
          <CardContent><div className="text-2xl font-bold">{analytics?.churnRate || 0}%</div>
          <p className="text-xs text-muted-foreground">-2% improvement</p></CardContent></Card>
        
        <Card><CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Avg CLV</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" /></CardHeader>
          <CardContent><div className="text-2xl font-bold">${analytics?.avgCLV || 0}</div>
          <p className="text-xs text-muted-foreground">Customer lifetime value</p></CardContent></Card>
      </div>

      <Tabs defaultValue="mrr" className="space-y-4">
        <TabsList><TabsTrigger value="mrr">MRR Trends</TabsTrigger>
          <TabsTrigger value="churn">Churn Analysis</TabsTrigger>
          <TabsTrigger value="plans">Plan Distribution</TabsTrigger>
          <TabsTrigger value="forecast">Revenue Forecast</TabsTrigger>
          <TabsTrigger value="cohorts">Cohort Analysis</TabsTrigger></TabsList>
        
        <TabsContent value="mrr"><MRRTrendChart data={analytics?.mrrTrend} /></TabsContent>
        <TabsContent value="churn"><ChurnRateChart data={analytics?.churnData} /></TabsContent>
        <TabsContent value="plans"><PlanDistributionChart data={analytics?.planDistribution} /></TabsContent>
        <TabsContent value="forecast"><RevenueForecastChart data={analytics?.forecast} /></TabsContent>
        <TabsContent value="cohorts"><CohortAnalysisTable data={analytics?.cohorts} /></TabsContent>
      </Tabs>
    </div>
  );
}
