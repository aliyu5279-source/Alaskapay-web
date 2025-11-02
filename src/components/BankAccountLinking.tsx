import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Building2, Plus, Check, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface Bank {
  id: string;
  bank_name: string;
  bank_code: string;
}

interface LinkedAccount {
  id: string;
  bank_id: string;
  account_number: string;
  account_name: string;
  is_verified: boolean;
  is_primary: boolean;
  nigerian_banks: Bank;
}

export function BankAccountLinking() {
  const [banks, setBanks] = useState<Bank[]>([]);
  const [linkedAccounts, setLinkedAccounts] = useState<LinkedAccount[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [linking, setLinking] = useState(false);
  const [selectedBank, setSelectedBank] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [isPrimary, setIsPrimary] = useState(false);

  useEffect(() => {
    loadBanks();
    loadLinkedAccounts();
  }, []);

  const loadBanks = async () => {
    const { data } = await supabase
      .from('nigerian_banks')
      .select('id, bank_name, bank_code')
      .eq('is_active', true)
      .order('bank_name');
    setBanks(data || []);
  };

  const loadLinkedAccounts = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('linked_bank_accounts')
      .select('*, nigerian_banks(id, bank_name, bank_code)')
      .eq('user_id', user.id);
    setLinkedAccounts(data || []);
  };

  const handleVerify = async () => {
    if (!selectedBank || !accountNumber) {
      toast.error('Please select bank and enter account number');
      return;
    }

    setVerifying(true);
    try {
      const bank = banks.find(b => b.id === selectedBank);
      const { data, error } = await supabase.functions.invoke('verify-bank-account', {
        body: { accountNumber, bankCode: bank?.bank_code }
      });

      if (error) throw error;
      if (!data.success) throw new Error(data.error);

      setAccountName(data.accountName);
      toast.success('Account verified successfully');
    } catch (error: any) {
      toast.error(error.message || 'Verification failed');
    } finally {
      setVerifying(false);
    }
  };

  const handleLink = async () => {
    if (!accountName) {
      toast.error('Please verify account first');
      return;
    }

    setLinking(true);
    try {
      const { data, error } = await supabase.functions.invoke('link-bank-account', {
        body: { bankId: selectedBank, accountNumber, accountName, isPrimary }
      });

      if (error) throw error;
      if (!data.success) throw new Error(data.error);

      toast.success('Bank account linked successfully');
      setShowDialog(false);
      resetForm();
      loadLinkedAccounts();
    } catch (error: any) {
      toast.error(error.message || 'Failed to link account');
    } finally {
      setLinking(false);
    }
  };

  const resetForm = () => {
    setSelectedBank('');
    setAccountNumber('');
    setAccountName('');
    setIsPrimary(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Linked Bank Accounts</h2>
        <Button onClick={() => setShowDialog(true)}>
          <Plus className="mr-2 h-4 w-4" /> Link Account
        </Button>
      </div>

      <div className="grid gap-4">
        {linkedAccounts.map((account) => (
          <Card key={account.id} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Building2 className="h-8 w-8 text-primary" />
                <div>
                  <h3 className="font-semibold">{account.nigerian_banks.bank_name}</h3>
                  <p className="text-sm">{account.account_number} - {account.account_name}</p>
                </div>
              </div>
              <div className="flex gap-2">
                {account.is_primary && <Badge>Primary</Badge>}
                {account.is_verified && <Badge variant="outline"><Check className="h-3 w-3 mr-1" /> Verified</Badge>}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Link Bank Account</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Select Bank</Label>
              <Select value={selectedBank} onValueChange={setSelectedBank}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose bank" />
                </SelectTrigger>
                <SelectContent>
                  {banks.map(bank => (
                    <SelectItem key={bank.id} value={bank.id}>{bank.bank_name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Account Number</Label>
              <Input 
                value={accountNumber} 
                onChange={(e) => setAccountNumber(e.target.value)}
                maxLength={10}
                placeholder="10-digit account number"
              />
            </div>
            <Button onClick={handleVerify} disabled={verifying} className="w-full">
              {verifying ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Verify Account
            </Button>
            {accountName && (
              <>
                <div>
                  <Label>Account Name</Label>
                  <Input value={accountName} disabled />
                </div>
                <Button onClick={handleLink} disabled={linking} className="w-full">
                  {linking ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Link Account
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
