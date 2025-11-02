import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, AlertCircle } from 'lucide-react';
import { initiateTransfer } from '@/services/paystackService';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface Props {
  open: boolean;
  onClose: () => void;
  recipientCode: string;
  maxAmount: number;
}

export default function WithdrawalModal({ open, onClose, recipientCode, maxAmount }: Props) {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleWithdraw = async () => {
    const withdrawAmount = parseFloat(amount);
    if (withdrawAmount <= 0 || withdrawAmount > maxAmount) {
      toast({ title: 'Invalid Amount', variant: 'destructive' });
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const result = await initiateTransfer({
        source: 'balance',
        amount: withdrawAmount,
        recipient: recipientCode,
        reason: 'Wallet withdrawal'
      });

      if (result.status && result.data) {
        // Record transaction
        await supabase.from('transactions').insert({
          user_id: user.id,
          type: 'withdrawal',
          amount: withdrawAmount,
          status: 'pending',
          reference: result.data.transfer_code,
          provider: 'paystack'
        });

        toast({ title: 'Success', description: 'Withdrawal initiated successfully' });
        onClose();
      } else {
        toast({ title: 'Failed', description: result.message, variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to process withdrawal', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Withdraw to Bank</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label>Amount (₦)</Label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              max={maxAmount}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Available: ₦{maxAmount.toLocaleString()}
            </p>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex gap-2">
            <AlertCircle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-800">
              Withdrawals are processed within 24 hours. A small fee may apply.
            </p>
          </div>

          <Button onClick={handleWithdraw} disabled={loading} className="w-full">
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Withdraw ₦{amount || '0'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
