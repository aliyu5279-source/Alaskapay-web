import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Send, Zap, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function WebhookTester() {
  const { toast } = useToast();
  const [webhookUrl, setWebhookUrl] = useState('');
  const [eventType, setEventType] = useState('payment.success');
  const [customPayload, setCustomPayload] = useState('');
  const [testResults, setTestResults] = useState<any[]>([]);
  const [testing, setTesting] = useState(false);

  const eventTemplates: Record<string, any> = {
    'payment.success': {
      event: 'payment.success',
      data: {
        id: 'pay_' + Math.random().toString(36).substr(2, 9),
        amount: 10000,
        currency: 'NGN',
        status: 'success',
        customer: { id: 'cus_123', email: 'customer@example.com' },
        timestamp: new Date().toISOString()
      }
    },
    'payment.failed': {
      event: 'payment.failed',
      data: {
        id: 'pay_' + Math.random().toString(36).substr(2, 9),
        amount: 5000,
        currency: 'NGN',
        status: 'failed',
        error: 'Insufficient funds',
        timestamp: new Date().toISOString()
      }
    },
    'user.created': {
      event: 'user.created',
      data: {
        id: 'usr_' + Math.random().toString(36).substr(2, 9),
        email: 'newuser@example.com',
        name: 'John Doe',
        created_at: new Date().toISOString()
      }
    },
    'subscription.renewed': {
      event: 'subscription.renewed',
      data: {
        id: 'sub_' + Math.random().toString(36).substr(2, 9),
        plan: 'premium',
        amount: 50000,
        next_billing_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      }
    }
  };

  const handleSendWebhook = async () => {
    if (!webhookUrl) {
      toast({ title: 'Error', description: 'Please enter a webhook URL', variant: 'destructive' });
      return;
    }

    setTesting(true);
    try {
      const payload = customPayload ? JSON.parse(customPayload) : eventTemplates[eventType];
      
      // Simulate webhook delivery
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const result = {
        id: Date.now(),
        event: eventType,
        url: webhookUrl,
        payload,
        status: Math.random() > 0.2 ? 'success' : 'failed',
        statusCode: Math.random() > 0.2 ? 200 : 500,
        timestamp: new Date(),
        duration: Math.floor(Math.random() * 500) + 100
      };

      setTestResults(prev => [result, ...prev]);
      
      toast({
        title: result.status === 'success' ? 'Webhook delivered!' : 'Webhook failed',
        description: `${eventType} event ${result.status === 'success' ? 'sent successfully' : 'delivery failed'}`,
        variant: result.status === 'success' ? 'default' : 'destructive'
      });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Webhook Event Tester
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Webhook URL</Label>
            <Input
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              placeholder="https://your-app.com/webhooks"
            />
          </div>

          <div className="space-y-2">
            <Label>Event Type</Label>
            <Select value={eventType} onValueChange={setEventType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="payment.success">Payment Success</SelectItem>
                <SelectItem value="payment.failed">Payment Failed</SelectItem>
                <SelectItem value="user.created">User Created</SelectItem>
                <SelectItem value="subscription.renewed">Subscription Renewed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Custom Payload (Optional)</Label>
            <Textarea
              value={customPayload}
              onChange={(e) => setCustomPayload(e.target.value)}
              placeholder="Leave empty to use default event template"
              className="font-mono text-sm min-h-[120px]"
            />
          </div>

          <Button onClick={handleSendWebhook} disabled={testing} className="w-full">
            <Send className="h-4 w-4 mr-2" />
            {testing ? 'Sending...' : 'Send Test Webhook'}
          </Button>
        </CardContent>
      </Card>

      {testResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {testResults.map((result) => (
                <div key={result.id} className="p-4 border rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {result.status === 'success' ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                      <Badge>{result.event}</Badge>
                      <span className="text-sm text-muted-foreground">
                        {result.statusCode} • {result.duration}ms
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {result.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <pre className="bg-muted p-2 rounded text-xs overflow-x-auto">
                    {JSON.stringify(result.payload, null, 2)}
                  </pre>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
