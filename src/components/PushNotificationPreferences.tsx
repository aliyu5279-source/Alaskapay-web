import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Bell, BellOff, CreditCard, AlertTriangle, DollarSign, Calendar, Megaphone, Shield } from 'lucide-react';
import { pushNotifications } from '@/lib/pushNotifications';
import { supabase } from '@/lib/supabase';
import { Badge } from '@/components/ui/badge';

export default function PushNotificationPreferences() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [prefs, setPrefs] = useState({
    transaction_confirmations: true,
    low_balance_warnings: true,
    bill_payment_reminders: true,
    promotional_offers: false,
    security_alerts: true,
    large_transactions: true,
    failed_payments: true
  });

  useEffect(() => {
    checkSubscription();
    loadPreferences();
  }, []);

  const checkSubscription = async () => {
    const sub = await pushNotifications.getSubscription();
    setIsSubscribed(!!sub);
    setLoading(false);
  };

  const loadPreferences = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('push_notification_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (data) setPrefs(data);
    } catch (error) {
      console.error('Error loading push preferences:', error);
    }
  };

  const enablePushNotifications = async () => {
    try {
      const permission = await pushNotifications.requestPermission();
      if (permission === 'granted') {
        await pushNotifications.subscribe();
        setIsSubscribed(true);
        toast({ title: 'Push notifications enabled', description: 'You will now receive real-time alerts' });
      } else {
        toast({ title: 'Permission denied', description: 'Please enable notifications in your browser settings', variant: 'destructive' });
      }
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const disablePushNotifications = async () => {
    try {
      await pushNotifications.unsubscribe();
      setIsSubscribed(false);
      toast({ title: 'Push notifications disabled' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const savePreferences = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      await supabase.from('push_notification_preferences').upsert({
        ...prefs,
        user_id: user.id,
        updated_at: new Date().toISOString()
      });

      toast({ title: 'Preferences saved' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const notificationTypes = [
    { key: 'transaction_confirmations', label: 'Transaction Confirmations', description: 'Instant alerts for completed transactions', icon: CreditCard },
    { key: 'low_balance_warnings', label: 'Low Balance Warnings', description: 'Alert when your balance falls below ₦1,000', icon: AlertTriangle },
    { key: 'bill_payment_reminders', label: 'Bill Payment Reminders', description: 'Reminders for upcoming bill payments', icon: Calendar },
    { key: 'promotional_offers', label: 'Promotional Offers', description: 'Special deals and cashback offers', icon: Megaphone },
    { key: 'security_alerts', label: 'Security Alerts', description: 'Suspicious activity and login alerts', icon: Shield },
    { key: 'large_transactions', label: 'Large Transactions', description: 'Alerts for transactions over ₦10,000', icon: DollarSign },
    { key: 'failed_payments', label: 'Failed Payments', description: 'Notifications when payments fail', icon: AlertTriangle }
  ];

  if (loading) return <div className="flex justify-center p-8">Loading...</div>;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Push Notifications
          </CardTitle>
          <CardDescription>Receive real-time alerts on your device</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg border bg-gradient-to-r from-purple-50 to-blue-50">
            <div className="flex items-center gap-3">
              {isSubscribed ? <Bell className="w-6 h-6 text-green-600" /> : <BellOff className="w-6 h-6 text-gray-400" />}
              <div>
                <p className="font-medium">{isSubscribed ? 'Notifications Enabled' : 'Notifications Disabled'}</p>
                <p className="text-sm text-gray-600">
                  {isSubscribed ? 'You are receiving push notifications' : 'Enable to receive real-time alerts'}
                </p>
              </div>
            </div>
            <Button onClick={isSubscribed ? disablePushNotifications : enablePushNotifications} variant={isSubscribed ? 'outline' : 'default'}>
              {isSubscribed ? 'Disable' : 'Enable'}
            </Button>
          </div>

          {isSubscribed && (
            <div className="space-y-3 pt-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium">Notification Types</h3>
                <Badge variant="secondary">{Object.values(prefs).filter(Boolean).length} enabled</Badge>
              </div>
              {notificationTypes.map(({ key, label, description, icon: Icon }) => (
                <div key={key} className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                  <div className="flex items-start gap-3 flex-1">
                    <Icon className="w-5 h-5 mt-0.5 text-purple-600" />
                    <div className="flex-1">
                      <Label htmlFor={key} className="text-sm font-medium cursor-pointer">{label}</Label>
                      <p className="text-xs text-gray-500">{description}</p>
                    </div>
                  </div>
                  <Switch
                    id={key}
                    checked={prefs[key as keyof typeof prefs]}
                    onCheckedChange={(checked) => setPrefs({ ...prefs, [key]: checked })}
                  />
                </div>
              ))}
              <Button onClick={savePreferences} className="w-full mt-4">Save Preferences</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
