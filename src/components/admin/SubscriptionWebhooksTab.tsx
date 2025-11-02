import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { subscriptionWebhookService } from '@/lib/subscriptionWebhookService';
import { Webhook, CheckCircle, XCircle, Clock, RefreshCw, Copy, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function SubscriptionWebhooksTab() {
  const [logs, setLogs] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [testPayload, setTestPayload] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const { data } = await subscriptionWebhookService.getWebhookLogs({ limit: 50 });
    const statsData = await subscriptionWebhookService.getWebhookStats();
    setLogs(data || []);
    setStats(statsData);
    setLoading(false);
  };

  const copyWebhookUrl = (source: 'stripe' | 'paystack') => {
    const url = source === 'stripe' 
      ? `${window.location.origin}/api/webhooks/stripe-subscription`
      : `${window.location.origin}/api/webhooks/paystack-subscription`;
    navigator.clipboard.writeText(url);
    toast({
      title: 'Copied!',
      description: 'Webhook URL copied to clipboard'
    });
  };

  const sendTestWebhook = async () => {
    try {
      const payload = JSON.parse(testPayload);
      await subscriptionWebhookService.logWebhookDelivery({
        id: `test_${Date.now()}`,
        type: payload.type || 'test.event',
        data: payload,
        source: 'stripe'
      }, 'success');
      
      toast({
        title: 'Test webhook sent',
        description: 'Check the logs below'
      });
      loadData();
    } catch (error) {
      toast({
        title: 'Invalid JSON',
        description: 'Please enter valid JSON payload',
        variant: 'destructive'
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: any = {
      success: 'default',
      failed: 'destructive',
      processing: 'secondary',
      ignored: 'outline'
    };
    return <Badge variant={variants[status] || 'outline'}>{status}</Badge>;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'processing': return <Clock className="h-4 w-4 text-yellow-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Subscription Webhooks</h2>
          <p className="text-muted-foreground">Monitor and test webhook events</p>
        </div>
        <Button onClick={loadData} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Statistics */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {stats.total > 0 ? ((stats.success / stats.total) * 100).toFixed(1) : 0}%
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Failed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Last 24h</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.last24h}</div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="logs" className="space-y-4">
        <TabsList>
          <TabsTrigger value="logs">Delivery Logs</TabsTrigger>
          <TabsTrigger value="config">Configuration</TabsTrigger>
          <TabsTrigger value="test">Test Webhook</TabsTrigger>
        </TabsList>

        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Webhook Events</CardTitle>
              <CardDescription>Last 50 webhook deliveries</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Status</TableHead>
                    <TableHead>Event Type</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Event ID</TableHead>
                    <TableHead>Timestamp</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(log.status)}
                          {getStatusBadge(log.status)}
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{log.event_type}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{log.source}</Badge>
                      </TableCell>
                      <TableCell className="font-mono text-xs">{log.event_id}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(log.created_at).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="config" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Stripe Webhook Configuration</CardTitle>
              <CardDescription>Configure Stripe to send subscription events</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Webhook Endpoint URL</Label>
                <div className="flex gap-2">
                  <Input 
                    value={`${window.location.origin}/api/webhooks/stripe-subscription`}
                    readOnly 
                  />
                  <Button onClick={() => copyWebhookUrl('stripe')} variant="outline">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Events to Subscribe</Label>
                <div className="text-sm space-y-1">
                  <div>• invoice.paid</div>
                  <div>• invoice.payment_failed</div>
                  <div>• customer.subscription.updated</div>
                  <div>• customer.subscription.deleted</div>
                  <div>• customer.subscription.trial_will_end</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Paystack Webhook Configuration</CardTitle>
              <CardDescription>Configure Paystack to send subscription events</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Webhook Endpoint URL</Label>
                <div className="flex gap-2">
                  <Input 
                    value={`${window.location.origin}/api/webhooks/paystack-subscription`}
                    readOnly 
                  />
                  <Button onClick={() => copyWebhookUrl('paystack')} variant="outline">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="test" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Test Webhook</CardTitle>
              <CardDescription>Send a test webhook event</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Event Payload (JSON)</Label>
                <textarea
                  className="w-full h-64 p-3 border rounded-md font-mono text-sm"
                  value={testPayload}
                  onChange={(e) => setTestPayload(e.target.value)}
                  placeholder={JSON.stringify({
                    type: 'invoice.paid',
                    data: {
                      object: {
                        subscription: 'sub_123',
                        amount_paid: 2000,
                        currency: 'usd'
                      }
                    }
                  }, null, 2)}
                />
              </div>
              <Button onClick={sendTestWebhook}>
                <Send className="h-4 w-4 mr-2" />
                Send Test Event
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
