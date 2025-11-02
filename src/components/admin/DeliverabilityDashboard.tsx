import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, RefreshCw, TrendingUp, TrendingDown } from 'lucide-react';
import { format, subDays } from 'date-fns';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import ReputationScoreCard from './ReputationScoreCard';
import BounceRateTrendChart from './BounceRateTrendChart';
import EmailClientEngagementChart from './EmailClientEngagementChart';
import GeographicDeliveryMap from './GeographicDeliveryMap';
import DomainHealthPanel from './DomainHealthPanel';
import DeliverabilityRecommendations from './DeliverabilityRecommendations';

export default function DeliverabilityDashboard() {
  const [dateRange, setDateRange] = useState({ from: subDays(new Date(), 30), to: new Date() });
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchMetrics = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('get-deliverability-metrics', {
        body: {
          startDate: format(dateRange.from, 'yyyy-MM-dd'),
          endDate: format(dateRange.to, 'yyyy-MM-dd')
        }
      });

      if (error) throw error;
      setMetrics(data);
      toast.success('Metrics updated');
    } catch (error: any) {
      toast.error('Failed to fetch metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, [dateRange]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Email Deliverability</h2>
          <p className="text-muted-foreground">Monitor sender reputation and delivery metrics</p>
        </div>
        <Button onClick={fetchMetrics} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <ReputationScoreCard metrics={metrics} />

      <Tabs defaultValue="trends" className="space-y-4">
        <TabsList>
          <TabsTrigger value="trends">Bounce Trends</TabsTrigger>
          <TabsTrigger value="clients">Email Clients</TabsTrigger>
          <TabsTrigger value="geography">Geography</TabsTrigger>
          <TabsTrigger value="domain">Domain Health</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>

        <TabsContent value="trends"><BounceRateTrendChart dateRange={dateRange} /></TabsContent>
        <TabsContent value="clients"><EmailClientEngagementChart /></TabsContent>
        <TabsContent value="geography"><GeographicDeliveryMap /></TabsContent>
        <TabsContent value="domain"><DomainHealthPanel /></TabsContent>
        <TabsContent value="recommendations"><DeliverabilityRecommendations metrics={metrics} /></TabsContent>
      </Tabs>
    </div>
  );
}
