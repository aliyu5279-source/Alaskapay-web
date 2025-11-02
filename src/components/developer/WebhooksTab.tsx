import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Webhook, Plus, Send, Copy } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export function WebhooksTab() {
  const [webhooks, setWebhooks] = useState([
    {
      id: '1',
      url: 'https://myapp.com/webhooks/alaskapay',
      events: ['payment.successful', 'payment.failed', 'transfer.completed'],
      active: true,
      secret: 'whsec_' + Math.random().toString(36).substring(7)
    }
  ]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showTestModal, setShowTestModal] = useState(false);

  const availableEvents = [
    { id: 'payment.successful', label: 'Payment Successful' },
    { id: 'payment.failed', label: 'Payment Failed' },
    { id: 'transfer.completed', label: 'Transfer Completed' },
    { id: 'wallet.credited', label: 'Wallet Credited' },
    { id: 'wallet.debited', label: 'Wallet Debited' },
    { id: 'kyc.approved', label: 'KYC Approved' },
    { id: 'kyc.rejected', label: 'KYC Rejected' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Webhooks</h2>
          <p className="text-gray-600">Configure webhook endpoints for real-time events</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Webhook
        </Button>
      </div>

      <div className="space-y-4">
        {webhooks.map((webhook) => (
          <Card key={webhook.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <Webhook className="h-5 w-5 text-blue-600" />
                <div>
                  <code className="text-sm font-mono">{webhook.url}</code>
                  <div className="flex gap-2 mt-2">
                    {webhook.events.map((event) => (
                      <Badge key={event} variant="secondary" className="text-xs">
                        {event}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              <Badge variant={webhook.active ? 'default' : 'secondary'}>
                {webhook.active ? 'Active' : 'Inactive'}
              </Badge>
            </div>

            <div className="flex items-center gap-4 mt-4">
              <div className="flex-1">
                <Label className="text-xs text-gray-600">Signing Secret</Label>
                <div className="flex items-center gap-2 mt-1">
                  <code className="text-xs bg-gray-100 px-3 py-1 rounded flex-1">
                    {webhook.secret}
                  </code>
                  <Button size="sm" variant="ghost">
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <Button size="sm" variant="outline" onClick={() => setShowTestModal(true)}>
                <Send className="h-4 w-4 mr-2" />
                Test
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Webhook Endpoint</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Endpoint URL</Label>
              <Input placeholder="https://yourapp.com/webhooks/alaskapay" />
            </div>
            <div>
              <Label className="mb-3 block">Events to Subscribe</Label>
              <div className="grid grid-cols-2 gap-3">
                {availableEvents.map((event) => (
                  <div key={event.id} className="flex items-center space-x-2">
                    <Checkbox id={event.id} />
                    <label htmlFor={event.id} className="text-sm cursor-pointer">
                      {event.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <Button className="w-full">Create Webhook</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showTestModal} onOpenChange={setShowTestModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Test Webhook</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Select Event Type</Label>
              <select className="w-full border rounded p-2 mt-1">
                {availableEvents.map((event) => (
                  <option key={event.id} value={event.id}>
                    {event.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label>Test Payload</Label>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded text-xs overflow-x-auto mt-1">
{`{
  "event": "payment.successful",
  "data": {
    "id": "txn_test_123",
    "amount": 5000.00,
    "currency": "NGN",
    "status": "successful"
  }
}`}
              </pre>
            </div>
            <Button className="w-full">
              <Send className="h-4 w-4 mr-2" />
              Send Test Event
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
