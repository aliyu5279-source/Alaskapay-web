import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { useBiometricAuth } from '@/hooks/useBiometricAuth';
import { Lock, AlertTriangle, Fingerprint } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import ForgotPINModal from './ForgotPINModal';

interface PINVerificationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onVerified: () => void;
  title?: string;
  description?: string;
}

export default function PINVerificationModal({ 
  open, 
  onOpenChange, 
  onVerified,
  title = 'Verify Transaction PIN',
  description = 'Enter your 4-digit PIN to continue'
}: PINVerificationModalProps) {
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [attemptsRemaining, setAttemptsRemaining] = useState<number | null>(null);
  const [lockedUntil, setLockedUntil] = useState<string | null>(null);
  const [showForgotPIN, setShowForgotPIN] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [showBiometricOption, setShowBiometricOption] = useState(false);
  const { toast } = useToast();
  const { isAvailable, biometryType, authenticate } = useBiometricAuth();

  useEffect(() => {
    if (open) {
      setPin('');
      setAttemptsRemaining(null);
      setLockedUntil(null);
      checkBiometricSettings();
    }
  }, [open]);

  const checkBiometricSettings = async () => {
    if (!isAvailable) return;
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('profiles')
      .select('biometric_transaction_auth')
      .eq('id', user.id)
      .single();

    if (data?.biometric_transaction_auth) {
      setBiometricEnabled(true);
      setShowBiometricOption(true);
      // Auto-trigger biometric auth
      handleBiometricAuth();
    }
  };

  const handleBiometricAuth = async () => {
    const success = await authenticate('Verify transaction');
    if (success) {
      toast({ title: 'Verified', description: 'Biometric authentication successful' });
      onVerified();
      onOpenChange(false);
    } else {
      toast({ 
        title: 'Authentication Failed', 
        description: 'Please enter your PIN instead',
        variant: 'destructive' 
      });
    }
  };

  const getBiometryName = () => {
    switch (biometryType) {
      case 0: return 'Touch ID';
      case 1: return 'Face ID';
      case 2: return 'Fingerprint';
      case 3: return 'Face Authentication';
      default: return 'Biometric';
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (pin.length !== 4) {
      toast({ title: 'Invalid PIN', description: 'PIN must be 4 digits', variant: 'destructive' });
      return;
    }

    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const { data, error } = await supabase.functions.invoke('verify-transaction-pin', {
        body: { pin },
        headers: { Authorization: `Bearer ${session?.access_token}` }
      });

      if (error) {
        if (error.message.includes('locked')) {
          setLockedUntil(data?.locked_until);
          toast({ title: 'PIN Locked', description: 'Too many failed attempts. Try again later.', variant: 'destructive' });
        } else if (error.message.includes('Incorrect')) {
          setAttemptsRemaining(data?.attempts_remaining ?? null);
          toast({ title: 'Incorrect PIN', description: `${data?.attempts_remaining ?? 0} attempts remaining`, variant: 'destructive' });
        } else {
          throw error;
        }
        setPin('');
        return;
      }

      if (data?.verified) {
        toast({ title: 'Verified', description: 'PIN verified successfully' });
        onVerified();
        onOpenChange(false);
      }
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              {title}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-sm text-muted-foreground">{description}</p>
            
            {showBiometricOption && (
              <div className="space-y-2">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={handleBiometricAuth}
                >
                  <Fingerprint className="h-4 w-4 mr-2" />
                  Use {getBiometryName()}
                </Button>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Or enter PIN</span>
                  </div>
                </div>
              </div>
            )}
            
            {lockedUntil && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  PIN locked until {new Date(lockedUntil).toLocaleTimeString()}
                </AlertDescription>
              </Alert>
            )}

            {attemptsRemaining !== null && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  {attemptsRemaining} attempts remaining before lockout
                </AlertDescription>
              </Alert>
            )}

            <Input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
              maxLength={4}
              placeholder="••••"
              className="text-center text-2xl tracking-widest"
              autoFocus={!showBiometricOption}
              disabled={!!lockedUntil}
            />


            <div className="text-center">
              <Button 
                type="button" 
                variant="link" 
                className="text-sm text-primary"
                onClick={() => {
                  onOpenChange(false);
                  setShowForgotPIN(true);
                }}
              >
                Forgot PIN?
              </Button>
            </div>

            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" disabled={loading || !!lockedUntil} className="flex-1">
                {loading ? 'Verifying...' : 'Verify'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <ForgotPINModal 
        open={showForgotPIN} 
        onOpenChange={setShowForgotPIN}
        onSuccess={() => {
          setShowForgotPIN(false);
          toast({ title: 'PIN Reset', description: 'Your PIN has been reset successfully' });
        }}
      />
    </>
  );
}

export { PINVerificationModal };

