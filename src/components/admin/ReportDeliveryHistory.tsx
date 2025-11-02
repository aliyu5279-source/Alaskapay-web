import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { RefreshCw, Mail, Download, Eye, AlertTriangle, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface Delivery {
  id: string;
  report_id: string;
  sent_at: string;
  recipients: string[];
  delivery_status: string;
  data_types: string[];
  format: string;
  error_message?: string;
  retry_count: number;
  opens?: number;
  downloads?: number;
}

export default function ReportDeliveryHistory() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);
  const [retrying, setRetrying] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchDeliveries = async () => {
    try {
      const { data, error } = await supabase
        .from('analytics_report_deliveries')
        .select(`
          *,
          opens:analytics_report_opens(count),
          downloads:analytics_report_downloads(count)
        `)
        .order('sent_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      const formatted = data.map((d: any) => ({
        ...d,
        opens: d.opens[0]?.count || 0,
        downloads: d.downloads[0]?.count || 0
      }));

      setDeliveries(formatted);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveries();

    const subscription = supabase
      .channel('delivery-updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'analytics_report_deliveries' }, fetchDeliveries)
      .subscribe();

    return () => { subscription.unsubscribe(); };
  }, []);

  const handleRetry = async (deliveryId: string) => {
    setRetrying(deliveryId);
    try {
      const { error } = await supabase.functions.invoke('retry-failed-delivery', {
        body: { deliveryId }
      });

      if (error) throw error;

      toast({ title: 'Success', description: 'Report delivery retry initiated' });
      fetchDeliveries();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setRetrying(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      pending: { icon: Clock, variant: 'secondary', label: 'Pending' },
      sent: { icon: Mail, variant: 'default', label: 'Sent' },
      delivered: { icon: CheckCircle, variant: 'default', label: 'Delivered' },
      failed: { icon: XCircle, variant: 'destructive', label: 'Failed' },
      bounced: { icon: AlertTriangle, variant: 'destructive', label: 'Bounced' }
    };
    const config = variants[status] || variants.pending;
    const Icon = config.icon;
    return <Badge variant={config.variant}><Icon className="w-3 h-3 mr-1" />{config.label}</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Report Delivery History
          <Button size="sm" variant="outline" onClick={fetchDeliveries} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sent At</TableHead>
              <TableHead>Recipients</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Format</TableHead>
              <TableHead>Opens</TableHead>
              <TableHead>Downloads</TableHead>
              <TableHead>Retries</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {deliveries.map((delivery) => (
              <TableRow key={delivery.id}>
                <TableCell>{format(new Date(delivery.sent_at), 'MMM d, yyyy HH:mm')}</TableCell>
                <TableCell>{delivery.recipients.length} recipient(s)</TableCell>
                <TableCell>{getStatusBadge(delivery.delivery_status)}</TableCell>
                <TableCell className="uppercase">{delivery.format}</TableCell>
                <TableCell><Eye className="w-4 h-4 inline mr-1" />{delivery.opens}</TableCell>
                <TableCell><Download className="w-4 h-4 inline mr-1" />{delivery.downloads}</TableCell>
                <TableCell>{delivery.retry_count}/3</TableCell>
                <TableCell>
                  {(delivery.delivery_status === 'failed' || delivery.delivery_status === 'bounced') && delivery.retry_count < 3 && (
                    <Button size="sm" variant="outline" onClick={() => handleRetry(delivery.id)} disabled={retrying === delivery.id}>
                      <RefreshCw className={`w-3 h-3 mr-1 ${retrying === delivery.id ? 'animate-spin' : ''}`} />
                      Retry
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
