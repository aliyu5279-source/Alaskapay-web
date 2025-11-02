import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import PINVerificationModal from '@/components/pin/PINVerificationModal';

interface TransferModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function TransferModal({ open, onClose, onSuccess }: TransferModalProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPinVerification, setShowPinVerification] = useState(false);

  const handleInitiateTransfer = () => {
    // Validate phone number format (Nigerian format)
    const phoneRegex = /^(\+234|0)[789][01]\d{8}$/;
    if (!phoneNumber || !phoneRegex.test(phoneNumber)) {
      toast.error('Please enter a valid Nigerian phone number (e.g., 08012345678 or +2348012345678)');
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    // Show PIN verification modal
    setShowPinVerification(true);
  };

  const handleTransfer = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('wallet-transfer', {
        body: {
          recipient_phone: phoneNumber,
          amount: parseFloat(amount),
          currency: 'NGN',
          description
        }
      });

      if (error) throw error;

      toast.success('Transfer completed successfully!');
      onSuccess();
      onClose();
      setPhoneNumber('');
      setAmount('');
      setDescription('');
    } catch (error: any) {
      toast.error(error.message || 'Transfer failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Transfer to AlaskaPay User</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Recipient Phone Number</Label>
              <Input
                type="tel"
                placeholder="08012345678 or +2348012345678"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Enter the recipient's registered phone number
              </p>
            </div>

            <div>
              <Label>Amount (NGN)</Label>
              <Input
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="text-lg"
              />
            </div>

            <div>
              <Label>Description (Optional)</Label>
              <Textarea
                placeholder="What's this for?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            <Button onClick={handleInitiateTransfer} disabled={loading} className="w-full">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Continue to PIN Verification
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <PINVerificationModal
        open={showPinVerification}
        onOpenChange={setShowPinVerification}
        onVerified={handleTransfer}
        title="Verify Transfer"
        description={`Enter your PIN to transfer ₦${parseFloat(amount || '0').toLocaleString()} to ${phoneNumber}`}
      />
    </>
  );
}

