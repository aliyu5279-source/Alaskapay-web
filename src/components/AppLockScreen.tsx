import { useState } from 'react';
import { Shield, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useBiometricAuth } from '@/hooks/useBiometricAuth';
import { useToast } from '@/hooks/use-toast';

interface AppLockScreenProps {
  onUnlock: () => void;
}

export const AppLockScreen = ({ onUnlock }: AppLockScreenProps) => {
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const { authenticate } = useBiometricAuth();
  const { toast } = useToast();

  const handleBiometricAuth = async () => {
    setLoading(true);
    try {
      const success = await authenticate('Unlock Alaska Pay');
      if (success) {
        onUnlock();
      } else {
        toast({
          title: 'Authentication Failed',
          description: 'Please try again or use PIN',
          variant: 'destructive',
        });
      }
    } finally {
      setLoading(false);
    }
  };
  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Verify PIN against stored hash
    const storedPin = localStorage.getItem('userPin');
    
    if (!storedPin) {
      // If no PIN is set, check database
      toast({
        title: 'No PIN Set',
        description: 'Please set up a PIN in settings first',
        variant: 'destructive',
      });
      return;
    }
    
    if (pin === storedPin) {
      onUnlock();
      setPin('');
    } else {
      toast({
        title: 'Invalid PIN',
        description: 'Please try again',
        variant: 'destructive',
      });
      setPin('');
    }
  };



  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4 p-8">
        <div className="flex flex-col items-center space-y-6">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
            <Lock className="w-10 h-10 text-blue-600" />
          </div>
          
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">App Locked</h2>
            <p className="text-gray-600">
              Authenticate to access your account
            </p>
          </div>

          <Button
            onClick={handleBiometricAuth}
            disabled={loading}
            className="w-full"
            size="lg"
          >
            <Shield className="w-5 h-5 mr-2" />
            {loading ? 'Authenticating...' : 'Unlock with Biometrics'}
          </Button>

          <div className="w-full">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">Or use PIN</span>
              </div>
            </div>
          </div>

          <form onSubmit={handlePinSubmit} className="w-full space-y-4">
            <Input
              type="password"
              placeholder="Enter PIN"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              maxLength={6}
              className="text-center text-2xl tracking-widest"
            />
            <Button type="submit" variant="outline" className="w-full">
              Unlock with PIN
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
};
