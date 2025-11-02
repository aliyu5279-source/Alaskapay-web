import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, CreditCard, Building2 } from 'lucide-react';
import { initializePayment } from '@/services/paystackService';
import { useToast } from '@/hooks/use-toast';

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: (reference: string) => void;
  amount: number;
  email: string;
  userId: string;
}

export default function PaystackPaymentModal({ open, onClose, onSuccess, amount, email, userId }: Props) {
  const [loading, setLoading] = useState(false);
  const [method, setMethod] = useState<'card' | 'bank'>('card');
  const { toast } = useToast();

  const handlePayment = async () => {
    setLoading(true);
    try {
      const channels = method === 'card' ? ['card'] : ['bank', 'bank_transfer'];
      const result = await initializePayment({
        email,
        amount,
        currency: 'NGN',
        channels,
        metadata: { userId, type: 'wallet_funding' }
      });

      if (result.status && result.data) {
        window.location.href = result.data.authorization_url;
      } else {
        toast({
          title: 'Payment Failed',
          description: result.message,
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to initialize payment',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Fund Wallet - ₦{amount.toLocaleString()}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant={method === 'card' ? 'default' : 'outline'}
              onClick={() => setMethod('card')}
              className="h-20"
            >
              <CreditCard className="mr-2 h-5 w-5" />
              Card Payment
            </Button>
            <Button
              variant={method === 'bank' ? 'default' : 'outline'}
              onClick={() => setMethod('bank')}
              className="h-20"
            >
              <Building2 className="mr-2 h-5 w-5" />
              Bank Transfer
            </Button>
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">
              {method === 'card' 
                ? 'Pay securely with your debit/credit card'
                : 'Transfer directly from your bank account'}
            </p>
          </div>

          <Button onClick={handlePayment} disabled={loading} className="w-full">
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Continue to Payment
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
