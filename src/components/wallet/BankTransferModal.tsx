import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Building2, CheckCircle, Plus, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { NIGERIAN_BANKS } from '@/lib/nigerianBanks';
import { verifyBankAccount, linkBankAccount, getLinkedBankAccounts } from '@/services/bankService';
import { BankTransferFlow } from './BankTransferFlow';
import type { LinkedBankAccount } from '@/services/bankService';
import { useAuth } from '@/contexts/AuthContext';

interface BankTransferModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function BankTransferModal({ open, onClose, onSuccess }: BankTransferModalProps) {
  const { user } = useAuth();
  const [step, setStep] = useState<'select' | 'link' | 'amount' | 'transfer'>('select');
  const [linkedAccounts, setLinkedAccounts] = useState<LinkedBankAccount[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<LinkedBankAccount | null>(null);
  const [selectedBank, setSelectedBank] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [amount, setAmount] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [linking, setLinking] = useState(false);

  useEffect(() => {
    if (open) {
      loadLinkedAccounts();
      setStep('select');
      setAmount('');
      setSelectedAccount(null);
    }
  }, [open]);

  const loadLinkedAccounts = async () => {
    const accounts = await getLinkedBankAccounts();
    setLinkedAccounts(accounts);
  };

  const handleVerify = async () => {
    if (!selectedBank || accountNumber.length !== 10) {
      toast.error('Select bank and enter valid account number');
      return;
    }

    setVerifying(true);
    const bank = NIGERIAN_BANKS.find(b => b.id === selectedBank);
    const result = await verifyBankAccount(accountNumber, bank!.code);
    
    if (result.success) {
      setAccountName(result.accountName!);
      toast.success('Account verified!');
    } else {
      toast.error(result.error);
    }
    setVerifying(false);
  };

  const handleLink = async () => {
    setLinking(true);
    try {
      const bank = NIGERIAN_BANKS.find(b => b.id === selectedBank)!;
      await linkBankAccount({
        bankName: bank.name,
        bankCode: bank.code,
        accountNumber,
        accountName
      });
      toast.success('Bank account linked!');
      await loadLinkedAccounts();
      setStep('select');
      setAccountNumber('');
      setAccountName('');
      setSelectedBank('');
    } catch (error: any) {
      toast.error(error.message);
    }
    setLinking(false);
  };

  const handleSelectAccount = (account: LinkedBankAccount) => {
    setSelectedAccount(account);
    setStep('amount');
  };

  const handleAmountSubmit = () => {
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) {
      toast.error('Enter a valid amount');
      return;
    }
    if (amt < 100) {
      toast.error('Minimum amount is ₦100');
      return;
    }
    setStep('transfer');
  };

  const handleTransferSuccess = () => {
    toast.success('Wallet funded successfully!');
    onSuccess();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Fund via Bank Transfer</DialogTitle>
        </DialogHeader>

        {step === 'select' && (
          <div className="space-y-4">
            {linkedAccounts.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No linked accounts. Link your bank account to get started.
              </p>
            ) : (
              linkedAccounts.map(acc => (
                <Card 
                  key={acc.id} 
                  className="p-4 cursor-pointer hover:bg-accent transition-colors"
                  onClick={() => handleSelectAccount(acc)}
                >
                  <div className="flex items-center gap-3">
                    <Building2 className="h-8 w-8 text-primary" />
                    <div className="flex-1">
                      <p className="font-semibold">{acc.bank_name}</p>
                      <p className="text-sm text-muted-foreground">{acc.account_number}</p>
                      <p className="text-xs text-muted-foreground">{acc.account_name}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {acc.is_verified && <Badge variant="secondary">Verified</Badge>}
                      <ArrowRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </div>
                </Card>
              ))
            )}
            <Button onClick={() => setStep('link')} variant="outline" className="w-full">
              <Plus className="mr-2 h-4 w-4" /> Link New Account
            </Button>
          </div>
        )}

        {step === 'link' && (
          <div className="space-y-4">
            <div>
              <Label>Bank</Label>
              <Select value={selectedBank} onValueChange={setSelectedBank}>
                <SelectTrigger>
                  <SelectValue placeholder="Select bank" />
                </SelectTrigger>
                <SelectContent>
                  {NIGERIAN_BANKS.map(bank => (
                    <SelectItem key={bank.id} value={bank.id}>{bank.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Account Number</Label>
              <Input 
                value={accountNumber} 
                onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ''))} 
                maxLength={10}
                placeholder="Enter 10-digit account number"
              />
            </div>
            <Button onClick={handleVerify} disabled={verifying || !selectedBank || accountNumber.length !== 10} className="w-full">
              {verifying && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Verify Account
            </Button>
            {accountName && (
              <>
                <div className="p-3 bg-green-50 dark:bg-green-950 rounded border border-green-200 dark:border-green-800">
                  <Label className="text-xs text-muted-foreground">Account Name</Label>
                  <p className="font-semibold text-green-700 dark:text-green-300">{accountName}</p>
                </div>
                <Button onClick={handleLink} disabled={linking} className="w-full">
                  {linking && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Link Account
                </Button>
              </>
            )}
            <Button onClick={() => setStep('select')} variant="ghost" className="w-full">
              Back
            </Button>
          </div>
        )}

        {step === 'amount' && selectedAccount && (
          <div className="space-y-4">
            <Card className="p-4 bg-accent">
              <div className="flex items-center gap-3">
                <Building2 className="h-8 w-8 text-primary" />
                <div>
                  <p className="font-semibold">{selectedAccount.bank_name}</p>
                  <p className="text-sm text-muted-foreground">{selectedAccount.account_number}</p>
                </div>
              </div>
            </Card>
            <div>
              <Label>Amount (NGN)</Label>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                min="100"
              />
              <p className="text-xs text-muted-foreground mt-1">Minimum: ₦100</p>
            </div>
            <Button onClick={handleAmountSubmit} className="w-full">
              Continue
            </Button>
            <Button onClick={() => setStep('select')} variant="ghost" className="w-full">
              Back
            </Button>
          </div>
        )}

        {step === 'transfer' && selectedAccount && user && (
          <BankTransferFlow
            userId={user.id}
            bankAccount={selectedAccount}
            amount={parseFloat(amount)}
            onSuccess={handleTransferSuccess}
            onCancel={() => setStep('amount')}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

