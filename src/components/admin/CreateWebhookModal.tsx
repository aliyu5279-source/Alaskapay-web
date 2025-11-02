import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface CreateWebhookModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const EVENT_TYPES = [
  { value: 'fraud_alert', label: 'Fraud Alert' },
  { value: 'transaction_created', label: 'Transaction Created' },
  { value: 'kyc_submitted', label: 'KYC Submitted' },
  { value: 'kyc_approved', label: 'KYC Approved' },
  { value: 'kyc_rejected', label: 'KYC Rejected' }
];

export function CreateWebhookModal({ open, onClose, onSuccess }: CreateWebhookModalProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    description: '',
    template_type: 'custom',
    authentication_type: 'none',
    authentication_secret: '',
    event_types: [] as string[],
    retry_enabled: true,
    max_retries: 3,
    timeout_seconds: 30
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('manage-webhooks', {
        body: { action: 'create', webhook: formData }
      });

      if (error) throw error;

      toast({
        title: 'Webhook Created',
        description: 'Webhook endpoint has been configured successfully'
      });

      onSuccess();
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

  const toggleEventType = (eventType: string) => {
    setFormData(prev => ({
      ...prev,
      event_types: prev.event_types.includes(eventType)
        ? prev.event_types.filter(t => t !== eventType)
        : [...prev.event_types, eventType]
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Webhook Endpoint</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Production Slack Alerts"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Webhook URL</Label>
            <Input
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              placeholder="https://hooks.slack.com/services/..."
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Template Type</Label>
            <Select
              value={formData.template_type}
              onValueChange={(value) => setFormData({ ...formData, template_type: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="custom">Custom</SelectItem>
                <SelectItem value="slack">Slack</SelectItem>
                <SelectItem value="discord">Discord</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Event Types</Label>
            <div className="space-y-2">
              {EVENT_TYPES.map(event => (
                <div key={event.value} className="flex items-center space-x-2">
                  <Checkbox
                    checked={formData.event_types.includes(event.value)}
                    onCheckedChange={() => toggleEventType(event.value)}
                  />
                  <label className="text-sm">{event.label}</label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Authentication Type</Label>
            <Select
              value={formData.authentication_type}
              onValueChange={(value) => setFormData({ ...formData, authentication_type: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="api_key">API Key</SelectItem>
                <SelectItem value="bearer_token">Bearer Token</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.authentication_type !== 'none' && (
            <div className="space-y-2">
              <Label>Secret</Label>
              <Input
                type="password"
                value={formData.authentication_secret}
                onChange={(e) => setFormData({ ...formData, authentication_secret: e.target.value })}
                placeholder="Enter secret key"
              />
            </div>
          )}

          <div className="flex gap-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Webhook'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
