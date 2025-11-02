import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

export const PasswordResetForm: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { resetPassword } = useAuth();
  const { toast } = useToast();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await resetPassword(email);
    setLoading(false);
    
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      // Send password reset email
      await supabase.functions.invoke('send-password-reset', {
        body: { email, resetLink: window.location.origin + '/reset-password' }
      });
      setSent(true);
      toast({ title: 'Success', description: 'Password reset email sent!' });
    }
  };


  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Reset Password</CardTitle>
        <CardDescription>
          {sent ? 'Check your email for reset instructions' : 'Enter your email to receive reset instructions'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!sent ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Sending...' : 'Send Reset Link'}
            </Button>
            <div className="text-center text-sm">
              <button type="button" onClick={onBack} className="text-blue-600 hover:underline">
                Back to login
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center">
            <Button onClick={onBack} className="w-full">Back to Login</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
