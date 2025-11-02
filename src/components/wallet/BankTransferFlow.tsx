import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { bankTransferService } from '@/services/bankTransferService';

interface BankTransferFlowProps {
  userId: string;
  bankAccount: any;
  amount: number;
  onSuccess: () => void;
  onCancel: () => void;
}

export function BankTransferFlow({
  userId,
  bankAccount,
  amount,
  onSuccess,
  onCancel
}: BankTransferFlowProps) {
  const [step, setStep] = useState<'confirm' | 'otp' | 'processing' | 'success' | 'error'>('confirm');
  const [otp, setOtp] = useState('');
  const [reference, setReference] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInitiate = async () => {
    setLoading(true);
    const result = await bankTransferService.initiateTransfer({
      userId,
      bankAccountId: bankAccount.id,
      amount,
      currency: 'NGN'
    });

    setLoading(false);

    if (result.success) {
      setReference(result.reference || '');
      setMessage(result.message || '');
      
      if (result.requiresAuth) {
        setStep('otp');
      } else {
        setStep('processing');
        setTimeout(() => verifyTransfer(result.reference!), 2000);
      }
    } else {
      setMessage(result.error || 'Transfer failed');
      setStep('error');
    }
  };

  const handleOTPSubmit = async () => {
    setLoading(true);
    const result = await bankTransferService.submitOTP({ reference, otp });
    setLoading(false);

    if (result.success) {
      setStep('processing');
      setTimeout(() => verifyTransfer(reference), 2000);
    } else {
      setMessage(result.error || 'Invalid OTP');
    }
  };

  const verifyTransfer = async (ref: string) => {
    const result = await bankTransferService.verifyTransfer(ref);
    
    if (result.success) {
      setStep('success');
      setTimeout(onSuccess, 2000);
    } else {
      setMessage(result.error || 'Verification failed');
      setStep('error');
    }
  };

  if (step === 'confirm') {
    return (
      <Card className="p-6 space-y-4">
        <h3 className="text-lg font-semibold">Confirm Transfer</h3>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Bank: {bankAccount.bank_name}</p>
          <p className="text-sm text-muted-foreground">Account: {bankAccount.account_number}</p>
          <p className="text-sm text-muted-foreground">Name: {bankAccount.account_name}</p>
          <p className="text-2xl font-bold">₦{amount.toLocaleString()}</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleInitiate} disabled={loading} className="flex-1">
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Confirm Transfer
          </Button>
          <Button onClick={onCancel} variant="outline">Cancel</Button>
        </div>
      </Card>
    );
  }

  if (step === 'otp') {
    return (
      <Card className="p-6 space-y-4">
        <h3 className="text-lg font-semibold">Enter OTP</h3>
        <Alert>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
        <div className="space-y-2">
          <Label htmlFor="otp">OTP Code</Label>
          <Input
            id="otp"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter 6-digit OTP"
            maxLength={6}
          />
        </div>
        <Button onClick={handleOTPSubmit} disabled={loading || otp.length !== 6} className="w-full">
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Submit OTP
        </Button>
      </Card>
    );
  }

  if (step === 'processing') {
    return (
      <Card className="p-6 text-center space-y-4">
        <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
        <h3 className="text-lg font-semibold">Processing Transfer</h3>
        <p className="text-sm text-muted-foreground">Please wait...</p>
      </Card>
    );
  }

  if (step === 'success') {
    return (
      <Card className="p-6 text-center space-y-4">
        <CheckCircle className="h-12 w-12 mx-auto text-green-500" />
        <h3 className="text-lg font-semibold">Transfer Successful!</h3>
        <p className="text-sm text-muted-foreground">Your wallet has been credited</p>
      </Card>
    );
  }

  return (
    <Card className="p-6 text-center space-y-4">
      <AlertCircle className="h-12 w-12 mx-auto text-red-500" />
      <h3 className="text-lg font-semibold">Transfer Failed</h3>
      <p className="text-sm text-muted-foreground">{message}</p>
      <Button onClick={onCancel}>Close</Button>
    </Card>
  );
}
