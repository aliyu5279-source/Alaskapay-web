import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

export function SessionSettings() {
  const { user } = useAuth();
  const [timeoutMinutes, setTimeoutMinutes] = useState(60);
  const [rememberDevice, setRememberDevice] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, [user]);

  const loadSettings = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('session_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (data) {
        setTimeoutMinutes(data.timeout_minutes);
        setRememberDevice(data.remember_device);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    if (!user) return;
    setSaving(true);

    try {
      const { error } = await supabase
        .from('session_settings')
        .upsert({
          user_id: user.id,
          timeout_minutes: timeoutMinutes,
          remember_device: rememberDevice,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      toast.success('Session settings saved');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Session Timeout</CardTitle>
        <CardDescription>
          Configure how long you stay logged in
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Automatic logout after</Label>
          <Select value={timeoutMinutes.toString()} onValueChange={(v) => setTimeoutMinutes(parseInt(v))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="15">15 minutes</SelectItem>
              <SelectItem value="30">30 minutes</SelectItem>
              <SelectItem value="60">1 hour</SelectItem>
              <SelectItem value="120">2 hours</SelectItem>
              <SelectItem value="240">4 hours</SelectItem>
              <SelectItem value="480">8 hours</SelectItem>
              <SelectItem value="1440">24 hours</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Remember this device</Label>
            <p className="text-sm text-muted-foreground">
              Stay logged in on this device
            </p>
          </div>
          <Switch checked={rememberDevice} onCheckedChange={setRememberDevice} />
        </div>

        <Button onClick={saveSettings} disabled={saving}>
          {saving ? 'Saving...' : 'Save Settings'}
        </Button>
      </CardContent>
    </Card>
  );
}
