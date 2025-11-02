import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, Bell } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface Alert {
  id: string;
  webhook_endpoint_id: string;
  alert_type: string;
  threshold_value: number;
  current_value: number;
  alert_message: string;
  is_resolved: boolean;
  created_at: string;
}

export function WebhookPerformanceAlerts({ onClose }: { onClose: () => void }) {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [webhooks, setWebhooks] = useState<any[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [newAlert, setNewAlert] = useState({
    webhook_id: '',
    alert_type: 'high_failure_rate',
    threshold: 10
  });

  useEffect(() => {
    loadAlerts();
    loadWebhooks();
  }, []);

  const loadAlerts = async () => {
    const { data } = await supabase
      .from('webhook_performance_alerts')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setAlerts(data);
  };

  const loadWebhooks = async () => {
    const { data } = await supabase
      .from('webhook_endpoints')
      .select('id, name');
    
    if (data) setWebhooks(data);
  };

  const handleCreateAlert = async () => {
    try {
      const { error } = await supabase
        .from('webhook_performance_alerts')
        .insert({
          webhook_endpoint_id: newAlert.webhook_id,
          alert_type: newAlert.alert_type,
          threshold_value: newAlert.threshold,
          alert_message: `Alert: ${newAlert.alert_type} threshold exceeded`
        });

      if (error) throw error;
      
      toast.success('Alert created successfully');
      setShowCreate(false);
      loadAlerts();
    } catch (error: any) {
      toast.error('Failed to create alert: ' + error.message);
    }
  };

  const handleResolveAlert = async (alertId: string) => {
    try {
      const { error } = await supabase
        .from('webhook_performance_alerts')
        .update({ is_resolved: true, resolved_at: new Date().toISOString() })
        .eq('id', alertId);

      if (error) throw error;
      
      toast.success('Alert resolved');
      loadAlerts();
    } catch (error: any) {
      toast.error('Failed to resolve alert: ' + error.message);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Performance Alerts</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <Button onClick={() => setShowCreate(!showCreate)} className="w-full">
            <Bell className="mr-2 h-4 w-4" />
            Create New Alert
          </Button>

          {showCreate && (
            <div className="border rounded-lg p-4 space-y-4">
              <div className="space-y-2">
                <Label>Webhook</Label>
                <Select value={newAlert.webhook_id} onValueChange={(v) => setNewAlert({...newAlert, webhook_id: v})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select webhook" />
                  </SelectTrigger>
                  <SelectContent>
                    {webhooks.map(w => (
                      <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Alert Type</Label>
                <Select value={newAlert.alert_type} onValueChange={(v) => setNewAlert({...newAlert, alert_type: v})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high_failure_rate">High Failure Rate</SelectItem>
                    <SelectItem value="slow_response">Slow Response Time</SelectItem>
                    <SelectItem value="endpoint_down">Endpoint Down</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Threshold</Label>
                <Input 
                  type="number" 
                  value={newAlert.threshold}
                  onChange={(e) => setNewAlert({...newAlert, threshold: Number(e.target.value)})}
                />
              </div>

              <Button onClick={handleCreateAlert} className="w-full">Create Alert</Button>
            </div>
          )}

          <div className="space-y-2">
            {alerts.map(alert => (
              <div key={alert.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  {alert.is_resolved ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                  )}
                  <div>
                    <div className="font-medium">{alert.alert_message}</div>
                    <div className="text-sm text-muted-foreground">
                      Threshold: {alert.threshold_value} | Current: {alert.current_value}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={alert.is_resolved ? 'secondary' : 'destructive'}>
                    {alert.is_resolved ? 'Resolved' : 'Active'}
                  </Badge>
                  {!alert.is_resolved && (
                    <Button size="sm" onClick={() => handleResolveAlert(alert.id)}>
                      Resolve
                    </Button>
                  )}
                </div>
              </div>
            ))}

            {alerts.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No alerts configured
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
