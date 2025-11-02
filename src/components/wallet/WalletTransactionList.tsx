import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowUpRight, ArrowDownLeft, Download } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';

export function WalletTransactionList() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, [user, filter]);

  const fetchTransactions = async () => {
    if (!user) return;
    setLoading(true);

    try {
      let query = supabase
        .from('wallet_transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (filter !== 'all') {
        query = query.eq('transaction_type', filter);
      }

      const { data, error } = await query;
      if (error) throw error;
      setTransactions(data || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportTransactions = () => {
    const csv = [
      ['Date', 'Type', 'Amount', 'Balance', 'Status', 'Reference', 'Description'],
      ...transactions.map(t => [
        format(new Date(t.created_at), 'yyyy-MM-dd HH:mm'),
        t.transaction_type,
        t.amount,
        t.balance_after,
        t.status,
        t.reference,
        t.description || ''
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wallet-transactions-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
  };

  const getIcon = (type: string) => {
    return ['topup', 'transfer_in', 'refund'].includes(type) ? 
      <ArrowDownLeft className="text-green-600" size={20} /> : 
      <ArrowUpRight className="text-red-600" size={20} />;
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Transaction History</h3>
        <div className="flex gap-2">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="topup">Top Up</SelectItem>
              <SelectItem value="transfer_in">Transfer In</SelectItem>
              <SelectItem value="transfer_out">Transfer Out</SelectItem>
              <SelectItem value="bill_payment">Bill Payment</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={exportTransactions}>
            <Download size={16} className="mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {loading ? (
          <p className="text-center text-gray-500 py-8">Loading...</p>
        ) : transactions.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No transactions yet</p>
        ) : (
          transactions.map((txn) => (
            <div key={txn.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
              <div className="flex items-center gap-3">
                {getIcon(txn.transaction_type)}
                <div>
                  <p className="font-medium">{txn.description}</p>
                  <p className="text-sm text-gray-500">
                    {format(new Date(txn.created_at), 'MMM dd, yyyy HH:mm')}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-semibold ${txn.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {txn.amount >= 0 ? '+' : ''}{txn.currency_code} {Math.abs(txn.amount).toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                </p>
                <Badge variant={txn.status === 'completed' ? 'default' : 'secondary'}>
                  {txn.status}
                </Badge>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
