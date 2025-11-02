import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export function CommissionTransactionList() {
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('commission_transactions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50);

    setTransactions(data || []);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Commission History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.map((txn) => (
            <div key={txn.id} className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${txn.transaction_type === 'credit' ? 'bg-green-100' : 'bg-red-100'}`}>
                  {txn.transaction_type === 'credit' ? (
                    <ArrowDownRight className="h-4 w-4 text-green-600" />
                  ) : (
                    <ArrowUpRight className="h-4 w-4 text-red-600" />
                  )}
                </div>
                <div>
                  <p className="font-medium">{txn.description}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(txn.created_at).toLocaleDateString()} • {txn.source_type}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-bold ${txn.transaction_type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                  {txn.transaction_type === 'credit' ? '+' : '-'}₦{parseFloat(txn.amount).toLocaleString()}
                </p>
                <Badge variant={txn.status === 'completed' ? 'default' : 'secondary'}>
                  {txn.status}
                </Badge>
              </div>
            </div>
          ))}
          {transactions.length === 0 && (
            <p className="text-center text-muted-foreground py-8">No transactions yet</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}