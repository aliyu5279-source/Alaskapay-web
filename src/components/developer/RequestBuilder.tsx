import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play, Save, Plus, Trash2 } from 'lucide-react';

interface RequestBuilderProps {
  onExecute: (request: any) => void;
  onSave: (request: any) => void;
  loading: boolean;
}

export default function RequestBuilder({ onExecute, onSave, loading }: RequestBuilderProps) {
  const [method, setMethod] = useState('GET');
  const [url, setUrl] = useState('/api/v1/users');
  const [authType, setAuthType] = useState('bearer');
  const [authValue, setAuthValue] = useState('');
  const [headers, setHeaders] = useState([{ key: 'Content-Type', value: 'application/json' }]);
  const [params, setParams] = useState([{ key: '', value: '' }]);
  const [body, setBody] = useState('{\n  "name": "John Doe",\n  "email": "john@example.com"\n}');

  const addHeader = () => setHeaders([...headers, { key: '', value: '' }]);
  const removeHeader = (index: number) => setHeaders(headers.filter((_, i) => i !== index));
  const updateHeader = (index: number, field: 'key' | 'value', value: string) => {
    const newHeaders = [...headers];
    newHeaders[index][field] = value;
    setHeaders(newHeaders);
  };

  const addParam = () => setParams([...params, { key: '', value: '' }]);
  const removeParam = (index: number) => setParams(params.filter((_, i) => i !== index));
  const updateParam = (index: number, field: 'key' | 'value', value: string) => {
    const newParams = [...params];
    newParams[index][field] = value;
    setParams(newParams);
  };

  const handleExecute = () => {
    onExecute({ method, url, authType, authValue, headers, params, body });
  };

  const handleSave = () => {
    onSave({ method, url, authType, authValue, headers, params, body, name: `${method} ${url}` });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>API Request Builder</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Select value={method} onValueChange={setMethod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="GET">GET</SelectItem>
              <SelectItem value="POST">POST</SelectItem>
              <SelectItem value="PUT">PUT</SelectItem>
              <SelectItem value="PATCH">PATCH</SelectItem>
              <SelectItem value="DELETE">DELETE</SelectItem>
            </SelectContent>
          </Select>
          <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="/api/v1/endpoint" className="flex-1" />
        </div>

        <Tabs defaultValue="auth">
          <TabsList>
            <TabsTrigger value="auth">Authentication</TabsTrigger>
            <TabsTrigger value="headers">Headers</TabsTrigger>
            <TabsTrigger value="params">Query Params</TabsTrigger>
            <TabsTrigger value="body">Body</TabsTrigger>
          </TabsList>

          <TabsContent value="auth" className="space-y-4">
            <div className="space-y-2">
              <Label>Auth Type</Label>
              <Select value={authType} onValueChange={setAuthType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bearer">Bearer Token</SelectItem>
                  <SelectItem value="apikey">API Key</SelectItem>
                  <SelectItem value="basic">Basic Auth</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{authType === 'bearer' ? 'Token' : authType === 'apikey' ? 'API Key' : 'Credentials'}</Label>
              <Input value={authValue} onChange={(e) => setAuthValue(e.target.value)} placeholder="Enter authentication value" />
            </div>
          </TabsContent>

          <TabsContent value="headers" className="space-y-2">
            {headers.map((header, index) => (
              <div key={index} className="flex gap-2">
                <Input value={header.key} onChange={(e) => updateHeader(index, 'key', e.target.value)} placeholder="Header name" />
                <Input value={header.value} onChange={(e) => updateHeader(index, 'value', e.target.value)} placeholder="Header value" />
                <Button variant="ghost" size="icon" onClick={() => removeHeader(index)}><Trash2 className="h-4 w-4" /></Button>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={addHeader}><Plus className="h-4 w-4 mr-2" />Add Header</Button>
          </TabsContent>

          <TabsContent value="params" className="space-y-2">
            {params.map((param, index) => (
              <div key={index} className="flex gap-2">
                <Input value={param.key} onChange={(e) => updateParam(index, 'key', e.target.value)} placeholder="Parameter name" />
                <Input value={param.value} onChange={(e) => updateParam(index, 'value', e.target.value)} placeholder="Parameter value" />
                <Button variant="ghost" size="icon" onClick={() => removeParam(index)}><Trash2 className="h-4 w-4" /></Button>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={addParam}><Plus className="h-4 w-4 mr-2" />Add Parameter</Button>
          </TabsContent>

          <TabsContent value="body">
            <Textarea value={body} onChange={(e) => setBody(e.target.value)} className="font-mono text-sm min-h-[200px]" placeholder="Request body (JSON)" />
          </TabsContent>
        </Tabs>

        <div className="flex gap-2">
          <Button onClick={handleExecute} disabled={loading} className="flex-1">
            <Play className="h-4 w-4 mr-2" />{loading ? 'Executing...' : 'Execute Request'}
          </Button>
          <Button variant="outline" onClick={handleSave}><Save className="h-4 w-4 mr-2" />Save</Button>
        </div>
      </CardContent>
    </Card>
  );
}
