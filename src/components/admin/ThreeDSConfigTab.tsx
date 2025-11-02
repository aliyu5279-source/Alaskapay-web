import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Save, AlertCircle, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export function ThreeDSConfigTab() {
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const { data, error } = await supabase
        .from('three_ds_config')
        .select('*')
        .eq('is_active', true)
        .single();

      if (error) throw error;
      setConfig(data || getDefaultConfig());
    } catch (error: any) {
      console.error('Error loading config:', error);
      setConfig(getDefaultConfig());
    } finally {
      setLoading(false);
    }
  };

  const getDefaultConfig = () => ({
    name: 'Default 3DS Policy',
    enabled: true,
    amount_threshold: 10000,
    risk_score_threshold: 50,
    trigger_rules: {
      high_risk_countries: true,
      new_payment_method: true,
      velocity_exceeded: true,
      amount_spike: true,
      failed_attempts: true
    },
    preferred_version: '2.0',
    fallback_to_v1: true,
    allowed_methods: ['otp', 'biometric', 'app'],
    frictionless_enabled: true,
    authentication_timeout_seconds: 300,
    max_retry_attempts: 3,
    exemption_rules: {
      low_value_exemption: { enabled: true, threshold: 1000 },
      trusted_beneficiary: { enabled: true },
      recurring_payment: { enabled: false }
    },
    target_success_rate: 95.00,
    target_completion_time_seconds: 60
  });

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage(null);

      const { error } = await supabase
        .from('three_ds_config')
        .upsert({
          ...config,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      setMessage({ type: 'success', text: '3DS configuration saved successfully!' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">3D Secure Configuration</h2>
          <p className="text-muted-foreground">
            Configure thresholds and rules for 3DS authentication
          </p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      {message && (
        <Alert variant={message.type === 'error' ? 'destructive' : 'default'}>
          {message.type === 'success' ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Basic Settings</CardTitle>
            <CardDescription>Core 3DS authentication settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="enabled">Enable 3D Secure</Label>
              <Switch
                id="enabled"
                checked={config.enabled}
                onCheckedChange={(checked) => setConfig({ ...config, enabled: checked })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount Threshold (NGN)</Label>
              <Input
                id="amount"
                type="number"
                value={config.amount_threshold}
                onChange={(e) => setConfig({ ...config, amount_threshold: parseFloat(e.target.value) })}
              />
              <p className="text-xs text-muted-foreground">
                Transactions above this amount require 3DS
              </p>
            </div>

            <div className="space-y-2">
              <Label>Risk Score Threshold: {config.risk_score_threshold}</Label>
              <Slider
                value={[config.risk_score_threshold]}
                onValueChange={([value]) => setConfig({ ...config, risk_score_threshold: value })}
                max={100}
                step={5}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Transactions with risk score above this require 3DS
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="timeout">Authentication Timeout (seconds)</Label>
              <Input
                id="timeout"
                type="number"
                value={config.authentication_timeout_seconds}
                onChange={(e) => setConfig({ ...config, authentication_timeout_seconds: parseInt(e.target.value) })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="retries">Max Retry Attempts</Label>
              <Input
                id="retries"
                type="number"
                value={config.max_retry_attempts}
                onChange={(e) => setConfig({ ...config, max_retry_attempts: parseInt(e.target.value) })}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Trigger Rules</CardTitle>
            <CardDescription>Conditions that trigger 3DS authentication</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(config.trigger_rules).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <Label htmlFor={key} className="cursor-pointer">
                  {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </Label>
                <Switch
                  id={key}
                  checked={value as boolean}
                  onCheckedChange={(checked) => setConfig({
                    ...config,
                    trigger_rules: { ...config.trigger_rules, [key]: checked }
                  })}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Authentication Methods</CardTitle>
            <CardDescription>Allowed verification methods</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {['otp', 'biometric', 'app', 'password'].map((method) => (
              <div key={method} className="flex items-center justify-between">
                <Label htmlFor={method} className="cursor-pointer capitalize">
                  {method}
                </Label>
                <Switch
                  id={method}
                  checked={config.allowed_methods.includes(method)}
                  onCheckedChange={(checked) => {
                    const methods = checked
                      ? [...config.allowed_methods, method]
                      : config.allowed_methods.filter((m: string) => m !== method);
                    setConfig({ ...config, allowed_methods: methods });
                  }}
                />
              </div>
            ))}

            <div className="flex items-center justify-between pt-4 border-t">
              <Label htmlFor="frictionless">Enable Frictionless Flow</Label>
              <Switch
                id="frictionless"
                checked={config.frictionless_enabled}
                onCheckedChange={(checked) => setConfig({ ...config, frictionless_enabled: checked })}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Exemptions</CardTitle>
            <CardDescription>Transactions exempt from 3DS</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="low-value">Low Value Exemption</Label>
                <Switch
                  id="low-value"
                  checked={config.exemption_rules.low_value_exemption.enabled}
                  onCheckedChange={(checked) => setConfig({
                    ...config,
                    exemption_rules: {
                      ...config.exemption_rules,
                      low_value_exemption: { ...config.exemption_rules.low_value_exemption, enabled: checked }
                    }
                  })}
                />
              </div>
              {config.exemption_rules.low_value_exemption.enabled && (
                <Input
                  type="number"
                  placeholder="Threshold amount"
                  value={config.exemption_rules.low_value_exemption.threshold}
                  onChange={(e) => setConfig({
                    ...config,
                    exemption_rules: {
                      ...config.exemption_rules,
                      low_value_exemption: { 
                        ...config.exemption_rules.low_value_exemption, 
                        threshold: parseFloat(e.target.value) 
                      }
                    }
                  })}
                />
              )}
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="trusted">Trusted Beneficiary</Label>
              <Switch
                id="trusted"
                checked={config.exemption_rules.trusted_beneficiary.enabled}
                onCheckedChange={(checked) => setConfig({
                  ...config,
                  exemption_rules: {
                    ...config.exemption_rules,
                    trusted_beneficiary: { enabled: checked }
                  }
                })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="recurring">Recurring Payments</Label>
              <Switch
                id="recurring"
                checked={config.exemption_rules.recurring_payment.enabled}
                onCheckedChange={(checked) => setConfig({
                  ...config,
                  exemption_rules: {
                    ...config.exemption_rules,
                    recurring_payment: { enabled: checked }
                  }
                })}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}