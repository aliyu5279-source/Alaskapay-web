import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Loader2, Save, Settings } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

export function SubscriptionPauseSettingsTab() {
  const [plans, setPlans] = useState<any[]>([]);
  const [settings, setSettings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [plansRes, settingsRes] = await Promise.all([
        supabase.from('subscription_plans').select('*').order('price'),
        supabase.from('subscription_pause_settings').select('*')
      ]);

      if (plansRes.data) setPlans(plansRes.data);
      if (settingsRes.data) setSettings(settingsRes.data);
    } catch (error: any) {
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const getSettingsForPlan = (planId: string) => {
    return settings.find(s => s.plan_id === planId) || {
      max_pause_duration_days: 90,
      max_pauses_per_year: 2,
      allow_customer_pause: true,
      require_reason: false,
      auto_resume_enabled: true,
      prorate_on_resume: true
    };
  };

  const handleSaveSettings = async (planId: string, newSettings: any) => {
    try {
      setSaving(planId);
      
      const existing = settings.find(s => s.plan_id === planId);
      
      if (existing) {
        const { error } = await supabase
          .from('subscription_pause_settings')
          .update(newSettings)
          .eq('plan_id', planId);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('subscription_pause_settings')
          .insert({ ...newSettings, plan_id: planId });
        
        if (error) throw error;
      }

      toast.success('Settings saved successfully');
      fetchData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save settings');
    } finally {
      setSaving(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Pause Settings</h2>
          <p className="text-sm text-gray-600">Configure pause options for each plan</p>
        </div>
      </div>

      <div className="space-y-4">
        {plans.map((plan) => {
          const planSettings = getSettingsForPlan(plan.id);
          
          return (
            <Card key={plan.id} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">{plan.name}</h3>
                  <p className="text-sm text-gray-600">₦{plan.price}/{plan.billing_cycle}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Max Pause Duration (Days)</Label>
                  <Input
                    type="number"
                    defaultValue={planSettings.max_pause_duration_days}
                    onChange={(e) => {
                      planSettings.max_pause_duration_days = parseInt(e.target.value);
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Max Pauses Per Year</Label>
                  <Input
                    type="number"
                    defaultValue={planSettings.max_pauses_per_year}
                    onChange={(e) => {
                      planSettings.max_pauses_per_year = parseInt(e.target.value);
                    }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label>Allow Customer Pause</Label>
                  <Switch
                    checked={planSettings.allow_customer_pause}
                    onCheckedChange={(checked) => {
                      planSettings.allow_customer_pause = checked;
                    }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label>Require Reason</Label>
                  <Switch
                    checked={planSettings.require_reason}
                    onCheckedChange={(checked) => {
                      planSettings.require_reason = checked;
                    }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label>Auto Resume</Label>
                  <Switch
                    checked={planSettings.auto_resume_enabled}
                    onCheckedChange={(checked) => {
                      planSettings.auto_resume_enabled = checked;
                    }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label>Prorate on Resume</Label>
                  <Switch
                    checked={planSettings.prorate_on_resume}
                    onCheckedChange={(checked) => {
                      planSettings.prorate_on_resume = checked;
                    }}
                  />
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <Button
                  onClick={() => handleSaveSettings(plan.id, planSettings)}
                  disabled={saving === plan.id}
                >
                  {saving === plan.id && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <Save className="mr-2 h-4 w-4" />
                  Save Settings
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
