import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, XCircle, Info } from 'lucide-react';
import { CodeBlock } from './CodeBlock';

const errorCodes = [
  { code: 400, name: 'Bad Request', description: 'Invalid request parameters' },
  { code: 401, name: 'Unauthorized', description: 'Invalid or missing API key' },
  { code: 403, name: 'Forbidden', description: 'Insufficient permissions' },
  { code: 404, name: 'Not Found', description: 'Resource not found' },
  { code: 429, name: 'Too Many Requests', description: 'Rate limit exceeded' },
  { code: 500, name: 'Internal Server Error', description: 'Server error occurred' },
];

export function ErrorHandlingGuide() {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <XCircle className="h-5 w-5 text-red-600" />
          <h3 className="text-xl font-semibold">Error Response Format</h3>
        </div>
        <p className="text-gray-600 mb-4">All errors follow a consistent JSON format:</p>
        <CodeBlock 
          code={`{
  "error": {
    "code": "invalid_request",
    "message": "Amount must be greater than 0",
    "type": "validation_error",
    "param": "amount"
  }
}`}
          language="json"
        />
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="h-5 w-5 text-orange-600" />
          <h3 className="text-xl font-semibold">HTTP Status Codes</h3>
        </div>
        <div className="space-y-3">
          {errorCodes.map((error) => (
            <div key={error.code} className="flex items-start gap-3 p-3 border rounded-lg">
              <Badge variant={error.code >= 500 ? 'destructive' : 'outline'}>
                {error.code}
              </Badge>
              <div>
                <p className="font-medium">{error.name}</p>
                <p className="text-sm text-gray-600">{error.description}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Info className="h-5 w-5 text-blue-600" />
          <h3 className="text-xl font-semibold">Error Handling Example</h3>
        </div>
        <CodeBlock 
          code={`try {
  const response = await fetch('https://api.alaskapay.com/v1/payments', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ak_test_...',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(paymentData)
  });

  if (!response.ok) {
    const error = await response.json();
    console.error('Payment failed:', error.error.message);
    // Handle specific error types
    if (error.error.code === 'insufficient_funds') {
      // Show insufficient funds message
    }
  }

  const data = await response.json();
  console.log('Payment successful:', data);
} catch (err) {
  console.error('Network error:', err);
}`}
          language="javascript"
        />
      </Card>
    </div>
  );
}
