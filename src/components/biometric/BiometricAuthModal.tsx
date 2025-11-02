import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useBiometricAuth } from '@/hooks/useBiometricAuth';
import { Fingerprint, Lock, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface BiometricAuthModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  reason?: string;
  allowPinFallback?: boolean;
}

export const BiometricAuthModal: React.FC<BiometricAuthModalProps> = ({
  open,
  onClose,
  onSuccess,
  reason = 'Authenticate to continue',
  allowPinFallback = true,
}) => {
  const { isAvailable, biometryType, authenticate } = useBiometricAuth();
  const [showPinFallback, setShowPinFallback] = useState(false);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    if (open && isAvailable && !showPinFallback) {
      handleBiometricAuth();
    }
  }, [open]);

  const handleBiometricAuth = async () => {
    const success = await authenticate(reason);
    if (success) {
      onSuccess();
      onClose();
    } else {
      setError('Authentication failed. Please try again.');
      setAttempts(prev => prev + 1);
      if (attempts >= 2 && allowPinFallback) {
        setShowPinFallback(true);
      }
    }
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const storedPin = localStorage.getItem('userPin');
    
    if (pin === storedPin) {
      onSuccess();
      onClose();
      setPin('');
      setError('');
    } else {
      setError('Incorrect PIN. Please try again.');
      setPin('');
      setAttempts(prev => prev + 1);
      
      if (attempts >= 4) {
        setError('Too many failed attempts. Please contact support.');
      }
    }
  };

  const getBiometryName = () => {
    if (biometryType === 'face') return 'Face ID';
    if (biometryType === 'fingerprint') return 'Fingerprint';
    if (biometryType === 'touchId') return 'Touch ID';
    return 'Biometric';
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {showPinFallback ? <Lock className="h-5 w-5" /> : <Fingerprint className="h-5 w-5" />}
            {showPinFallback ? 'Enter PIN' : `${getBiometryName()} Required`}
          </DialogTitle>
          <DialogDescription>{reason}</DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!showPinFallback ? (
          <div className="space-y-4">
            <div className="flex flex-col items-center gap-4 py-6">
              <Fingerprint className="h-16 w-16 text-primary animate-pulse" />
              <p className="text-sm text-muted-foreground text-center">
                Use {getBiometryName()} to authenticate
              </p>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleBiometricAuth} className="flex-1">
                Try Again
              </Button>
              {allowPinFallback && (
                <Button variant="outline" onClick={() => setShowPinFallback(true)}>
                  Use PIN
                </Button>
              )}
            </div>
          </div>
        ) : (
          <form onSubmit={handlePinSubmit} className="space-y-4">
            <div>
              <Label htmlFor="pin">Enter your 4-digit PIN</Label>
              <Input
                id="pin"
                type="password"
                maxLength={4}
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                placeholder="••••"
                autoFocus
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit" className="flex-1" disabled={pin.length !== 4}>
                Authenticate
              </Button>
              {isAvailable && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowPinFallback(false);
                    setPin('');
                    setError('');
                  }}
                >
                  Use {getBiometryName()}
                </Button>
              )}
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};
