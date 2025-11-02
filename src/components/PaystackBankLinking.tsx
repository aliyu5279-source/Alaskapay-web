import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Building2, Plus, Check, Loader2, AlertCircle, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Bank {
  id: string;
  name: string;
  code: string;
}

interface PaystackRecipient {
  id: string;
  bank_name: string;
  account_number: string;
  account_name: string;
  recipient_code: string;
  is_primary: boolean;
  created_at: string;
}

const NIGERIAN_BANKS: Bank[] = [
  { id: '1', name: 'Access Bank', code: '044' },
  { id: '2', name: 'GTBank', code: '058' },
  { id: '3', name: 'First Bank', code: '011' },
  { id: '4', name: 'UBA', code: '033' },
  { id: '5', name: 'Zenith Bank', code: '057' },
  { id: '6', name: 'Kuda Bank', code: '50211' },
  { id: '7', name: 'Opay', code: '999992' },
  { id: '8', name: 'PalmPay', code: '999991' },
];

export function PaystackBankLinking() {
  const [recipients, setRecipients] = useState<PaystackRecipient[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [linking, setLinking] = useState(false);
  const [selectedBank, setSelectedBank] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');

  useEffect(() => {
    loadRecipients();
  }, []);

  const loadRecipients = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('paystack_recipients')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    setRecipients(data || []);
  };

  const handleVerify = async () => {
    if (!selectedBank || accountNumber.length !== 10) {
      toast.error('Select bank and enter valid 10-digit account number');
      return;
    }

    setVerifying(true);
    try {
      const bank = NIGERIAN_BANKS.find(b => b.id === selectedBank);
      const { data, error } = await supabase.functions.invoke('verify-paystack-account', {
        body: { account_number: accountNumber, bank_code: bank?.code }
      });

      if (error) throw error;
      setAccountName(data.account_name);
      toast.success('Account verified!');
    } catch (error: any) {
      toast.error(error.message || 'Verification failed');
    } finally {
      setVerifying(false);
    }
  };

  const handleLink = async () => {
    if (!accountName) {
      toast.error('Verify account first');
      return;
    }

    setLinking(true);
    try {
      const bank = NIGERIAN_BANKS.find(b => b.id === selectedBank);
      const { data, error } = await supabase.functions.invoke('create-paystack-recipient', {
        body: { 
          bank_code: bank?.code,
          account_number: accountNumber,
          account_name: accountName,
          bank_name: bank?.name
        }
      });

      if (error) throw error;
      toast.success('Bank account linked to Paystack!');
      setShowDialog(false);
      resetForm();
      loadRecipients();
    } catch (error: any) {
      toast.error(error.message || 'Failed to link');
    } finally {
      setLinking(false);
    }
  };

  const setPrimary = async (id: string) => {
    const { error } = await supabase
      .from('paystack_recipients')
      .update({ is_primary: false })
      .neq('id', id);

    await supabase
      .from('paystack_recipients')
      .update({ is_primary: true })
      .eq('id', id);

    if (!error) {
      toast.success('Primary account updated');
      loadRecipients();
    }
  };

  const resetForm = () => {
    setSelectedBank('');
    setAccountNumber('');
    setAccountName('');
  };

  return (
    <div className="space-y-6">
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Link your Nigerian bank account to receive commission payments via Paystack
        </AlertDescription>
      </Alert>

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Commission Payment Accounts</h2>
        <Button onClick={() => setShowDialog(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Account
        </Button>
      </div>

      <div className="grid gap-4">
        {recipients.map((recipient) => (
          <Card key={recipient.id} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Building2 className="h-8 w-8 text-primary" />
                <div>
                  <h3 className="font-semibold">{recipient.bank_name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {recipient.account_number} - {recipient.account_name}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                {recipient.is_primary ? (
                  <Badge>Primary</Badge>
                ) : (
                  <Button size="sm" variant="outline" onClick={() => setPrimary(recipient.id)}>
                    Set Primary
                  </Button>
                )}
                <Badge variant="outline">
                  <Check className="h-3 w-3 mr-1" /> Verified
                </Badge>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Link Bank Account to Paystack</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Bank</Label>
              <Select value={selectedBank} onValueChange={setSelectedBank}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your bank" />
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
                placeholder="10-digit account number"
              />
            </div>
            <Button onClick={handleVerify} disabled={verifying} className="w-full">
              {verifying && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Verify with Paystack
            </Button>
            {accountName && (
              <>
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <Label className="text-green-900">Verified Account Name</Label>
                  <p className="font-semibold text-green-900">{accountName}</p>
                </div>
                <Button onClick={handleLink} disabled={linking} className="w-full">
                  {linking && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
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
