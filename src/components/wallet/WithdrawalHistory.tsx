import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/lib/supabase';
import { Loader2, Download, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

export function WithdrawalHistory() {
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadWithdrawals();

    const channel = supabase
      .channel('withdrawal-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'withdrawal_requests'
      }, () => {
        loadWithdrawals();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [statusFilter]);

  const loadWithdrawals = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      let query = supabase
        .from('withdrawal_requests')
        .select(`
          *,
          bank_account:linked_bank_accounts(bank_name, account_number)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      setWithdrawals(data || []);
    } catch (error: any) {
      toast.error('Failed to load withdrawal history');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'processing': return 'bg-blue-500';
      case 'pending': return 'bg-yellow-500';
      case 'failed': return 'bg-red-500';
      case 'cancelled': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const exportToCSV = () => {
    const headers = ['Date', 'Reference', 'Bank', 'Amount', 'Fee', 'Net Amount', 'Status'];
    const rows = withdrawals.map(w => [
      new Date(w.created_at).toLocaleDateString(),
      w.reference,
      w.bank_account?.bank_name || 'N/A',
      w.amount,
      w.fee,
      w.net_amount,
      w.status
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `withdrawals-${Date.now()}.csv`;
    a.click();
    toast.success('Withdrawal history exported');
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Withdrawal History</CardTitle>
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon" onClick={loadWithdrawals}>
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={exportToCSV}>
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {withdrawals.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No withdrawal history found
          </div>
        ) : (
          <div className="space-y-4">
            {withdrawals.map((withdrawal) => (
              <div key={withdrawal.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="space-y-1">
                  <div className="font-medium">{withdrawal.bank_account?.bank_name}</div>
                  <div className="text-sm text-muted-foreground">
                    {withdrawal.bank_account?.account_number}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(withdrawal.created_at).toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Ref: {withdrawal.reference}
                  </div>
                </div>
                <div className="text-right space-y-2">
                  <div className="font-bold text-lg">
                    {withdrawal.currency} {parseFloat(withdrawal.net_amount).toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Fee: {withdrawal.currency} {parseFloat(withdrawal.fee).toLocaleString()}
                  </div>
                  <Badge className={getStatusColor(withdrawal.status)}>
                    {withdrawal.status}
                  </Badge>
                  {withdrawal.failure_reason && (
                    <div className="text-xs text-red-500 mt-1">
                      {withdrawal.failure_reason}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
