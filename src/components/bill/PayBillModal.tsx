import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { CurrencySelector } from '@/components/CurrencySelector';
import { CurrencyDisplay } from '@/components/CurrencyDisplay';
import { BiometricConfirmation } from './BiometricConfirmation';
import { useAuth } from '@/contexts/AuthContext';
import PINVerificationModal from '@/components/pin/PINVerificationModal';

export function PayBillModal({ open, onClose, biller, onSuccess }) {
  const { user } = useAuth();
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('NGN');
  const [convertedAmount, setConvertedAmount] = useState(0);
  const [exchangeRate, setExchangeRate] = useState(1);
  const [scheduledDate, setScheduledDate] = useState(null);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [showBiometric, setShowBiometric] = useState(false);
  const [showPinVerification, setShowPinVerification] = useState(false);
  const [transactionAuthEnabled, setTransactionAuthEnabled] = useState(false);


  useEffect(() => {
    loadUserSettings();
  }, [user]);

  const loadUserSettings = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('profiles')
      .select('transaction_auth_enabled')
      .eq('id', user.id)
      .single();
    if (data) {
      setTransactionAuthEnabled(data.transaction_auth_enabled || false);
    }
  };


  useEffect(() => {
    // All amounts are in NGN, no conversion needed
    setConvertedAmount(parseFloat(amount) || 0);
    setExchangeRate(1);
  }, [amount, currency]);



  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    // Show PIN verification first
    setShowPinVerification(true);
  };

  const handlePinVerified = async () => {
    // After PIN is verified, check if biometric is needed for high-value
    const totalAmount = parseFloat(amount) + (parseFloat(amount) * 0.01);
    if (transactionAuthEnabled && totalAmount > 500) {
      setShowBiometric(true);
      return;
    }

    await processPayment();
  };


  const processPayment = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('process-bill-payment', {
        body: {
          savedBillerId: biller.id,
          payeeId: biller.payee_id,
          accountNumber: biller.account_number,
          amount: parseFloat(amount),
          currency,
          exchangeRate,
          amountUsd: convertedAmount,
          paymentMethod: 'wallet',
          scheduledDate: scheduledDate ? format(scheduledDate, 'yyyy-MM-dd') : null,
          notes
        }
      });

      if (error) throw error;
      
      // Process commission automatically
      if (data.payment) {
        await supabase.functions.invoke('process-bill-commission', {
          body: {
            billType: biller.category || 'electricity',
            amount: parseFloat(amount),
            userId: user?.id,
            transactionId: data.payment.id
          }
        });
      }
      
      if (data.fraudCheck?.riskLevel === 'high') {
        toast.warning('Payment flagged for review');
      } else {
        toast.success(scheduledDate ? 'Payment scheduled' : 'Payment processing');
      }
      
      onSuccess();
      onClose();
      setAmount('');
      setScheduledDate(null);
      setNotes('');
    } catch (error) {
      toast.error(error.message || 'Failed to process payment');
    } finally {
      setLoading(false);
    }
  };



  if (!biller) return null;

  const fee = parseFloat(amount) * 0.01 || 0;
  const total = parseFloat(amount) + fee || 0;

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Pay {biller.nickname}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Amount (NGN)</Label>
              <Input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                placeholder="0.00"
              />
            </div>

            <div>
              <Label>Schedule Payment (Optional)</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {scheduledDate ? format(scheduledDate, 'PPP') : 'Pay now'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={scheduledDate} onSelect={setScheduledDate} />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label>Notes (Optional)</Label>
              <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
            </div>
            <div className="bg-muted p-3 rounded space-y-1">
              <div className="flex justify-between text-sm">
                <span>Amount</span>
                <span>₦{parseFloat(amount || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Fee (1%)</span>
                <span>₦{fee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>₦{total.toFixed(2)}</span>
              </div>
            </div>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Processing...' : 'Continue to PIN Verification'}
            </Button>

          </form>

        </DialogContent>
      </Dialog>
      <PINVerificationModal
        open={showPinVerification}
        onOpenChange={setShowPinVerification}
        onVerified={handlePinVerified}
        title="Verify Bill Payment"
        description={`Enter your PIN to pay ₦${total.toFixed(2)} to ${biller.nickname}`}
      />

      <BiometricConfirmation
        open={showBiometric}
        onClose={() => setShowBiometric(false)}
        onConfirm={processPayment}
        amount={total}
      />
    </>
  );
}
