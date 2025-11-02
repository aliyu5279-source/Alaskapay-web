import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface ResponseViewerProps {
  response: {
    status: number;
    statusText: string;
    data: any;
    headers?: Record<string, string>;
    duration?: number;
  };
}

export default function ResponseViewer({ response }: ResponseViewerProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return 'bg-green-500';
    if (status >= 300 && status < 400) return 'bg-blue-500';
    if (status >= 400 && status < 500) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            Response
            <Badge className={getStatusColor(response.status)}>
              {response.status} {response.statusText}
            </Badge>
            {response.duration && (
              <span className="text-sm text-muted-foreground font-normal">
                {response.duration}ms
              </span>
            )}
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => copyToClipboard(JSON.stringify(response.data, null, 2))}
          >
            {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
            {copied ? 'Copied!' : 'Copy'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="body">
          <TabsList>
            <TabsTrigger value="body">Response Body</TabsTrigger>
            <TabsTrigger value="headers">Headers</TabsTrigger>
          </TabsList>

          <TabsContent value="body">
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
              <code className="text-sm">
                {JSON.stringify(response.data, null, 2)}
              </code>
            </pre>
          </TabsContent>

          <TabsContent value="headers">
            <div className="bg-muted p-4 rounded-lg space-y-2">
              {response.headers ? (
                Object.entries(response.headers).map(([key, value]) => (
                  <div key={key} className="flex gap-2 text-sm">
                    <span className="font-semibold">{key}:</span>
                    <span className="text-muted-foreground">{value}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No headers available</p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
