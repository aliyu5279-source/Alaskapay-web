import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Trash2, TestTube, ExternalLink, Settings } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { RateLimitConfig } from './RateLimitConfig';
import { ThrottlingStatistics } from './ThrottlingStatistics';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface Webhook {
  id: string;
  name: string;
  url: string;
  event_types: string[];
  template_type: string;
  is_active: boolean;
  authentication_type: string;
  rate_limit_enabled: boolean;
  max_requests_per_minute: number;
  burst_limit: number;
  rate_limit_window_seconds: number;
}


export function WebhookList({ onUpdate }: { onUpdate: () => void }) {
  const { toast } = useToast();
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [loading, setLoading] = useState(true);
  const [testing, setTesting] = useState<string | null>(null);
  const [selectedWebhook, setSelectedWebhook] = useState<Webhook | null>(null);
  const [showRateLimitDialog, setShowRateLimitDialog] = useState(false);

  useEffect(() => {
    loadWebhooks();
  }, []);

  const loadWebhooks = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('manage-webhooks', {
        body: { action: 'list' }
      });

      if (error) throw error;
      setWebhooks(data.webhooks || []);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = async (webhook: Webhook) => {
    try {
      const { error } = await supabase.functions.invoke('manage-webhooks', {
        body: {
          action: 'update',
          webhook: { ...webhook, is_active: !webhook.is_active }
        }
      });

      if (error) throw error;
      loadWebhooks();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const testWebhook = async (webhookId: string) => {
    setTesting(webhookId);
    try {
      const { data, error } = await supabase.functions.invoke('test-webhook', {
        body: { webhookId }
      });

      if (error) throw error;

      toast({
        title: data.success ? 'Test Successful' : 'Test Failed',
        description: data.success 
          ? `Response: ${data.status} (${data.duration_ms}ms)`
          : data.error
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setTesting(null);
    }
  };

  const deleteWebhook = async (webhookId: string) => {
    if (!confirm('Are you sure you want to delete this webhook?')) return;

    try {
      const { error } = await supabase.functions.invoke('manage-webhooks', {
        body: { action: 'delete', webhook: { id: webhookId } }
      });

      if (error) throw error;
      loadWebhooks();
      onUpdate();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const handleRateLimitUpdate = async (config: any) => {
    if (!selectedWebhook) return;

    await supabase.functions.invoke('manage-webhooks', {
      body: {
        action: 'update',
        webhook: { ...selectedWebhook, ...config }
      }
    });
    
    loadWebhooks();
  };

  const openRateLimitConfig = (webhook: Webhook) => {
    setSelectedWebhook(webhook);
    setShowRateLimitDialog(true);
  };


  if (loading) {
    return <div>Loading webhooks...</div>;
  }

  return (
    <>
      <div className="space-y-4">
        {webhooks.map(webhook => (
          <Card key={webhook.id} className="p-4">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold">{webhook.name}</h3>
                  <Badge variant={webhook.template_type === 'custom' ? 'outline' : 'default'}>
                    {webhook.template_type}
                  </Badge>
                  {webhook.authentication_type !== 'none' && (
                    <Badge variant="secondary">{webhook.authentication_type}</Badge>
                  )}
                  {webhook.rate_limit_enabled && (
                    <Badge variant="outline" className="text-xs">
                      Rate Limited: {webhook.max_requests_per_minute}/min
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-2 flex items-center gap-1">
                  <ExternalLink className="h-3 w-3" />
                  {webhook.url}
                </p>
                <div className="flex gap-2">
                  {webhook.event_types.map(type => (
                    <Badge key={type} variant="outline" className="text-xs">
                      {type.replace(/_/g, ' ')}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => openRateLimitConfig(webhook)}
                >
                  <Settings className="h-4 w-4" />
                </Button>
                <Switch
                  checked={webhook.is_active}
                  onCheckedChange={() => toggleActive(webhook)}
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => testWebhook(webhook.id)}
                  disabled={testing === webhook.id}
                >
                  <TestTube className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => deleteWebhook(webhook.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            {webhook.rate_limit_enabled && (
              <ThrottlingStatistics webhookId={webhook.id} />
            )}
          </Card>
        ))}

        {webhooks.length === 0 && (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">No webhooks configured yet</p>
          </Card>
        )}
      </div>

      <Dialog open={showRateLimitDialog} onOpenChange={setShowRateLimitDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Rate Limit Configuration - {selectedWebhook?.name}</DialogTitle>
          </DialogHeader>
          {selectedWebhook && (
            <RateLimitConfig
              webhookId={selectedWebhook.id}
              currentConfig={{
                enabled: selectedWebhook.rate_limit_enabled,
                maxRequestsPerMinute: selectedWebhook.max_requests_per_minute,
                burstLimit: selectedWebhook.burst_limit,
                windowSeconds: selectedWebhook.rate_limit_window_seconds,
              }}
              onUpdate={handleRateLimitUpdate}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

