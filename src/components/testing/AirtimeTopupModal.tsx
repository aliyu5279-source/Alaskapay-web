import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle2, History } from 'lucide-react';
import { toast } from 'sonner';
import PINVerificationModal from '@/components/pin/PINVerificationModal';
import { reloadlyService, ReloadlyOperator } from '@/services/reloadlyService';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

interface AirtimeTopupModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const QUICK_AMOUNTS = [100, 200, 500, 1000, 2000, 5000];

export function AirtimeTopupModal({ open, onClose, onSuccess }: AirtimeTopupModalProps) {
  const { user } = useAuth();
  const [operators, setOperators] = useState<ReloadlyOperator[]>([]);
  const [selectedOperator, setSelectedOperator] = useState<ReloadlyOperator | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingOperators, setLoadingOperators] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const [receipt, setReceipt] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    if (open) {
      loadOperators();
      loadTransactions();
    }
  }, [open]);

  const loadOperators = async () => {
    setLoadingOperators(true);
    try {
      const ops = await reloadlyService.getOperators();
      setOperators(ops);
    } catch (error: any) {
      toast.error('Failed to load networks');
    } finally {
      setLoadingOperators(false);
    }
  };

  const loadTransactions = async () => {
    if (!user) return;
    setLoadingHistory(true);
    try {
      const { data, error } = await supabase
        .from('airtime_transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);
      if (error) throw error;
      setTransactions(data || []);
    } catch (error) {
      console.error('Failed to load history');
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleSubmit = () => {
    if (!selectedOperator) {
      toast.error('Please select a network');
      return;
    }
    if (!phoneNumber || phoneNumber.length < 11) {
      toast.error('Enter valid phone number');
      return;
    }
    const amt = parseFloat(amount);
    if (!amount || amt < (selectedOperator.localMinAmount || 50)) {
      toast.error(`Minimum amount is ₦${selectedOperator.localMinAmount || 50}`);
      return;
    }
    if (amt > (selectedOperator.localMaxAmount || 50000)) {
      toast.error(`Maximum amount is ₦${selectedOperator.localMaxAmount || 50000}`);
      return;
    }
    setShowPin(true);
  };

  const handleTopup = async () => {
    if (!selectedOperator || !user) return;
    setLoading(true);
    try {
      const result = await reloadlyService.topupAirtime(
        selectedOperator.operatorId,
        phoneNumber,
        parseFloat(amount),
        user.id
      );
      await supabase.from('airtime_transactions').insert({
        user_id: user.id,
        operator_id: selectedOperator.operatorId,
        operator_name: result.operatorName,
        phone_number: result.recipientPhone,
        amount: result.requestedAmount,
        currency: result.requestedAmountCurrencyCode,
        reloadly_transaction_id: result.transactionId,
        operator_transaction_id: result.operatorTransactionId,
        status: 'completed',
        discount: result.discount,
        delivered_amount: result.deliveredAmount,
        balance_before: result.balanceInfo.oldBalance,
        balance_after: result.balanceInfo.newBalance,
        metadata: {
          customIdentifier: result.customIdentifier,
          countryCode: result.countryCode,
          transactionDate: result.transactionDate
        }
      });
      setReceipt(result);
      toast.success(`₦${amount} airtime sent!`);
      loadTransactions();
      onSuccess();
    } catch (error: any) {
      await supabase.from('airtime_transactions').insert({
        user_id: user.id,
        operator_id: selectedOperator.operatorId,
        operator_name: selectedOperator.name,
        phone_number: phoneNumber,
        amount: parseFloat(amount),
        status: 'failed',
        error_message: error.message
      });
      toast.error(error.message || 'Topup failed');
    } finally {
      setLoading(false);
      setShowPin(false);
    }
  };

  const resetForm = () => {
    setSelectedOperator(null);
    setPhoneNumber('');
    setAmount('');
    setReceipt(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'failed': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  if (receipt) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              Purchase Successful
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Network:</span>
              <span className="font-medium">{receipt.operatorName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Phone:</span>
              <span className="font-medium">{receipt.recipientPhone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Amount:</span>
              <span className="font-medium">₦{receipt.deliveredAmount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Transaction ID:</span>
              <span className="font-mono text-xs">{receipt.transactionId}</span>
            </div>
          </div>
          <Button onClick={handleClose} className="w-full">Done</Button>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Airtime Top-up</DialogTitle>
          </DialogHeader>
          <Tabs defaultValue="buy" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="buy">Buy Airtime</TabsTrigger>
              <TabsTrigger value="history">
                <History className="h-4 w-4 mr-2" />
                History
              </TabsTrigger>
            </TabsList>
            <TabsContent value="buy" className="space-y-4">
              <div>
                <Label>Network Provider</Label>
                <Select 
                  value={selectedOperator?.operatorId.toString() || ''} 
                  onValueChange={(val) => {
                    const op = operators.find(o => o.operatorId.toString() === val);
                    setSelectedOperator(op || null);
                  }}
                  disabled={loadingOperators}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={loadingOperators ? "Loading..." : "Select network"} />
                  </SelectTrigger>
                  <SelectContent>
                    {operators.map(op => (
                      <SelectItem key={op.operatorId} value={op.operatorId.toString()}>
                        {op.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Phone Number</Label>
                <Input
                  type="tel"
                  placeholder="080XXXXXXXX"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 11))}
                  maxLength={11}
                />
              </div>
              <div>
                <Label>Amount (₦)</Label>
                <Input
                  type="number"
                  placeholder="1000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {QUICK_AMOUNTS.map(amt => (
                    <Button
                      key={amt}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setAmount(amt.toString())}
                    >
                      ₦{amt}
                    </Button>
                  ))}
                </div>
              </div>
              <Button onClick={handleSubmit} disabled={loading || loadingOperators} className="w-full">
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Submit Transaction
              </Button>
            </TabsContent>
            <TabsContent value="history" className="space-y-3">
              {loadingHistory ? (
                <div className="text-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                </div>
              ) : transactions.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No transactions yet</p>
              ) : (
                transactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{tx.operator_name}</span>
                        <Badge className={getStatusColor(tx.status)}>{tx.status}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{tx.phone_number}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(tx.created_at).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">₦{tx.amount}</p>
                    </div>
                  </div>
                ))
              )}
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
      <PINVerificationModal
        open={showPin}
        onOpenChange={setShowPin}
        onVerified={handleTopup}
        title="Verify Airtime Purchase"
        description={`Enter PIN to buy ₦${amount} airtime for ${phoneNumber}`}
      />
    </>
  );
}
