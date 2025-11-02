import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Wallet, ArrowDownToLine, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Recipient {
  id: string;
  bank_name: string;
  account_number: string;
  account_name: string;
  recipient_code: string;
  is_primary: boolean;
}

export function CommissionWithdrawal() {
  const [balance, setBalance] = useState(0);
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [amount, setAmount] = useState('');
  const [selectedRecipient, setSelectedRecipient] = useState<Recipient | null>(null);
  const [processing, setProcessing] = useState(false);
  const [withdrawals, setWithdrawals] = useState<any[]>([]);

  useEffect(() => {
    loadBalance();
    loadRecipients();
    loadWithdrawals();
  }, []);

  const loadBalance = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('user_wallets')
      .select('commission_balance')
      .eq('user_id', user.id)
      .single();
    
    setBalance(data?.commission_balance || 0);
  };

  const loadRecipients = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('paystack_recipients')
      .select('*')
      .eq('user_id', user.id);
    
    setRecipients(data || []);
    const primary = data?.find(r => r.is_primary);
    if (primary) setSelectedRecipient(primary);
  };

  const loadWithdrawals = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('commission_withdrawals')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10);
    
    setWithdrawals(data || []);
  };

  const handleWithdraw = async () => {
    const withdrawAmount = parseFloat(amount);
    if (!withdrawAmount || withdrawAmount <= 0) {
      toast.error('Enter valid amount');
      return;
    }

    if (withdrawAmount > balance) {
      toast.error('Insufficient balance');
      return;
    }

    if (!selectedRecipient) {
      toast.error('Select bank account');
      return;
    }

    setProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke('process-commission-withdrawal', {
        body: {
          amount: withdrawAmount,
          recipient_code: selectedRecipient.recipient_code,
          recipient_id: selectedRecipient.id
        }
      });

      if (error) throw error;
      toast.success('Withdrawal initiated! Funds will arrive in 1-2 business days');
      setShowDialog(false);
      setAmount('');
      loadBalance();
      loadWithdrawals();
    } catch (error: any) {
      toast.error(error.message || 'Withdrawal failed');
    } finally {
      setProcessing(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'failed': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-gradient-to-br from-primary to-primary/80 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-90">Commission Balance</p>
            <h2 className="text-4xl font-bold mt-2">₦{balance.toLocaleString()}</h2>
          </div>
          <Wallet className="h-16 w-16 opacity-50" />
        </div>
        <Button 
          onClick={() => setShowDialog(true)} 
          className="mt-4 w-full bg-white text-primary hover:bg-gray-100"
          disabled={balance <= 0 || recipients.length === 0}
        >
          <ArrowDownToLine className="mr-2 h-4 w-4" />
          Withdraw to Bank
        </Button>
      </Card>

      {recipients.length === 0 && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Link a bank account first to withdraw commissions
          </AlertDescription>
        </Alert>
      )}

      <div>
        <h3 className="text-xl font-bold mb-4">Recent Withdrawals</h3>
        <div className="space-y-3">
          {withdrawals.map((w) => (
            <Card key={w.id} className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">₦{w.amount.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(w.created_at).toLocaleDateString()}
                  </p>
                </div>
                <Badge className={getStatusColor(w.status)}>
                  {w.status}
                </Badge>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Withdraw Commission</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Available Balance</Label>
              <p className="text-2xl font-bold text-primary">₦{balance.toLocaleString()}</p>
            </div>

            <div>
              <Label>Withdrawal Amount</Label>
              <Input 
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                max={balance}
              />
            </div>

            <div>
              <Label>Bank Account</Label>
              <Card className="p-3 mt-2">
                {selectedRecipient ? (
                  <div>
                    <p className="font-semibold">{selectedRecipient.bank_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedRecipient.account_number} - {selectedRecipient.account_name}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No account selected</p>
                )}
              </Card>
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Withdrawals are processed via Paystack and typically arrive in 1-2 business days
              </AlertDescription>
            </Alert>

            <Button 
              onClick={handleWithdraw} 
              disabled={processing}
              className="w-full"
            >
              {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Confirm Withdrawal
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
