import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CodeBlock } from './CodeBlock';

const endpoints = [
  {
    method: 'POST',
    path: '/payments/initiate',
    description: 'Initialize a new payment transaction',
    params: ['amount', 'currency', 'reference', 'customer'],
  },
  {
    method: 'GET',
    path: '/payments/:id',
    description: 'Retrieve payment details',
    params: ['id'],
  },
  {
    method: 'GET',
    path: '/payments',
    description: 'List all payments',
    params: ['page', 'limit', 'status'],
  },
  {
    method: 'POST',
    path: '/transfers',
    description: 'Initiate a transfer',
    params: ['amount', 'recipient', 'currency'],
  },
  {
    method: 'GET',
    path: '/wallet/balance',
    description: 'Get wallet balance',
    params: [],
  },
  {
    method: 'POST',
    path: '/wallet/withdraw',
    description: 'Withdraw from wallet',
    params: ['amount', 'bank_account'],
  },
];

export function EndpointReference() {
  return (
    <div className="space-y-4">
      <div className="mb-6">
        <h3 className="text-2xl font-bold mb-2">API Endpoints</h3>
        <p className="text-gray-600">Base URL: <code className="bg-gray-100 px-2 py-1 rounded">https://api.alaskapay.com/v1</code></p>
      </div>

      {endpoints.map((endpoint, idx) => (
        <Card key={idx} className="p-6">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <Badge variant={endpoint.method === 'GET' ? 'outline' : 'default'}>
                {endpoint.method}
              </Badge>
              <code className="text-sm font-mono">{endpoint.path}</code>
            </div>
          </div>
          <p className="text-gray-600 mb-4">{endpoint.description}</p>
          
          {endpoint.params.length > 0 && (
            <div className="mb-4">
              <h4 className="font-medium text-sm mb-2">Parameters:</h4>
              <div className="flex flex-wrap gap-2">
                {endpoint.params.map(param => (
                  <Badge key={param} variant="secondary">{param}</Badge>
                ))}
              </div>
            </div>
          )}

          <CodeBlock 
            code={`curl -X ${endpoint.method} https://api.alaskapay.com/v1${endpoint.path} \\
  -H "Authorization: Bearer ak_test_..." \\
  -H "Content-Type: application/json"`}
          />
        </Card>
      ))}
    </div>
  );
}
