import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { TwoFactorVerification } from '@/components/TwoFactorVerification';
import { useBiometricAuth } from '@/hooks/useBiometricAuth';
import { Fingerprint } from 'lucide-react';

export const LoginForm: React.FC<{ onSuccess?: () => void; onSwitchToSignup?: () => void; onSwitchToReset?: () => void }> = ({ onSuccess, onSwitchToSignup, onSwitchToReset }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [show2FA, setShow2FA] = useState(false);
  const [twoFactorData, setTwoFactorData] = useState<any>(null);
  const { signIn } = useAuth();
  const { toast } = useToast();
  const { isAvailable, authenticate, getCredentials, saveCredentials } = useBiometricAuth();

  useEffect(() => {
    checkBiometricLogin();
  }, []);

  const checkBiometricLogin = async () => {
    if (!isAvailable) return;

    const credentials = await getCredentials();
    if (credentials) {
      setEmail(credentials.username);
    }
  };

  const handleBiometricLogin = async () => {
    const authenticated = await authenticate('Log in to Alaska Pay');
    if (!authenticated) return;

    const credentials = await getCredentials();
    if (!credentials) {
      toast({ title: 'Error', description: 'No saved credentials', variant: 'destructive' });
      return;
    }

    setLoading(true);
    const { error, data } = await signIn(credentials.username, credentials.password);
    
    if (error) {
      setLoading(false);
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      return;
    }

    await clearFailedAttempts(credentials.username);
    setLoading(false);
    toast({ title: 'Success', description: 'Logged in with biometrics!' });
    onSuccess?.();
  };


  // Helper function to get IP address (simplified - in production use a proper service)
  const getIpAddress = async () => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch {
      return 'Unknown';
    }
  };

  // Helper function to clear failed attempts on successful login
  const clearFailedAttempts = async (userEmail: string) => {
    try {
      await supabase
        .from('failed_login_attempts')
        .delete()
        .eq('email', userEmail);
    } catch (error) {
      console.error('Error clearing failed attempts:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { error, data } = await signIn(email, password);
    
    if (error) {
      setLoading(false);
      
      // Track failed login attempt
      try {
        const ipAddress = await getIpAddress();
        const userAgent = navigator.userAgent;
        
        const { data: trackingData } = await supabase.functions.invoke('track-failed-login', {
          body: { email, ipAddress, userAgent }
        });

        // Send alert if 3 or more failed attempts
        if (trackingData?.shouldAlert) {
          await supabase.functions.invoke('send-security-alert', {
            body: {
              email,
              alertType: 'failed_login_attempts',
              metadata: {
                attemptCount: trackingData.attemptCount,
                ipAddress,
                userAgent,
                timestamp: new Date().toISOString()
              }
            }
          });
        }
      } catch (trackError) {
        console.error('Error tracking failed login:', trackError);
      }
      
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      return;
    }

    // Clear failed attempts on successful login
    await clearFailedAttempts(email);

    // Check if user has 2FA enabled
    const { data: twoFactorSettings } = await supabase
      .from('two_factor_auth')
      .select('*')
      .eq('user_id', data?.user?.id)
      .single();

    if (twoFactorSettings?.enabled) {
      // Sign out temporarily and show 2FA prompt
      await supabase.auth.signOut();
      setTwoFactorData({ email, password, secret: twoFactorSettings.secret, backupCodes: twoFactorSettings.backup_codes });
      setShow2FA(true);
      setLoading(false);
    } else {
      // No 2FA, proceed with login
      await supabase.functions.invoke('send-activity-alert', {
        body: { email, activity: 'Login', date: new Date().toLocaleString(), location: 'Web' }
      });
      setLoading(false);
      toast({ title: 'Success', description: 'Logged in successfully!' });
      onSuccess?.();
    }
  };


  const handle2FAVerification = async (code: string, isBackupCode: boolean) => {
    try {
      const { data, error } = await supabase.functions.invoke('verify-2fa-code', {
        body: { 
          secret: twoFactorData.secret, 
          code, 
          isBackupCode 
        }
      });

      if (error) throw error;

      if (!data.valid) {
        toast({
          title: 'Invalid Code',
          description: 'Please check your code and try again',
          variant: 'destructive'
        });
        return;
      }

      // If backup code was used, remove it from the list
      if (isBackupCode) {
        const updatedCodes = twoFactorData.backupCodes.filter((c: string) => c !== code);
        await supabase.from('two_factor_auth')
          .update({ backup_codes: updatedCodes })
          .eq('user_id', twoFactorData.userId);
      }

      // Complete login
      await signIn(twoFactorData.email, twoFactorData.password);
      await supabase.functions.invoke('send-activity-alert', {
        body: { 
          email: twoFactorData.email, 
          activity: 'Login with 2FA', 
          date: new Date().toLocaleString(), 
          location: 'Web' 
        }
      });
      
      toast({ title: 'Success', description: 'Logged in successfully!' });
      onSuccess?.();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  if (show2FA) {
    return (
      <TwoFactorVerification
        onVerify={handle2FAVerification}
        onCancel={() => {
          setShow2FA(false);
          setTwoFactorData(null);
        }}
      />
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>Enter your credentials to access your account</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </Button>
          
          {isAvailable && (
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleBiometricLogin}
              disabled={loading}
            >
              <Fingerprint className="mr-2 h-4 w-4" />
              Login with Biometrics
            </Button>
          )}

          <div className="text-center space-y-2 text-sm">
            <button type="button" onClick={onSwitchToReset} className="text-blue-600 hover:underline">
              Forgot password?
            </button>
            <div>
              Don't have an account?{' '}
              <button type="button" onClick={onSwitchToSignup} className="text-blue-600 hover:underline">
                Sign up
              </button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

