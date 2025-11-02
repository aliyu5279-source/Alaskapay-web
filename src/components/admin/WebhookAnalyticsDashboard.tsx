import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, RefreshCw, AlertTriangle } from 'lucide-react';
import { WebhookSuccessRateChart } from './WebhookSuccessRateChart';
import { WebhookResponseTimeChart } from './WebhookResponseTimeChart';
import { WebhookActiveEndpointsChart } from './WebhookActiveEndpointsChart';
import { WebhookFailureReasonsChart } from './WebhookFailureReasonsChart';
import { WebhookPerformanceComparison } from './WebhookPerformanceComparison';
import { WebhookAnalyticsExport } from './WebhookAnalyticsExport';
import { WebhookPerformanceAlerts } from './WebhookPerformanceAlerts';
import { supabase } from '@/lib/supabase';
import { useEffect } from 'react';

export function WebhookAnalyticsDashboard() {
  const [selectedWebhook, setSelectedWebhook] = useState<string>('all');
  const [timeRange, setTimeRange] = useState<number>(7);
  const [webhooks, setWebhooks] = useState<any[]>([]);
  const [showExport, setShowExport] = useState(false);
  const [showAlerts, setShowAlerts] = useState(false);

  useEffect(() => {
    loadWebhooks();
  }, []);

  const loadWebhooks = async () => {
    const { data } = await supabase
      .from('webhook_endpoints')
      .select('id, name')
      .eq('is_active', true);
    
    if (data) setWebhooks(data);
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Webhook Analytics</h2>
          <p className="text-muted-foreground">
            Comprehensive monitoring and performance insights
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowAlerts(true)}>
            <AlertTriangle className="h-4 w-4 mr-2" />
            Alerts
          </Button>
          <Button variant="outline" onClick={() => setShowExport(true)}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Webhook</label>
              <Select value={selectedWebhook} onValueChange={setSelectedWebhook}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Webhooks</SelectItem>
                  {webhooks.map(webhook => (
                    <SelectItem key={webhook.id} value={webhook.id}>
                      {webhook.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Time Range</label>
              <Select value={timeRange.toString()} onValueChange={(v) => setTimeRange(Number(v))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Last 24 Hours</SelectItem>
                  <SelectItem value="7">Last 7 Days</SelectItem>
                  <SelectItem value="30">Last 30 Days</SelectItem>
                  <SelectItem value="90">Last 90 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WebhookSuccessRateChart 
          webhookId={selectedWebhook === 'all' ? undefined : selectedWebhook}
          days={timeRange}
        />
        <WebhookResponseTimeChart 
          webhookId={selectedWebhook === 'all' ? undefined : selectedWebhook}
          days={timeRange}
        />
        <WebhookActiveEndpointsChart />
        <WebhookFailureReasonsChart 
          webhookId={selectedWebhook === 'all' ? undefined : selectedWebhook}
        />
      </div>

      {/* Performance Comparison */}
      <WebhookPerformanceComparison />

      {/* Modals */}
      {showExport && (
        <WebhookAnalyticsExport 
          onClose={() => setShowExport(false)}
          webhookId={selectedWebhook === 'all' ? undefined : selectedWebhook}
        />
      )}
      {showAlerts && (
        <WebhookPerformanceAlerts onClose={() => setShowAlerts(false)} />
      )}
    </div>
  );
}
