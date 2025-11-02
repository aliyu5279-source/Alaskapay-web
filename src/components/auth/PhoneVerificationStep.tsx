import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { Loader2, Phone, CheckCircle } from 'lucide-react';

interface PhoneVerificationStepProps {
  onVerified: (phone: string) => void;
  initialPhone?: string;
}

export const PhoneVerificationStep: React.FC<PhoneVerificationStepProps> = ({ 
  onVerified, 
  initialPhone = '' 
}) => {
  const [phone, setPhone] = useState(initialPhone);
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'verify'>('phone');
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const formatPhone = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.startsWith('234')) return '+' + cleaned;
    if (cleaned.startsWith('0')) return '+234' + cleaned.slice(1);
    return '+234' + cleaned;
  };

  const handleSendOTP = async () => {
    if (!phone || phone.length < 11) {
      toast({ title: 'Error', description: 'Enter valid phone', variant: 'destructive' });
      return;
    }

    setLoading(true);
    const formattedPhone = formatPhone(phone);

    const { error } = await supabase.functions.invoke('send-phone-otp', {
      body: { phone: formattedPhone, purpose: 'signup' }
    });

    setLoading(false);

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      setStep('verify');
      setCountdown(60);
      toast({ title: 'OTP Sent', description: 'Check your phone for code' });
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      toast({ title: 'Error', description: 'Enter 6-digit code', variant: 'destructive' });
      return;
    }

    setLoading(true);
    const formattedPhone = formatPhone(phone);

    const { data, error } = await supabase.functions.invoke('verify-phone-otp', {
      body: { phone: formattedPhone, otp, purpose: 'signup' }
    });

    setLoading(false);

    if (error || !data?.valid) {
      toast({ title: 'Error', description: 'Invalid code', variant: 'destructive' });
    } else {
      toast({ title: 'Verified!', description: 'Phone verified', duration: 2000 });
      onVerified(formattedPhone);
    }
  };

  if (step === 'phone') {
    return (
      <div className="space-y-4">
        <div>
          <Label htmlFor="phone">Phone Number</Label>
          <div className="flex gap-2 mt-1">
            <Input
              id="phone"
              type="tel"
              placeholder="08012345678"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleSendOTP} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Phone className="h-4 w-4" />}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Enter Nigerian number (e.g., 08012345678)
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-center">
        <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
        <p className="text-sm text-muted-foreground">Code sent to {phone}</p>
      </div>
      <div>
        <Label htmlFor="otp">Verification Code</Label>
        <Input
          id="otp"
          type="text"
          placeholder="000000"
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
          maxLength={6}
          className="text-center text-2xl tracking-widest"
        />
      </div>
      <Button onClick={handleVerifyOTP} disabled={loading} className="w-full">
        {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
        Verify Code
      </Button>
      <Button
        variant="ghost"
        onClick={handleSendOTP}
        disabled={countdown > 0 || loading}
        className="w-full"
      >
        {countdown > 0 ? `Resend in ${countdown}s` : 'Resend Code'}
      </Button>
    </div>
  );
};
