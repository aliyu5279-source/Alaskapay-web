import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Loader2, Mail } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export const EmailVerificationPage: React.FC = () => {
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [message, setMessage] = useState('Verifying your email...');
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    verifyEmail();
  }, []);

  const verifyEmail = async () => {
    try {
      // Supabase automatically handles email verification via the link
      // We just need to check if the user is now verified
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user?.email_confirmed_at) {
        setStatus('success');
        setMessage('Your email has been verified successfully!');
        
        toast({
          title: 'Email Verified',
          description: 'You can now access all features.',
        });
      } else {
        setStatus('error');
        setMessage('Unable to verify email. The link may have expired.');
      }
    } catch (error: any) {
      setStatus('error');
      setMessage(error.message || 'Verification failed');
    }
  };

  const handleResend = async () => {
    if (!user?.email) return;
    
    try {
      await supabase.auth.resend({
        type: 'signup',
        email: user.email,
      });
      
      toast({
        title: 'Email Sent',
        description: 'Check your inbox for the verification link.',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            {status === 'verifying' && <Loader2 className="h-16 w-16 text-blue-600 animate-spin" />}
            {status === 'success' && <CheckCircle className="h-16 w-16 text-green-600" />}
            {status === 'error' && <XCircle className="h-16 w-16 text-red-600" />}
          </div>
          <CardTitle>Email Verification</CardTitle>
          <CardDescription>{message}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {status === 'success' && (
            <Button onClick={() => window.location.hash = 'dashboard'} className="w-full">
              Go to Dashboard
            </Button>
          )}
          
          {status === 'error' && (
            <>
              <Button onClick={handleResend} variant="outline" className="w-full">
                <Mail className="mr-2 h-4 w-4" />
                Resend Verification Email
              </Button>
              <Button onClick={() => window.location.hash = ''} variant="ghost" className="w-full">
                Back to Home
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
