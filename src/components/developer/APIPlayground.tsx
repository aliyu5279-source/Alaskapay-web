import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Play, History, Save, Share2, Webhook } from 'lucide-react';
import RequestBuilder from './RequestBuilder';
import ResponseViewer from './ResponseViewer';
import RequestHistory from './RequestHistory';
import SavedRequests from './SavedRequests';
import WebhookTester from './WebhookTester';

export default function APIPlayground() {
  const [activeTab, setActiveTab] = useState('builder');
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [savedRequests, setSavedRequests] = useState<any[]>([]);

  const handleExecuteRequest = async (request: any) => {
    setLoading(true);
    try {
      const startTime = Date.now();
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const mockResponse = {
        status: 200,
        statusText: 'OK',
        data: { success: true, message: 'Request executed successfully', timestamp: new Date().toISOString() },
        headers: { 'content-type': 'application/json', 'x-request-id': Math.random().toString(36) },
        duration: Date.now() - startTime
      };
      
      setResponse(mockResponse);
      setHistory(prev => [{ ...request, response: mockResponse, timestamp: new Date() }, ...prev.slice(0, 49)]);
    } catch (error: any) {
      setResponse({ status: 500, statusText: 'Error', data: { error: error.message } });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveRequest = (request: any) => {
    setSavedRequests(prev => [...prev, { ...request, id: Date.now(), savedAt: new Date() }]);
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="builder"><Play className="h-4 w-4 mr-2" />Request Builder</TabsTrigger>
          <TabsTrigger value="history"><History className="h-4 w-4 mr-2" />History</TabsTrigger>
          <TabsTrigger value="saved"><Save className="h-4 w-4 mr-2" />Saved</TabsTrigger>
          <TabsTrigger value="webhooks"><Webhook className="h-4 w-4 mr-2" />Webhooks</TabsTrigger>
        </TabsList>

        <TabsContent value="builder" className="space-y-4">
          <RequestBuilder onExecute={handleExecuteRequest} onSave={handleSaveRequest} loading={loading} />
          {response && <ResponseViewer response={response} />}
        </TabsContent>

        <TabsContent value="history">
          <RequestHistory history={history} onReplay={handleExecuteRequest} />
        </TabsContent>

        <TabsContent value="saved">
          <SavedRequests requests={savedRequests} onLoad={handleExecuteRequest} onDelete={(id) => setSavedRequests(prev => prev.filter(r => r.id !== id))} />
        </TabsContent>

        <TabsContent value="webhooks">
          <WebhookTester />
        </TabsContent>
      </Tabs>
    </div>
  );
}
