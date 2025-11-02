import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Bell, Mail, CreditCard, Receipt, Shield, Megaphone, Smartphone, AlertTriangle, DollarSign, Key, AtSign, ShieldCheck, ShieldAlert, Info } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import DigestPreferences from './DigestPreferences';
import PushNotificationPreferences from './PushNotificationPreferences';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function NotificationPreferences() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [prefs, setPrefs] = useState({
    welcome_emails: true,
    password_reset_emails: true,
    payment_confirmations: true,
    transaction_receipts: true,
    account_activity_alerts: true,
    marketing_emails: false,
    new_device_login: true,
    failed_login_attempts: true,
    large_transactions: true,
    large_transaction_threshold: 1000,
    password_changes: true,
    email_changes: true,
    two_factor_changes: true,
    admin_critical_alerts: true,
    admin_warning_alerts: true,
    admin_info_alerts: false
  });



  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('notification_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      if (data) setPrefs(data);
    } catch (error) {
      console.error('Error loading preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const savePreferences = async () => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('notification_preferences')
        .upsert({ ...prefs, user_id: user.id, updated_at: new Date().toISOString() });

      if (error) throw error;

      toast({ title: 'Preferences saved', description: 'Your notification preferences have been updated.' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const generalNotifications = [
    { key: 'welcome_emails', label: 'Welcome Emails', description: 'Receive a welcome email when you sign up', icon: Mail },
    { key: 'password_reset_emails', label: 'Password Reset', description: 'Important security emails for password resets', icon: Shield },
    { key: 'payment_confirmations', label: 'Payment Confirmations', description: 'Get notified when payments are processed', icon: CreditCard },
    { key: 'transaction_receipts', label: 'Transaction Receipts', description: 'Receive detailed receipts for all transactions', icon: Receipt },
    { key: 'account_activity_alerts', label: 'Account Activity', description: 'Alerts for important account activities', icon: Bell },
    { key: 'marketing_emails', label: 'Marketing & Updates', description: 'Product updates and promotional offers', icon: Megaphone }
  ];

  const securityAlerts = [
    { key: 'new_device_login', label: 'New Device Login', description: 'Alert when your account is accessed from a new device', icon: Smartphone },
    { key: 'failed_login_attempts', label: 'Failed Login Attempts', description: 'Notify about multiple failed login attempts', icon: AlertTriangle },
    { key: 'large_transactions', label: 'Large Transactions', description: 'Alert for transactions over $1,000', icon: DollarSign },
    { key: 'password_changes', label: 'Password Changes', description: 'Notify when your password is changed', icon: Key },
    { key: 'email_changes', label: 'Email Changes', description: 'Alert when your email address is updated', icon: AtSign },
    { key: 'two_factor_changes', label: '2FA Changes', description: 'Notify when two-factor authentication is modified', icon: ShieldCheck }
  ];

  const adminAlerts = [
    { key: 'admin_critical_alerts', label: 'Critical Admin Alerts', description: 'Email alerts for critical system events requiring immediate attention', icon: ShieldAlert },
    { key: 'admin_warning_alerts', label: 'Warning Admin Alerts', description: 'Email alerts for warning-level administrative events', icon: AlertTriangle },
    { key: 'admin_info_alerts', label: 'Info Admin Alerts', description: 'Email alerts for informational administrative events', icon: Info }
  ];


  if (loading) return <div className="flex justify-center p-8">Loading...</div>;

  return (
    <Tabs defaultValue="email" className="space-y-6">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="email" className="flex items-center gap-2">
          <Mail className="w-4 h-4" />
          Email Notifications
        </TabsTrigger>
        <TabsTrigger value="push" className="flex items-center gap-2">
          <Bell className="w-4 h-4" />
          Push Notifications
        </TabsTrigger>
      </TabsList>

      <TabsContent value="email" className="space-y-6">

      <Card>
        <CardHeader>
          <CardTitle>General Notifications</CardTitle>
          <CardDescription>Manage general email notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {generalNotifications.map(({ key, label, description, icon: Icon }) => (
            <div key={key} className="flex items-center justify-between space-x-4 p-4 rounded-lg border">
              <div className="flex items-start space-x-4 flex-1">
                <Icon className="w-5 h-5 mt-0.5 text-purple-600" />
                <div className="flex-1">
                  <Label htmlFor={key} className="text-base font-medium cursor-pointer">{label}</Label>
                  <p className="text-sm text-gray-500">{description}</p>
                </div>
              </div>
              <Switch
                id={key}
                checked={prefs[key as keyof typeof prefs]}
                onCheckedChange={(checked) => setPrefs({ ...prefs, [key]: checked })}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Security Alerts</CardTitle>
          <CardDescription>Get notified about suspicious activities and security events</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {securityAlerts.map(({ key, label, description, icon: Icon }) => (
            <div key={key} className="space-y-2">
              <div className="flex items-center justify-between space-x-4 p-4 rounded-lg border border-orange-200 bg-orange-50/50">
                <div className="flex items-start space-x-4 flex-1">
                  <Icon className="w-5 h-5 mt-0.5 text-orange-600" />
                  <div className="flex-1">
                    <Label htmlFor={key} className="text-base font-medium cursor-pointer">{label}</Label>
                    <p className="text-sm text-gray-600">{description}</p>
                  </div>
                </div>
                <Switch
                  id={key}
                  checked={prefs[key as keyof typeof prefs]}
                  onCheckedChange={(checked) => setPrefs({ ...prefs, [key]: checked })}
                />
              </div>
              {key === 'large_transactions' && prefs.large_transactions && (
                <div className="ml-12 p-4 bg-white rounded-lg border border-orange-200">
                  <Label htmlFor="threshold" className="text-sm font-medium">Alert Threshold Amount (₦)</Label>
                  <Input
                    id="threshold"
                    type="number"
                    min="0"
                    step="100"
                    value={prefs.large_transaction_threshold}
                    onChange={(e) => setPrefs({ ...prefs, large_transaction_threshold: parseFloat(e.target.value) || 0 })}
                    className="mt-2"
                    placeholder="1000"
                  />
                  <p className="text-xs text-gray-500 mt-1">You'll be alerted when a transaction exceeds this amount</p>
                </div>
              )}
            </div>
          ))}



        </CardContent>
      </Card>


      {user?.role === 'admin' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-red-600" />
              Admin Email Alerts
            </CardTitle>
            <CardDescription>Configure email notifications for administrative events</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {adminAlerts.map(({ key, label, description, icon: Icon }) => (
              <div key={key} className="flex items-center justify-between space-x-4 p-4 rounded-lg border border-red-200 bg-red-50/50">
                <div className="flex items-start space-x-4 flex-1">
                  <Icon className="w-5 h-5 mt-0.5 text-red-600" />
                  <div className="flex-1">
                    <Label htmlFor={key} className="text-base font-medium cursor-pointer">{label}</Label>
                    <p className="text-sm text-gray-600">{description}</p>
                  </div>
                </div>
                <Switch
                  id={key}
                  checked={prefs[key as keyof typeof prefs]}
                  onCheckedChange={(checked) => setPrefs({ ...prefs, [key]: checked })}
                />
              </div>
            ))}
          </CardContent>
        </Card>

      )}

      {user?.role === 'admin' && <DigestPreferences />}

      <Button onClick={savePreferences} disabled={saving} className="w-full">
        {saving ? 'Saving...' : 'Save Email Preferences'}
      </Button>
      </TabsContent>

      <TabsContent value="push">
        <PushNotificationPreferences />
      </TabsContent>
    </Tabs>
  );
}

