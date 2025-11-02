import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Trash2, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface RequestHistoryProps {
  history: any[];
  onReplay: (request: any) => void;
}

export default function RequestHistory({ history, onReplay }: RequestHistoryProps) {
  const getMethodColor = (method: string) => {
    const colors: Record<string, string> = {
      GET: 'bg-blue-500',
      POST: 'bg-green-500',
      PUT: 'bg-yellow-500',
      PATCH: 'bg-orange-500',
      DELETE: 'bg-red-500'
    };
    return colors[method] || 'bg-gray-500';
  };

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return 'text-green-600';
    if (status >= 400 && status < 500) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (history.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No request history yet</p>
          <p className="text-sm text-muted-foreground mt-2">
            Execute API requests to see them here
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Request History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {history.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <Badge className={getMethodColor(item.method)}>
                    {item.method}
                  </Badge>
                  <code className="text-sm">{item.url}</code>
                  {item.response && (
                    <span className={`text-sm font-semibold ${getStatusColor(item.response.status)}`}>
                      {item.response.status}
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}
                  {item.response?.duration && ` • ${item.response.duration}ms`}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onReplay(item)}
              >
                <Play className="h-4 w-4 mr-2" />
                Replay
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
