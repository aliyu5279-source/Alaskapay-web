import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, TrendingDown, AlertTriangle, CheckCircle, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ChargebackPreventionTab() {
  const [metrics, setMetrics] = useState<any>(null);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [resolutions, setResolutions] = useState<any[]>([]);
  const [gatewayChargebacks, setGatewayChargebacks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [metricsRes, alertsRes, resolutionsRes, chargebacksRes] = await Promise.all([
        supabase.from('chargeback_metrics').select('*').order('date', { ascending: false }).limit(1).single(),
        supabase.from('pre_dispute_alerts').select('*, transactions(*), users:user_id(email)').order('created_at', { ascending: false }).limit(10),
        supabase.from('instant_resolutions').select('*, transactions(*), users:user_id(email)').order('created_at', { ascending: false }).limit(10),
        supabase.from('gateway_chargeback_notifications').select('*, transactions(*)').order('received_at', { ascending: false }).limit(10)
      ]);

      setMetrics(metricsRes.data);
      setAlerts(alertsRes.data || []);
      setResolutions(resolutionsRes.data || []);
      setGatewayChargebacks(chargebacksRes.data || []);
    } catch (error: any) {
      toast({ title: 'Error loading data', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chargeback Rate</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(metrics?.chargeback_rate * 100).toFixed(2)}%</div>
            <p className="text-xs text-muted-foreground">
              {metrics?.total_chargebacks} of {metrics?.total_transactions} transactions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Prevented</CardTitle>
            <Shield className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.chargebacks_prevented || 0}</div>
            <p className="text-xs text-muted-foreground">
              {metrics?.instant_resolutions || 0} instant resolutions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Amount Saved</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{metrics?.amount_saved?.toLocaleString() || 0}</div>
            <p className="text-xs text-muted-foreground">Through prevention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{alerts.filter(a => a.status === 'sent').length}</div>
            <p className="text-xs text-muted-foreground">Awaiting response</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="alerts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="alerts">Pre-Dispute Alerts</TabsTrigger>
          <TabsTrigger value="resolutions">Instant Resolutions</TabsTrigger>
          <TabsTrigger value="gateway">Gateway Chargebacks</TabsTrigger>
        </TabsList>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Pre-Dispute Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alerts.map((alert) => (
                  <div key={alert.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <p className="font-medium">{alert.users?.email}</p>
                      <p className="text-sm text-muted-foreground">
                        ₦{alert.transactions?.amount?.toLocaleString()} • {alert.alert_type}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(alert.sent_at).toLocaleString()}
                      </p>
                    </div>
                    <Badge variant={alert.status === 'resolved' ? 'default' : 'secondary'}>
                      {alert.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resolutions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Instant Resolutions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {resolutions.map((res) => (
                  <div key={res.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <p className="font-medium">{res.users?.email}</p>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {res.resolution_type} • ₦{res.amount?.toLocaleString() || 0}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Processed in {res.processing_time_seconds}s
                      </p>
                    </div>
                    <Badge variant="default">Prevented</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gateway" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gateway Chargeback Notifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {gatewayChargebacks.map((cb) => (
                  <div key={cb.id} className="p-4 border rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge>{cb.gateway.toUpperCase()}</Badge>
                      <Badge variant={cb.status === 'won' ? 'default' : 'destructive'}>
                        {cb.status}
                      </Badge>
                    </div>
                    <p className="font-medium">₦{cb.amount.toLocaleString()} {cb.currency}</p>
                    <p className="text-sm text-muted-foreground">{cb.reason_description}</p>
                    {cb.evidence_due_date && (
                      <p className="text-xs text-orange-600">
                        Evidence due: {new Date(cb.evidence_due_date).toLocaleString()}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
