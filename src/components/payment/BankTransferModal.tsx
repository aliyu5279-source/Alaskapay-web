import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { listBanks, resolveAccount, createRecipient } from '@/services/paystackService';
import { useToast } from '@/hooks/use-toast';

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: (recipientCode: string) => void;
}

export default function BankTransferModal({ open, onClose, onSuccess }: Props) {
  const [banks, setBanks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [accountName, setAccountName] = useState('');
  const [formData, setFormData] = useState({
    bankCode: '',
    accountNumber: '',
    accountName: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    if (open) loadBanks();
  }, [open]);

  const loadBanks = async () => {
    const result = await listBanks();
    if (result.status) setBanks(result.data || []);
  };

  const handleVerifyAccount = async () => {
    if (!formData.bankCode || !formData.accountNumber) return;
    
    setVerifying(true);
    try {
      const result = await resolveAccount(formData.accountNumber, formData.bankCode);
      if (result.status && result.data) {
        setAccountName(result.data.account_name);
        setFormData(prev => ({ ...prev, accountName: result.data.account_name }));
      } else {
        toast({ title: 'Verification Failed', description: result.message, variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to verify account', variant: 'destructive' });
    } finally {
      setVerifying(false);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const result = await createRecipient({
        type: 'nuban',
        name: formData.accountName,
        account_number: formData.accountNumber,
        bank_code: formData.bankCode
      });

      if (result.status && result.data) {
        onSuccess(result.data.recipient_code);
        toast({ title: 'Success', description: 'Bank account added successfully' });
        onClose();
      } else {
        toast({ title: 'Failed', description: result.message, variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to add bank account', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Bank Account</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label>Bank</Label>
            <Select value={formData.bankCode} onValueChange={(v) => setFormData(p => ({ ...p, bankCode: v }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select bank" />
              </SelectTrigger>
              <SelectContent>
                {banks.map(bank => (
                  <SelectItem key={bank.code} value={bank.code}>{bank.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Account Number</Label>
            <div className="flex gap-2">
              <Input
                value={formData.accountNumber}
                onChange={(e) => setFormData(p => ({ ...p, accountNumber: e.target.value }))}
                maxLength={10}
              />
              <Button onClick={handleVerifyAccount} disabled={verifying}>
                {verifying ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Verify'}
              </Button>
            </div>
          </div>

          {accountName && (
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle2 className="h-4 w-4" />
              <span className="text-sm font-medium">{accountName}</span>
            </div>
          )}

          <Button onClick={handleSubmit} disabled={loading || !accountName} className="w-full">
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Add Bank Account
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
