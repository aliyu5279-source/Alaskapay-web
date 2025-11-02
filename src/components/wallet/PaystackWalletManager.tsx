import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Send, History, CreditCard } from 'lucide-react';
import PaystackPaymentModal from '@/components/payment/PaystackPaymentModal';
import BankTransferModal from '@/components/payment/BankTransferModal';
import WithdrawalModal from '@/components/payment/WithdrawalModal';
import { usePaystackVerification } from '@/hooks/usePaystackVerification';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export default function PaystackWalletManager() {
  const [balance, setBalance] = useState(0);
  const [showFundModal, setShowFundModal] = useState(false);
  const [showBankModal, setShowBankModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [recipientCode, setRecipientCode] = useState('');
  const [user, setUser] = useState<any>(null);
  const { verifying } = usePaystackVerification();
  const { toast } = useToast();

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUser(user);
      const { data: wallet } = await supabase
        .from('wallets')
        .select('balance')
        .eq('user_id', user.id)
        .single();
      
      if (wallet) setBalance(wallet.balance);
    }
  };

  const handleBankAdded = (code: string) => {
    setRecipientCode(code);
    toast({ title: 'Success', description: 'Bank account added successfully' });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Wallet Balance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold mb-6">₦{balance.toLocaleString()}</div>
          
          <div className="grid grid-cols-2 gap-3">
            <Button onClick={() => setShowFundModal(true)} className="h-16">
              <Plus className="mr-2 h-5 w-5" />
              Fund Wallet
            </Button>
            <Button 
              onClick={() => recipientCode ? setShowWithdrawModal(true) : setShowBankModal(true)}
              variant="outline"
              className="h-16"
            >
              <Send className="mr-2 h-5 w-5" />
              Withdraw
            </Button>
          </div>
        </CardContent>
      </Card>

      {user && (
        <>
          <PaystackPaymentModal
            open={showFundModal}
            onClose={() => setShowFundModal(false)}
            onSuccess={() => loadUserData()}
            amount={5000}
            email={user.email}
            userId={user.id}
          />

          <BankTransferModal
            open={showBankModal}
            onClose={() => setShowBankModal(false)}
            onSuccess={handleBankAdded}
          />

          {recipientCode && (
            <WithdrawalModal
              open={showWithdrawModal}
              onClose={() => setShowWithdrawModal(false)}
              recipientCode={recipientCode}
              maxAmount={balance}
            />
          )}
        </>
      )}
    </div>
  );
}
