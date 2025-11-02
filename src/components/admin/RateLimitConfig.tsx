import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Gauge, AlertTriangle, CheckCircle } from 'lucide-react';

interface RateLimitConfigProps {
  webhookId: string;
  currentConfig: {
    enabled: boolean;
    maxRequestsPerMinute: number;
    burstLimit: number;
    windowSeconds: number;
  };
  onUpdate: (config: any) => Promise<void>;
}

export function RateLimitConfig({ webhookId, currentConfig, onUpdate }: RateLimitConfigProps) {
  const [enabled, setEnabled] = useState(currentConfig.enabled);
  const [maxRequests, setMaxRequests] = useState(currentConfig.maxRequestsPerMinute);
  const [burstLimit, setBurstLimit] = useState(currentConfig.burstLimit);
  const [windowSeconds, setWindowSeconds] = useState(currentConfig.windowSeconds);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      await onUpdate({
        rate_limit_enabled: enabled,
        max_requests_per_minute: maxRequests,
        burst_limit: burstLimit,
        rate_limit_window_seconds: windowSeconds,
      });
      setMessage({ type: 'success', text: 'Rate limit configuration saved successfully' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save configuration' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gauge className="h-5 w-5" />
          Rate Limiting Configuration
        </CardTitle>
        <CardDescription>
          Configure rate limits to prevent overwhelming external endpoints
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="rate-limit-enabled">Enable Rate Limiting</Label>
          <Switch
            id="rate-limit-enabled"
            checked={enabled}
            onCheckedChange={setEnabled}
          />
        </div>

        {enabled && (
          <>
            <div className="space-y-2">
              <Label htmlFor="max-requests">Max Requests Per Minute</Label>
              <Input
                id="max-requests"
                type="number"
                value={maxRequests}
                onChange={(e) => setMaxRequests(parseInt(e.target.value))}
                min={1}
                max={1000}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="burst-limit">Burst Limit</Label>
              <Input
                id="burst-limit"
                type="number"
                value={burstLimit}
                onChange={(e) => setBurstLimit(parseInt(e.target.value))}
                min={1}
                max={100}
              />
              <p className="text-xs text-muted-foreground">
                Maximum requests allowed in a short burst
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="window-seconds">Window Duration (seconds)</Label>
              <Input
                id="window-seconds"
                type="number"
                value={windowSeconds}
                onChange={(e) => setWindowSeconds(parseInt(e.target.value))}
                min={10}
                max={3600}
              />
            </div>
          </>
        )}

        {message && (
          <Alert variant={message.type === 'error' ? 'destructive' : 'default'}>
            {message.type === 'success' ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <AlertTriangle className="h-4 w-4" />
            )}
            <AlertDescription>{message.text}</AlertDescription>
          </Alert>
        )}

        <Button onClick={handleSave} disabled={saving} className="w-full">
          {saving ? 'Saving...' : 'Save Configuration'}
        </Button>
      </CardContent>
    </Card>
  );
}
