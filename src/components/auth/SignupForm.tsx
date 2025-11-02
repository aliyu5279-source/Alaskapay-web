import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { PhoneVerificationStep } from './PhoneVerificationStep';
import PINSetupModal from '@/components/pin/PINSetupModal';


export const SignupForm: React.FC<{ onSuccess?: () => void; onSwitchToLogin?: () => void }> = ({ onSuccess, onSwitchToLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [verifiedPhone, setVerifiedPhone] = useState('');
  const [step, setStep] = useState<'details' | 'phone' | 'pin'>('details');
  const [showPinSetup, setShowPinSetup] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const { toast } = useToast();


  const handleDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep('phone');
  };

  const handlePhoneVerified = async (phone: string) => {
    setVerifiedPhone(phone);
    setLoading(true);

    const { data, error } = await signUp(email, password, fullName);
    
    if (error) {
      setLoading(false);
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      return;
    }

    // Store phone in profile
    if (data?.user) {
      await supabase.from('profiles').update({ 
        phone: phone,
        phone_verified: true 
      }).eq('id', data.user.id);
      
      setUserId(data.user.id);
      setLoading(false);
      setStep('pin');
      setShowPinSetup(true);
    }
  };

  const handlePinSetupComplete = () => {
    toast({ 
      title: 'Success', 
      description: 'Account setup complete!',
      duration: 5000
    });
    onSuccess?.();
  };


  return (
    <>
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
          <CardDescription>
            {step === 'details' && 'Create your account'}
            {step === 'phone' && 'Verify your phone number'}
            {step === 'pin' && 'Set up transaction PIN'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === 'details' ? (
            <form onSubmit={handleDetailsSubmit} className="space-y-4">
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
              </div>
              <Button type="submit" className="w-full">Continue</Button>
              <div className="text-center text-sm">
                Already have an account?{' '}
                <button type="button" onClick={onSwitchToLogin} className="text-blue-600 hover:underline">
                  Login
                </button>
              </div>
            </form>
          ) : step === 'phone' ? (
            <PhoneVerificationStep onVerified={handlePhoneVerified} />
          ) : (
            <div className="text-center py-4">
              <p className="text-sm text-muted-foreground">Setting up your transaction PIN...</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      <PINSetupModal 
        open={showPinSetup} 
        onOpenChange={setShowPinSetup}
        onSuccess={handlePinSetupComplete}
        isOnboarding={true}
      />
    </>
  );
};


