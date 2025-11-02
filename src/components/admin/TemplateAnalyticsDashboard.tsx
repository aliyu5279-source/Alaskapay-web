import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { BarChart, LineChart, PieChart, TrendingUp, AlertTriangle, Users, FileText, RefreshCw, Bell, Download, Calendar as CalendarIcon } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { UsageTrendsChart } from './UsageTrendsChart';
import { PopularTemplatesChart } from './PopularTemplatesChart';
import { PerformanceMetricsChart } from './PerformanceMetricsChart';
import { CategoryDistributionChart } from './CategoryDistributionChart';
import { AnalyticsExportModal } from './AnalyticsExportModal';
import { ScheduledAnalyticsReports } from './ScheduledAnalyticsReports';
import ReportDeliveryHistory from './ReportDeliveryHistory';
import DeliveryAlertsPanel from './DeliveryAlertsPanel';


export function TemplateAnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');
  const [hasNewData, setHasNewData] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [showExportModal, setShowExportModal] = useState(false);
  const subscriptionRef = useRef<any>(null);


  useEffect(() => {
    loadAnalytics();
    
    if (autoRefresh) {
      setupRealtimeSubscription();
    }

    return () => {
      if (subscriptionRef.current) {
        supabase.removeChannel(subscriptionRef.current);
      }
    };
  }, [timeRange, autoRefresh]);

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel('template-analytics-updates')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'export_templates' },
        (payload) => handleRealtimeUpdate('template', payload)
      )
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'batch_history' },
        (payload) => handleRealtimeUpdate('export', payload)
      )
      .subscribe();

    subscriptionRef.current = channel;
  };

  const handleRealtimeUpdate = (type: string, payload: any) => {
    setHasNewData(true);
    
    if (type === 'template' && payload.eventType === 'INSERT') {
      toast.info('New template created', {
        description: 'Analytics data updated',
        icon: <Bell className="h-4 w-4" />
      });
    } else if (type === 'export') {
      toast.info('New export executed', {
        description: 'Performance metrics updated',
        icon: <TrendingUp className="h-4 w-4" />
      });
    }

    // Auto-refresh after a short delay
    setTimeout(() => {
      loadAnalytics(true);
    }, 1000);
  };

  const loadAnalytics = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const { data, error } = await supabase.functions.invoke('get-template-analytics', {
        body: { timeRange }
      });

      if (error) throw error;
      setAnalytics(data);
      setHasNewData(false);
    } catch (error: any) {
      toast.error('Failed to load analytics');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading analytics...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-2">
            Template Analytics
            {hasNewData && (
              <Badge variant="destructive" className="animate-pulse">
                New Data
              </Badge>
            )}
          </h2>
          <p className="text-muted-foreground">Real-time usage trends and performance insights</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={autoRefresh ? 'bg-green-50' : ''}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${autoRefresh ? 'animate-spin' : ''}`} />
            {autoRefresh ? 'Live' : 'Paused'}
          </Button>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="transition-all duration-300 hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Templates</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.adoptionStats?.totalTemplates || 0}</div>
          </CardContent>
        </Card>
        <Card className="transition-all duration-300 hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Templates</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.adoptionStats?.activeTemplates || 0}</div>
          </CardContent>
        </Card>
        <Card className="transition-all duration-300 hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Unique Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.adoptionStats?.uniqueUsers || 0}</div>
          </CardContent>
        </Card>
        <Card className="transition-all duration-300 hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg Success Rate</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics?.performanceMetrics?.length > 0
                ? (analytics.performanceMetrics.reduce((acc: number, m: any) => acc + m.successRate, 0) / 
                   analytics.performanceMetrics.length).toFixed(1)
                : 0}%
            </div>
          </CardContent>
        </Card>
      </div>


      <div className="flex gap-2">
        <Button onClick={() => setShowExportModal(true)} variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export Data
        </Button>
      </div>

      <Tabs defaultValue="trends" className="space-y-4">
        <TabsList>
          <TabsTrigger value="trends">Usage Trends</TabsTrigger>
          <TabsTrigger value="popular">Popular Templates</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled Reports</TabsTrigger>
          <TabsTrigger value="delivery">Delivery History</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
        </TabsList>



        <TabsContent value="trends" className="space-y-4">
          <UsageTrendsChart data={analytics?.usageTrends || []} />
        </TabsContent>

        <TabsContent value="popular" className="space-y-4">
          <PopularTemplatesChart data={analytics?.popularTemplates || []} />
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <PerformanceMetricsChart data={analytics?.performanceMetrics || []} />
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <CategoryDistributionChart data={analytics?.categoryDistribution || []} />
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Optimization Recommendations</CardTitle>
              <CardDescription>Insights to improve template performance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {analytics?.recommendations?.length > 0 ? (
                analytics.recommendations.map((rec: any, idx: number) => (
                  <div key={idx} className="flex items-start gap-3 p-4 border rounded-lg transition-all duration-300 hover:shadow-md">
                    <AlertTriangle className={`h-5 w-5 mt-0.5 ${
                      rec.type === 'warning' ? 'text-yellow-500' : 'text-blue-500'
                    }`} />
                    <div>
                      {rec.template && <p className="font-medium">{rec.template}</p>}
                      <p className="text-sm text-muted-foreground">{rec.message}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  No recommendations at this time. Your templates are performing well!
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scheduled" className="space-y-4">
          <ScheduledAnalyticsReports />
        </TabsContent>

        <TabsContent value="delivery" className="space-y-4">
          <ReportDeliveryHistory />
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <DeliveryAlertsPanel />
        </TabsContent>
      </Tabs>

      <AnalyticsExportModal open={showExportModal} onOpenChange={setShowExportModal} />
    </div>
  );
}
