import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { Bell, X, AlertTriangle, CheckCircle, Ban, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';

interface FraudAlert {
  id: string;
  transaction_id: string;
  risk_score: number;
  transaction_amount: number;
  user_id: string;
  alert_message: string;
  created_at: string;
  acknowledged: boolean;
}

export function FraudAlertPanel() {
  const [alerts, setAlerts] = useState<FraudAlert[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    loadAlerts();
    subscribeToAlerts();
  }, []);

  const loadAlerts = async () => {
    const { data } = await supabase
      .from('fraud_alerts')
      .select('*')
      .eq('acknowledged', false)
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (data) setAlerts(data);
  };

  const subscribeToAlerts = () => {
    const channel = supabase
      .channel('fraud-alerts')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'fraud_alerts'
      }, (payload) => {
        const newAlert = payload.new as FraudAlert;
        setAlerts(prev => [newAlert, ...prev]);
        setIsOpen(true);
        playAlertSound();
        toast.error(`High Risk Transaction: $${newAlert.transaction_amount}`);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const playAlertSound = () => {
    if (soundEnabled && audioRef.current) {
      audioRef.current.play().catch(console.error);
    }
  };

  const acknowledgeAlert = async (alertId: string) => {
    await supabase
      .from('fraud_alerts')
      .update({ acknowledged: true, acknowledged_at: new Date().toISOString() })
      .eq('id', alertId);
    
    setAlerts(prev => prev.filter(a => a.id !== alertId));
  };

  const handleQuickAction = async (alertId: string, action: string) => {
    await supabase.functions.invoke('review-fraud-flag', {
      body: { flagId: alertId, action, notes: `Quick action: ${action}` }
    });
    
    acknowledgeAlert(alertId);
    toast.success(`Transaction ${action}`);
  };

  return (
    <>
      <audio ref={audioRef} src="/alert-sound.mp3" preload="auto" />
      
      <div className="relative">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          className="relative"
        >
          <Bell className="h-5 w-5" />
          {alerts.length > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-red-600 animate-pulse">
              {alerts.length}
            </Badge>
          )}
        </Button>

        {isOpen && (
          <Card className="absolute right-0 top-12 w-96 max-h-[600px] overflow-auto shadow-xl z-50 border-red-200">
            <div className="p-4 border-b bg-red-50 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <h3 className="font-semibold text-red-900">Fraud Alerts</h3>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="p-2">
              {alerts.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No active alerts</p>
              ) : (
                alerts.map(alert => (
                  <Card key={alert.id} className="p-4 mb-2 border-red-200 bg-red-50">
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="destructive" className="animate-pulse">
                        Risk: {alert.risk_score}
                      </Badge>
                      <span className="text-lg font-bold text-red-900">
                        ${alert.transaction_amount}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-700 mb-3">{alert.alert_message}</p>
                    
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleQuickAction(alert.id, 'approved')}
                        className="flex-1"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleQuickAction(alert.id, 'blocked')}
                        className="flex-1"
                      >
                        <Ban className="h-4 w-4 mr-1" />
                        Block
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => {
                          window.location.href = '/admin?tab=fraud';
                          acknowledgeAlert(alert.id);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </Card>
        )}
      </div>
    </>
  );
}