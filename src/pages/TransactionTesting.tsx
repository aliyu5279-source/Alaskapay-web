import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Smartphone, Send, Building2, ArrowLeft, Zap } from 'lucide-react';
import { AirtimeTopupModal } from '@/components/testing/AirtimeTopupModal';
import { AirtimeTransactionHistory } from '@/components/testing/AirtimeTransactionHistory';
import { BillPaymentModal } from '@/components/bill/BillPaymentModal';
import { BillTransactionHistory } from '@/components/bill/BillTransactionHistory';
import { TransferModal } from '@/components/wallet/TransferModal';
import { WithdrawModal } from '@/components/wallet/WithdrawModal';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';


export default function TransactionTesting() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showAirtime, setShowAirtime] = useState(false);
  const [showBills, setShowBills] = useState(false);
  const [showTransfer, setShowTransfer] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);


  const handleSuccess = () => {
    toast.success('Transaction completed!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Transaction Testing</h1>
            <p className="text-muted-foreground">Test all payment features with Reloadly API</p>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setShowAirtime(true)}>
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-2">
                <Smartphone className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle>Airtime Topup</CardTitle>
              <CardDescription>Buy airtime via Reloadly</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• MTN, Airtel, Glo, 9mobile</li>
                <li>• Instant delivery (5 seconds)</li>
                <li>• Real API integration</li>
              </ul>
              <Button className="w-full mt-4" onClick={() => setShowAirtime(true)}>
                Test Airtime
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setShowBills(true)}>
            <CardHeader>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-2">
                <Zap className="h-6 w-6 text-orange-600" />
              </div>
              <CardTitle>Bill Payment</CardTitle>
              <CardDescription>Pay utility bills</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Electricity, Cable TV</li>
                <li>• Internet subscriptions</li>
                <li>• Customer validation</li>
              </ul>
              <Button className="w-full mt-4" onClick={() => setShowBills(true)}>
                Test Bills
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setShowTransfer(true)}>
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                <Send className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle>Wallet Transfer</CardTitle>
              <CardDescription>Send to AlaskaPay users</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Instant P2P transfers</li>
                <li>• Free between users</li>
                <li>• Use phone number</li>
              </ul>
              <Button className="w-full mt-4" onClick={() => setShowTransfer(true)}>
                Test Transfer
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setShowWithdraw(true)}>
            <CardHeader>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-2">
                <Building2 className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle>Bank Transfer</CardTitle>
              <CardDescription>Withdraw to any bank</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• All Nigerian banks</li>
                <li>• 1-2 business days</li>
                <li>• Secure & verified</li>
              </ul>
              <Button className="w-full mt-4" onClick={() => setShowWithdraw(true)}>
                Test Withdrawal
              </Button>
            </CardContent>
          </Card>
        </div>

        <AirtimeTransactionHistory />
        <BillTransactionHistory />

        <Card>
          <CardHeader>
            <CardTitle>Testing Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">1. Airtime Topup (Reloadly API)</h3>
              <p className="text-sm text-muted-foreground">
                Select network from live operators, enter phone number, choose amount, verify with PIN. 
                Real airtime will be delivered to the phone number.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">2. Bill Payment (Reloadly API)</h3>
              <p className="text-sm text-muted-foreground">
                Select category (Electricity/Cable TV/Internet), choose provider, validate customer number, 
                enter amount, verify with PIN. Real bill payment will be processed.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">3. Wallet Transfer</h3>
              <p className="text-sm text-muted-foreground">
                Enter recipient phone (registered user), amount, optional note, verify with PIN
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">4. Bank Transfer</h3>
              <p className="text-sm text-muted-foreground">
                Link bank account first, select account, enter amount, verify with PIN
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <AirtimeTopupModal
        open={showAirtime}
        onClose={() => setShowAirtime(false)}
        onSuccess={handleSuccess}
      />
      <BillPaymentModal
        open={showBills}
        onClose={() => setShowBills(false)}
        onSuccess={handleSuccess}
      />
      <TransferModal
        open={showTransfer}
        onClose={() => setShowTransfer(false)}
        onSuccess={handleSuccess}
      />
      {user && (
        <WithdrawModal
          open={showWithdraw}
          onOpenChange={setShowWithdraw}
          walletId={user.id}
          currentBalance={10000}
          currency="NGN"
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}

