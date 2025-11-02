import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Tag } from 'lucide-react';
import { aiService } from '@/services/aiService';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface Transaction {
  id: string;
  description: string;
  amount: number;
  category?: string;
}

export function AITransactionCategorizer() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [categorizing, setCategorizing] = useState<string | null>(null);
  const { toast } = useToast();

  const loadUncategorized = async () => {
    setLoading(true);
    try {
      const { data } = await supabase
        .from('transactions')
        .select('id, description, amount, metadata')
        .is('metadata->category', null)
        .limit(10);

      if (data) {
        setTransactions(data);
      }
    } catch (error) {
      console.error('Failed to load transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const categorizeTransaction = async (transaction: Transaction) => {
    setCategorizing(transaction.id);
    try {
      const category = await aiService.categorizeTransaction(
        transaction.description,
        transaction.amount
      );

      await supabase
        .from('transactions')
        .update({ 
          metadata: { category } 
        })
        .eq('id', transaction.id);

      setTransactions(prev => prev.filter(t => t.id !== transaction.id));
      
      toast({
        title: 'Categorized',
        description: `Transaction categorized as ${category}`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to categorize transaction',
        variant: 'destructive'
      });
    } finally {
      setCategorizing(null);
    }
  };

  const categorizeAll = async () => {
    for (const transaction of transactions) {
      await categorizeTransaction(transaction);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5 text-primary" />
            AI Transaction Categorizer
          </CardTitle>
          <div className="flex gap-2">
            <Button onClick={loadUncategorized} disabled={loading} size="sm" variant="outline">
              Load Uncategorized
            </Button>
            <Button onClick={categorizeAll} disabled={transactions.length === 0} size="sm">
              <Sparkles className="h-4 w-4 mr-2" />
              Categorize All
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {transactions.length === 0 && (
          <p className="text-muted-foreground text-center py-8">
            No uncategorized transactions found.
          </p>
        )}
        
        {transactions.map((transaction) => (
          <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <p className="font-medium">{transaction.description}</p>
              <p className="text-sm text-muted-foreground">${transaction.amount}</p>
            </div>
            <Button
              onClick={() => categorizeTransaction(transaction)}
              disabled={categorizing === transaction.id}
              size="sm"
            >
              {categorizing === transaction.id ? 'Categorizing...' : 'Categorize'}
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}