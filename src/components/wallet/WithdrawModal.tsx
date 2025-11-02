import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Loader2, AlertCircle, Info } from 'lucide-react';
import PINVerificationModal from '@/components/pin/PINVerificationModal';

interface WithdrawModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  walletId: string;
  currentBalance: number;
  currency: string;
  onSuccess?: () => void;
}

export function WithdrawModal({ open, onOpenChange, walletId, currentBalance, currency, onSuccess }: WithdrawModalProps) {
  const [amount, setAmount] = useState('');
  const [selectedBank, setSelectedBank] = useState('');
  const [banks, setBanks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingBanks, setLoadingBanks] = useState(true);
  const [fee, setFee] = useState(0);
  const [netAmount, setNetAmount] = useState(0);
  const [kycTier, setKycTier] = useState(1);
  const [dailyLimit, setDailyLimit] = useState(0);
  const [withdrawnToday, setWithdrawnToday] = useState(0);
  const [showPinVerification, setShowPinVerification] = useState(false);


  useEffect(() => {
    if (open) {
      loadBankAccounts();
      loadKycInfo();
    }
  }, [open]);

  useEffect(() => {
    if (amount) {
      calculateFee();
    }
  }, [amount, kycTier]);

  const loadBankAccounts = async () => {
    try {
      const { data, error } = await supabase
        .from('linked_bank_accounts')
        .select('*')
        .eq('status', 'verified')
        .order('is_primary', { ascending: false });

      if (error) throw error;
      setBanks(data || []);
      if (data && data.length > 0) {
        setSelectedBank(data[0].id);
      }
    } catch (error: any) {
      toast.error('Failed to load bank accounts');
    } finally {
      setLoadingBanks(false);
    }
  };

  const loadKycInfo = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: limits } = await supabase
        .from('kyc_tier_limits')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (limits) {
        setKycTier(limits.tier);
        setDailyLimit(limits.daily_withdrawal_limit);
      }

      const { data: todayWithdrawals } = await supabase
        .from('withdrawal_requests')
        .select('amount')
        .eq('user_id', user.id)
        .eq('status', 'completed')
        .gte('created_at', new Date().toISOString().split('T')[0]);

      const total = todayWithdrawals?.reduce((sum, w) => sum + parseFloat(w.amount), 0) || 0;
      setWithdrawnToday(total);
    } catch (error) {
      console.error('Error loading KYC info:', error);
    }
  };

  const calculateFee = async () => {
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) {
      setFee(0);
      setNetAmount(0);
      return;
    }

    try {
      const { data } = await supabase
        .from('withdrawal_fees')
        .select('*')
        .eq('tier', kycTier)
        .eq('is_active', true)
        .single();

      if (data) {
        let calculatedFee = 0;
        if (data.fee_type === 'fixed') {
          calculatedFee = data.fee_value;
        } else if (data.fee_type === 'percentage') {
          calculatedFee = (amt * data.fee_value) / 100;
        }
        setFee(calculatedFee);
        setNetAmount(amt - calculatedFee);
      }
    } catch (error) {
      console.error('Error calculating fee:', error);
    }
  };

  const handleInitiateWithdrawal = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(amount);

    if (isNaN(amt) || amt <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (amt > currentBalance) {
      toast.error('Insufficient wallet balance');
      return;
    }

    if (withdrawnToday + amt > dailyLimit) {
      toast.error(`Daily withdrawal limit exceeded. Remaining: ${currency} ${(dailyLimit - withdrawnToday).toLocaleString()}`);
      return;
    }

    if (!selectedBank) {
      toast.error('Please select a bank account');
      return;
    }

    // Show PIN verification modal
    setShowPinVerification(true);
  };

  const handleWithdrawal = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const reference = `WD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      const { error } = await supabase.from('withdrawal_requests').insert({
        user_id: user.id,
        wallet_account_id: walletId,
        bank_account_id: selectedBank,
        amount: parseFloat(amount),
        fee: fee,
        net_amount: netAmount,
        currency: currency,
        kyc_tier: kycTier,
        reference: reference,
        processing_time_estimate: '1-2 business days',
        status: 'pending'
      });

      if (error) throw error;

      toast.success('Withdrawal request submitted successfully');
      onOpenChange(false);
      onSuccess?.();
      setAmount('');
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit withdrawal request');
    } finally {
      setLoading(false);
    }
  };



  const remainingLimit = dailyLimit - withdrawnToday;


  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Withdraw Funds</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleInitiateWithdrawal} className="space-y-4">
            <div>
              <Label>Available Balance</Label>
              <div className="text-2xl font-bold text-green-600">
                {currency} {currentBalance.toLocaleString()}
              </div>
            </div>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Daily limit: {currency} {remainingLimit.toLocaleString()} remaining
              </AlertDescription>
            </Alert>

            <div>
              <Label htmlFor="amount">Withdrawal Amount</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>

            {amount && parseFloat(amount) > 0 && (
              <div className="bg-muted p-3 rounded-lg space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Amount:</span>
                  <span className="font-medium">{currency} {parseFloat(amount).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Fee:</span>
                  <span>- {currency} {fee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold text-base pt-1 border-t">
                  <span>You'll receive:</span>
                  <span className="text-green-600">{currency} {netAmount.toLocaleString()}</span>
                </div>
              </div>
            )}

            <div>
              <Label htmlFor="bank">Bank Account</Label>
              {loadingBanks ? (
                <div className="flex items-center justify-center p-4">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              ) : banks.length === 0 ? (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    No verified bank accounts found. Please link a bank account first.
                  </AlertDescription>
                </Alert>
              ) : (
                <Select value={selectedBank} onValueChange={setSelectedBank}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {banks.map((bank) => (
                      <SelectItem key={bank.id} value={bank.id}>
                        {bank.bank_name} - {bank.account_number}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Processing time: 1-2 business days. You'll receive an email when your withdrawal is processed.
              </AlertDescription>
            </Alert>

            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" disabled={loading || banks.length === 0} className="flex-1">
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Continue to PIN Verification
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <PINVerificationModal
        open={showPinVerification}
        onOpenChange={setShowPinVerification}
        onVerified={handleWithdrawal}
        title="Verify Withdrawal"
        description={`Enter your PIN to withdraw ${currency} ${parseFloat(amount || '0').toLocaleString()}`}
      />
    </>
  );
}

