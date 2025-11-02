import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle, XCircle, Clock, RefreshCw } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface DeliveryLog {
  id: string;
  webhook_endpoint_id: string;
  event_type: string;
  delivery_status: string;
  attempt_number: number;
  response_status: number;
  duration_ms: number;
  error_message: string;
  created_at: string;
  webhook_endpoints: { name: string };
}

export function WebhookDeliveryLogs() {
  const [logs, setLogs] = useState<DeliveryLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    loadLogs();
  }, [statusFilter]);

  const loadLogs = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('webhook_delivery_logs')
        .select('*, webhook_endpoints(name)')
        .order('created_at', { ascending: false })
        .limit(100);

      if (statusFilter !== 'all') {
        query = query.eq('delivery_status', statusFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      setLogs(data || []);
    } catch (error) {
      console.error('Error loading logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'retrying':
        return <RefreshCw className="h-4 w-4 text-yellow-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="success">Success</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
            <SelectItem value="retrying">Retrying</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" onClick={loadLogs}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="space-y-2">
        {logs.map(log => (
          <Card key={log.id} className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  {getStatusIcon(log.delivery_status)}
                  <span className="font-medium">{log.webhook_endpoints?.name}</span>
                  <Badge variant="outline">{log.event_type}</Badge>
                  {log.attempt_number > 1 && (
                    <Badge variant="secondary">Attempt {log.attempt_number}</Badge>
                  )}
                </div>
                <div className="text-sm text-muted-foreground">
                  {log.response_status && `HTTP ${log.response_status}`} • {log.duration_ms}ms • {new Date(log.created_at).toLocaleString()}
                </div>
                {log.error_message && (
                  <div className="text-sm text-red-500 mt-1">{log.error_message}</div>
                )}
              </div>
            </div>
          </Card>
        ))}

        {logs.length === 0 && !loading && (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">No delivery logs found</p>
          </Card>
        )}
      </div>
    </div>
  );
}
