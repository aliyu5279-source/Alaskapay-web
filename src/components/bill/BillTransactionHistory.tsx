import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { FileText, Zap, Tv, Wifi } from 'lucide-react';
import { format } from 'date-fns';
import { BillReceiptModal } from './BillReceiptModal';

interface BillTransaction {
  id: string;
  transaction_id: string;
  category: string;
  provider: string;
  customer_number: string;
  customer_name?: string;
  amount: number;
  status: string;
  created_at: string;
}

export function BillTransactionHistory() {
  const [transactions, setTransactions] = useState<BillTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTx, setSelectedTx] = useState<BillTransaction | null>(null);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      const { data, error } = await supabase
        .from('bills_transactions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setTransactions(data || []);
    } catch (error) {
      console.error('Error loading transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'electricity': return <Zap className="h-4 w-4" />;
      case 'cable_tv': return <Tv className="h-4 w-4" />;
      case 'internet': return <Wifi className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading transactions...</div>;
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Bill Payment History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {transactions.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No bill payments yet</p>
            ) : (
              transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent cursor-pointer"
                  onClick={() => setSelectedTx(tx)}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-full">
                      {getCategoryIcon(tx.category)}
                    </div>
                    <div>
                      <p className="font-medium">{tx.provider}</p>
                      <p className="text-sm text-muted-foreground">
                        {tx.customer_name || tx.customer_number}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(tx.created_at), 'MMM dd, yyyy HH:mm')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">₦{tx.amount.toLocaleString()}</p>
                    <Badge variant={tx.status === 'successful' ? 'default' : 'destructive'}>
                      {tx.status}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {selectedTx && (
        <BillReceiptModal
          open={!!selectedTx}
          onClose={() => setSelectedTx(null)}
          transaction={selectedTx}
        />
      )}
    </>
  );
}
