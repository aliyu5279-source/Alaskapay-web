import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

export const VerificationStatusBadge: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [resending, setResending] = React.useState(false);

  if (!user) return null;

  const isVerified = user.email_confirmed_at;

  const handleResend = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setResending(true);
    
    try {
      await supabase.auth.resend({
        type: 'signup',
        email: user.email!,
      });
      
      toast({
        title: 'Verification email sent',
        description: 'Check your inbox for the verification link.',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setResending(false);
    }
  };

  if (isVerified) {
    return (
      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
        <CheckCircle className="h-3 w-3 mr-1" />
        Verified
      </Badge>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
        <AlertCircle className="h-3 w-3 mr-1" />
        Unverified
      </Badge>
      <Button
        size="sm"
        variant="ghost"
        onClick={handleResend}
        disabled={resending}
        className="h-6 text-xs"
      >
        {resending ? 'Sending...' : 'Verify'}
      </Button>
    </div>
  );
};
