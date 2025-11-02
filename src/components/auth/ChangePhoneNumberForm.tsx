import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { PhoneVerificationStep } from './PhoneVerificationStep';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ChangePhoneNumberFormProps {
  currentPhone: string;
  userId: string;
  onSuccess?: () => void;
}

export const ChangePhoneNumberForm: React.FC<ChangePhoneNumberFormProps> = ({
  currentPhone,
  userId,
  onSuccess
}) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handlePhoneVerified = async (newPhone: string) => {
    setLoading(true);

    const { error } = await supabase
      .from('profiles')
      .update({ 
        phone: newPhone,
        phone_verified: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    setLoading(false);

    if (error) {
      toast({ 
        title: 'Error', 
        description: 'Failed to update phone number', 
        variant: 'destructive' 
      });
    } else {
      toast({ 
        title: 'Success', 
        description: 'Phone number updated successfully!',
        duration: 3000
      });
      onSuccess?.();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Change Phone Number</CardTitle>
        <CardDescription>
          Update your wallet account phone number
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Current phone: <strong>{currentPhone}</strong>
            <br />
            You'll need to verify your new phone number
          </AlertDescription>
        </Alert>

        <PhoneVerificationStep onVerified={handlePhoneVerified} />
      </CardContent>
    </Card>
  );
};
