import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { utilityPaymentService, BillProvider } from '@/services/utilityPaymentService';
import { Loader2, Zap, Tv, Wifi } from 'lucide-react';
import { PINVerificationModal } from '@/components/pin/PINVerificationModal';

interface BillPaymentModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CATEGORIES = [
  { id: 'electricity', name: 'Electricity', icon: Zap },
  { id: 'cable_tv', name: 'Cable TV', icon: Tv },
  { id: 'internet', name: 'Internet', icon: Wifi }
];

export function BillPaymentModal({ open, onClose, onSuccess }: BillPaymentModalProps) {
  const [category, setCategory] = useState('');
  const [providers, setProviders] = useState<BillProvider[]>([]);
  const [provider, setProvider] = useState('');
  const [customerNumber, setCustomerNumber] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (category) {
      loadProviders();
    }
  }, [category]);

  const loadProviders = async () => {
    try {
      setLoading(true);
      const billers = await utilityPaymentService.getBillers(category);
      setProviders(billers);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleValidate = async () => {
    if (!provider || !customerNumber) return;

    try {
      setValidating(true);
      const result = await utilityPaymentService.validateCustomer(provider, customerNumber);
      
      if (result.valid) {
        setCustomerName(result.customerName || '');
        if (result.amount) setAmount(result.amount.toString());
        toast({
          title: 'Customer Validated',
          description: `Customer: ${result.customerName || customerNumber}`
        });
      } else {
        toast({
          title: 'Validation Failed',
          description: 'Invalid customer number',
          variant: 'destructive'
        });
      }
    } catch (error: any) {
      toast({
        title: 'Validation Error',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setValidating(false);
    }
  };

  const handlePayment = () => {
    if (!category || !provider || !customerNumber || !amount) {
      toast({
        title: 'Missing Information',
        description: 'Please fill all required fields',
        variant: 'destructive'
      });
      return;
    }
    setShowPinModal(true);
  };

  const handlePinVerified = async (pin: string) => {
    try {
      setLoading(true);
      await utilityPaymentService.payBill({
        category,
        provider,
        customerNumber,
        customerName,
        amount: parseFloat(amount),
        pin
      });

      toast({
        title: 'Payment Successful',
        description: 'Bill payment completed successfully'
      });
      onSuccess();
      onClose();
    } catch (error: any) {
      toast({
        title: 'Payment Failed',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Pay Utility Bill</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map(cat => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {category && (
              <div>
                <Label>Service Provider</Label>
                <Select value={provider} onValueChange={setProvider} disabled={loading}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select provider" />
                  </SelectTrigger>
                  <SelectContent>
                    {providers.map(p => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div>
              <Label>Customer Number</Label>
              <div className="flex gap-2">
                <Input
                  value={customerNumber}
                  onChange={(e) => setCustomerNumber(e.target.value)}
                  placeholder="Enter customer number"
                />
                <Button onClick={handleValidate} disabled={validating || !provider}>
                  {validating ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Verify'}
                </Button>
              </div>
            </div>

            {customerName && (
              <div>
                <Label>Customer Name</Label>
                <Input value={customerName} disabled />
              </div>
            )}

            <div>
              <Label>Amount (₦)</Label>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
              />
            </div>

            <Button onClick={handlePayment} disabled={loading} className="w-full">
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Pay Bill
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <PINVerificationModal
        open={showPinModal}
        onClose={() => setShowPinModal(false)}
        onVerified={handlePinVerified}
        title="Confirm Bill Payment"
      />
    </>
  );
}
