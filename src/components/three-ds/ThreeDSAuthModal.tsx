import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Lock, Smartphone, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface ThreeDSAuthModalProps {
  open: boolean;
  onClose: () => void;
  transactionData: {
    amount: number;
    currency: string;
    reference: string;
    description?: string;
  };
  onSuccess: (authResult: any) => void;
  onFailed: (error: string) => void;
}

export function ThreeDSAuthModal({ 
  open, 
  onClose, 
  transactionData, 
  onSuccess, 
  onFailed 
}: ThreeDSAuthModalProps) {
  const [step, setStep] = useState<'checking' | 'authenticating' | 'otp' | 'success' | 'failed'>('checking');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [authId, setAuthId] = useState('');
  const [countdown, setCountdown] = useState(300); // 5 minutes
  const [authUrl, setAuthUrl] = useState('');

  useEffect(() => {
    if (open && step === 'checking') {
      initiate3DS();
    }
  }, [open]);

  useEffect(() => {
    if (step === 'authenticating' && countdown > 0) {
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            setStep('failed');
            setError('Authentication timeout. Please try again.');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [step, countdown]);

  const initiate3DS = async () => {
    try {
      setLoading(true);
      setError('');

      // Check if 3DS is required
      const { data: config } = await supabase
        .from('three_ds_config')
        .select('*')
        .eq('is_active', true)
        .single();

      const riskScore = calculateRiskScore(transactionData.amount);
      const requires3DS = transactionData.amount >= (config?.amount_threshold || 10000) ||
                         riskScore >= (config?.risk_score_threshold || 50);

      if (!requires3DS) {
        // Bypass 3DS for low-risk transactions
        onSuccess({ bypassed: true, liability_shift: false });
        return;
      }

      // Create 3DS authentication record
      const { data: auth, error: authError } = await supabase
        .from('three_ds_authentications')
        .insert({
          user_id: (await supabase.auth.getUser()).data.user?.id,
          amount: transactionData.amount,
          currency: transactionData.currency,
          reference: transactionData.reference,
          risk_score: riskScore,
          risk_level: getRiskLevel(riskScore),
          triggered_by: 'automatic',
          status: 'initiated',
          expires_at: new Date(Date.now() + 300000).toISOString()
        })
        .select()
        .single();

      if (authError) throw authError;

      setAuthId(auth.id);
      
      // Simulate Paystack 3DS URL (in production, this would come from Paystack API)
      const mockAuthUrl = `https://checkout.paystack.com/3ds/${auth.reference}`;
      setAuthUrl(mockAuthUrl);
      
      setStep('authenticating');
      
    } catch (err: any) {
      setError(err.message);
      setStep('failed');
      onFailed(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOTPSubmit = async () => {
    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    try {
      setLoading(true);
      setError('');

      // Verify OTP (in production, this would verify with Paystack)
      const isValid = otp === '123456'; // Mock validation

      if (!isValid) {
        throw new Error('Invalid OTP. Please try again.');
      }

      // Update authentication record
      await supabase
        .from('three_ds_authentications')
        .update({
          status: 'success',
          authentication_method: 'otp',
          authenticated_at: new Date().toISOString(),
          completed_at: new Date().toISOString(),
          liability_shift: true,
          eci: '05',
          enrolled: true
        })
        .eq('id', authId);

      setStep('success');
      
      setTimeout(() => {
        onSuccess({ 
          authenticationId: authId, 
          liability_shift: true,
          eci: '05'
        });
        onClose();
      }, 2000);

    } catch (err: any) {
      setError(err.message);
      await supabase
        .from('three_ds_authentications')
        .update({ status: 'failed', error_message: err.message })
        .eq('id', authId);
    } finally {
      setLoading(false);
    }
  };

  const calculateRiskScore = (amount: number): number => {
    let score = 0;
    if (amount > 50000) score += 30;
    else if (amount > 20000) score += 20;
    else if (amount > 10000) score += 10;
    return score;
  };

  const getRiskLevel = (score: number): string => {
    if (score >= 75) return 'critical';
    if (score >= 50) return 'high';
    if (score >= 25) return 'medium';
    return 'low';
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            Secure Transaction Verification
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {step === 'checking' && (
            <div className="text-center py-8">
              <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
              <p className="text-sm text-muted-foreground">
                Verifying transaction security...
              </p>
            </div>
          )}

          {step === 'authenticating' && (
            <div className="space-y-4">
              <Alert>
                <Lock className="h-4 w-4" />
                <AlertDescription>
                  For your security, this transaction requires additional verification.
                </AlertDescription>
              </Alert>

              <div className="bg-muted p-4 rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Amount:</span>
                  <span className="font-semibold">
                    {transactionData.currency} {transactionData.amount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Time remaining:</span>
                  <span className="font-mono text-orange-600">{formatTime(countdown)}</span>
                </div>
              </div>

              <div className="text-center space-y-4">
                <Smartphone className="h-16 w-16 text-blue-600 mx-auto" />
                <div>
                  <p className="font-medium mb-2">Complete authentication</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Click the button below to authenticate via your bank's secure page
                  </p>
                  <Button 
                    onClick={() => {
                      window.open(authUrl, '_blank');
                      setStep('otp');
                    }}
                    className="w-full"
                  >
                    <Lock className="h-4 w-4 mr-2" />
                    Authenticate Now
                  </Button>
                </div>
              </div>
            </div>
          )}

          {step === 'otp' && (
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  Enter the OTP sent to your registered phone number
                </p>
                <Input
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="text-center text-2xl tracking-widest font-mono"
                  maxLength={6}
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button 
                onClick={handleOTPSubmit} 
                disabled={loading || otp.length !== 6}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  'Verify OTP'
                )}
              </Button>
            </div>
          )}

          {step === 'success' && (
            <div className="text-center py-8">
              <CheckCircle2 className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Authentication Successful!</h3>
              <p className="text-sm text-muted-foreground">
                Your transaction is now protected with liability shift
              </p>
            </div>
          )}

          {step === 'failed' && (
            <div className="space-y-4">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
              <Button onClick={initiate3DS} variant="outline" className="w-full">
                Try Again
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}