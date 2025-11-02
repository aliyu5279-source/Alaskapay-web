import { useState, useEffect } from 'react';
import { Bell, Volume2, Vibrate, Moon, Check } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/supabase';
import { pushNotifications } from '@/lib/pushNotifications';
import { toast } from 'sonner';

export function PushNotificationSettings() {
  const [prefs, setPrefs] = useState<any>({
    failed_transactions: true,
    security_alerts: true,
    high_value_payments: true,
    high_value_threshold: 10000,
    system_errors: true,
    user_reports: true,
    new_user_signups: false,
    daily_digest: false,
    sound_enabled: true,
    vibration_enabled: true,
    quiet_hours_enabled: false,
    quiet_hours_start: '22:00',
    quiet_hours_end: '08:00'
  });
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPreferences();
    checkSubscription();
  }, []);

  const loadPreferences = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('push_notification_preferences')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (data) {
      setPrefs(data);
    }
    setLoading(false);
  };

  const checkSubscription = async () => {
    const subscription = await pushNotifications.getSubscription();
    setIsSubscribed(!!subscription);
  };

  const handleEnableNotifications = async () => {
    try {
      const permission = await pushNotifications.requestPermission();
      if (permission === 'granted') {
        await pushNotifications.subscribe();
        setIsSubscribed(true);
        toast.success('Push notifications enabled');
      } else {
        toast.error('Notification permission denied');
      }
    } catch (error) {
      toast.error('Failed to enable notifications');
    }
  };

  const handleDisableNotifications = async () => {
    try {
      await pushNotifications.unsubscribe();
      setIsSubscribed(false);
      toast.success('Push notifications disabled');
    } catch (error) {
      toast.error('Failed to disable notifications');
    }
  };

  const savePreferences = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('push_notification_preferences')
      .upsert({ ...prefs, user_id: user.id });

    if (error) {
      toast.error('Failed to save preferences');
    } else {
      toast.success('Preferences saved');
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Push Notifications
          </CardTitle>
          <CardDescription>
            Receive real-time alerts on your device
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Enable Push Notifications</Label>
            <Button
              onClick={isSubscribed ? handleDisableNotifications : handleEnableNotifications}
              variant={isSubscribed ? 'destructive' : 'default'}
            >
              {isSubscribed ? 'Disable' : 'Enable'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notification Types</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { key: 'failed_transactions', label: 'Failed Transactions', desc: 'Alert when payments fail' },
            { key: 'security_alerts', label: 'Security Alerts', desc: 'Suspicious activity detected' },
            { key: 'high_value_payments', label: 'High Value Payments', desc: 'Large transactions' },
            { key: 'system_errors', label: 'System Errors', desc: 'Critical system issues' },
            { key: 'user_reports', label: 'User Reports', desc: 'User-submitted issues' },
            { key: 'new_user_signups', label: 'New User Signups', desc: 'New account registrations' },
            { key: 'daily_digest', label: 'Daily Digest', desc: 'Daily summary at 9 AM' }
          ].map(item => (
            <div key={item.key} className="flex items-center justify-between">
              <div>
                <Label>{item.label}</Label>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
              <Switch
                checked={prefs[item.key]}
                onCheckedChange={(checked) => setPrefs({ ...prefs, [item.key]: checked })}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Volume2 className="h-5 w-5" />
            Sound & Vibration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Sound</Label>
            <Switch
              checked={prefs.sound_enabled}
              onCheckedChange={(checked) => setPrefs({ ...prefs, sound_enabled: checked })}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label>Vibration</Label>
            <Switch
              checked={prefs.vibration_enabled}
              onCheckedChange={(checked) => setPrefs({ ...prefs, vibration_enabled: checked })}
            />
          </div>
        </CardContent>
      </Card>

      <Button onClick={savePreferences} className="w-full">
        <Check className="h-4 w-4 mr-2" />
        Save Preferences
      </Button>
    </div>
  );
}
