import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, ExternalLink } from 'lucide-react';
import { CodeBlock } from './CodeBlock';

export function SDKSection() {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">Official SDKs</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="border rounded-lg p-4">
            <h4 className="font-semibold mb-2">Node.js</h4>
            <p className="text-sm text-gray-600 mb-3">v2.1.0</p>
            <Button variant="outline" size="sm" className="w-full">
              <Download className="h-4 w-4 mr-2" />
              npm install alaskapay
            </Button>
          </div>
          <div className="border rounded-lg p-4">
            <h4 className="font-semibold mb-2">Python</h4>
            <p className="text-sm text-gray-600 mb-3">v1.8.0</p>
            <Button variant="outline" size="sm" className="w-full">
              <Download className="h-4 w-4 mr-2" />
              pip install alaskapay
            </Button>
          </div>
          <div className="border rounded-lg p-4">
            <h4 className="font-semibold mb-2">PHP</h4>
            <p className="text-sm text-gray-600 mb-3">v1.5.0</p>
            <Button variant="outline" size="sm" className="w-full">
              <Download className="h-4 w-4 mr-2" />
              composer require alaskapay/sdk
            </Button>
          </div>
          <div className="border rounded-lg p-4">
            <h4 className="font-semibold mb-2">Ruby</h4>
            <p className="text-sm text-gray-600 mb-3">v1.4.0</p>
            <Button variant="outline" size="sm" className="w-full">
              <Download className="h-4 w-4 mr-2" />
              gem install alaskapay
            </Button>
          </div>
        </div>

        <Tabs defaultValue="nodejs">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="nodejs">Node.js</TabsTrigger>
            <TabsTrigger value="python">Python</TabsTrigger>
            <TabsTrigger value="php">PHP</TabsTrigger>
            <TabsTrigger value="ruby">Ruby</TabsTrigger>
          </TabsList>

          <TabsContent value="nodejs" className="space-y-4">
            <CodeBlock 
              code={`const AlaskaPay = require('alaskapay');

const client = new AlaskaPay('ak_test_...');

// Create payment
const payment = await client.payments.create({
  amount: 5000.00,
  currency: 'NGN',
  reference: 'REF_' + Date.now(),
  customer: {
    email: 'customer@example.com'
  }
});

console.log(payment.id);`}
              language="javascript"
            />
          </TabsContent>

          <TabsContent value="python" className="space-y-4">
            <CodeBlock 
              code={`import alaskapay

alaskapay.api_key = 'ak_test_...'

# Create payment
payment = alaskapay.Payment.create(
    amount=5000.00,
    currency='NGN',
    reference='REF_' + str(time.time()),
    customer={'email': 'customer@example.com'}
)

print(payment.id)`}
              language="python"
            />
          </TabsContent>

          <TabsContent value="php" className="space-y-4">
            <CodeBlock 
              code={`<?php
require_once('vendor/autoload.php');

\\AlaskaPay\\AlaskaPay::setApiKey('ak_test_...');

$payment = \\AlaskaPay\\Payment::create([
  'amount' => 5000.00,
  'currency' => 'NGN',
  'reference' => 'REF_' . time(),
  'customer' => [
    'email' => 'customer@example.com'
  ]
]);

echo $payment->id;`}
              language="php"
            />
          </TabsContent>

          <TabsContent value="ruby" className="space-y-4">
            <CodeBlock 
              code={`require 'alaskapay'

AlaskaPay.api_key = 'ak_test_...'

payment = AlaskaPay::Payment.create(
  amount: 5000.00,
  currency: 'NGN',
  reference: "REF_#{Time.now.to_i}",
  customer: {
    email: 'customer@example.com'
  }
)

puts payment.id`}
              language="ruby"
            />
          </TabsContent>
        </Tabs>
      </Card>

      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">Community SDKs</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <p className="font-medium">Go SDK</p>
              <p className="text-sm text-gray-600">Community maintained</p>
            </div>
            <Button variant="ghost" size="sm">
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <p className="font-medium">Java SDK</p>
              <p className="text-sm text-gray-600">Community maintained</p>
            </div>
            <Button variant="ghost" size="sm">
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
