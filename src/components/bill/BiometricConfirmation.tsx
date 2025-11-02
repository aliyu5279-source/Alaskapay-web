import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useBiometricAuth } from '@/hooks/useBiometricAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Fingerprint, Lock } from 'lucide-react';

interface BiometricConfirmationProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  amount: number;
}

export const BiometricConfirmation: React.FC<BiometricConfirmationProps> = ({
  open,
  onClose,
  onConfirm,
  amount,
}) => {
  const { user } = useAuth();
  const { isAvailable, authenticate } = useBiometricAuth();
  const { toast } = useToast();
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [usePIN, setUsePIN] = useState(false);

  const handleBiometricAuth = async () => {
    const authenticated = await authenticate(
      `Confirm payment of $${amount.toFixed(2)}`
    );

    if (authenticated) {
      onConfirm();
      onClose();
    }
  };

  const handlePINAuth = async () => {
    if (!user || pin.length !== 4) {
      toast({ title: 'Error', description: 'Enter 4-digit PIN', variant: 'destructive' });
      return;
    }

    setLoading(true);
    const { data } = await supabase
      .from('profiles')
      .select('pin_hash')
      .eq('id', user.id)
      .single();

    setLoading(false);

    if (data?.pin_hash === pin) {
      onConfirm();
      onClose();
      setPin('');
    } else {
      toast({ title: 'Error', description: 'Invalid PIN', variant: 'destructive' });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm High-Value Transaction</DialogTitle>
          <DialogDescription>
            This transaction of ${amount.toFixed(2)} requires authentication
          </DialogDescription>
        </DialogHeader>

        {!usePIN && isAvailable ? (
          <div className="space-y-4">
            <Button onClick={handleBiometricAuth} className="w-full" size="lg">
              <Fingerprint className="mr-2 h-5 w-5" />
              Authenticate with Biometrics
            </Button>
            <Button onClick={() => setUsePIN(true)} variant="outline" className="w-full">
              <Lock className="mr-2 h-4 w-4" />
              Use PIN Instead
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <Label htmlFor="pin">Enter 4-Digit PIN</Label>
              <Input
                id="pin"
                type="password"
                maxLength={4}
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                placeholder="Enter PIN"
              />
            </div>
            <Button onClick={handlePINAuth} className="w-full" disabled={loading}>
              {loading ? 'Verifying...' : 'Confirm'}
            </Button>
            {isAvailable && (
              <Button onClick={() => setUsePIN(false)} variant="outline" className="w-full">
                Use Biometrics Instead
              </Button>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
