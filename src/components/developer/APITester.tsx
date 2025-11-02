import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Play, Copy } from 'lucide-react';

export function APITester() {
  const [method, setMethod] = useState('POST');
  const [endpoint, setEndpoint] = useState('/payments/initiate');
  const [apiKey, setApiKey] = useState('');
  const [body, setBody] = useState('{\n  "amount": 5000.00,\n  "currency": "NGN"\n}');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const testAPI = async () => {
    setLoading(true);
    setResponse('');
    
    setTimeout(() => {
      const mockResponse = {
        status: 'success',
        data: {
          id: 'txn_' + Math.random().toString(36).substr(2, 9),
          amount: 5000.00,
          currency: 'NGN',
          status: 'pending',
          reference: 'REF_' + Date.now(),
          created_at: new Date().toISOString()
        }
      };
      setResponse(JSON.stringify(mockResponse, null, 2));
      setLoading(false);
    }, 1500);
  };

  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-4">Interactive API Tester</h3>
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label>Method</Label>
            <Select value={method} onValueChange={setMethod}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="GET">GET</SelectItem>
                <SelectItem value="POST">POST</SelectItem>
                <SelectItem value="PUT">PUT</SelectItem>
                <SelectItem value="DELETE">DELETE</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="col-span-2">
            <Label>Endpoint</Label>
            <Input value={endpoint} onChange={(e) => setEndpoint(e.target.value)} />
          </div>
        </div>

        <div>
          <Label>API Key</Label>
          <Input type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="ak_test_..." />
        </div>

        <div>
          <Label>Request Body</Label>
          <Textarea value={body} onChange={(e) => setBody(e.target.value)} rows={6} className="font-mono text-sm" />
        </div>

        <Button onClick={testAPI} disabled={loading} className="w-full">
          <Play className="h-4 w-4 mr-2" />
          {loading ? 'Testing...' : 'Send Request'}
        </Button>

        {response && (
          <div>
            <div className="flex justify-between items-center mb-2">
              <Label>Response</Label>
              <Button size="sm" variant="ghost" onClick={() => navigator.clipboard.writeText(response)}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <pre className="bg-gray-900 text-green-400 p-4 rounded text-sm overflow-x-auto">{response}</pre>
          </div>
        )}
      </div>
    </Card>
  );
}
