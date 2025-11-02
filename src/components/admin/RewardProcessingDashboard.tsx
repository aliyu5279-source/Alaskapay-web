import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import { PlayCircle, Clock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

export function RewardProcessingDashboard() {
  const [stats, setStats] = useState({ pending: 0, approved: 0, expired: 0, flagged: 0 });
  const [batchLogs, setBatchLogs] = useState([]);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    loadStats();
    loadBatchLogs();
    const interval = setInterval(loadStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadStats = async () => {
    try {
      const { data: pending } = await supabase
        .from('referral_rewards_pending')
        .select('status', { count: 'exact', head: true })
        .eq('status', 'pending');
      
      const { data: approved } = await supabase
        .from('referral_rewards_pending')
        .select('status', { count: 'exact', head: true })
        .eq('status', 'approved');

      const { data: expired } = await supabase
        .from('referral_rewards_pending')
        .select('status', { count: 'exact', head: true })
        .eq('status', 'expired');

      const { data: flagged } = await supabase
        .from('referral_rewards_pending')
        .select('status', { count: 'exact', head: true })
        .eq('status', 'fraud_flagged');

      setStats({
        pending: pending?.length || 0,
        approved: approved?.length || 0,
        expired: expired?.length || 0,
        flagged: flagged?.length || 0
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const loadBatchLogs = async () => {
    try {
      const { data } = await supabase
        .from('referral_batch_processing_logs')
        .select('*')
        .order('started_at', { ascending: false })
        .limit(10);
      
      setBatchLogs(data || []);
    } catch (error) {
      console.error('Failed to load batch logs:', error);
    }
  };

  const runBatchProcess = async (type) => {
    setProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke('batch-process-rewards', {
        body: { processing_type: type }
      });
      
      if (error) throw error;
      
      toast.success(`Processed ${data.successful} rewards successfully`);
      loadStats();
      loadBatchLogs();
    } catch (error) {
      toast.error('Batch processing failed');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.approved}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Expired</CardTitle>
            <XCircle className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.expired}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Fraud Flagged</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.flagged}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Batch Processing</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button onClick={() => runBatchProcess('approval')} disabled={processing}>
              <PlayCircle className="w-4 h-4 mr-2" />Auto-Approve Rewards
            </Button>
            <Button onClick={() => runBatchProcess('expiration')} disabled={processing} variant="outline">
              Process Expirations
            </Button>
            <Button onClick={() => runBatchProcess('notification')} disabled={processing} variant="outline">
              Send Notifications
            </Button>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">Recent Batch Logs</h3>
            {batchLogs.map((log) => (
              <div key={log.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <Badge>{log.processing_type}</Badge>
                  <p className="text-sm text-muted-foreground mt-1">
                    {log.successful}/{log.total_processed} successful • {log.duration_ms}ms
                  </p>
                </div>
                <span className="text-xs text-muted-foreground">
                  {new Date(log.started_at).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}