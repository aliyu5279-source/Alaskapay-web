import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { WalletBalanceCard } from './wallet/WalletBalanceCard';
import { WalletTransactionList } from './wallet/WalletTransactionList';
import { WithdrawalHistory } from './wallet/WithdrawalHistory';
import { TopUpModal } from './wallet/TopUpModal';
import { TransferModal } from './wallet/TransferModal';
import { WithdrawModal } from './wallet/WithdrawModal';
import { PaymentSuccessHandler } from './wallet/PaymentSuccessHandler';
import { LinkedBanksManager } from './wallet/LinkedBanksManager';
import { BankTransferModal } from './wallet/BankTransferModal';
import { PhoneAccountDisplay } from './wallet/PhoneAccountDisplay';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Wallet, CreditCard, ArrowDownToLine, Building2, Mail, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export function WalletDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [topUpOpen, setTopUpOpen] = useState(false);
  const [transferOpen, setTransferOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [bankTransferOpen, setBankTransferOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [walletInfo, setWalletInfo] = useState<any>(null);
  const [resending, setResending] = useState(false);

  const isVerified = user?.email_confirmed_at;

  const handleSuccess = () => setRefreshKey(prev => prev + 1);

  const handleResendEmail = async () => {
    if (!user?.email) return;
    setResending(true);
    
    try {
      await supabase.auth.resend({
        type: 'signup',
        email: user.email,
      });
      
      toast({
        title: 'Verification email sent',
        description: 'Check your inbox for the verification link.',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setResending(false);
    }
  };

  const handleRestrictedAction = (action: string) => {
    if (!isVerified) {
      toast({
        title: 'Email Verification Required',
        description: 'Please verify your email to access wallet features.',
        variant: 'destructive',
      });
      return false;
    }
    return true;
  };

  return (
    <>
      <PaymentSuccessHandler />
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Wallet</h1>
        
        {!isVerified && (
          <Alert className="bg-yellow-50 border-yellow-200">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="flex items-center justify-between">
              <span className="text-yellow-800">
                Please verify your email address to access wallet features.
              </span>
              <Button size="sm" variant="outline" onClick={handleResendEmail} disabled={resending}>
                {resending ? 'Sending...' : 'Resend Email'}
              </Button>
            </AlertDescription>
          </Alert>
        )}
        
        <PhoneAccountDisplay />

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <WalletBalanceCard key={refreshKey} onTopUp={() => setTopUpOpen(true)} onTransfer={() => setTransferOpen(true)} onWithdraw={() => setWithdrawOpen(true)} onWalletLoad={setWalletInfo} />
          </div>
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="h-20 flex flex-col gap-2" onClick={() => setBankTransferOpen(true)}><Building2 size={24} /><span className="text-xs">Bank Transfer</span></Button>
              <Button variant="outline" className="h-20 flex flex-col gap-2"><Wallet size={24} /><span className="text-xs">Pay Bills</span></Button>
              <Button variant="outline" className="h-20 flex flex-col gap-2"><CreditCard size={24} /><span className="text-xs">Fund Card</span></Button>
              <Button variant="outline" className="h-20 flex flex-col gap-2" onClick={() => setWithdrawOpen(true)}><ArrowDownToLine size={24} /><span className="text-xs">Withdraw</span></Button>
            </div>
          </Card>
        </div>
        <Tabs defaultValue="transactions"><TabsList><TabsTrigger value="transactions">Transactions</TabsTrigger><TabsTrigger value="withdrawals">Withdrawals</TabsTrigger><TabsTrigger value="banks">Linked Banks</TabsTrigger></TabsList><TabsContent value="transactions"><WalletTransactionList key={refreshKey} /></TabsContent><TabsContent value="withdrawals"><WithdrawalHistory /></TabsContent><TabsContent value="banks"><LinkedBanksManager onAddNew={() => setBankTransferOpen(true)} /></TabsContent></Tabs>
        <TopUpModal open={topUpOpen} onClose={() => setTopUpOpen(false)} onSuccess={handleSuccess} />
        <TransferModal open={transferOpen} onClose={() => setTransferOpen(false)} onSuccess={handleSuccess} />
        <BankTransferModal open={bankTransferOpen} onClose={() => setBankTransferOpen(false)} onSuccess={handleSuccess} />
        {walletInfo && <WithdrawModal open={withdrawOpen} onOpenChange={setWithdrawOpen} walletId={walletInfo.id} currentBalance={walletInfo.balance} currency={walletInfo.currency} onSuccess={handleSuccess} />}
      </div>
    </>
  );
}
