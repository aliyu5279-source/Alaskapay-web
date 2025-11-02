import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { PaymentGatewaySelector } from './PaymentGatewaySelector';

interface TopUpModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function TopUpModal({ open, onClose, onSuccess }: TopUpModalProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [amount, setAmount] = useState('');
  const [step, setStep] = useState<'amount' | 'gateway'>('amount');

  const isVerified = user?.email_confirmed_at;
  const quickAmounts = [1000, 5000, 10000, 20000, 50000];

  const handleContinue = () => {
    if (!isVerified) {
      toast({ title: 'Email Verification Required', description: 'Please verify your email to top up wallet.', variant: 'destructive' });
      return;
    }
    if (!amount || parseFloat(amount) <= 0) {
      toast({ title: 'Error', description: 'Please enter a valid amount', variant: 'destructive' });
      return;
    }
    setStep('gateway');
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle>Top Up Wallet</DialogTitle></DialogHeader>
        {step === 'amount' ? (
          <div className="space-y-4">
            <div><Label>Amount (NGN)</Label><Input type="number" placeholder="Enter amount" value={amount} onChange={(e) => setAmount(e.target.value)} className="text-lg" />
              <div className="flex gap-2 mt-2 flex-wrap">{quickAmounts.map((amt) => (<Button key={amt} variant="outline" size="sm" onClick={() => setAmount(amt.toString())}>₦{amt.toLocaleString()}</Button>))}</div>
            </div>
            <Button onClick={handleContinue} className="w-full">Continue</Button>
          </div>
        ) : (
          <div className="space-y-4">
            <PaymentGatewaySelector onSelect={(gateway) => { onSuccess(); onClose(); }} isLoading={false} />
            <Button variant="outline" onClick={() => setStep('amount')} className="w-full">Back</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
