import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';

export default function PreDisputeAlerts() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAlert, setSelectedAlert] = useState<any>(null);
  const [feedback, setFeedback] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('pre_dispute_alerts')
        .select('*, transactions(*)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAlerts(data || []);
    } catch (error: any) {
      toast({
        title: 'Error loading alerts',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResolution = async (alertId: string, resolutionType: string) => {
    try {
      const { error } = await supabase.functions.invoke('process-instant-resolution', {
        body: { alertId, resolutionType, userFeedback: feedback }
      });

      if (error) throw error;

      toast({
        title: 'Resolution processed',
        description: 'Your response has been recorded successfully'
      });

      loadAlerts();
      setSelectedAlert(null);
      setFeedback('');
    } catch (error: any) {
      toast({
        title: 'Error processing resolution',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'bg-blue-500';
      case 'viewed': return 'bg-yellow-500';
      case 'resolved': return 'bg-green-500';
      case 'escalated': return 'bg-red-500';
      case 'expired': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading alerts...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Transaction Alerts</h2>
        <Badge variant="outline">{alerts.length} Total</Badge>
      </div>

      {alerts.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No alerts at this time
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {alerts.map((alert) => (
            <Card key={alert.id} className="border-l-4 border-l-orange-500">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-5 w-5 text-orange-500" />
                    <div>
                      <CardTitle className="text-lg">
                        {alert.alert_type.replace('_', ' ').toUpperCase()}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        Transaction: ₦{alert.transactions?.amount?.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(alert.status)}>
                    {alert.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm">{alert.message}</p>

                {alert.status === 'sent' || alert.status === 'viewed' ? (
                  <div className="space-y-3">
                    <p className="text-sm font-medium">What would you like to do?</p>
                    <div className="grid gap-2">
                      {alert.resolution_options?.map((option: any, idx: number) => (
                        <Button
                          key={idx}
                          variant={option.type === 'confirm' ? 'default' : 'outline'}
                          className="justify-start"
                          onClick={() => setSelectedAlert({ ...alert, selectedOption: option })}
                        >
                          {option.type === 'confirm' && <CheckCircle className="h-4 w-4 mr-2" />}
                          {option.type === 'refund' && <Clock className="h-4 w-4 mr-2" />}
                          {option.type === 'dispute' && <XCircle className="h-4 w-4 mr-2" />}
                          {option.label}
                        </Button>
                      ))}
                    </div>

                    {selectedAlert?.id === alert.id && (
                      <div className="space-y-3 p-4 bg-muted rounded-lg">
                        <Textarea
                          placeholder="Additional feedback (optional)"
                          value={feedback}
                          onChange={(e) => setFeedback(e.target.value)}
                          rows={3}
                        />
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleResolution(alert.id, selectedAlert.selectedOption.action)}
                          >
                            Confirm
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => setSelectedAlert(null)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    Resolved on {new Date(alert.resolved_at).toLocaleString()}
                  </div>
                )}

                <div className="text-xs text-muted-foreground">
                  Expires: {new Date(alert.expires_at).toLocaleString()}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
