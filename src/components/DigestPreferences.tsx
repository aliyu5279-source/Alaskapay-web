import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Clock, Calendar, CalendarDays } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function DigestPreferences() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [digestPrefs, setDigestPrefs] = useState({
    enabled: false,
    schedule: 'daily',
    hour_of_day: 9,
    day_of_week: 1
  });

  useEffect(() => {
    loadDigestPreferences();
  }, []);

  const loadDigestPreferences = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('admin_digest_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      if (data) setDigestPrefs(data);
    } catch (error) {
      console.error('Error loading digest preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveDigestPreferences = async () => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('admin_digest_preferences')
        .upsert({ 
          ...digestPrefs, 
          user_id: user.id, 
          updated_at: new Date().toISOString() 
        });

      if (error) throw error;

      toast({ 
        title: 'Digest preferences saved', 
        description: 'Your email digest settings have been updated.' 
      });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center p-8">Loading...</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-600" />
          Email Digest Schedule
        </CardTitle>
        <CardDescription>
          Receive batched email summaries instead of individual notifications
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between p-4 rounded-lg border border-blue-200 bg-blue-50/50">
          <div className="flex items-start space-x-4 flex-1">
            <CalendarDays className="w-5 h-5 mt-0.5 text-blue-600" />
            <div className="flex-1">
              <Label htmlFor="digest-enabled" className="text-base font-medium cursor-pointer">
                Enable Email Digest
              </Label>
              <p className="text-sm text-gray-600">
                Batch notifications into scheduled digest emails
              </p>
            </div>
          </div>
          <Switch
            id="digest-enabled"
            checked={digestPrefs.enabled}
            onCheckedChange={(checked) => setDigestPrefs({ ...digestPrefs, enabled: checked })}
          />
        </div>

        {digestPrefs.enabled && (
          <div className="space-y-4 p-4 bg-white rounded-lg border">
            <div>
              <Label htmlFor="schedule" className="text-sm font-medium">Digest Frequency</Label>
              <Select
                value={digestPrefs.schedule}
                onValueChange={(value) => setDigestPrefs({ ...digestPrefs, schedule: value })}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hourly">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Hourly
                    </div>
                  </SelectItem>
                  <SelectItem value="daily">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Daily
                    </div>
                  </SelectItem>
                  <SelectItem value="weekly">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="w-4 h-4" />
                      Weekly
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {(digestPrefs.schedule === 'daily' || digestPrefs.schedule === 'weekly') && (
              <div>
                <Label htmlFor="hour" className="text-sm font-medium">Time of Day (UTC)</Label>
                <Select
                  value={digestPrefs.hour_of_day.toString()}
                  onValueChange={(value) => setDigestPrefs({ ...digestPrefs, hour_of_day: parseInt(value) })}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 24 }, (_, i) => (
                      <SelectItem key={i} value={i.toString()}>
                        {i.toString().padStart(2, '0')}:00 UTC
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {digestPrefs.schedule === 'weekly' && (
              <div>
                <Label htmlFor="day" className="text-sm font-medium">Day of Week</Label>
                <Select
                  value={digestPrefs.day_of_week.toString()}
                  onValueChange={(value) => setDigestPrefs({ ...digestPrefs, day_of_week: parseInt(value) })}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Sunday</SelectItem>
                    <SelectItem value="1">Monday</SelectItem>
                    <SelectItem value="2">Tuesday</SelectItem>
                    <SelectItem value="3">Wednesday</SelectItem>
                    <SelectItem value="4">Thursday</SelectItem>
                    <SelectItem value="5">Friday</SelectItem>
                    <SelectItem value="6">Saturday</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        )}

        <Button onClick={saveDigestPreferences} disabled={saving} className="w-full">
          {saving ? 'Saving...' : 'Save Digest Preferences'}
        </Button>
      </CardContent>
    </Card>
  );
}
