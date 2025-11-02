import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, AlertTriangle, CheckCircle, Sparkles } from 'lucide-react';
import { aiService } from '@/services/aiService';
import { supabase } from '@/lib/supabase';

interface RiskTransaction {
  id: string;
  description: string;
  amount: number;
  recipient: string;
  riskScore: number;
  status: 'pending' | 'approved' | 'blocked';
}

export function AIFraudDetector() {
  const [transactions, setTransactions] = useState<RiskTransaction[]>([]);
  const [scanning, setScanning] = useState(false);

  const scanTransactions = async () => {
    setScanning(true);
    try {
      const { data } = await supabase
        .from('transactions')
        .select('*')
        .eq('status', 'pending')
        .gte('amount', 100)
        .limit(10);

      if (data) {
        const analyzed = await Promise.all(
          data.map(async (t) => {
            const riskScore = await aiService.detectFraudRisk(t);
            return {
              id: t.id,
              description: t.description,
              amount: t.amount,
              recipient: t.recipient_id || 'Unknown',
              riskScore,
              status: t.status
            };
          })
        );
        setTransactions(analyzed);
      }
    } catch (error) {
      console.error('Scan failed:', error);
    } finally {
      setScanning(false);
    }
  };

  const handleAction = async (id: string, action: 'approve' | 'block') => {
    await supabase
      .from('transactions')
      .update({ status: action === 'approve' ? 'completed' : 'failed' })
      .eq('id', id);
    
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const getRiskColor = (score: number) => {
    if (score >= 70) return 'text-red-500';
    if (score >= 40) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getRiskLabel = (score: number) => {
    if (score >= 70) return 'High Risk';
    if (score >= 40) return 'Medium Risk';
    return 'Low Risk';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            AI Fraud Detection
          </CardTitle>
          <Button onClick={scanTransactions} disabled={scanning} size="sm">
            <Sparkles className="h-4 w-4 mr-2" />
            {scanning ? 'Scanning...' : 'Scan Transactions'}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {transactions.length === 0 && (
          <p className="text-muted-foreground text-center py-8">
            No suspicious transactions detected.
          </p>
        )}
        
        {transactions.map((transaction) => (
          <div key={transaction.id} className="p-4 border rounded-lg space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-medium">{transaction.description}</p>
                <p className="text-sm text-muted-foreground">
                  ${transaction.amount} to {transaction.recipient}
                </p>
              </div>
              <Badge className={getRiskColor(transaction.riskScore)}>
                {getRiskLabel(transaction.riskScore)} ({transaction.riskScore}%)
              </Badge>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={() => handleAction(transaction.id, 'approve')}
                size="sm" 
                variant="outline"
                className="flex-1"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve
              </Button>
              <Button 
                onClick={() => handleAction(transaction.id, 'block')}
                size="sm" 
                variant="destructive"
                className="flex-1"
              >
                <AlertTriangle className="h-4 w-4 mr-2" />
                Block
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}