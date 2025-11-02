import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Lock, Phone, Eye, EyeOff } from 'lucide-react';

interface ForgotPINModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ForgotPINModal({ open, onOpenChange }: ForgotPINModalProps) {
  const [step, setStep] = useState<'phone' | 'otp' | 'newpin'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [showPins, setShowPins] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const { toast } = useToast();

  const handleSendOTP = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const { error } = await supabase.functions.invoke('send-phone-otp', {
        body: { phone_number: phone, purpose: 'pin_reset' },
        headers: { Authorization: `Bearer ${session?.access_token}` }
      });

      if (error) throw error;

      toast({ title: 'OTP Sent', description: 'Check your phone for the verification code' });
      setStep('otp');
      setResendTimer(60);
      const interval = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const { data, error } = await supabase.functions.invoke('verify-phone-otp', {
        body: { phone_number: phone, otp_code: otp },
        headers: { Authorization: `Bearer ${session?.access_token}` }
      });

      if (error) throw error;
      if (!data?.verified) {
        toast({ title: 'Invalid OTP', description: 'Please check the code and try again', variant: 'destructive' });
        return;
      }

      toast({ title: 'Verified', description: 'Phone verified. Set your new PIN' });
      setStep('newpin');
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPIN = async () => {
    if (newPin.length !== 4 || !/^\d{4}$/.test(newPin)) {
      toast({ title: 'Invalid PIN', description: 'PIN must be exactly 4 digits', variant: 'destructive' });
      return;
    }

    if (newPin !== confirmPin) {
      toast({ title: 'PINs do not match', variant: 'destructive' });
      return;
    }

    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const { error } = await supabase.functions.invoke('set-transaction-pin', {
        body: { pin: newPin },
        headers: { Authorization: `Bearer ${session?.access_token}` }
      });

      if (error) throw error;

      toast({ title: 'Success', description: 'PIN reset successfully' });
      onOpenChange(false);
      setStep('phone');
      setPhone('');
      setOtp('');
      setNewPin('');
      setConfirmPin('');
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Reset Transaction PIN
          </DialogTitle>
        </DialogHeader>

        {step === 'phone' && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Enter your phone number to receive a verification code</p>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="flex gap-2">
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+234..."
                />
                <Button onClick={handleSendOTP} disabled={loading || !phone}>
                  {loading ? 'Sending...' : 'Send OTP'}
                </Button>
              </div>
            </div>
          </div>
        )}

        {step === 'otp' && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Enter the 6-digit code sent to {phone}</p>
            <div className="space-y-2">
              <Label htmlFor="otp">Verification Code</Label>
              <Input
                id="otp"
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                maxLength={6}
                placeholder="000000"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleSendOTP} disabled={resendTimer > 0}>
                {resendTimer > 0 ? `Resend (${resendTimer}s)` : 'Resend OTP'}
              </Button>
              <Button onClick={handleVerifyOTP} disabled={loading || otp.length !== 6} className="flex-1">
                {loading ? 'Verifying...' : 'Verify'}
              </Button>
            </div>
          </div>
        )}

        {step === 'newpin' && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Create your new 4-digit PIN</p>
            <div className="space-y-2">
              <Label htmlFor="newPin">New PIN</Label>
              <div className="relative">
                <Input
                  id="newPin"
                  type={showPins ? 'text' : 'password'}
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  maxLength={4}
                  placeholder="••••"
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPins(!showPins)}
                >
                  {showPins ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPin">Confirm PIN</Label>
              <Input
                id="confirmPin"
                type={showPins ? 'text' : 'password'}
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                maxLength={4}
                placeholder="••••"
              />
            </div>
            <Button onClick={handleResetPIN} disabled={loading} className="w-full">
              {loading ? 'Resetting...' : 'Reset PIN'}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}