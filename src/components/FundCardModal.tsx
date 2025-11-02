import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Loader2, Wallet, Shield } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { PINVerificationModal } from '@/components/pin/PINVerificationModal';

interface FundCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  card: any;
  onSuccess: () => void;
}

export function FundCardModal({ isOpen, onClose, card, onSuccess }: FundCardModalProps) {
  const [amount, setAmount] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [frequency, setFrequency] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [showPinVerification, setShowPinVerification] = useState(false);
  const [pendingFundData, setPendingFundData] = useState<any>(null);

  const walletBalance = 1000000;
  const minAmount = 100;
  const maxAmount = 500000;

  const handleContinueToPIN = () => {
    const fundAmount = parseFloat(amount);

    if (!fundAmount || fundAmount < minAmount) {
      toast.error(`Minimum funding amount is ₦${minAmount.toLocaleString()}`);
      return;
    }

    if (fundAmount > maxAmount) {
      toast.error(`Maximum funding amount is ₦${maxAmount.toLocaleString()}`);
      return;
    }

    if (fundAmount > walletBalance) {
      toast.error('Insufficient wallet balance');
      return;
    }

    if (isRecurring && !frequency) {
      toast.error('Please select a recurring frequency');
      return;
    }

    setPendingFundData({
      cardId: card.id,
      amount: fundAmount,
      isRecurring,
      recurringFrequency: isRecurring ? frequency : null
    });
    setShowPinVerification(true);
  };

  const handlePINVerified = async () => {
    setShowPinVerification(false);
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('fund-virtual-card', {
        body: pendingFundData
      });

      if (error) throw error;

      toast.success('Card funded successfully!');
      onSuccess();
      onClose();
      setAmount('');
      setIsRecurring(false);
      setFrequency('');
      setPendingFundData(null);
    } catch (error: any) {
      toast.error(error.message || 'Failed to fund card');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Fund Virtual Card</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Alert>
              <Wallet className="h-4 w-4" />
              <AlertDescription>
                Wallet Balance: <strong>₦{walletBalance.toLocaleString()}</strong>
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount (₦)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min={minAmount}
                max={maxAmount}
              />
              <p className="text-xs text-muted-foreground">
                Min: ₦{minAmount.toLocaleString()} | Max: ₦{maxAmount.toLocaleString()}
              </p>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="recurring">Recurring Funding</Label>
              <Switch
                id="recurring"
                checked={isRecurring}
                onCheckedChange={setIsRecurring}
              />
            </div>

            {isRecurring && (
              <div className="space-y-2">
                <Label htmlFor="frequency">Frequency</Label>
                <Select value={frequency} onValueChange={setFrequency}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="flex gap-2">
              <Button onClick={handleContinueToPIN} disabled={loading} className="flex-1">
                <Shield className="mr-2 h-4 w-4" />
                Continue to PIN
              </Button>
              <Button variant="outline" onClick={onClose} disabled={loading}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <PINVerificationModal
        open={showPinVerification}
        onOpenChange={setShowPinVerification}
        onVerified={handlePINVerified}
        description="Enter your 4-digit PIN to confirm card funding"
      />
    </>
  );
}
