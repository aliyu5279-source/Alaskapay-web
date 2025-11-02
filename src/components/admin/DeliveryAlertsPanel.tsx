import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface DeliveryAlert {
  id: string;
  delivery_id: string;
  alert_type: string;
  severity: string;
  message: string;
  acknowledged: boolean;
  created_at: string;
}

export default function DeliveryAlertsPanel() {
  const [alerts, setAlerts] = useState<DeliveryAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchAlerts = async () => {
    try {
      const { data, error } = await supabase
        .from('analytics_delivery_alerts')
        .select('*')
        .eq('acknowledged', false)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAlerts(data || []);
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();

    const subscription = supabase
      .channel('alert-updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'analytics_delivery_alerts' }, fetchAlerts)
      .subscribe();

    return () => { subscription.unsubscribe(); };
  }, []);

  const acknowledgeAlert = async (alertId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('analytics_delivery_alerts')
        .update({
          acknowledged: true,
          acknowledged_by: user?.id,
          acknowledged_at: new Date().toISOString()
        })
        .eq('id', alertId);

      if (error) throw error;

      toast({ title: 'Success', description: 'Alert acknowledged' });
      fetchAlerts();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <XCircle className="w-5 h-5 text-red-500" />;
      case 'error': return <AlertTriangle className="w-5 h-5 text-orange-500" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      default: return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  if (loading) return <div>Loading alerts...</div>;

  if (alerts.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center text-muted-foreground">
            <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
            No delivery issues detected
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Delivery Alerts ({alerts.length})</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {alerts.map((alert) => (
          <Alert key={alert.id} variant={alert.severity === 'critical' || alert.severity === 'error' ? 'destructive' : 'default'}>
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                {getSeverityIcon(alert.severity)}
                <div>
                  <AlertTitle className="capitalize">{alert.alert_type.replace(/_/g, ' ')}</AlertTitle>
                  <AlertDescription>{alert.message}</AlertDescription>
                  <p className="text-xs text-muted-foreground mt-2">
                    {format(new Date(alert.created_at), 'MMM d, yyyy HH:mm')}
                  </p>
                </div>
              </div>
              <Button size="sm" variant="outline" onClick={() => acknowledgeAlert(alert.id)}>
                Acknowledge
              </Button>
            </div>
          </Alert>
        ))}
      </CardContent>
    </Card>
  );
}
