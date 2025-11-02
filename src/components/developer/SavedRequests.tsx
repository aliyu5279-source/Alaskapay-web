import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Trash2, Share2, Bookmark } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface SavedRequestsProps {
  requests: any[];
  onLoad: (request: any) => void;
  onDelete: (id: number) => void;
}

export default function SavedRequests({ requests, onLoad, onDelete }: SavedRequestsProps) {
  const { toast } = useToast();
  const [shareId, setShareId] = useState<number | null>(null);

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

  const handleShare = (request: any) => {
    const shareUrl = `${window.location.origin}/api-playground?request=${btoa(JSON.stringify(request))}`;
    navigator.clipboard.writeText(shareUrl);
    setShareId(request.id);
    toast({
      title: 'Share link copied!',
      description: 'Anyone with this link can load this API request',
    });
    setTimeout(() => setShareId(null), 2000);
  };

  if (requests.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Bookmark className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No saved requests yet</p>
          <p className="text-sm text-muted-foreground mt-2">
            Save API requests to reuse them later
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Saved Requests ({requests.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {requests.map((request) => (
            <div
              key={request.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <Badge className={getMethodColor(request.method)}>
                    {request.method}
                  </Badge>
                  <code className="text-sm">{request.url}</code>
                </div>
                <p className="text-xs text-muted-foreground">
                  Saved {formatDistanceToNow(new Date(request.savedAt), { addSuffix: true })}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleShare(request)}
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  {shareId === request.id ? 'Copied!' : 'Share'}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onLoad(request)}
                >
                  <Play className="h-4 w-4 mr-2" />
                  Load
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(request.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
