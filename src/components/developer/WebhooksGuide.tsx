import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Webhook, Shield, CheckCircle } from 'lucide-react';
import { CodeBlock } from './CodeBlock';

const webhookEvents = [
  { event: 'payment.successful', description: 'Payment completed successfully' },
  { event: 'payment.failed', description: 'Payment attempt failed' },
  { event: 'transfer.completed', description: 'Transfer processed' },
  { event: 'wallet.credited', description: 'Wallet received funds' },
  { event: 'wallet.debited', description: 'Wallet funds withdrawn' },
  { event: 'dispute.created', description: 'New dispute opened' },
];

export function WebhooksGuide() {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Webhook className="h-5 w-5 text-purple-600" />
          <h3 className="text-xl font-semibold">Webhook Events</h3>
        </div>
        <p className="text-gray-600 mb-4">
          Webhooks notify your application when events occur in real-time.
        </p>
        <div className="space-y-2">
          {webhookEvents.map((webhook) => (
            <div key={webhook.event} className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <code className="text-sm font-mono text-blue-600">{webhook.event}</code>
                <p className="text-sm text-gray-600 mt-1">{webhook.description}</p>
              </div>
              <Badge variant="outline">Active</Badge>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="h-5 w-5 text-green-600" />
          <h3 className="text-xl font-semibold">Webhook Signature Verification</h3>
        </div>
        <p className="text-gray-600 mb-4">Verify webhook authenticity using the signature header:</p>
        <CodeBlock 
          code={`const crypto = require('crypto');

function verifyWebhook(payload, signature, secret) {
  const hash = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(hash)
  );
}

// Express.js example
app.post('/webhook', (req, res) => {
  const signature = req.headers['x-alaskapay-signature'];
  const isValid = verifyWebhook(
    JSON.stringify(req.body),
    signature,
    process.env.WEBHOOK_SECRET
  );
  
  if (!isValid) {
    return res.status(401).send('Invalid signature');
  }
  
  // Process webhook
  res.status(200).send('OK');
});`}
          language="javascript"
        />
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle className="h-5 w-5 text-blue-600" />
          <h3 className="text-xl font-semibold">Webhook Payload Example</h3>
        </div>
        <CodeBlock 
          code={`{
  "id": "evt_1234567890",
  "type": "payment.successful",
  "created": 1640995200,
  "data": {
    "object": {
      "id": "txn_abc123",
      "amount": 5000.00,
      "currency": "NGN",
      "status": "successful",
      "reference": "REF_123456",
      "customer": {
        "email": "customer@example.com"
      }
    }
  }
}`}
          language="json"
        />
      </Card>
    </div>
  );
}
