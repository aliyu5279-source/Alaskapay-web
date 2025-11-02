import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Clock, Play, Trash2, AlertCircle } from 'lucide-react';

export function SubmissionQueueManager() {
  const [queue, setQueue] = useState<any[]>([]);
  const [stats, setStats] = useState({ queued: 0, processing: 0, failed: 0 });
  const { toast } = useToast();

  useEffect(() => {
    loadQueue();
    const interval = setInterval(loadQueue, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadQueue = async () => {
    const { data } = await supabase
      .from('submission_retry_queue')
      .select('*, regulatory_submissions(*)')
      .order('scheduled_for', { ascending: true });

    if (data) {
      setQueue(data);
      setStats({
        queued: data.filter(q => q.status === 'queued').length,
        processing: data.filter(q => q.status === 'processing').length,
        failed: data.filter(q => q.status === 'failed').length
      });
    }
  };

  const processQueue = async (itemId: string) => {
    await supabase
      .from('submission_retry_queue')
      .update({ status: 'processing', processed_at: new Date().toISOString() })
      .eq('id', itemId);

    toast({ title: 'Processing queue item...' });
    loadQueue();
  };

  const removeFromQueue = async (itemId: string) => {
    await supabase
      .from('submission_retry_queue')
      .delete()
      .eq('id', itemId);

    toast({ title: 'Removed from queue' });
    loadQueue();
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Queued</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.queued}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Processing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.processing}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Failed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Retry Queue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {queue.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No items in queue</p>
            ) : (
              queue.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant={item.status === 'failed' ? 'destructive' : 'secondary'}>
                        {item.status}
                      </Badge>
                      <span className="text-sm font-medium">
                        Priority: {item.priority}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Scheduled for: {new Date(item.scheduled_for).toLocaleString()}
                    </p>
                    {item.regulatory_submissions && (
                      <p className="text-sm">
                        {item.regulatory_submissions.regulatory_body} - {item.regulatory_submissions.submission_type}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {item.status === 'queued' && (
                      <Button size="sm" onClick={() => processQueue(item.id)}>
                        <Play className="h-4 w-4 mr-2" />
                        Process Now
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => removeFromQueue(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}